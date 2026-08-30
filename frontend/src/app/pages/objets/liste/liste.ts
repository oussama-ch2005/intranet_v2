import { Component,OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Object } from '../../../core/service/object';
@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './liste.html',
  styleUrl: './liste.css',
})

export class Liste implements OnInit {
  objets:any[]=[];
  objetsFiltres:any[]=[];
  typeSelectionne='TICKET';
  recherche='';
  chargement=true;
  showModal = false;

  types=[
    {valeur:'TICKET', labek:'Ticket',icone:''},
    { valeur: 'DEMANDE',      label: 'Demandes',      icone: '' },
    { valeur: 'TACHE',        label: 'Tâches',        icone: '' },
    { valeur: 'INTERVENTION', label: 'Interventions', icone: '' },
    { valeur: 'MATERIEL',     label: 'Matériels',     icone: '' },

  ];

  nouvelObjet={
    typeObject:'TICKET',
    title:'',
    description:'',
    priority:'NORMAL'

  };
  constructor(private object: Object,private router :Router,private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    this.charger();

  }


  charger(){
    this.chargement= true;
    this.object.listerParType(this.typeSelectionne).subscribe({
      next: (data: any) => {
        this.objets=data;
        this.filtrer();
        this.chargement = false;
        // Force Angular à mettre à jour l'affichage
        this.cdr.detectChanges();

      },
      error: () => this.chargement = false
    });

  }
  changerType(type:string){
    this.typeSelectionne=type;
    this.charger();
  }

  filtrer() {
  this.objetsFiltres = this.objets.filter(o =>
    o.title?.toLowerCase().includes(this.recherche.toLowerCase()));
  
    this.objetsFiltres.sort((a, b) => {
      return this.dateCreation(b) - this.dateCreation(a);
    })
    
  ;
  }

  private dateCreation(objet: any): number {
    return new Date(objet.createdAt ?? objet.created).getTime();
  }

  ouvrirDetail(objet:any){
    this.router.navigate(['/objets/detail',objet.id]);
  }

  creer(){
    this.nouvelObjet.typeObject=this.typeSelectionne;
    this.object.creer(this.nouvelObjet).subscribe({
      next:(data:any)=>{
        this.showModal=false;
        this.nouvelObjet={typeObject:this.typeSelectionne,title:'',description:'',priority:'NORMAL'};
        //ouvrir directement le detaille avec la conversation
        this.router.navigate(['/objets/detail',data.id]);


      }
      

    });
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

  labelType(valeur:string){
    return this.types.find(t=> t.valeur===valeur)?.label || '';
  }





}
  






