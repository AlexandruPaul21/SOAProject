import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ApiService} from '../services/api';
import {interval, startWith, Subscription, switchMap} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="mb-8 flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-bold text-white mb-2">Live Analytics</h2>
          <p class="text-gray-400">Real-time event popularity tracking via Kafka Stream</p>
        </div>
        <div class="flex items-center gap-2">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span class="text-xs text-green-400 font-mono uppercase">Streaming</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Stat Card -->
        <div *ngFor="let item of stats() | keyvalue"
             class="bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden group hover:border-purple-500/50 transition-colors">

             <!-- Decorative Background Graph -->
             <div class="absolute bottom-0 left-0 right-0 h-16 opacity-10 flex items-end justify-between px-2 gap-1 pointer-events-none">
                <div class="w-full bg-purple-500 rounded-t-sm h-[40%]"></div>
                <div class="w-full bg-purple-500 rounded-t-sm h-[70%]"></div>
                <div class="w-full bg-purple-500 rounded-t-sm h-[50%]"></div>
                <div class="w-full bg-purple-500 rounded-t-sm h-[90%]"></div>
                <div class="w-full bg-purple-500 rounded-t-sm h-[60%]"></div>
             </div>

             <div class="relative z-10">
               <h3 class="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{{ item.key }}</h3>
               <div class="flex items-baseline gap-2">
                 <span class="text-4xl font-extrabold text-white">{{ item.value }}</span>
                 <span class="text-sm text-purple-400">views</span>
               </div>
             </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="(stats() | keyvalue)?.length === 0" class="col-span-full text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700 border-dashed">
          <p class="text-gray-500">No analytics data yet.</p>
          <p class="text-sm text-gray-600 mt-1">Hover over event cards in the 'Browse' tab to generate Kafka events.</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats = signal<{[key: string]: number}>({});
  private api = inject(ApiService);
  private refreshSub!: Subscription;

  ngOnInit() {
    this.refreshSub = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => this.api.getAnalyticsStats())
      )
      .subscribe({
        next: (data) => this.stats.set(data),
        error: (err) => console.error('Analytics Error', err)
      });
  }

  ngOnDestroy() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }
}
