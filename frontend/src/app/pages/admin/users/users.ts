import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: any[] = [];
  chargement=true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/api/users').subscribe({
      next: (data) => {
        this.users = data;
        this.chargement=false;
      },
      error: () => this.chargement=false
    });
  }

 initiales(nom:string,prenom:string):string{
  return (prenom?.charAt(0) || '') + (nom?.charAt(0) || '');
 
 }
}
