import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {RxStompService} from './components/services/rx-stomp';
import {ApiService} from './components/services/api';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-900 font-sans text-white">

      <!-- Shared Navbar -->
      <app-navbar
        [wsConnected]="wsConnected"
        (tokenChange)="onAuthChange($event)"
        (usernameChange)="onUserChange($event)">
      </app-navbar>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Navigation Tabs -->
        <div class="flex justify-center gap-4 mb-10 bg-gray-800/50 p-1.5 rounded-full w-fit mx-auto backdrop-blur-sm">
           <a routerLink="/" class="px-6 py-2 rounded-full font-bold text-gray-400 hover:text-white" routerLinkActive="bg-purple-600 text-white shadow-lg" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
           <a routerLink="/shop/inventory" class="px-6 py-2 rounded-full font-bold text-gray-400 hover:text-white" routerLinkActive="bg-purple-600 text-white shadow-lg">Browse</a>
           <a routerLink="/shop/tickets" class="px-6 py-2 rounded-full font-bold text-gray-400 hover:text-white" routerLinkActive="bg-purple-600 text-white shadow-lg">My Tickets</a>
        </div>

        <!-- The Micro-Frontend Loads Here -->
        <router-outlet></router-outlet>

      </main>

      <!-- Global Toast Notifications -->
      <div class="fixed bottom-5 right-5 flex flex-col gap-2 pointer-events-none z-50">
        <div *ngFor="let notif of notifications" class="bg-gray-800 border-l-4 border-purple-500 text-white px-6 py-4 rounded shadow-2xl animate-bounce">
            <p class="text-xs text-gray-300">{{ notif }}</p>
        </div>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  private rxStomp = inject(RxStompService);
  private api = inject(ApiService);

  wsConnected = false;
  notifications: string[] = [];
  tempToken = '';

  ngOnInit() {
    // Global WebSocket Listener
    this.rxStomp.connected$.subscribe(state => this.wsConnected = (state === 1));
    this.rxStomp.watch('/topic/orders').subscribe(msg => {
      this.notifications.push(msg.body);
      setTimeout(() => this.notifications.shift(), 5000);

      // Dispatch Event so Remote App knows to refresh!
      window.dispatchEvent(new CustomEvent('order-update'));
    });
  }

  onAuthChange(token: string) { this.tempToken = token; this.updateApi(); }
  onUserChange(user: string) {
    this.api.setCredentials(this.tempToken, user);
  }
  updateApi() { /* triggered by inputs */ }
}
