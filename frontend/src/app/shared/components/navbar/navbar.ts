import { Component ,OnInit,Input,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/service/auth';  
import { FormsModule } from '@angular/forms'; 
import { Subscription } from 'rxjs';
import { Websocket } from '../../../core/service/websocket';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  @Input() titre=''; //titre passe par la page parent



  private apiUrl = 'http://localhost:8080/api/notifications';


  recherche = '';
  notifications: any []=[];
  showNotifs = false;
  showProfil = false;

private notifSub!: Subscription;

  constructor(public auth:Auth , 
    private router:Router,
     private http:HttpClient,
     private cdr: ChangeDetectorRef,
     private wsSvc: Websocket

   ) {}

  ngOnInit() {
    this.chargerNotifications();

    // ✅ écoute en temps réel des nouvelles mentions
    this.notifSub = this.wsSvc.notificationRecue$.subscribe(() => {
      this.chargerNotifications();
    });
  }
  ngOnDestroy() {
    if (this.notifSub) this.notifSub.unsubscribe();
  }


  chargerNotifications() {
    // Récupère les notifications non lues de l'utilisateur connecté
    this.http.get<any>(`${this.apiUrl}/non-lues`).subscribe({
      next: (data) => {
        console.log(data);
        const notifications = Array.isArray(data)
          ? data
          : (data?.content || data?.data || data?.notifications || []);
        this.notifications = [...notifications].sort(
          (a, b) => this.dateNotification(b) - this.dateNotification(a)
        );
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  marquerLue(id: number) {
    this.notifications = this.notifications.filter(notification => notification.id !== id);
    this.cdr.detectChanges();

    this.http.put(`${this.apiUrl}/${id}/lue`, {}).subscribe({
      next: () => {
        console.log('Notification marquée comme lue');
      },
      error: () => {}
    });
  }

  private dateNotification(notification: any): number {
    const valeur = notification.dateNotif
      ?? notification.dateNotification
      ?? notification.createdAt
      ?? notification.created
      ?? notification.date;
    const date = new Date(valeur).getTime();
    return Number.isNaN(date) ? 0 : date;
  }

  objetNotification(notification: any): string {
    console.log(notification);
    return notification.titreObjet
      ?? notification.objectTitle
      ?? notification.conversation?.objetMetierTitle
      ?? notification.conversationTitle
      ?? 'cet objet';
  }

  auteurNotification(notification: any): string {
    const prenom = notification.mentionParPrenom
      ?? notification.auteur?.prenom
      ?? notification.sender?.prenom
      ?? '';
    const nom = notification.mentionParNom
      ?? notification.auteur?.nom
      ?? notification.sender?.nom
      ?? '';
    return `${prenom} ${nom}`.trim() || notification.senderName || 'Un utilisateur';
  }

  ouvrirNotification(notification: any) {
    const detailId = notification.conversationId
      ?? notification.objetId
      ?? notification.objectId
      ?? notification.idObjet;

    this.marquerLue(notification.id);
    this.fermerMenus();

    if (detailId != null) {
      this.router.navigate(['/objets/detail', detailId]);
    }
  }


  marquerToutesLues()
  {
    console.log(this.notifications);
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

  acceuil(){
    if(this.auth.estAdmin()){
      return '/admin/dashboard';
    }else{
      return '/user/user-dashboard';
    }
  }


  initiales():string{
    const email=this.auth.getEmail()||'';
    return email.charAt(0).toUpperCase();
  }
}
