import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface User {
  id: number;
  username: string;
  nombre: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  activo: boolean;
  fecha_creacion: Date;
  ultimo_acceso?: Date;
  telefono?: string;
  departamento?: string;
  avatar_url?: string;
}

export interface NewUser {
  username: string;
  password: string;
  nombre: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  telefono?: string;
  departamento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtener un usuario por ID
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Crear nuevo usuario
  createUser(user: NewUser): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, { headers: this.getHeaders() });
  }

  // Actualizar usuario
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() });
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Activar/desactivar usuario
  toggleUserStatus(id: number, activo: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, { activo }, { headers: this.getHeaders() });
  }

  // Cambiar contraseña
  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(
      `${this.apiUrl}/${userId}/change-password`,
      { currentPassword, newPassword },
      { headers: this.getHeaders() }
    );
  }

  // Reiniciar contraseña (admin)
  resetPassword(userId: number): Observable<{temporaryPassword: string}> {
    return this.http.post<{temporaryPassword: string}>(
      `${this.apiUrl}/${userId}/reset-password`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // Obtener roles disponibles
  getAvailableRoles(): {value: string, label: string, description: string}[] {
    return [
      { value: 'admin', label: 'Administrador', description: 'Acceso completo al sistema' },
      { value: 'manager', label: 'Gerente', description: 'Puede gestionar proyectos y equipos' },
      { value: 'user', label: 'Usuario', description: 'Acceso estándar a funcionalidades' },
      { value: 'viewer', label: 'Observador', description: 'Solo lectura' }
    ];
  }

  // Validar fortaleza de contraseña
  validatePasswordStrength(password: string): {valid: boolean, errors: string[]} {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}