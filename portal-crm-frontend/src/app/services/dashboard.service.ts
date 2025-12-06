import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`, { headers: this.getHeaders() });
  }

  getRecentActivities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/recent-activities`, { headers: this.getHeaders() });
  }
}