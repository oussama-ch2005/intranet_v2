import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  


@Injectable({providedIn:'root'})
export class Object {
    private apiUrl="http://localhost:8080/api/object";

    constructor(private http: HttpClient) {}
    creer(data:any){
        return this.http.post(this.apiUrl,data);

    }

    obtenirParId(id:number){
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    listerParType(type:string){
        return this.http.get(`${this.apiUrl}/type/${type}`);
    }

    changerStatus(id:number,status:string){
        return this.http.put(`${this.apiUrl}/${id}/status?status=${status}`,{});
    }

}
