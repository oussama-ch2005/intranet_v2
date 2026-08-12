import { Component,OnInit } from '@angular/core';
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
    {valeur:'TICKET', labek:'Ticket',icone:'🎫'},
    { valeur: 'DEMANDE',      label: 'Demandes',      icone: '📋' },
    { valeur: 'TACHE',        label: 'Tâches',        icone: '✅' },
    { valeur: 'INTERVENTION', label: 'Interventions', icone: '🔧' },
    { valeur: 'MATERIEL',     label: 'Matériels',     icone: '📦' },

  ];

  nouvelObjet={
    typeObject:'TICKET',
    title:'',
    description:'',
    priority:'NORMAL'

  };
  constructor(private object: Object,private router :Router) {}
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

      },
      error: () => this.chargement = false
    });

  }
  changerType(type:string){
    this.typeSelectionne=type;
    this.charger();
  }

  filtrer(){

    this.objetsFiltres=this.objets.filter(o=>
      o.title?.tolowerCase().includes(this.recherche.toLowerCase())

    );
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

  badgeStatut(s:string){
    const m:any={
      'OUVERT':'badge-blue',
      'EN_COURS':'badge-amber',
      'RESOLU':'badge-green',
      'FERME':'badge-gray'
    };
    return m[s] || 'badge-gray';
  }
  badgePriorite(p:string){
    const m:any={
      'URGENTE':'badge-red',
      'HAUTE':'badge-amber',
      'NORMALE':'badge-blue',
      'FAIBLE':'badge-gray'
    };
    return m[p] || 'badge-gray';
  }
  labelType(valeur:string){
    return this.types.find(t=> t.valeur===valeur)?.label || '';
  }





}
  






