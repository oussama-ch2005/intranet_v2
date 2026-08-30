import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sidebar} from '../../../shared/components/sidebar/sidebar';
import { Navbar }  from '../../../shared/components/navbar/navbar';
import { Object}    from '../../../core/service/object';

@Component({
  selector: 'app-mes-objets',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Navbar],
  templateUrl: './mes-objets.html',
  styleUrl: './mes-objets.css'
})
export class MesObjets implements OnInit {

  objets:        any[] = [];
  objetsFiltres: any[] = [];
  recherche      = '';
  chargement     = true;
  showModal      = false;

  types = [
    { valeur:'TICKET',       label:'Ticket',       icone:'' },
    { valeur:'DEMANDE',      label:'Demande',      icone:'' },
    { valeur:'TACHE',        label:'Tâche',        icone:'' },
    { valeur:'INTERVENTION', label:'Intervention', icone:'' },
    { valeur:'MATERIEL',     label:'Matériel',     icone:'' },
  ];

  nouvelObjet = { typeObject:'TICKET', title:'', description:'', priority:'NORMALE' };

  constructor(private objSvc: Object, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.charger(); }

  charger() {
    this.chargement = true;
    this.objSvc.mesObjets().subscribe({
      next: (data: any) => { this.objets = data; this.filtrer(); this.chargement = false; this.cdr.detectChanges(); },
      error: () => { this.chargement = false; }
    });
  }

  filtrer() {
    this.objetsFiltres = this.objets
      .filter(o => o.title?.toLowerCase().includes(this.recherche.toLowerCase()))
      .sort((a, b) => this.dateCreation(b) - this.dateCreation(a));
  }

  private dateCreation(objet: any): number {
    return new Date(objet.createdAt ?? objet.created).getTime();
  }

  ouvrir(o: any) { this.router.navigate(['/objets/detail', o.id]); }

  creer() {
    this.objSvc.creer(this.nouvelObjet).subscribe({
      next: (data: any) => {
        this.showModal = false;
        this.nouvelObjet = { typeObject:'TICKET', title:'', description:'', priority:'NORMALE' };
        this.router.navigate(['/objets/detail', data.id]);
      }
    });
  }

  icone(v: string) { return this.types.find(t => t.valeur === v)?.icone || '📄'; }
  badgeStatut(s: string)   { const m: any = { OUVERT:'b-blue', EN_COURS:'b-amber', RESOLU:'b-green', FERME:'b-gray' }; return m[s]||'b-gray'; }
  badgePriorite(p: string) { const m: any = { URGENTE:'b-red', HAUT:'b-amber', NORMALE:'b-blue', FAIBLE:'b-gray' };   return m[p]||'b-gray'; }
}