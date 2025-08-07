import { Routes } from '@angular/router';
import { HomePage } from './calyndra-pages/home-page/home-page';
import { Login } from './calyndra-pages/login/login';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: Login },
  { path: 'signup', component: Login },
  { path: '**', redirectTo: '' },
];
