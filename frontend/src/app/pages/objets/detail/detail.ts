import { Component, OnInit, OnDestroy, AfterViewChecked,
         ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Sidebar }           from '../../../shared/components/sidebar/sidebar';
import { Navbar }            from '../../../shared/components/navbar/navbar';
import { Object as ObjSvc }  from '../../../core/service/object';    //  alias pour éviter conflit JS
import { ConversationService } from '../../../core/service/conversation';
import { Message }           from '../../../core/service/message';
import { Websocket }         from '../../../core/service/websocket';
import { Auth }              from '../../../core/service/auth';
import { User }              from '../../../core/service/user';
import { FileService }    from '../../../core/service/file'; //  nouveau

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('msgZone') msgZone!: ElementRef;
    @ViewChild('fileInput')   fileInput!: ElementRef; //  référence input file

  objet:          any = null;
  conversation:   any = null;
  messages:       any[] = [];
  nouveauMessage  = '';
  utilisateurs:   any[] = [];
  suggestions:    any[] = [];
  rechercheMentionActive = false;
  chargObjet      = true;
  chargConv       = true;


  // Fichiers sélectionnés en attente d'envoi
  fichiersEnAttente: {
    file: File;
    preview: string | null;
    uploading: boolean;
    uploaded: boolean;
    url: string;
    nomFichier: string;
    typeFichier: string;
    tailleKo: number;
    
  }[] = [];



  private mentionsSelectionnees = new Set<number>();
  private wsSub!: Subscription;
  private objetId!: number;
  private shouldScroll = false;

  statuts = ['OUVERT', 'EN_COURS', 'RESOLU', 'FERME'];

  constructor(
    private route:   ActivatedRoute,
    public  router:  Router,
    public  auth:    Auth,
    private objSvc:  ObjSvc,
    private convSvc: ConversationService,
    private msgSvc:  Message,
    private wsSvc:   Websocket,
    private cdr:     ChangeDetectorRef,
    private userSvc: User,
    public  fileSvc:  FileService  //  injecté en public pour le template
  ) {}

  ngOnInit() {
    this.objetId = +this.route.snapshot.paramMap.get('id')!;
    //  Charger la liste des utilisateurs pour les @mentions
    this.userSvc.listerTous().subscribe({
      next: (users: any) => {
        // L'API peut retourner une liste directe ou une réponse paginée.
        console.log('reponse api',users);
        this.utilisateurs = Array.isArray(users)
          ? users
          : (users?.content || users?.data || users?.users || []);
          console.log('utilisateurs après parsing:', this.utilisateurs);
        this.filtrerUtilisateurs();
      },
      error: (err) => {
        console.error('erruer chegement users', err);
        this.utilisateurs = [];
        this.suggestions = [];
      }
    });
    this.chargerObjet();
    this.chargerConversation();
  }

