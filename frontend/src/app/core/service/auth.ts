import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Router} from '@angular/router';
import {tap} from 'rxjs';


@Injectable({providedIn:'root'})
export class Auth {
  private apiUrl="http://localhost:8080/api/auth";

  constructor(private http: HttpClient ,private router:Router) {}

  //conexion envoi email/motdepass ,reçoit le token
  connecter(email:string,motDePasse:string){
    return this.http.post<{token:string,email:string,role:string}>(
      `${this.apiUrl}/connexion`,
      {email,motDePasse}
    ).pipe(
      tap(response=>{
        //stocker le token et les info user

        localStorage.setItem('token',response.token);
        localStorage.setItem("email",response.email);
        localStorage.setItem('role',response.role)

      })
    );
  }

  //Deconnexion
  deconnecter(){
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

  estAdmin():boolean{
    return this.getRole()==="ADMIN"
  }



}
