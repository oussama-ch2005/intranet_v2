import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import { Websocket } from './websocket';   //  ajouté


@Injectable({providedIn:'root'})
export class Auth {
  private apiUrl="http://localhost:8080/api/auth";


  constructor(private http: HttpClient ,private router:Router,private wsSvc: Websocket) {}

  //conexion envoi email/motdepass ,reçoit le token
  connecter(email:string,password:string){
    return this.http.post<{token:string,email:string,role:string}>(
      `${this.apiUrl}/connexion`,
      {email,password}
    ).pipe(
      tap(response=>{
        //stocker le token et les info user

        localStorage.setItem('token',response.token);
        localStorage.setItem("email",response.email);
        localStorage.setItem('role',response.role)
        this.wsSvc.connecter(response.email);

      })
    );
  }

  //Deconnexion
  deconnecter(){
    this.wsSvc.deconnecter();//coupe le ws
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  estConnecte():boolean{
    return !!localStorage.getItem('token');
  }

  //recuperer token
  getToken(): string|null{
    return localStorage.getItem('token');
  }

  //recupere le romle
  getRole():string|null{
    return localStorage.getItem('role');
  }
  getEmail():string|null{
    return localStorage.getItem('email');
  }

  
estAdmin(): boolean {
  const role = this.getRole();
  if (!role) return false;
  const normalized = (typeof role === 'string' ? role : JSON.stringify(role))
    .toUpperCase()
    .replace(/^ROLE_/, '')
    .trim();
  return normalized === 'ADMIN' || normalized.includes('ADMIN');
}




}
