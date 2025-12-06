import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Task {
  id: number;
  proyecto_id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fecha_vencimiento: Date;
  asignado_a: number;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  proyecto_nombre?: string;
  asignado_nombre?: string;
}

export interface TaskFilters {
  estado?: string;
  prioridad?: string;
  proyecto_id?: number;
  asignado_a?: number;
  fecha_vencimiento?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
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

  getTasks(filters?: TaskFilters): Observable<{tasks: Task[], total: number, page: number, totalPages: number}> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof TaskFilters]) {
          params = params.set(key, filters[key as keyof TaskFilters]!.toString());
        }
      });
    }

    return this.http.get<{tasks: Task[], total: number, page: number, totalPages: number}>(
      `${this.apiUrl}/tasks`,
      { headers: this.getHeaders(), params }
    );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(
      `${this.apiUrl}/tasks/${id}`,
      { headers: this.getHeaders() }
    );
  }

  createTask(task: Omit<Task, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>): Observable<Task> {
    return this.http.post<Task>(
      `${this.apiUrl}/tasks`,
      task,
      { headers: this.getHeaders() }
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/tasks/${id}`,
      task,
      { headers: this.getHeaders() }
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/tasks/${id}`,
      { headers: this.getHeaders() }
    );
  }

  updateTaskStatus(id: number, estado: Task['estado']): Observable<Task> {
    return this.http.patch<Task>(
      `${this.apiUrl}/tasks/${id}/status`,
      { estado },
      { headers: this.getHeaders() }
    );
  }

  getTaskStats(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/tasks/stats`,
      { headers: this.getHeaders() }
    );
  }
}