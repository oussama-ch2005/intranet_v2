import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Auth} from '../../core/service/auth';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email='';
  password='';
  erreur='';
  chargement=false;

  constructor(private auth:Auth,private router :Router) {}

  connecter (){
    this.erreur="";

    this.chargement=true;

    this.auth.connecter(this.email, this.password).subscribe({
      next: (response) => {
        this.chargement=false;
        // rediger selon le role de l'utilisateur
        if(response.role==="ADMIN"){
          this.router.navigate(['/admin/dashboard']);
        }else{
          this.router.navigate(['/user/mes-objets']);
        }
      },
      error: () => {
        this.chargement=false;
        this.erreur="Email ou mot de passe incorrect";
      }
    });
  }

}
