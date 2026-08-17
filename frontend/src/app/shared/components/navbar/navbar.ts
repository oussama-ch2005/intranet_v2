import { Component ,OnInit,Input,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/service/auth';  
import { FormsModule } from '@angular/forms'; 



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  @Input() titre=''; //titre passe par la page parent

  recherche = '';
  notifications: any []=[];
  showNotifs = false;
  showProfil = false;



  constructor(public auth:Auth , 
    private router:Router,
     private http:HttpClient,
     private cdr: ChangeDetectorRef
   ) {}

  ngOnInit() {
    this.chargerNotifications();
  }


  chargerNotifications() {
    // Récupère les notifications non lues de l'utilisateur connecté
    this.http.get<any[]>('/api/notifications/non-lues').subscribe({
      next: (data) => {
        console.log(data);
        this.notifications = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  marquerLue(id: number) {
    this.http.put(`/api/notifications/${id}/lue`, {}).subscribe({
      next: () => {
        console.log('Notification marquée comme lue');
        this.chargerNotifications();
      },
      error: () => {}
    });
  }


  marquerToutesLues()
  {
    this.notifications.forEach((notification) => {
      this.marquerLue(notification.id);
    });

  }

  rechercherObjet(){
    if(!this.recherche.trim()){
      return;
    }
    this.router.navigate(['/objets/liste'], { queryParams: { recherche: this.recherche } });
    this.recherche='';

  }

  toggleNotifs() {
    this.showNotifs = !this.showNotifs;
    this.showProfil=false;
  }

  toggleProfil() {
    this.showProfil = !this.showProfil;
    this.showNotifs=false;
  }

  fermerMenus() {
    this.showNotifs = false;
    this.showProfil = false;
  }

  initiales():string{
    const email=this.auth.getEmail()||'';
    return email.charAt(0).toUpperCase();
  }
}
