import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn:'root'})
export class Conversation {
  private apiUrl = "http://localhost:8080/api/conversation";

  constructor(private http: HttpClient) {}

  obtenirParId(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  obtenirOuCreer(objetId:number){
    return this.http.get(`${this.apiUrl}/object/${objetId}`);
  }
  
}
