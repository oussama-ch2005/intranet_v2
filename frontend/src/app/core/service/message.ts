import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn:'root'})
export class Message {
    private apiUrl = "http://localhost:8080/api/message";
    constructor(private http: HttpClient) {}
    envoyer(conversationId:number,data:any){
        return this.http.post(`${this.apiUrl}/conversation/${conversationId}`,data);
    }
    supprimer(messageId:number){
        return this.http.delete(`${this.apiUrl}/${messageId}`);
    }

}
