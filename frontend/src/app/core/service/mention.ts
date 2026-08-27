import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Mention {
  private api = 'http://localhost:8080/api/mentions';
  constructor(private http: HttpClient) {}

  mesMentions() {
    return this.http.get<any[]>(`${this.api}/mes-mentions`);
  }
}
