const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

router.use(authenticateToken);

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    // Datos mock para demo - en producción esto vendría de la base de datos
    const clients = [
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
      }
    ];

    // Filtrar clientes (simulación)
    let filteredClients = clients;
    
    if (search) {
      filteredClients = filteredClients.filter(client => 
        client.nombre.toLowerCase().includes(search.toLowerCase()) ||
        client.apellido.toLowerCase().includes(search.toLowerCase()) ||
        client.empresa.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredClients = filteredClients.filter(client => client.estado === status);
    }

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedClients = filteredClients.slice(startIndex, endIndex);

    res.json({
      clients: paginatedClients,
      total: filteredClients.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredClients.length / limit)
    });
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error obteniendo clientes' });
  }
});

// Obtener un cliente específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Simulación de búsqueda en BD
    const client = {
      id: parseInt(id),
      nombre: 'Ana',
      apellido: 'García',
      empresa: 'Tech Solutions SA',
      industria: 'Tecnología',
      email: 'ana.garcia@techsolutions.com',
      telefono: '+52 55 1234 5678',
      estado: 'activo',
      fechaRegistro: new Date('2023-01-15'),
      ingresos: 125000,
      direccion: 'Av. Reforma 123, CDMX',
      contacto: 'Juan Pérez - Gerente de Ventas'
    };

    res.json(client);
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    res.status(500).json({ error: 'Error obteniendo cliente' });
  }
});

module.exports = router;