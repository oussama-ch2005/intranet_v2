import { Routes } from '@angular/router';
import {Login} from './pages/login/login'
import {authGuard} from './core/guards/auth-guard';
import {adminGuard} from './core/guards/admin-guard';
import {Dashboard} from './pages/admin/dashboard/dashboard';
import {Objets} from './pages/admin/objets/objets';
import {Users} from './pages/admin/users/users';
import {MesObjets} from './pages/user/mes-objets/mes-objets';
import {Conversation} from './pages/user/conversation/conversation';
import { Liste } from './pages/objets/liste/liste'; 
import { Detail } from './pages/objets/detail/detail';
import { UserDashboard } from './pages/user/user-dashboard/user-dashboard';
import { MesMentionsComponent } from './pages/user/mes-mentions/mes-mentions';


export const routes: Routes = [
  { path: 'login', component: Login },

  { path: 'objets', canActivate: [authGuard], children: [
    { path: 'liste',    component: Liste },
    { path: 'detail/:id', component: Detail },
    { path: '', redirectTo: 'liste', pathMatch: 'full' }
  ]},

  { path: 'admin', canActivate: [authGuard, adminGuard], children: [
    { path: 'dashboard', component: Dashboard },
    { path: 'objets',   component: Objets},
    { path: 'users',     component: Users },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]},


  //routes utilisateur - protege par authGuard
  {path:'user',canActivate:[authGuard],children:[
      {path:"user-dashboard",component:UserDashboard },
      {path:"mes-objets",component:MesObjets },
      {path: "conversation/:id",component:Conversation},
      {path:"mes-mentions",component:MesMentionsComponent },
      {path:'',redirectTo: 'mes-objets',pathMatch: "full"}
  ]},
  

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
