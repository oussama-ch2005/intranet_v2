import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Object } from '../../../core/service/object';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  tickets: any[] = [];
  stats = { ouverts: 0, enCours: 0, resolus: 0 };
  chargement = true;

  constructor(private object: Object) {}

  ngOnInit() {
    this.object.listerParType('TICKET').subscribe({
      next: (data: any) => {
        this.tickets = data;
        this.stats.ouverts  = data.filter((t: any) => t.status === 'OUVERT').length;
        this.stats.enCours  = data.filter((t: any) => t.status === 'EN_COURS').length;
        this.stats.resolus  = data.filter((t: any) => t.status === 'RESOLU').length;
        this.chargement = false;
      },
      error: () => this.chargement = false
    });
  }

  couleurStatut(statut: string): string {
    const map: any = {
      'OUVERT': 'badge-blue',
      'EN_COURS': 'badge-amber',
      'RESOLU': 'badge-green',
      'FERME': 'badge-gray'
    };
    return map[statut] || 'badge-gray';
  }

  couleurPriorite(priorite: string): string {
    const map: any = {
      'URGENTE': 'badge-red',
      'HAUTE': 'badge-amber',
      'NORMALE': 'badge-blue',
      'FAIBLE': 'badge-gray'
    };
    return map[priorite] || 'badge-gray';
  }
}