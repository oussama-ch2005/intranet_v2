import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Navbar}  from '../../../shared/components/navbar/navbar';
import { Mention }   from '../../../core/service/mention';

@Component({
  selector: 'app-mes-mentions',
  standalone: true,
  imports: [CommonModule, Sidebar, Navbar],
  templateUrl: './mes-mentions.html',
  styleUrl: './mes-mentions.css'
})
export class MesMentionsComponent implements OnInit {

  mentions:   any[] = [];
  chargement  = true;

  constructor(
    private mentionSvc: Mention,
    private router:     Router,
    private cdr:        ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mentionSvc.mesMentions().subscribe({
      next: (data: any) => {
        this.mentions = this.trierEtGrouperMentions(
          Array.isArray(data) ? data : (data?.content || data?.data || [])
        );
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => { this.chargement = false; }
    });
  }

  /** Une seule carte par objet : celle de la mention la plus récente. */
  private trierEtGrouperMentions(mentions: any[]): any[] {
    const plusRecentParObjet = new Map<string | number, any>();

    [...mentions]
      .sort((a, b) => this.dateMention(b) - this.dateMention(a))
      .forEach(mention => {
        const cleObjet = mention.objetId ?? mention.objectId ?? mention.conversationId;
        if (!plusRecentParObjet.has(cleObjet)) {
          plusRecentParObjet.set(cleObjet, mention);
        }
      });

    return [...plusRecentParObjet.values()]
      .sort((a, b) => this.dateMention(b) - this.dateMention(a));
  }

  private dateMention(mention: any): number {
    const valeur = mention.dateMessage ?? mention.sentDate ?? mention.sent_date
      ?? mention.createdAt ?? mention.created;
    const date = new Date(valeur).getTime();
    return Number.isNaN(date) ? 0 : date;
  }

  // Ouvrir la conversation où l'utilisateur a été mentionné
  ouvrirConversation(mention: any) {
    // On navigue vers le détail de l'objet lié à la conversation
    this.router.navigate(['/objets/detail', mention.conversationId]);
  }

    
  
}
