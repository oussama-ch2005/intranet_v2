import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  


@Injectable({providedIn: 'root'})
export class User {
    private api="/api/users";
    constructor(private http: HttpClient) {}
    listerTous() {
        return this.http.get<any[]>(this.api);
        
    }

    obtenirParId(id: number) {
        return this.http.get<any>(`${this.api}/${id}`);
    }
}
