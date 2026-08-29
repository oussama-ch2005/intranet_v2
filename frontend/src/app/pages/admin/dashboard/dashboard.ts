import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Object } from '../../../core/service/object';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  objets: any[] = [];
  stats = { ouverts: 0, enCours: 0, resolus: 0 };
  chargement = true;

  constructor(private object: Object,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.object.listerTous().subscribe({
      next: (data: any) => {
        console.log(data);
        this.objets = [...data].sort((a, b) => this.dateCreation(b) - this.dateCreation(a));
        this.stats.ouverts  = data.filter((t: any) => t.status === 'OUVERT').length;
        this.stats.enCours  = data.filter((t: any) => t.status === 'EN_COURS').length;
        this.stats.resolus  = data.filter((t: any) => t.status === 'RESOLU').length;
        this.chargement = false;
        // Force Angular à mettre à jour l'affichage
        this.cdr.detectChanges();

      },
      error: () => this.chargement = false
    });
  }

  private dateCreation(objet: any): number {
    return new Date(objet.createdAt ?? objet.created).getTime();
  }

  couleurStatut(statut: string): string {
    const map: any = {
      'OUVERT': 'badge-blue',
      'ENCOURS': 'badge-amber',
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

  
 
couleurType(type: string): string {
  const map: any = {
    'TICKET': 'badge-red',
    'DEMANDE': 'badge-amber',
    'INTERVENTION': 'badge-blue',
    'TACHE': 'badge-green',
    'MATERIEL': 'badge-gray'
  };
  return map[type] || 'badge-gray';
 }
}