import { Routes } from '@angular/router';
import {Login} from './pages/login/login'
import {authGuard} from './core/guards/auth-guard';
import {adminGuard} from './core/guards/admin-guard';
import {Dashboard} from './pages/admin/dashboard/dashboard';
import {Tickets} from './pages/admin/tickets/tickets';
import {Users} from './pages/admin/users/users';
import {MesTickets} from './pages/user/mes-tickets/mes-tickets';
import {Conversation} from './pages/user/conversation/conversation';


export const routes: Routes = [

  // route public
  {path:'login',component:Login},
  //route admin - protege par authguard + admin guard
  {
    path:"admin",canActivate:[authGuard,adminGuard],children:[
      {path:'dashboard',component:Dashboard},
      {path:"tickets",component:Tickets},
      {path:"users",component:Users},
      {path:'',redirectTo:'dashboard',pathMatch:'full'}

    ]},
  //routes utilisateur - protege par authGuard
  {path:'user',canActivate:[authGuard],children:[
      {path:"tickets",component:MesTickets },
      {path: "conversation/:id",component:Conversation},
      {path:'',redirectTo: 'tickets',pathMatch: "full"}

    ]},
  //redirection par defeut
  {path:'',redirectTo:'login',pathMatch:"full"},
  {path:'**',redirectTo:"login"}



];
