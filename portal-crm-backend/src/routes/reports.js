const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

router.use(authenticateToken);

// Métricas generales para reportes
router.get('/metrics', async (req, res) => {
  try {
    const { dateRange = '30d' } = req.query;

    const metrics = {
      totalRevenue: 1254300,
      newClients: 28,
      conversionRate: 24.5,
      activeProjects: 15,
      currentMonthRevenue: 156800,
      lastMonthRevenue: 142500,
      revenueGrowth: 10.0
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error obteniendo métricas:', error);
    res.status(500).json({ error: 'Error obteniendo métricas' });
  }
});

// Reporte de ventas
router.get('/sales', async (req, res) => {
  try {
    const salesData = {
      monthly: [
        { month: 'Ene', sales: 120000 },
        { month: 'Feb', sales: 135000 },
        { month: 'Mar', sales: 142000 },
        { month: 'Abr', sales: 156800 },
        { month: 'May', sales: 148000 },
        { month: 'Jun', sales: 165000 }
      ],
      byCategory: [
        { category: 'Consultoría', value: 45 },
        { category: 'Desarrollo', value: 30 },
        { category: 'Soporte', value: 15 },
        { category: 'Capacitación', value: 10 }
      ]
    };

    res.json(salesData);
  } catch (error) {
    console.error('Error obteniendo reporte de ventas:', error);
    res.status(500).json({ error: 'Error obteniendo reporte de ventas' });
  }
});

// Reporte de clientes
router.get('/clients', async (req, res) => {
  try {
    const clientReport = {
      byStatus: [
        { status: 'Activo', count: 45 },
        { status: 'Prospecto', count: 23 },
        { status: 'Inactivo', count: 12 }
      ],
      byIndustry: [
        { industry: 'Tecnología', count: 32 },
        { industry: 'Consultoría', count: 18 },
        { industry: 'Manufactura', count: 15 },
        { industry: 'Salud', count: 8 },
        { industry: 'Educación', count: 7 }
      ],
      acquisition: [
        { source: 'Referido', count: 25 },
        { source: 'Web', count: 35 },
        { source: 'Redes Sociales', count: 15 },
        { source: 'Eventos', count: 10 }
      ]
    };

    res.json(clientReport);
  } catch (error) {
    console.error('Error obteniendo reporte de clientes:', error);
    res.status(500).json({ error: 'Error obteniendo reporte de clientes' });
  }
});

module.exports = router;