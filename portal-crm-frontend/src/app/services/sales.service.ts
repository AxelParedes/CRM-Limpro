import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sale {
  id: number;
  fecha_venta: string;
  cliente: string;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  vendedor: string;
  estado: string;
}

export interface SalesStats {
  total_ventas: number;
  ingresos_totales: number;
  promedio_venta: number;
  clientes_unicos: number;
  vendedores_activos: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:3000/api/sales';

  constructor(private http: HttpClient) { }

  // Método para obtener datos de ventas desde la base de datos
  getSalesData(): Observable<{success: boolean, data: Sale[], total: number}> {
    return this.http.get<{success: boolean, data: Sale[], total: number}>(`${this.apiUrl}/reports`);
  }

  // Método para obtener estadísticas desde la base de datos
  getSalesStats(): Observable<{success: boolean, data: SalesStats}> {
    return this.http.get<{success: boolean, data: SalesStats}>(`${this.apiUrl}/stats`);
  }

  // Método para generar el PDF con datos reales
  generateSalesPDF(): Observable<{success: boolean, data: any}> {
    return this.http.post<{success: boolean, data: any}>(`${this.apiUrl}/generate-pdf`, {});
  }

  // Generar PDF en el navegador con datos reales
  generatePDFInBrowser(data: any): void {
    const content = this.generatePDFContent(data);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Generar contenido HTML del PDF con datos reales
  private generatePDFContent(data: any): string {
    const fecha = new Date().toLocaleDateString('es-MX');
    const ventas = data.ventas || [];
    const estadisticas = data.estadisticas || {};

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Ventas - Limpro</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { color: #2c5aa0; margin: 0; }
          .stats { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
          .stat-item { text-align: center; }
          .stat-value { font-size: 18px; font-weight: bold; color: #2c5aa0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #2c5aa0; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          .text-right { text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte de Ventas - Limpro Comercial</h1>
          <p>Generado el ${fecha}</p>
        </div>
        
        <div class="stats">
          <h3>Estadísticas Resumen</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">${estadisticas.total_ventas || 0}</div>
              <div>Total Ventas</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">$${(estadisticas.ingresos_totales || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
              <div>Ingresos Totales</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">$${(estadisticas.promedio_venta || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</div>
              <div>Promedio por Venta</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${estadisticas.clientes_unicos || 0}</div>
              <div>Clientes Únicos</div>
            </div>
          </div>
        </div>
        
        <h3>Detalle de Ventas (${ventas.length} registros)</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
              <th>Vendedor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${ventas.map((venta: any) => `
              <tr>
                <td>${venta.id}</td>
                <td>${new Date(venta.fecha_venta).toLocaleDateString('es-MX')}</td>
                <td>${venta.cliente}</td>
                <td>${venta.producto}</td>
                <td>${venta.cantidad}</td>
                <td class="text-right">$${(venta.precio_unitario || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                <td class="text-right"><strong>$${(venta.total || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</strong></td>
                <td>${venta.vendedor}</td>
                <td>${venta.estado}</td>
              </tr>
            `).join('')}
            ${ventas.length === 0 ? `
              <tr>
                <td colspan="9" class="text-center">No hay datos de ventas disponibles</td>
              </tr>
            ` : ''}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Reporte generado automáticamente por el Sistema CRM Limpro</p>
          <p>Total de registros: ${ventas.length}</p>
        </div>
      </body>
      </html>
    `;
  }
}