const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

router.use(authenticateToken);

// Datos para el dashboard
router.get('/stats', async (req, res) => {
  try {
    // En producción, estas consultas vendrían de la base de datos
    const stats = {
      totalClients: 1542,
      activeProjects: 28,
      pendingTasks: 12,
      revenue: 125430,
      newLeads: 45,
      conversionRate: 24.5
    };

    res.json(stats);
  } catch (error) {
    console.error('Error obteniendo stats del dashboard:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

// Actividades recientes
router.get('/recent-activities', async (req, res) => {
  try {
    const activities = [
      { 
        id: 1, 
        activity: "Nuevo cliente registrado - Tech Solutions", 
        time: "Hace 5 min", 
        type: "success",
        user: "Sistema"
      },
      { 
        id: 2, 
        activity: "Proyecto completado - Implementación CRM", 
        time: "Hace 1 hora", 
        type: "info",
        user: "María González"
      },
      { 
        id: 3, 
        activity: "Tarea pendiente - Revisar propuesta comercial", 
        time: "Hace 2 horas", 
        type: "warning",
        user: "Carlos Ramírez"
      },
      { 
        id: 4, 
        activity: "Lead calificado - Empresa XYZ", 
        time: "Hace 3 horas", 
        type: "success",
        user: "Ana López"
      }
    ];

    res.json(activities);
  } catch (error) {
    console.error('Error obteniendo actividades:', error);
    res.status(500).json({ error: 'Error obteniendo actividades' });
  }
});

module.exports = router;