// ──────────────────────────────────────────
  // GESTION DES FICHIERS
  // ──────────────────────────────────────────

 ouvrirSelecteurFichier() {
    this.fileInput.nativeElement.click();
  }

   onFichiersSelectionnes(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      // Limite 10 Mo
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} dépasse la limite de 10 Mo`);
        return;
      }

      const fichierEnAttente = {
        file,
        preview:    null as string | null,
        uploading:  true,
        uploaded:   false,
        url:        '',
        nomFichier: file.name,
        typeFichier: file.type,
        tailleKo:   Math.round(file.size / 1024)
      };

      // Prévisualisation si image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fichierEnAttente.preview = e.target?.result as string;
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }

      this.fichiersEnAttente.push(fichierEnAttente);

      // ✅ Upload immédiat
      this.fileSvc.upload(file).subscribe({
        next: (res: any) => {
          fichierEnAttente.uploading = false;
          fichierEnAttente.uploaded  = true;
          fichierEnAttente.url       = res.url;
          this.cdr.detectChanges();
        },
        error: () => {
          fichierEnAttente.uploading = false;
          alert(`Erreur upload : ${file.name}`);
          this.supprimerFichier(fichierEnAttente);
        }
      });
    });

    // Reset input pour permettre de resélectionner le même fichier
    
    input.value = '';
  }

  supprimerFichier(fichier: any) {
    this.fichiersEnAttente = this.fichiersEnAttente.filter(f => f !== fichier);
    this.cdr.detectChanges();
  }










  // SYSTEME DE MENTION
 

  filtrerUtilisateurs() {
    // Nettoyer les mentions dont le nom a été effacé
    this.mentionsSelectionnees.forEach(userId => {
      const user = this.utilisateurs.find(u => u.id === userId);
      const nom  = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : '';
      if (!nom || !this.nouveauMessage.includes(`@${nom}`)) {
        this.mentionsSelectionnees.delete(userId);
      }
    });

     //  Nombre max de mots parmi les noms mentionnables (ex: "Ali Benali" = 2)
  const maxMots = Math.max(
    1,
    ...this.utilisateurs.map(u =>
      this.nomUtilisateur(u).trim().split(/\s+/).filter(Boolean).length
    )
  );

  // Regex dynamique : autorise jusqu'à (maxMots - 1) mots supplémentaires après le premier
  const regex = new RegExp(
    `(?:^|\\s)@([^\\s@]*(?:\\s+[^\\s@]*){0,${maxMots - 1}})$`
  );

    // Détecter si l'utilisateur est en train de taper @quelquechose
    const match = this.nouveauMessage.match(/(?:^|\s)@([^\s@]*)$/);
    if (!match) {
      this.rechercheMentionActive = false;
      this.suggestions = [];
      return;
    }

    this.rechercheMentionActive = true;
    const recherche = match[1].toLowerCase();
    // Filtrer les utilisateurs (exclure soi-même)
    this.suggestions = this.utilisateurs.filter(user => {
      const valeursRecherche = [
        user.prenom,
        user.nom,
        this.nomUtilisateur(user),
        user.email,
        user.username,
        user.userName
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return user.email !== this.auth.getEmail()
        && valeursRecherche.includes(recherche);
    });
  }

  selectionnerUtilisateur(user: any) {
    // Trouver la position du dernier @ et remplacer
    const positionArobase = this.nouveauMessage.lastIndexOf('@');
    if (positionArobase === -1) return;

    const avant = this.nouveauMessage.slice(0, positionArobase);
    const nom = this.nomUtilisateur(user);
    if (!nom) return;

    // Remplace le @texte_partiel par @Prenom Nom (avec espace après)
    this.nouveauMessage = `${avant}@${nom} `;
    this.mentionsSelectionnees.add(user.id ?? user.userId);
    this.suggestions = [];
    this.rechercheMentionActive = false;
    this.cdr.detectChanges();
  }

  nomUtilisateur(user: any): string {
    const nomComplet = `${user?.prenom || ''} ${user?.nom || ''}`.trim();
    return nomComplet || user?.username || user?.userName || user?.email || '';
  }

  decouperMessage(contenu: string): { texte: string; mention: boolean }[] {
    const nomsComposes = this.utilisateurs
      .map(user => this.nomUtilisateur(user).trim())
      .filter(nom => nom.split(/\s+/).length > 1)
      .sort((a, b) => b.length - a.length);
    const morceaux: { texte: string; mention: boolean }[] = [];
    let position = 0;

    while (position < contenu.length) {
      const nom = nomsComposes.find(candidate => {
        const mention = `@${candidate}`;
        return contenu.startsWith(mention, position)
          && (!contenu[position - 1] || /\s/.test(contenu[position - 1]))
          && (!contenu[position + mention.length] || /\s/.test(contenu[position + mention.length]));
      });

      if (nom) {
        const texte = `@${nom}`;
        morceaux.push({ texte, mention: true });
        position += texte.length;
        continue;
      }

      const debut = position;
      position++;
      while (position < contenu.length && !nomsComposes.some(candidate => {
        const mention = `@${candidate}`;
        return contenu.startsWith(mention, position)
          && (!contenu[position - 1] || /\s/.test(contenu[position - 1]));
      })) {
        position++;
      }
      morceaux.push({ texte: contenu.slice(debut, position), mention: false });
    }

    return morceaux;
  }

  estMorceauMentionne(morceaux: string[], index: number): boolean {
    if (!morceaux[index] || /^\s+$/.test(morceaux[index])) return false;

    const debutMorceau = morceaux
      .slice(0, index)
      .reduce((position, morceau) => position + morceau.length, 0);
    const finMorceau = debutMorceau + morceaux[index].length;

    return Array.from(this.mentionsSelectionnees).some(userId => {
      const user = this.utilisateurs.find(utilisateur => (utilisateur.id ?? utilisateur.userId) === userId);
      const nom = user ? this.nomUtilisateur(user) : '';
      if (!nom) return false;

      const mention = `@${nom}`;
      let debutMention = this.nouveauMessage.indexOf(mention);
      while (debutMention !== -1) {
        const finMention = debutMention + mention.length;
        if (debutMorceau < finMention && finMorceau > debutMention) return true;
        debutMention = this.nouveauMessage.indexOf(mention, debutMention + 1);
      }
      return false;
    });
  }

  
  // CHARGEMENT
  

  chargerObjet() {
    this.objSvc.obtenirParId(this.objetId).subscribe({
      next: (d: any) => {
        this.objet = d;
        this.chargObjet = false;
        this.cdr.detectChanges();
      },
      error: () => { this.chargObjet = false; }
    });
  }

  chargerConversation() {
    this.convSvc.obtenirParId(this.objetId).subscribe({
      next: (d: any) => {
        this.conversation = d;
        this.messages     = [...(d.messages || [])];
         console.log('Messages reçus:', this.messages);        //  ajoutez
         console.log('Email courant:', this.auth.getEmail());  //  ajoutez
        this.chargConv    = false;
        this.shouldScroll = true;
        this.cdr.detectChanges();
        this.connecterWS(d.id);
      },
      error: () => { this.chargConv = false; }
    });
  }

  connecterWS(convId: number) {
    this.wsSvc.connecter(this.auth.getEmail() || '');
    setTimeout(() => this.wsSvc.abonnerConversation(convId), 800);

    this.wsSub = this.wsSvc.messageRecu$.subscribe(msg => {
      //  evite les doublons (message depuis WS jà ajout via HTTP)
      const dejaDans = this.messages.find((m: any) => m.id === msg.id);
      if (!dejaDans) {
        this.messages = [...this.messages, msg];
        this.shouldScroll = true;
        this.cdr.detectChanges();
      }
    });
  }

  
  // ENVOI
 

   peutEnvoyer(): boolean {
    const aTexte   = this.nouveauMessage.trim().length > 0;
    const aFichier = this.fichiersEnAttente.length > 0;
    const tousUploades = this.fichiersEnAttente.every(f => f.uploaded);
    return (aTexte || aFichier) && tousUploades;
  }

  envoyer() {
    if ((!this.nouveauMessage.trim() && this.fichiersEnAttente.length === 0) || !this.conversation) return;
    if (this.fichiersEnAttente.some(f => f.uploading)) return;

    const contenu = this.nouveauMessage;

     // Construire les pièces jointes depuis les fichiers uploadés
    const pieceJointeRequests = this.fichiersEnAttente
      .filter(f => f.uploaded)
      .map(f => ({
        nomFichier:  f.nomFichier,
        url:         f.url,
        typeFichier: f.typeFichier,
        tailleKo:    f.tailleKo
      }));
    const fichiersEnvoyes = this.fichiersEnAttente.filter(f => f.uploaded);

    const data = {
      content:              contenu,
      id_mentiones:         Array.from(this.mentionsSelectionnees),
      pieceJointeRequests,
      receiverId:           null
    };

    //  Vider immédiatement l'input
    this.nouveauMessage = '';
    this.mentionsSelectionnees.clear();
    this.suggestions = [];

    this.msgSvc.envoyer(this.conversation.id, data).subscribe({
      next: (msgReponse: any) => {
        //  Ajouter immédiatement sans attendre le WebSocket
        const dejaDans = this.messages.find((m: any) => m.id === msgReponse.id);
        if (!dejaDans) {
          this.messages = [...this.messages, msgReponse];
          this.shouldScroll = true;
          this.cdr.detectChanges();
        }
        this.fichiersEnAttente = this.fichiersEnAttente.filter(f => !fichiersEnvoyes.includes(f));
      },
      error: () => {
        //  Remettre le contenu si l'envoi échoue
        this.nouveauMessage = contenu;
        this.cdr.detectChanges();
      }
    });
  }

  changerStatut(statut: string) {
    this.objSvc.changerStatus(this.objetId, statut).subscribe({
      next: (d: any) => { this.objet = d; this.cdr.detectChanges(); }
    });
  }

  
  // UTILITAIRES
  

  estMoi(msg: any): boolean {
    return msg.auteur?.email === this.auth.getEmail();
  }

 

  badgeStatut(s: string) {
    const m: any = { OUVERT:'b-blue', EN_COURS:'b-amber', RESOLU:'b-green', FERME:'b-gray' };
    return m[s] || 'b-gray';
  }

  badgePriorite(p: string) {
    const m: any = { URGENTE:'b-red', HAUTE:'b-amber', NORMALE:'b-blue', FAIBLE:'b-gray' };
    return m[p] || 'b-gray';
  }

  ngAfterViewChecked() {
    if (this.shouldScroll && this.msgZone) {
      const el = this.msgZone.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  ngOnDestroy() {
    if (this.wsSub) this.wsSub.unsubscribe();
    this.wsSvc.deconnecter();
  }
}
