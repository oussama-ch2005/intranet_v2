import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Sidebar} from '../../../shared/components/sidebar/sidebar';
import { Navbar}  from '../../../shared/components/navbar/navbar';
import { Object }    from '../../../core/service/object';
import { Auth }      from '../../../core/service/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Navbar],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit {

  mesObjets:  any[] = [];
  chargement  = true;
  stats = { ouverts:0, enCours:0, resolus:0 };

  constructor(public auth: Auth, private objSvc: Object, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.objSvc.mesObjets().subscribe({
      next: (data: any) => {
        this.mesObjets = data;
        this.stats = {
          ouverts: data.filter((o: any) => o.status === 'OUVERT').length,
          enCours: data.filter((o: any) => o.status === 'EN_COURS').length,
          resolus: data.filter((o: any) => o.status === 'RESOLU').length,
        };
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => { this.chargement = false; }
    });
  }

  ouvrir(o: any) { this.router.navigate(['/objets/detail', o.id]); }
  badgeStatut(s: string) { const m: any = { OUVERT:'b-blue', EN_COURS:'b-amber', RESOLU:'b-green', FERME:'b-gray' }; return m[s]||'b-gray'; }
}