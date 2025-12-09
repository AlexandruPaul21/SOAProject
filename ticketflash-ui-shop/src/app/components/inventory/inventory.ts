import {ChangeDetectorRef, Component, inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApiService, Item} from '../services/api';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Card: Now Clickable, No MouseEnter Analytics -->
      <div *ngFor="let item of items; trackBy: trackById"
           (click)="openModal(item)"
           class="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer">

        <div class="h-48 bg-gray-700 relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
          <div class="absolute bottom-4 left-4">
             <span class="px-2 py-1 bg-purple-600 text-xs font-bold rounded uppercase tracking-wider text-white">
                {{ item.quantity > 0 ? 'View Details' : 'Sold Out' }}
             </span>
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{{ item.name }}</h3>
            <span class="text-lg font-bold text-white">\${{ item.price }}</span>
          </div>

          <p class="text-gray-400 text-sm mb-6 h-10 truncate">{{ item.description }}</p>

          <div class="flex items-center justify-between mt-auto">
            <div class="text-sm">
              <span class="text-gray-500">Available:</span>
              <span [class]="item.quantity < 10 ? 'text-red-400 font-bold ml-1' : 'text-gray-300 font-bold ml-1'">
                {{ item.quantity }}
              </span>
            </div>
            <!-- Buy button removed from card, moved to modal -->
            <span class="text-purple-400 text-sm font-bold group-hover:translate-x-1 transition-transform">Details &rarr;</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div *ngIf="items.length === 0" class="text-center py-20 text-gray-600">
      <p>Loading Events...</p>
    </div>

    <!-- EVENT DETAILS MODAL -->
    <div *ngIf="selectedItem" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" (click)="closeModal()">
      <div class="bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden border border-gray-700 shadow-2xl relative" (click)="$event.stopPropagation()">

        <!-- Modal Header Image -->
        <div class="h-40 bg-purple-900/50 relative">
          <div class="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
          <button (click)="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/20 hover:bg-black/50 rounded-full p-2 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-8 -mt-10 relative">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-3xl font-extrabold text-white mb-1">{{ selectedItem.name }}</h2>
              <span class="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded uppercase">Verified Event</span>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-white">\${{ selectedItem.price }}</div>
              <div class="text-xs text-gray-400">per ticket</div>
            </div>
          </div>

          <p class="text-gray-300 leading-relaxed mb-8">{{ selectedItem.description }}</p>

          <!-- Stats Row -->
          <div class="grid grid-cols-2 gap-4 mb-8 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
            <div>
              <span class="text-xs text-gray-500 block uppercase tracking-wider">Availability</span>
              <span [class]="selectedItem.quantity < 10 ? 'text-red-400' : 'text-white'" class="text-xl font-bold">
                            {{ selectedItem.quantity }} <span class="text-sm font-normal text-gray-500">tickets left</span>
                        </span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block uppercase tracking-wider">Status</span>
              <span class="text-xl font-bold text-white">Selling Fast</span>
            </div>
          </div>

          <!-- Actions -->
          <button
            (click)="onBuy(selectedItem)"
            [disabled]="selectedItem.quantity === 0"
            class="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            <span *ngIf="selectedItem.quantity > 0">Buy Ticket Now</span>
            <span *ngIf="selectedItem.quantity === 0">Sold Out</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class InventoryComponent implements OnInit, OnDestroy {
  items: any[] = [];
  selectedItem: Item | null = null;
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.refresh();
    // Listen for Shell's signal
    window.addEventListener('order-update', this.handleUpdate);
  }

  ngOnDestroy() {
    window.removeEventListener('order-update', this.handleUpdate);
  }

  handleUpdate = () => {
      setTimeout(() => {
        this.refresh();
      }, 500);
  }

  openModal(item: Item) {
    this.selectedItem = item;
    // ANALYTICS TRIGGER: Now happens only on Open Modal
    this.api.trackView(item.name).subscribe();
  }

  closeModal() {
    this.selectedItem = null;
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

  onBuy(item: any) {
    // Uses the token stored in the Singleton ApiService
    this.api.buyTicket(item).subscribe({
      next: () => {
        if (item.quantity > 0) {
          item.quantity--;
          if(this.selectedItem) this.selectedItem.quantity = item.quantity;
        }
        alert('Ticket Purchased! Check "My Tickets".');
        this.closeModal();
      },
      error: () => alert('Purchase Failed. Are you logged in?')
    });
  }
}
