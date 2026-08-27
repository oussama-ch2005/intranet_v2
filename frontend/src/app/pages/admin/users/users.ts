import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { User } from '../../../core/service/user';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: any[] = [];
  chargement=true;

  constructor(private userSvc: User, private cdr: ChangeDetectorRef) {}

  ngOnInit() {

    this.userSvc.listerTous().subscribe({
      next: (data) => {
        this.users = data;
        this.chargement=false;
        this.cdr.detectChanges();   //pour detecter les changements
      },
      error: () => this.chargement=false
    });
  }

 initiales(nom:string,prenom:string):string{
  return (prenom?.charAt(0) || '') + (nom?.charAt(0) || '');
 
 }

  changerEtat(user: any) {
    const nouvelEtat = !user.active;
    this.userSvc.changerEtat(user.id, nouvelEtat).subscribe({
      next: (userMisAJour) => {
        user.active = userMisAJour.active;
        this.cdr.detectChanges();
      }
    });
  }
}
