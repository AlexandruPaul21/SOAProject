import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Tickets} from './components/tickets/tickets';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tickets, Tickets],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ticketflash-frontend');
}
