import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, Item} from '../../services/api';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Added trackBy for better performance during updates -->
      <div *ngFor="let item of items; trackBy: trackById"
           (mouseenter)="onTrackView(item.name)"
           class="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">

        <div class="h-48 bg-gray-700 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
          <div class="absolute bottom-4 left-4">
            <span class="px-2 py-1 bg-purple-600 text-xs font-bold rounded uppercase tracking-wider text-white">Selling Fast</span>
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{{ item.name }}</h3>
            <span class="text-lg font-bold text-white">\${{ item.price }}</span>
          </div>

          <p class="text-gray-400 text-sm mb-6 h-10">{{ item.description }}</p>

          <div class="flex items-center justify-between mt-auto">
            <div class="text-sm">
              <span class="text-gray-500">Available:</span>
              <span [class]="item.quantity < 10 ? 'text-red-400 font-bold ml-1' : 'text-gray-300 font-bold ml-1'">
                {{ item.quantity }}
              </span>
            </div>

            <button
              (click)="onBuy(item)"
              [disabled]="item.quantity === 0"
              class="px-4 py-2 bg-white text-gray-900 font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ item.quantity === 0 ? 'Sold Out' : 'Buy Ticket' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="items.length === 0" class="text-center py-20 text-gray-600">
      <p>Loading Events...</p>
    </div>
  `
})
export class InventoryComponent implements OnInit {
  items: Item[] = [];

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  token = '';

  ngOnInit() {
    this.refresh();
  }

  // Helper to prevent DOM thrashing
  trackById(index: number, item: Item) {
    return item.id;
  }

  refresh() {
    this.api.getItems().subscribe(data => {
      // 2. FIX ORDER: Always sort by ID so they don't jump around
      this.items = data.sort((a, b) => a.id - b.id);
      this.cdr.detectChanges(); // Ensure UI reflects the new list
    });
  }

  decrementItem(itemId: number) {
    const item = this.items.find(i => i.id === itemId);
    if (item && item.quantity > 0) {
      item.quantity--;
      console.log('Inventory Component: Decremented', item.name);

      // 3. FIX HOVER ISSUE: Force Angular to update the view immediately
      this.cdr.detectChanges();
    }
  }

  onTrackView(name: string) {
    this.api.trackView(name).subscribe();
  }

  onBuy(item: Item) {
    if (!this.token) {
      alert('Please login if you want to buy a ticket!');
      return;
    }
    this.api.buyTicket(item, this.token).subscribe({
      next: (_) => {
        this.cdr.detectChanges();
      },
      error: (err) => alert('Purchase Failed (Check Console)'),
    });
  }
}
