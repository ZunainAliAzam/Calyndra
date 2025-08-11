import { Routes } from '@angular/router';
import { HomePage } from './calyndra-pages/home-page/home-page';
import { Login } from './calyndra-pages/login/login';
import { Layout } from './layouts/layout/layout';
import { ProfilePage } from './calyndra-pages/profile-page/profile-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: Login },
  { path: 'signup', component: Login },
  { path: 'org/home', component: Layout },
  { path: 'profile', component: ProfilePage },
  { path: '**', redirectTo: '' },
];
