import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService} from '../services/api';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">My Tickets</h2>
        <button (click)="loadTickets()" class="text-purple-400 hover:text-white underline text-sm transition-colors">
          Refresh List
        </button>
      </div>

      <div class="grid gap-4">
        <div *ngFor="let ticket of tickets"
             class="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-purple-500/50 transition-all duration-300">

          <div class="flex items-center gap-4">
            <div class="bg-red-500/10 text-red-400 p-3 rounded-lg">
              <!-- PDF Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-gray-200 font-mono font-bold">{{ ticket }}</p>
              <p class="text-xs text-gray-500">Ready for download</p>
            </div>
          </div>

          <a [href]="getDownloadUrl(ticket)"
             target="_blank"
             class="flex items-center gap-2 bg-gray-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-bold group">
            Download
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>

        <div *ngIf="tickets.length === 0" class="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
          <p class="text-gray-500 text-lg">No tickets found.</p>
          <p class="text-gray-600 text-sm mt-1">Buy an event to generate a PDF ticket via FaaS!</p>
        </div>
      </div>
    </div>
  `
})
export class TicketListComponent implements OnInit {
  tickets: string[] = [];
  private api = inject(ApiService);

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.api.getTickets().subscribe({
      next: (data) => this.tickets = data,
      error: (err) => console.error('Failed to load tickets', err)
    });
  }

  getDownloadUrl(filename: string): string {
    return this.api.getTicketUrl(filename);
  }
}
