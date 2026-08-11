import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Object} from '../../../core/service/object';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Sidebar],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {
  tickets: any[] = [];
  ticketsFiltres: any[] = [];
  recherche = '';
  filtreStatut = '';
  chargement = true;
  showModal = false;

  nouveauTicket = {
    typeObject: 'TICKET',
    title: '',
    description: '',
    priority: 'NORMALE'
  };

  constructor(private objectService: Object) {}

  ngOnInit() {
    this.chargerTickets();
  }

  chargerTickets() {
    this.chargement = true;
    this.objectService.listerParType('TICKET').subscribe({
      next: (data: any) => {
        this.tickets = data;
        this.filtrer();
        this.chargement = false;
      },
      error: () => this.chargement = false
    });
  }

  filtrer() {
    this.ticketsFiltres = this.tickets.filter(t => {
      const matchRecherche = t.title.toLowerCase().includes(this.recherche.toLowerCase());
      const matchStatut = !this.filtreStatut || t.status === this.filtreStatut;
      return matchRecherche && matchStatut;
    });
  }

  changerStatut(id: number, statut: string) {
    this.objectService.changerStatus(id, statut).subscribe({
      next: () => this.chargerTickets()
    });
  }


  creerTicket() {
    this.objectService.creer(this.nouveauTicket).subscribe({
      next: () => {
        this.showModal = false;
        this.nouveauTicket = { typeObject: 'TICKET', title: '', description: '', priority: 'NORMALE' };
        this.chargerTickets();
      }
    });
  }

  couleurStatut(s: string): string {
    const m: any = { OUVERT: 'badge-blue', EN_COURS: 'badge-amber', RESOLU: 'badge-green', FERME: 'badge-gray' };
    return m[s] || 'badge-gray';
  }

  couleurPriorite(p: string): string {
    const m: any = { URGENTE: 'badge-red', HAUTE: 'badge-amber', NORMALE: 'badge-blue', FAIBLE: 'badge-gray' };
    return m[p] || 'badge-gray';
  }
}