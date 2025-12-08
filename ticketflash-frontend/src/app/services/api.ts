import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private gatewayUrl = 'http://localhost:8080';
  private keycloakUrl = 'http://localhost:8180/realms/ticketflash-realm/protocol/openid-connect/token';

  login(username: string, password: string): Observable<any> {
    console.log(username, password);
    const body = new URLSearchParams();
    body.set('client_id', 'ticketflash-client');
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', 'password');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(this.keycloakUrl, body.toString(), { headers });
  }

  // --- Inventory ---
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.gatewayUrl}/api/inventory`);
  }

  // --- Analytics ---
  trackView(eventName: string) {
    return this.http.post(`${this.gatewayUrl}/api/analytics/view`, {
      eventName: eventName,
      userId: 'guest_user'
    }, { responseType: 'text' });
  }

  getTickets(): Observable<string[]> {
    return this.http.get<string[]>(`${this.gatewayUrl}/api/tickets`);
  }

  getTicketUrl(filename: string): string {
    return `${this.gatewayUrl}/api/tickets/${filename}`;
  }

  getAnalyticsStats(): Observable<{[key: string]: number}> {
    return this.http.get<{[key: string]: number}>(`${this.gatewayUrl}/api/analytics/stats`);
  }

  // --- Orders ---
  buyTicket(item: Item, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const orderPayload = {
      itemId: item.id,
      quantity: 1,
      userId: 'user_from_token' // In real app, decode JWT to get ID
    };

    return this.http.post(`${this.gatewayUrl}/api/orders`, orderPayload, {
      headers,
      responseType: 'text'
    });
  }
}
