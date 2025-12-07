import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Client {
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

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  
  // Filtros
  searchTerm = '';
  selectedStatus = '';
  sortBy = 'nombre';
  
  // Paginación
  currentPage = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadClients();
    this.filteredClients = this.clients;
  }

  loadClients(): void {
    // Datos de ejemplo
    this.clients = [
      {
        id: 1,
        nombre: 'Ana',
        apellido: 'García',
        empresa: 'Tech Solutions SA',
        industria: 'Tecnología',
        email: 'ana.garcia@techsolutions.com',
        telefono: '+52 55 1234 5678',
        estado: 'activo',
        fechaRegistro: new Date('2023-01-15'),
        ingresos: 125000
      },
      {
        id: 2,
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        empresa: 'Constructora Moderna',
        industria: 'Construcción',
        email: 'carlos@constructora.com',
        telefono: '+52 55 2345 6789',
        estado: 'activo',
        fechaRegistro: new Date('2023-02-20'),
        ingresos: 89000
      },
      {
        id: 3,
        nombre: 'María',
        apellido: 'López',
        empresa: 'Consultoría Integral',
        industria: 'Consultoría',
        email: 'mlopez@consultoria.com',
        telefono: '+52 55 3456 7890',
        estado: 'prospecto',
        fechaRegistro: new Date('2023-03-10'),
        ingresos: 0
      },
      {
        id: 4,
        nombre: 'Roberto',
        apellido: 'Martínez',
        empresa: 'Distribuidora Norte',
        industria: 'Logística',
        email: 'roberto.martinez@distribuidora.com',
        telefono: '+52 55 4567 8901',
        estado: 'activo',
        fechaRegistro: new Date('2023-01-08'),
        ingresos: 156000
      },
      {
        id: 5,
        nombre: 'Laura',
        apellido: 'Hernández',
        empresa: 'Diseño Creativo',
        industria: 'Marketing',
        email: 'laura@disenocreativo.com',
        telefono: '+52 55 5678 9012',
        estado: 'inactivo',
        fechaRegistro: new Date('2022-11-15'),
        ingresos: 45000
      },
      {
        id: 6,
        nombre: 'Javier',
        apellido: 'Ramírez',
        empresa: 'Alimentos Naturales',
        industria: 'Alimentación',
        email: 'jramirez@alimentos.com',
        telefono: '+52 55 6789 0123',
        estado: 'activo',
        fechaRegistro: new Date('2023-04-05'),
        ingresos: 78000
      },
      {
        id: 7,
        nombre: 'Sofia',
        apellido: 'González',
        empresa: 'Educación Digital',
        industria: 'Educación',
        email: 'sofia.gonzalez@edudigital.com',
        telefono: '+52 55 7890 1234',
        estado: 'prospecto',
        fechaRegistro: new Date('2023-05-12'),
        ingresos: 0
      },
      {
        id: 8,
        nombre: 'Diego',
        apellido: 'Pérez',
        empresa: 'Automotriz del Valle',
        industria: 'Automotriz',
        email: 'diego.perez@automotriz.com',
        telefono: '+52 55 8901 2345',
        estado: 'activo',
        fechaRegistro: new Date('2023-02-28'),
        ingresos: 210000
      }
    ];
  }

  filterClients(): void {
    this.filteredClients = this.clients.filter(client => {
      const matchesSearch = !this.searchTerm || 
        client.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.empresa.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.telefono.includes(this.searchTerm);

      const matchesStatus = !this.selectedStatus || client.estado === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.sortClients();
    this.currentPage = 1;
  }

  sortClients(): void {
    this.filteredClients.sort((a, b) => {
      switch (this.sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'fecha':
          return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime();
        case 'empresa':
          return a.empresa.localeCompare(b.empresa);
        default:
          return 0;
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.sortBy = 'nombre';
    this.filteredClients = this.clients;
    this.sortClients();
  }

  // Propiedades computadas
  get activeClientsCount(): number {
    return this.clients.filter(client => client.estado === 'activo').length;
  }

  get prospectsCount(): number {
    return this.clients.filter(client => client.estado === 'prospecto').length;
  }

  get monthlyRevenue(): number {
    return this.clients
      .filter(client => client.estado === 'activo')
      .reduce((sum, client) => sum + client.ingresos, 0);
  }

  // Métodos de paginación
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage * this.pageSize < this.filteredClients.length) {
      this.currentPage++;
    }
  }

  openAddClientModal(): void {
    // Aquí implementarías la lógica para abrir un modal de agregar cliente
    alert('Funcionalidad para agregar cliente - Próximamente');
  }
}