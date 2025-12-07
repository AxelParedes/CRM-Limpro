import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface CompanySettings {
  name: string;
  logoUrl: string;
  currency: string;
  timezone: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notificationsEnabled: boolean;
  autoSave: boolean;
  itemsPerPage: number;
  dashboardLayout?: string;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    address: string;
  };
  events: {
    newClient: boolean;
    taskDue: boolean;
    projectUpdate: boolean;
    salesReport: boolean;
    paymentReceived: boolean;
    milestoneCompleted: boolean;
  };
  reports: {
    weekly: string;
    monthly: string;
    time: string;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  ipBlockDuration: number;
  passwordExpiryDays: number;
  requireStrongPassword: boolean;
}

export interface IntegrationSettings {
  webhookUrl: string;
  webhookEnabled: boolean;
  webhookSecret?: string;
  smtp: {
    host: string;
    port: string;
    ssl: boolean;
    username: string;
    password: string;
  };
  apiKey: string;
  apiKeyGeneratedAt: Date;
}

export interface SystemSettings {
  company: CompanySettings;
  preferences: UserPreferences;
  notifications: NotificationSettings;
  security: SecuritySettings;
  integrations: IntegrationSettings;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'http://localhost:3000/api/settings';
  private currentSettings?: SystemSettings;

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

  // Obtener configuración del sistema
  getSettings(): Observable<SystemSettings> {
    if (this.currentSettings) {
      return of(this.currentSettings);
    }

    return this.http.get<SystemSettings>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(settings => {
          this.currentSettings = settings;
          this.applySettings(settings);
        }),
        catchError(error => {
          console.error('Error loading settings, using defaults:', error);
          return of(this.getDefaultSettings());
        })
      );
  }

  // Guardar configuración
  saveSettings(settings: SystemSettings): Observable<SystemSettings> {
    return this.http.put<SystemSettings>(this.apiUrl, settings, { headers: this.getHeaders() })
      .pipe(
        tap(savedSettings => {
          this.currentSettings = savedSettings;
          this.applySettings(savedSettings);
          localStorage.setItem('crm_settings', JSON.stringify(savedSettings));
        })
      );
  }

  // Aplicar configuración en tiempo real
  private applySettings(settings: SystemSettings): void {
    // Aplicar tema
    this.applyTheme(settings.preferences.theme);
    
    // Aplicar idioma
    this.applyLanguage(settings.preferences.language);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('crm_settings', JSON.stringify(settings));
  }

  // Aplicar tema visual
  applyTheme(theme: string): void {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Aplicar idioma
  applyLanguage(language: string): void {
    // Aquí podrías integrar ngx-translate o similar
    console.log('Applying language:', language);
    localStorage.setItem('language', language);
  }

  // Regenerar API Key
  regenerateApiKey(): Observable<{apiKey: string, generatedAt: Date}> {
    return this.http.post<{apiKey: string, generatedAt: Date}>(
      `${this.apiUrl}/regenerate-api-key`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (this.currentSettings) {
          this.currentSettings.integrations.apiKey = response.apiKey;
          this.currentSettings.integrations.apiKeyGeneratedAt = response.generatedAt;
        }
      })
    );
  }

  // Probar conexión SMTP
  testSmtpConnection(smtpConfig: any): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(
      `${this.apiUrl}/test-smtp`,
      smtpConfig,
      { headers: this.getHeaders() }
    );
  }

  // Probar webhook
  testWebhook(webhookUrl: string): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(
      `${this.apiUrl}/test-webhook`,
      { url: webhookUrl },
      { headers: this.getHeaders() }
    );
  }

  // Configuración por defecto
  private getDefaultSettings(): SystemSettings {
    return {
      company: {
        name: 'Limpro Comercial',
        logoUrl: '',
        currency: 'MXN',
        timezone: 'America/Mexico_City',
        address: '',
        phone: '',
        email: ''
      },
      preferences: {
        theme: 'light',
        language: 'es',
        notificationsEnabled: true,
        autoSave: true,
        itemsPerPage: 20,
        dashboardLayout: 'default'
      },
      notifications: {
        email: {
          enabled: true,
          address: ''
        },
        events: {
          newClient: true,
          taskDue: true,
          projectUpdate: true,
          salesReport: true,
          paymentReceived: true,
          milestoneCompleted: true
        },
        reports: {
          weekly: 'monday',
          monthly: '1',
          time: '09:00'
        }
      },
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        ipBlockDuration: 1,
        passwordExpiryDays: 90,
        requireStrongPassword: true
      },
      integrations: {
        webhookUrl: '',
        webhookEnabled: false,
        webhookSecret: this.generateRandomSecret(),
        smtp: {
          host: '',
          port: '587',
          ssl: true,
          username: '',
          password: ''
        },
        apiKey: this.generateApiKey(),
        apiKeyGeneratedAt: new Date()
      }
    };
  }

  private generateApiKey(): string {
    return 'sk_live_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }

  private generateRandomSecret(): string {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  }
}