import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn:'root'})
export class ConversationService {
  private apiUrl = "http://localhost:8080/api/conversations";

  constructor(private http: HttpClient) {}

  obtenirParId(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  obtenirOuCreerParId(objetId:number){
    return this.http.get<any>(`${this.apiUrl}/object/${objetId}`);
  }
  
}
