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

  // --- STATE ---
  private _token = '';
  private _username = '';

  setCredentials(token: string, username: string) {
    this._token = token;
    this._username = username;
    // FIX 1: Persist to LocalStorage so Remote Apps can see it
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_username', username);
  }

  // Helper to get token from memory OR storage
  private getToken(): string {
    return this._token || localStorage.getItem('tf_token') || '';
  }

  private getUsername(): string {
    return this._username || localStorage.getItem('tf_username') || 'guest';
  }

  login(username: string, password: string): Observable<any> {
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
  buyTicket(item: any) {
    // FIX 2: Read from the helper method (which checks localStorage)
    const token = this.getToken();
    const username = this.getUsername();

    if (!token) {
      console.warn('No token found in ApiService or LocalStorage');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const orderPayload = {
      itemId: item.id,
      quantity: 1,
      userId: username
    };
    return this.http.post(`${this.gatewayUrl}/api/orders`, orderPayload, { headers, responseType: 'text' });
  }
}
