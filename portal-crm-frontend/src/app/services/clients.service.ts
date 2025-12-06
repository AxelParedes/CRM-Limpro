import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Client {
  id: number;
  nombre: string;
  apellido: string;
  empresa: string;
  industria: string;
  email: string;
  telefono: string;
  estado: 'activo' | 'inactivo' | 'prospecto';
  fechaRegistro: Date;
  ingresos: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
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

  getClients(filters?: any): Observable<{clients: Client[], total: number, page: number, totalPages: number}> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<{clients: Client[], total: number, page: number, totalPages: number}>(
      `${this.apiUrl}/clients`,
      { headers: this.getHeaders(), params }
    );
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(
      `${this.apiUrl}/clients/${id}`,
      { headers: this.getHeaders() }
    );
  }
}