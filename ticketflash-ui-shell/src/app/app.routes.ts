import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'shop',
    // LAZY LOADING THE MICRO-FRONTEND
    loadChildren: () => import('mfe1/Routes').then(m => m.routes)
  }
];
