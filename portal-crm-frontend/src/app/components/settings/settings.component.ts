import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  // Estados
  isSaving = false;
  isLoading = false;
  activeTab = 'general';
  
  // Notificaciones
  notificationTitle = '';
  notificationMessage = '';
  
  // Configuración
  settings = {
    company: {
      name: 'Limpro Comercial',
      logoUrl: '',
      currency: 'MXN',
      timezone: 'America/Mexico_City'
    },
    preferences: {
      theme: 'light',
      language: 'es',
      notificationsEnabled: true,
      autoSave: true,
      itemsPerPage: 20
    },
    notifications: {
      email: {
        enabled: true
      },
      events: {
        newClient: true,
        taskDue: true,
        projectUpdate: true,
        salesReport: true
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
      ipBlockDuration: 1
    },
    integrations: {
      webhookUrl: '',
      webhookEnabled: false,
      smtp: {
        host: '',
        port: '587',
        ssl: true,
        username: '',
        password: ''
      },
      apiKey: 'sk_live_' + this.generateRandomString(32),
      apiKeyGeneratedAt: new Date()
    }
  };

  // Usuarios de ejemplo
  users = [
    { id: 1, username: 'admin', nombre: 'Administrador', email: 'admin@portal-crm.com', role: 'admin', activo: true },
    { id: 2, username: 'maria.g', nombre: 'María González', email: 'maria@empresa.com', role: 'manager', activo: true },
    { id: 3, username: 'carlos.r', nombre: 'Carlos Ramírez', email: 'carlos@empresa.com', role: 'user', activo: true }
  ];

  // Formulario de contraseña
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor() {}

  ngOnInit(): void {
    // Simular carga de configuración
    setTimeout(() => {
      this.loadSettingsFromStorage();
    }, 500);
  }

  loadSettingsFromStorage(): void {
    const saved = localStorage.getItem('crm_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsed };
      } catch (e) {
        console.error('Error parsing saved settings:', e);
      }
    }
  }

  // ========== MÉTODOS GENERALES ==========

  saveSettings(): void {
    this.isSaving = true;
    
    // Simular guardado
    setTimeout(() => {
      localStorage.setItem('crm_settings', JSON.stringify(this.settings));
      this.isSaving = false;
      this.showNotification('Éxito', 'Configuración guardada exitosamente');
    }, 1000);
  }

  // ========== PESTAÑA USUARIOS ==========

  openNewUserModal(): void {
    this.showNotification('Nuevo Usuario', 'Funcionalidad para agregar nuevo usuario - Próximamente');
  }

  toggleUserStatus(user: any): void {
    user.activo = !user.activo;
    this.showNotification('Estado Cambiado', `Usuario ${user.activo ? 'activado' : 'desactivado'} exitosamente`);
  }

  editUser(user: any): void {
    this.showNotification('Editar Usuario', `Editar usuario ${user.nombre} - Próximamente`);
  }

  deleteUser(user: any): void {
    if (confirm(`¿Eliminar al usuario ${user.nombre} permanentemente?`)) {
      this.users = this.users.filter(u => u.id !== user.id);
      this.showNotification('Usuario Eliminado', 'Usuario eliminado exitosamente');
    }
  }

  // ========== PESTAÑA SEGURIDAD ==========

  changePassword(): void {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.showNotification('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.showNotification('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.showNotification('Éxito', 'Contraseña cambiada exitosamente');
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  isPasswordValid(): boolean {
    return this.passwordForm.newPassword === this.passwordForm.confirmPassword && 
           this.passwordForm.newPassword.length >= 6;
  }

  // ========== PESTAÑA INTEGRACIONES ==========

  copyApiKey(): void {
    navigator.clipboard.writeText(this.settings.integrations.apiKey)
      .then(() => {
        this.showNotification('Copiado', 'API Key copiada al portapapeles');
      })
      .catch(err => {
        console.error('Error copying API key:', err);
        this.showNotification('Error', 'Error al copiar el API Key');
      });
  }

  regenerateApiKey(): void {
    if (confirm('¿Regenerar API Key? Las integraciones existentes dejarán de funcionar.')) {
      this.settings.integrations.apiKey = 'sk_live_' + this.generateRandomString(32);
      this.settings.integrations.apiKeyGeneratedAt = new Date();
      this.showNotification('Éxito', 'API Key regenerada exitosamente');
    }
  }

  testEmailConnection(): void {
    this.showNotification('Prueba de Email', 'Probando conexión SMTP... (simulado)');
  }

  testWebhook(): void {
    if (!this.settings.integrations.webhookUrl) {
      this.showNotification('Error', 'Por favor ingresa una URL de webhook');
      return;
    }
    this.showNotification('Prueba de Webhook', `Probando webhook: ${this.settings.integrations.webhookUrl} (simulado)`);
  }

  // ========== UTILIDADES ==========

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'manager': return 'bg-warning text-dark';
      case 'user': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuario';
      default: return role;
    }
  }

  getApiKeyDate(): string {
    return new Date(this.settings.integrations.apiKeyGeneratedAt).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  showNotification(title: string, message: string): void {
    this.notificationTitle = title;
    this.notificationMessage = message;
    
    // Mostrar modal de Bootstrap
    const modal = new (window as any).bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();
  }
}