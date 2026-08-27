import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Sidebar }    from '../../../shared/components/sidebar/sidebar';
import { Navbar}     from '../../../shared/components/navbar/navbar';
import { ConversationService } from '../../../core/service/conversation';
import { Message }      from '../../../core/service/message';
import { Websocket}    from '../../../core/service/websocket';
import { Auth }         from '../../../core/service/auth';
import { User }         from '../../../core/service/user';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './conversation.html',
  styleUrl: './conversation.css'
})
export class Conversation implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('msgZone') msgZone!: ElementRef;

  conversation:  any = null;
  messages:      any[] = [];
  nouveauMessage = '';
  utilisateurs: any[] = [];
  suggestions: any[] = [];
  private mentionsSelectionnees = new Set<number>();
  chargement     = true;
  private wsSub!: Subscription;
  private convId!: number;
  private shouldScroll = false;

  constructor(
    private route:   ActivatedRoute,
    public  router:  Router,
    public  auth:    Auth,
    private convSvc: ConversationService,
    private msgSvc:  Message,
    private wsSvc:   Websocket,
    private cdr:     ChangeDetectorRef,
    private userSvc: User
  ) {}

  ngOnInit() {
    this.convId = +this.route.snapshot.paramMap.get('id')!;
    this.userSvc.listerTous().subscribe({ next: users => this.utilisateurs = users });
    this.charger();
  }

  filtrerUtilisateurs() {
    this.mentionsSelectionnees.forEach(userId => {
      const user = this.utilisateurs.find(utilisateur => utilisateur.id === userId);
      const nom = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : '';
      if (!nom || !this.nouveauMessage.includes(`@${nom}`)) {
        this.mentionsSelectionnees.delete(userId);
      }
    });

    const match = this.nouveauMessage.match(/(?:^|\s)@([^\s@]*)$/);
    if (!match) {
      this.suggestions = [];
      return;
    }
    const recherche = match[1].toLowerCase();
    this.suggestions = this.utilisateurs.filter(user => {
      const nom = `${user.prenom || ''} ${user.nom || ''}`.toLowerCase();
      return user.email !== this.auth.getEmail() && nom.includes(recherche);
    });
  }

  selectionnerUtilisateur(user: any) {
    const match = this.nouveauMessage.match(/(?:^|\s)@([^\s@]*)$/);
    if (!match) return;
    const debut = this.nouveauMessage.slice(0, match.index! + match[0].length - match[1].length - 1);
    const nom = `${user.prenom || ''} ${user.nom || ''}`.trim();
    this.nouveauMessage = `${debut}@${nom} `;
    this.mentionsSelectionnees.add(user.id);
    this.suggestions = [];
  }

  charger() {
    this.convSvc.obtenirParId(this.convId).subscribe({
      next: (d: any) => {
        this.conversation = d;
        this.messages = [...(d.messages || [])];
        this.chargement = false;
        this.shouldScroll = true;
        this.cdr.detectChanges();
        this.connecterWS();
      },
      error: () => { this.chargement = false; }
    });
  }

  connecterWS() {
    this.wsSvc.connecter(this.auth.getEmail() || '');
    setTimeout(() => this.wsSvc.abonnerConversation(this.convId), 800);
    this.wsSub = this.wsSvc.messageRecu$.subscribe(msg => {
      this.messages = [...this.messages, msg];
      this.shouldScroll = true;
      this.cdr.detectChanges();
    });
  }

  envoyer() {
    if (!this.nouveauMessage.trim()) return;
    const data = { content: this.nouveauMessage, id_mentiones: Array.from(this.mentionsSelectionnees), pieceJointeRequests: [], receiverId: null };
    this.msgSvc.envoyer(this.convId, data).subscribe({
      next: () => { this.nouveauMessage = ''; this.mentionsSelectionnees.clear(); this.suggestions = []; }
    });
  }

  estMoi(msg: any): boolean { return msg.auteur?.email === this.auth.getEmail(); }

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