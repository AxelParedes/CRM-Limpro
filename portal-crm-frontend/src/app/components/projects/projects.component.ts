import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectsService, Project, ProjectFilters } from '../../services/projects.service';
import { ClientsService } from '../../services/clients.service';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'truncate', standalone: true})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (value.length <= limit) {
      return value;
    }
    return value.substring(0, limit) + '...';
  }
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  clients: any[] = [];
  viewMode: 'table' | 'cards' = 'table';
  isLoading = false;
  projectStats: any = {};

  filters: ProjectFilters = {
    estado: '',
    prioridad: '',
    cliente_id: undefined,
    search: '',
    page: 1,
    limit: 20
  };

  constructor(
    private projectsService: ProjectsService,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadClients();
    this.loadProjectStats();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.projectsService.getProjects(this.filters).subscribe({
      next: (response) => {
        this.projects = response.projects;
        this.filteredProjects = [...this.projects];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
        this.loadSampleProjects();
      }
    });
  }

  loadClients(): void {
    this.clientsService.getClients().subscribe({
      next: (response) => {
        this.clients = response.clients.slice(0, 10); // Limitar a 10 clientes
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  loadProjectStats(): void {
    this.projectsService.getProjectStats().subscribe({
      next: (stats) => {
        this.projectStats = stats;
      },
      error: (error) => {
        console.error('Error loading project stats:', error);
      }
    });
  }

  loadSampleProjects(): void {
    // Datos de ejemplo para desarrollo
    this.projects = [
      {
        id: 1,
        cliente_id: 1,
        nombre: 'Implementación CRM',
        descripcion: 'Sistema de gestión de relaciones con clientes para Tech Solutions',
        estado: 'completado',
        fecha_inicio: new Date('2023-01-20'),
        fecha_fin: new Date('2023-03-15'),
        presupuesto: 50000,
        ingresos: 50000,
        prioridad: 'alta',
        fecha_creacion: new Date('2023-01-15'),
        fecha_actualizacion: new Date('2023-03-15'),
        cliente_nombre: 'Tech Solutions SA',
        cliente_empresa: 'Tech Solutions SA',
        total_tareas: 15,
        tareas_completadas: 15
      },
      {
        id: 2,
        cliente_id: 1,
        nombre: 'Soporte Técnico Anual',
        descripcion: 'Contrato de soporte técnico para 2024',
        estado: 'en_progreso',
        fecha_inicio: new Date('2024-01-01'),
        fecha_fin: new Date('2024-12-31'),
        presupuesto: 25000,
        ingresos: 25000,
        prioridad: 'media',
        fecha_creacion: new Date('2023-12-15'),
        fecha_actualizacion: new Date('2024-01-25'),
        cliente_nombre: 'Tech Solutions SA',
        cliente_empresa: 'Tech Solutions SA',
        total_tareas: 8,
        tareas_completadas: 3
      },
      {
        id: 3,
        cliente_id: 2,
        nombre: 'Desarrollo Web Corporativo',
        descripcion: 'Sitio web institucional con e-commerce para Constructora Moderna',
        estado: 'en_progreso',
        fecha_inicio: new Date('2024-02-01'),
        fecha_fin: new Date('2024-05-31'),
        presupuesto: 35000,
        ingresos: 17500,
        prioridad: 'alta',
        fecha_creacion: new Date('2024-01-20'),
        fecha_actualizacion: new Date('2024-02-15'),
        cliente_nombre: 'Constructora Moderna',
        cliente_empresa: 'Constructora Moderna',
        total_tareas: 12,
        tareas_completadas: 5
      },
      {
        id: 4,
        cliente_id: 4,
        nombre: 'Sistema de Inventarios',
        descripcion: 'Software de control de inventario y logística para Distribuidora Norte',
        estado: 'pendiente',
        fecha_inicio: new Date('2024-03-01'),
        fecha_fin: new Date('2024-06-30'),
        presupuesto: 45000,
        ingresos: 0,
        prioridad: 'media',
        fecha_creacion: new Date('2024-02-10'),
        fecha_actualizacion: new Date('2024-02-10'),
        cliente_nombre: 'Distribuidora Norte',
        cliente_empresa: 'Distribuidora Norte',
        total_tareas: 0,
        tareas_completadas: 0
      }
    ];
    this.filteredProjects = [...this.projects];
    this.isLoading = false;
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.loadProjects();
  }

  resetFilters(): void {
    this.filters = {
      estado: '',
      prioridad: '',
      cliente_id: undefined,
      search: '',
      page: 1,
      limit: 20
    };
    this.loadProjects();
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
      case 'completado': return 'bg-success';
      case 'cancelado': return 'bg-secondary';
      default: return 'bg-light text-dark';
    }
  }

  getStatusLabel(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_progreso': return 'En Progreso';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  }

  getProgressPercentage(project: Project): number {
    if (!project.total_tareas || project.total_tareas === 0) return 0;
    return Math.round(((project.tareas_completadas || 0) / project.total_tareas) * 100);
  }

  getProgressBarClass(project: Project): string {
    const percentage = this.getProgressPercentage(project);
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-info';
    if (percentage >= 20) return 'bg-warning';
    return 'bg-danger';
  }

  isProjectDelayed(project: Project): boolean {
    if (project.estado === 'completado' || project.estado === 'cancelado') return false;
    const today = new Date();
    const dueDate = new Date(project.fecha_fin);
    return dueDate < today;
  }

  // Métodos de acciones
  openNewProjectModal(): void {
    alert('Funcionalidad para crear nuevo proyecto - Próximamente');
  }

  viewProjectDetails(project: Project): void {
    alert(`Detalles del proyecto: ${project.nombre}\n\nCliente: ${project.cliente_empresa}\nDescripción: ${project.descripcion}\nEstado: ${this.getStatusLabel(project.estado)}\nPresupuesto: $${project.presupuesto.toLocaleString()}`);
  }

  editProject(project: Project): void {
    alert(`Editar proyecto: ${project.nombre} - Próximamente`);
  }

  completeProject(project: Project): void {
    if (confirm(`¿Marcar el proyecto "${project.nombre}" como completado?`)) {
      this.projectsService.updateProject(project.id, { estado: 'completado' }).subscribe({
        next: () => {
          this.loadProjects();
          this.loadProjectStats();
        },
        error: (error) => {
          console.error('Error completing project:', error);
          alert('Error al completar el proyecto');
        }
      });
    }
  }

  deleteProject(project: Project): void {
    if (confirm(`¿Eliminar el proyecto "${project.nombre}"? Esta acción no se puede deshacer.`)) {
      this.projectsService.deleteProject(project.id).subscribe({
        next: () => {
          this.loadProjects();
          this.loadProjectStats();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          alert('Error al eliminar el proyecto');
        }
      });
    }
  }

  exportProjects(): void {
    alert('Funcionalidad de exportación - Próximamente');
  }
}