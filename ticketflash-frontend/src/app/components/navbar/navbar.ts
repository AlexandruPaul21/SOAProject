import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ApiService} from '../../services/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <nav class="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-purple-600 rounded flex items-center justify-center font-bold text-xl text-white">T</div>
            <span class="text-xl font-bold tracking-tight text-white">TicketFlash</span>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-4">
            <div class="hidden md:block text-xs text-gray-500">
              WS: <span [class]="wsConnected ? 'text-green-400 font-bold' : 'text-red-400 font-bold'">●</span>
            </div>

            <!-- Login Form (Visible if no token) -->
            <div *ngIf="!token" class="flex gap-2">
              <input
                type="text" [(ngModel)]="username" placeholder="User"
                class="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs w-24 text-white focus:border-purple-500 outline-none"
              >
              <input
                type="password" [(ngModel)]="password" placeholder="Pass"
                class="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs w-24 text-white focus:border-purple-500 outline-none"
              >
              <button
                (click)="onLogin()"
                class="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1 rounded transition-colors font-bold">
                Login
              </button>
            </div>

            <!-- Logged In State -->
            <div *ngIf="token" class="flex items-center gap-2">
              <span class="text-xs text-green-400 font-mono">Logged In</span>
              <button (click)="onLogout()" class="text-xs text-gray-400 hover:text-white underline">Logout</button>
            </div>

          </div>

        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  @Input() wsConnected = false;
  @Input() token = '';
  @Output() tokenChange = new EventEmitter<string>();

  private api = inject(ApiService);

  username = ''; // Default for convenience
  password = '';

  onLogin() {
    this.api.login(this.username, this.password).subscribe({
      next: (res: any) => {
        console.log('Login Success:', res);
        this.tokenChange.emit(res.access_token);
      },
      error: (err) => {
        console.error(err);
        alert('Login Failed! Check Console (Is Keycloak Web Origins configured?)');
      }
    });
  }

  onLogout() {
    this.tokenChange.emit('');
  }
}
