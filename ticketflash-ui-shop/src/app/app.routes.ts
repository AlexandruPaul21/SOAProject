import { Routes } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory';
import { TicketListComponent } from './components/ticket-list/ticket-list';

// These routes will be loaded inside the Shell
export const routes: Routes = [
  { path: '', redirectTo: 'inventory', pathMatch: 'full' },
  { path: 'inventory', component: InventoryComponent },
  { path: 'tickets', component: TicketListComponent },
];
