import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Project {
  id: number;
  cliente_id: number;
  nombre: string;
  descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'cancelado';
  fecha_inicio: Date;
  fecha_fin: Date;
  presupuesto: number;
  ingresos: number;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  cliente_nombre?: string;
  cliente_empresa?: string;
  total_tareas?: number;
  tareas_completadas?: number;
}

export interface ProjectFilters {
  estado?: string;
  prioridad?: string;
  cliente_id?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
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

  getProjects(filters?: ProjectFilters): Observable<{projects: Project[], total: number, page: number, totalPages: number}> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof ProjectFilters]) {
          params = params.set(key, filters[key as keyof ProjectFilters]!.toString());
        }
      });
    }

    return this.http.get<{projects: Project[], total: number, page: number, totalPages: number}>(
      `${this.apiUrl}/projects`,
      { headers: this.getHeaders(), params }
    );
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(
      `${this.apiUrl}/projects/${id}`,
      { headers: this.getHeaders() }
    );
  }

  createProject(project: Omit<Project, 'id' | 'fecha_creacion' | 'fecha_actualizacion'>): Observable<Project> {
    return this.http.post<Project>(
      `${this.apiUrl}/projects`,
      project,
      { headers: this.getHeaders() }
    );
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(
      `${this.apiUrl}/projects/${id}`,
      project,
      { headers: this.getHeaders() }
    );
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/projects/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getProjectStats(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/projects/stats`,
      { headers: this.getHeaders() }
    );
  }

  getProjectTimeline(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/projects/timeline`,
      { headers: this.getHeaders() }
    );
  }
}