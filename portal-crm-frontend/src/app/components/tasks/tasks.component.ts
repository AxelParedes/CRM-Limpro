import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService, Task, TaskFilters } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedTasks = new Set<number>();
  isLoading = false;
  taskStats: any = {};

  filters: TaskFilters = {
    estado: '',
    prioridad: '',
    search: '',
    page: 1,
    limit: 20
  };

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadTaskStats();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.tasksService.getTasks(this.filters).subscribe({
      next: (response) => {
        this.tasks = response.tasks;
        this.filteredTasks = [...this.tasks];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
        // Datos de ejemplo para desarrollo
        this.loadSampleTasks();
      }
    });
  }

  loadTaskStats(): void {
    this.tasksService.getTaskStats().subscribe({
      next: (stats) => {
        this.taskStats = stats;
      },
      error: (error) => {
        console.error('Error loading task stats:', error);
      }
    });
  }

  loadSampleTasks(): void {
    // Datos de ejemplo para desarrollo
    this.tasks = [
      {
        id: 1,
        proyecto_id: 1,
        titulo: 'Revisar propuesta comercial',
        descripcion: 'Analizar y aprobar la propuesta para el cliente Tech Solutions',
        estado: 'pendiente',
        prioridad: 'alta',
        fecha_vencimiento: new Date('2024-02-15'),
        asignado_a: 1,
        fecha_creacion: new Date('2024-01-20'),
        fecha_actualizacion: new Date('2024-01-20'),
        proyecto_nombre: 'Implementación CRM',
        asignado_nombre: 'María González'
      },
      {
        id: 2,
        proyecto_id: 2,
        titulo: 'Desarrollo del módulo de reportes',
        descripcion: 'Implementar gráficos y estadísticas para el dashboard',
        estado: 'en_progreso',
        prioridad: 'urgente',
        fecha_vencimiento: new Date('2024-01-31'),
        asignado_a: 2,
        fecha_creacion: new Date('2024-01-10'),
        fecha_actualizacion: new Date('2024-01-25'),
        proyecto_nombre: 'Sistema de Gestión',
        asignado_nombre: 'Carlos Ramírez'
      },
      {
        id: 3,
        proyecto_id: 1,
        titulo: 'Reunión de seguimiento',
        descripcion: 'Seguimiento semanal con el equipo de desarrollo',
        estado: 'completada',
        prioridad: 'media',
        fecha_vencimiento: new Date('2024-01-22'),
        asignado_a: 3,
        fecha_creacion: new Date('2024-01-15'),
        fecha_actualizacion: new Date('2024-01-22'),
        proyecto_nombre: 'Implementación CRM',
        asignado_nombre: 'Ana López'
      },
      {
        id: 4,
        proyecto_id: 3,
        titulo: 'Configurar servidor de producción',
        descripcion: 'Preparar el entorno de producción para el nuevo cliente',
        estado: 'pendiente',
        prioridad: 'alta',
        fecha_vencimiento: new Date('2024-02-05'),
        asignado_a: 1,
        fecha_creacion: new Date('2024-01-18'),
        fecha_actualizacion: new Date('2024-01-18'),
        proyecto_nombre: 'Migración Cloud',
        asignado_nombre: 'María González'
      },
      {
        id: 5,
        proyecto_id: 2,
        titulo: 'Documentación técnica',
        descripcion: 'Redactar documentación para la API del sistema',
        estado: 'en_progreso',
        prioridad: 'baja',
        fecha_vencimiento: new Date('2024-02-28'),
        asignado_a: 4,
        fecha_creacion: new Date('2024-01-05'),
        fecha_actualizacion: new Date('2024-01-20'),
        proyecto_nombre: 'Sistema de Gestión',
        asignado_nombre: 'Pedro Martínez'
      }
    ];
    this.filteredTasks = [...this.tasks];
    this.isLoading = false;
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadTasks();
  }

  resetFilters(): void {
    this.filters = {
      estado: '',
      prioridad: '',
      search: '',
      page: 1,
      limit: 20
    };
    this.loadTasks();
  }

  // Métodos de utilidad
  getPriorityBadgeClass(prioridad: string): string {
    switch (prioridad) {
      case 'urgente': return 'bg-danger';
      case 'alta': return 'bg-warning text-dark';
      case 'media': return 'bg-info';
      case 'baja': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }

  getPriorityLabel(prioridad: string): string {
    switch (prioridad) {
      case 'urgente': return 'Urgente';
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return prioridad;
    }
  }

  getStatusBadgeClass(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'bg-warning text-dark';
      case 'en_progreso': return 'bg-primary';
      case 'completada': return 'bg-success';
      case 'cancelada': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }

  getStatusLabel(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_progreso': return 'En Progreso';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  }

  isTaskOverdue(task: Task): boolean {
    if (task.estado === 'completada') return false;
    const today = new Date();
    const dueDate = new Date(task.fecha_vencimiento);
    return dueDate < today;
  }

  getDaysRemaining(task: Task): number | null {
    if (task.estado === 'completada') return null;
    const today = new Date();
    const dueDate = new Date(task.fecha_vencimiento);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  // Métodos de selección
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.filteredTasks.forEach(task => this.selectedTasks.add(task.id));
    } else {
      this.selectedTasks.clear();
    }
  }

  toggleTaskSelection(taskId: number): void {
    if (this.selectedTasks.has(taskId)) {
      this.selectedTasks.delete(taskId);
    } else {
      this.selectedTasks.add(taskId);
    }
  }

  // Métodos de acciones
  openNewTaskModal(): void {
    alert('Funcionalidad para crear nueva tarea - Próximamente');
  }

  editTask(task: Task): void {
    alert(`Editar tarea: ${task.titulo} - Próximamente`);
  }

  viewTaskDetails(task: Task): void {
    alert(`Detalles de tarea: ${task.titulo}\n\nDescripción: ${task.descripcion}\nEstado: ${this.getStatusLabel(task.estado)}\nPrioridad: ${this.getPriorityLabel(task.prioridad)}`);
  }

  completeTask(task: Task): void {
    if (confirm(`¿Marcar la tarea "${task.titulo}" como completada?`)) {
      this.tasksService.updateTaskStatus(task.id, 'completada').subscribe({
        next: () => {
          this.loadTasks();
          this.loadTaskStats();
        },
        error: (error) => {
          console.error('Error completing task:', error);
          alert('Error al completar la tarea');
        }
      });
    }
  }

  deleteTask(task: Task): void {
    if (confirm(`¿Eliminar la tarea "${task.titulo}"?`)) {
      this.tasksService.deleteTask(task.id).subscribe({
        next: () => {
          this.loadTasks();
          this.loadTaskStats();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          alert('Error al eliminar la tarea');
        }
      });
    }
  }

  completeSelectedTasks(): void {
    if (this.selectedTasks.size === 0) return;
    
    if (confirm(`¿Marcar ${this.selectedTasks.size} tareas como completadas?`)) {
      // En producción, harías una llamada API para actualizar en lote
      alert(`Funcionalidad de completar tareas en lote - Próximamente`);
      this.selectedTasks.clear();
    }
  }

  deleteSelectedTasks(): void {
    if (this.selectedTasks.size === 0) return;
    
    if (confirm(`¿Eliminar ${this.selectedTasks.size} tareas seleccionadas?`)) {
      // En producción, harías una llamada API para eliminar en lote
      alert(`Funcionalidad de eliminar tareas en lote - Próximamente`);
      this.selectedTasks.clear();
    }
  }

  exportTasks(): void {
    alert('Funcionalidad de exportación - Próximamente');
  }
}