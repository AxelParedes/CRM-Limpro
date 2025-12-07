const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/sales/reports - Obtener reportes de ventas
router.get('/reports', async (req, res) => {
  try {
    console.log('Obteniendo reportes de ventas...');
    
    const tableCheckQuery = `
      SELECT COUNT(*) as table_exists 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'ventas'
    `;
    
    const tableCheck = await db.query(tableCheckQuery);
    
    if (tableCheck[0].table_exists === 0) {
      console.log('Tabla ventas no existe');
      return res.json({
        success: true,
        data: [],
        total: 0,
        message: 'La tabla de ventas no existe aún'
      });
    }

    // Consulta adaptada a tu estructura real
    const query = `
      SELECT 
        id,
        cliente_id,
        proyecto_id,
        monto,
        tipo_venta,
        estado,
        descripcion
      FROM ventas 
      ORDER BY id DESC
      LIMIT 100
    `;
    
    const results = await db.query(query);
    console.log(`Se obtuvieron ${results.length} ventas`);
    
    // Transformar datos para el frontend
    const ventasTransformadas = results.map(venta => ({
      id: venta.id,
      fecha_venta: new Date().toISOString().split('T')[0], // Fecha actual como placeholder
      cliente: `Cliente ${venta.cliente_id}`, // Placeholder
      producto: `Proyecto ${venta.proyecto_id} - ${venta.descripcion || 'Sin descripción'}`,
      cantidad: 1, // Default
      precio_unitario: venta.monto,
      total: venta.monto,
      vendedor: 'Vendedor', // Placeholder
      estado: venta.estado || 'completada'
    }));
    
    res.json({
      success: true,
      data: ventasTransformadas,
      total: results.length
    });
  } catch (error) {
    console.error('Error en reportes de ventas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener reportes de ventas: ' + error.message
    });
  }
});

// GET /api/sales/stats - Estadísticas de ventas
router.get('/stats', async (req, res) => {
  try {
    console.log('Obteniendo estadísticas de ventas...');
    
    const tableCheckQuery = `
      SELECT COUNT(*) as table_exists 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'ventas'
    `;
    
    const tableCheck = await db.query(tableCheckQuery);
    
    if (tableCheck[0].table_exists === 0) {
      console.log('Tabla ventas no existe para stats');
      return res.json({
        success: true,
        data: {
          total_ventas: 0,
          ingresos_totales: 0,
          promedio_venta: 0,
          clientes_unicos: 0,
          vendedores_activos: 0
        }
      });
    }

    // Consulta adaptada a tu estructura
    const query = `
      SELECT 
        COUNT(*) as total_ventas,
        COALESCE(SUM(monto), 0) as ingresos_totales,
        COALESCE(AVG(monto), 0) as promedio_venta,
        COUNT(DISTINCT cliente_id) as clientes_unicos,
        1 as vendedores_activos
      FROM ventas
      WHERE estado = 'completada' OR estado IS NULL
    `;
    
    const results = await db.query(query);
    console.log('Estadísticas obtenidas:', results[0]);
    
    res.json({
      success: true,
      data: results[0]
    });
  } catch (error) {
    console.error('Error en stats de ventas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas: ' + error.message
    });
  }
});

// POST /api/sales/generate-pdf - Generar datos para PDF
router.post('/generate-pdf', async (req, res) => {
  try {
    console.log('Solicitando datos para PDF...');
    
    // Verificar si la tabla existe
    const tableCheckQuery = `
      SELECT COUNT(*) as table_exists 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'ventas'
    `;
    
    const tableCheck = await db.query(tableCheckQuery);
    
    if (tableCheck[0].table_exists === 0) {
      console.log('Tabla no existe, devolviendo datos vacíos');
      return res.json({
        success: true,
        data: {
          ventas: [],
          estadisticas: {
            total_ventas: 0,
            ingresos_totales: 0,
            promedio_venta: 0,
            clientes_unicos: 0,
            vendedores_activos: 0
          },
          fechaGeneracion: new Date().toISOString(),
          titulo: 'Reporte de Ventas - Limpro Comercial'
        }
      });
    }

    // Obtener datos de ventas reales
    const ventasQuery = `
      SELECT 
        id,
        cliente_id,
        proyecto_id,
        monto,
        tipo_venta,
        estado,
        descripcion
      FROM ventas 
      ORDER BY id DESC
      LIMIT 100
    `;
    
    const ventasReales = await db.query(ventasQuery);
    
    // Transformar datos para el PDF
    const ventasParaPDF = ventasReales.map(venta => ({
      id: venta.id,
      fecha_venta: new Date().toISOString().split('T')[0],
      cliente: `Cliente ${venta.cliente_id}`,
      producto: `Proyecto ${venta.proyecto_id} - ${venta.tipo_venta || 'Venta'}`,
      cantidad: 1,
      precio_unitario: venta.monto,
      total: venta.monto,
      vendedor: 'Sistema',
      estado: venta.estado || 'completada',
      descripcion: venta.descripcion
    }));

    // Obtener estadísticas reales
    const statsQuery = `
      SELECT 
        COUNT(*) as total_ventas,
        COALESCE(SUM(monto), 0) as ingresos_totales,
        COALESCE(AVG(monto), 0) as promedio_venta,
        COUNT(DISTINCT cliente_id) as clientes_unicos,
        1 as vendedores_activos
      FROM ventas
      WHERE estado = 'completada' OR estado IS NULL
    `;
    
    const stats = await db.query(statsQuery);
    
    console.log(`Datos para PDF: ${ventasParaPDF.length} ventas, $${stats[0].ingresos_totales} ingresos totales`);
    
    res.json({
      success: true,
      data: {
        ventas: ventasParaPDF,
        estadisticas: stats[0],
        fechaGeneracion: new Date().toISOString(),
        titulo: 'Reporte de Ventas - Limpro Comercial'
      }
    });
    
  } catch (error) {
    console.error('Error generando datos para PDF:', error);
    res.status(500).json({
      success: false,
      error: 'Error al generar datos para el PDF: ' + error.message
    });
  }
});

// POST /api/sales/create-table - SOLO si necesitas crear una tabla nueva
router.post('/create-table', async (req, res) => {
  try {
    console.log('Verificando tabla ventas existente...');
    
    // Solo verificar, no crear
    const checkQuery = 'SELECT COUNT(*) as count FROM ventas';
    const dataCheck = await db.query(checkQuery);
    
    console.log(`Tabla ventas existe con ${dataCheck[0].count} registros`);
    
    res.json({
      success: true,
      message: `Tabla ventas verificada con ${dataCheck[0].count} registros`,
      total_registros: dataCheck[0].count
    });
  } catch (error) {
    console.error('Error verificando tabla:', error);
    res.status(500).json({
      success: false,
      error: 'Error al verificar tabla de ventas: ' + error.message
    });
  }
});

// GET /api/sales/table-info - Información de la tabla
router.get('/table-info', async (req, res) => {
  try {
    const structureQuery = `DESCRIBE ventas`;
    const structure = await db.query(structureQuery);
    
    const countQuery = `SELECT COUNT(*) as total FROM ventas`;
    const count = await db.query(countQuery);
    
    const sampleQuery = `SELECT * FROM ventas LIMIT 5`;
    const sample = await db.query(sampleQuery);
    
    res.json({
      success: true,
      structure: structure,
      total_registros: count[0].total,
      muestra: sample
    });
  } catch (error) {
    console.error('Error obteniendo info:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener información: ' + error.message
    });
  }
});

module.exports = router;