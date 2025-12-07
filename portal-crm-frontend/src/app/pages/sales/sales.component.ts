import { Component, OnInit } from '@angular/core';
import { SalesService, Sale, SalesStats } from '../../services/sales.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  sales: Sale[] = [];
  stats: SalesStats = {
    total_ventas: 0,
    ingresos_totales: 0,
    promedio_venta: 0,
    clientes_unicos: 0,
    vendedores_activos: 0
  }; // Inicializar con valores por defecto
  loading = true;
  error = '';

  constructor(private salesService: SalesService) { }

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    this.loading = true;
    
    // Cargar reportes
    this.salesService.generateSalesPDF().subscribe({
      next: (response) => {
        if (response.success) {
          this.sales = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        this.error = 'Error al cargar los reportes de ventas';
      }
    });

    // Cargar estadísticas
    this.salesService.getSalesStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-MX');
  }
}