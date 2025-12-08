import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from '../navbar/navbar';
import {RxStompService} from '../../services/rx-stomp';
import {InventoryComponent} from '../inventory/inventory';
import {TicketListComponent} from '../ticket-list/ticket-list';
import {DashboardComponent} from '../dashboard/dashboard';

@Component({
  selector: 'tickets',
  standalone: true,
  imports: [CommonModule, NavbarComponent, InventoryComponent, TicketListComponent, DashboardComponent],
  template: `
    <div class="min-h-screen bg-gray-900 font-sans selection:bg-purple-500 selection:text-white">

      <app-navbar
        [wsConnected]="wsConnected"
        [(token)]="authToken">
      </app-navbar>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Tabs -->
        <div class="flex justify-center gap-4 mb-10 bg-gray-800/50 p-1.5 rounded-full w-fit mx-auto backdrop-blur-sm">
          <button (click)="view = 'shop'"
                  [class]="view === 'shop' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white'"
                  class="px-6 py-2 rounded-full font-bold transition-all duration-300">
            Browse Events
          </button>

          <button (click)="view = 'tickets'"
                  [class]="view === 'tickets' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white'"
                  class="px-6 py-2 rounded-full font-bold transition-all duration-300">
            My Tickets
          </button>

          <button (click)="view = 'dashboard'"
                  [class]="view === 'dashboard' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white'"
                  class="px-6 py-2 rounded-full font-bold transition-all duration-300">
            Analytics
          </button>
        </div>

        <!-- Views -->
        <div [ngSwitch]="view" class="animate-fade-in">
          <app-inventory *ngSwitchCase="'shop'" #inventory></app-inventory>
          <app-ticket-list *ngSwitchCase="'tickets'"></app-ticket-list>
          <app-dashboard *ngSwitchCase="'dashboard'"></app-dashboard>
        </div>

      </main>

      <!-- Toast Notifications -->
      <div class="fixed bottom-5 right-5 flex flex-col gap-2 pointer-events-none z-50">
        <div *ngFor="let notif of notifications"
             class="bg-gray-800 border-l-4 border-purple-500 text-white px-6 py-4 rounded shadow-2xl flex items-center gap-4 animate-slide-in pointer-events-auto max-w-sm">
          <div>
            <h4 class="font-bold text-sm text-purple-400">System Alert</h4>
            <p class="text-xs text-gray-300">{{ notif }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
  `]
})
export class Tickets implements OnInit {
  @ViewChild('inventory') inventory!: InventoryComponent;

  private rxStomp = inject(RxStompService);

  view: 'shop' | 'dashboard' | 'tickets' = 'shop';
  wsConnected = false;
  authToken = '';
  notifications: string[] = [];

  ngOnInit() {
    this.initWebSocket();
  }

  ngAfterViewChecked() {
    if (this.inventory) {
      this.inventory.token = this.authToken;
    }
  }

  private initWebSocket() {
    this.rxStomp.connected$.subscribe((state) => {
      this.wsConnected = (state === 1);
      console.log('WS Connection State:', state === 1 ? 'CONNECTED' : 'DISCONNECTED');
    });

    this.rxStomp.watch('/topic/orders').subscribe((message) => {
      const msgBody = message.body;
      console.log('1. WS Message Received:', msgBody);

      this.showNotification(msgBody);

      // DEBUG: Log the Regex attempt
      // Ensure backend sends exactly "New Ticket Sold! Item ID: 1"
      // If backend sends "Item ID:1" (no space), this regex needs to be /Item ID:\s*(\d+)/
      const match = msgBody.match(/Item ID: (\d+)/);
      console.log('2. Regex Match Result:', match);

      if (match && match[1]) {
        const itemId = parseInt(match[1], 10);
        console.log('3. Parsed ID:', itemId);

        if (this.inventory) {
          console.log('4. Calling Inventory Component...');
          this.inventory.decrementItem(itemId);
        } else {
          console.error('4. FAIL: Inventory Component ViewChild is undefined!');
        }
      } else {
        console.warn('2. FAIL: Regex did not find an ID. Check Backend string format.');
      }

      setTimeout(() => {
        if (this.inventory) {
          console.log('5. Triggering Full Refresh (DB Sync)');
          this.inventory.refresh();
        }
      }, 1000);
    });
  }

  private showNotification(msg: string) {
    this.notifications.push(msg);
    setTimeout(() => this.notifications.shift(), 5000);
  }
}
