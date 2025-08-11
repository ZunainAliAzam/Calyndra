import { Routes } from '@angular/router';
import { HomePage } from './calyndra-pages/home-page/home-page';
import { Login } from './calyndra-pages/login/login';
import { Layout } from './layouts/layout/layout';
import { ProfilePage } from './calyndra-pages/profile-page/profile-page';
import { Dashboard } from './calyndra-pages/dashboard/dashboard';
import { Events } from './calyndra-pages/events/events';
import { Reports } from './calyndra-pages/reports/reports';
import { Settings } from './calyndra-pages/settings/settings';
import { HelpCenter } from './calyndra-pages/help-center/help-center';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: Login },
  { path: 'signup', component: Login },
  {
    path: 'org',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Dashboard },
      { path: 'events', component: Events },
      { path: 'reports', component: Reports },
      { path: 'settings', component: Settings },
      { path: 'help', component: HelpCenter },
    ],
  },
  { path: 'profile', component: ProfilePage },
  { path: '**', redirectTo: '' },
];
