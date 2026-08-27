import { Component, OnInit, OnDestroy, AfterViewChecked,
         ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Sidebar }           from '../../../shared/components/sidebar/sidebar';
import { Navbar }            from '../../../shared/components/navbar/navbar';
import { Object as ObjSvc }  from '../../../core/service/object';    // ✅ alias pour éviter conflit JS
import { ConversationService } from '../../../core/service/conversation';
import { Message }           from '../../../core/service/message';
import { Websocket }         from '../../../core/service/websocket';
import { Auth }              from '../../../core/service/auth';
import { User }              from '../../../core/service/user';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('msgZone') msgZone!: ElementRef;

  objet:          any = null;
  conversation:   any = null;
  messages:       any[] = [];
  nouveauMessage  = '';
  utilisateurs:   any[] = [];
  suggestions:    any[] = [];
  rechercheMentionActive = false;
  chargObjet      = true;
  chargConv       = true;
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
    private userSvc: User
  ) {}

  ngOnInit() {
    this.objetId = +this.route.snapshot.paramMap.get('id')!;
    // ✅ Charger la liste des utilisateurs pour les @mentions
    this.userSvc.listerTous().subscribe({
      next: (users: any) => {
        // L'API peut retourner une liste directe ou une réponse paginée.
        this.utilisateurs = Array.isArray(users)
          ? users
          : (users?.content || users?.data || users?.users || []);
        this.filtrerUtilisateurs();
      },
      error: () => {
        this.utilisateurs = [];
        this.suggestions = [];
      }
    });
    this.chargerObjet();
    this.chargerConversation();
  }

  // ──────────────────────────────────────────
  // ✅ SYSTÈME DE @MENTION
  // ──────────────────────────────────────────

  filtrerUtilisateurs() {
    // Nettoyer les mentions dont le nom a été effacé
    this.mentionsSelectionnees.forEach(userId => {
      const user = this.utilisateurs.find(u => u.id === userId);
      const nom  = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : '';
      if (!nom || !this.nouveauMessage.includes(`@${nom}`)) {
        this.mentionsSelectionnees.delete(userId);
      }
    });

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

  // ──────────────────────────────────────────
  // CHARGEMENT
  // ──────────────────────────────────────────

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
      // ✅ Évite les doublons (message déjà ajouté via HTTP)
      const dejaDans = this.messages.find((m: any) => m.id === msg.id);
      if (!dejaDans) {
        this.messages = [...this.messages, msg];
        this.shouldScroll = true;
        this.cdr.detectChanges();
      }
    });
  }

  // ──────────────────────────────────────────
  // ENVOI
  // ──────────────────────────────────────────

  envoyer() {
    if (!this.nouveauMessage.trim() || !this.conversation) return;

    const contenu = this.nouveauMessage;

    const data = {
      content:              contenu,
      id_mentiones:         Array.from(this.mentionsSelectionnees),
      pieceJointeRequests:  [],
      receiverId:           null
    };

    // ✅ Vider immédiatement l'input
    this.nouveauMessage = '';
    this.mentionsSelectionnees.clear();
    this.suggestions = [];
    this.rechercheMentionActive = false;

    this.msgSvc.envoyer(this.conversation.id, data).subscribe({
      next: (msgReponse: any) => {
        // ✅ Ajouter immédiatement sans attendre le WebSocket
        const dejaDans = this.messages.find((m: any) => m.id === msgReponse.id);
        if (!dejaDans) {
          this.messages = [...this.messages, msgReponse];
          this.shouldScroll = true;
          this.cdr.detectChanges();
        }
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

  // ──────────────────────────────────────────
  // UTILITAIRES
  // ──────────────────────────────────────────

  estMoi(msg: any): boolean {
    return msg.auteur?.email === this.auth.getEmail();
  }

  icone(t: string) {
    const m: any = { TICKET:'🎫', DEMANDE:'📋', TACHE:'✅', INTERVENTION:'🔧', MATERIEL:'📦' };
    return m[t] || '📄';
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
