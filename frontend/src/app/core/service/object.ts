import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  


@Injectable({providedIn:'root'})
export class Object {
    private apiUrl="http://localhost:8080/api/objects";

    constructor(private http: HttpClient) {}
    creer(data:any){
        return this.http.post<any>(this.apiUrl,data);

    }

    obtenirParId(id:number){
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    listerTous(){
        return this.http.get<any[]>(`${this.apiUrl}`);
    }   

    listerParType(type:string){
        return this.http.get<any[]>(`${this.apiUrl}/type/${type}`);
    }

    changerStatus(id:number,status:string){
        return this.http.put<any>(`${this.apiUrl}/${id}/status?status=${status}`,{});
    }

}
