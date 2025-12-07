require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const salesRoutes = require('./routes/sales');

const app = express();

const { testConnection } = require('./config/database');

// Verificar conexión a la base de datos al iniciar
testConnection().then(success => {
  if (!success) {
    console.log('El servidor iniciará sin conexión a la base de datos');
  }
});

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas básicas de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend CRM funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de autenticación
app.use('/api/auth', require('./routes/auth'));

// Rutas de datos (protegidas)
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/sales', salesRoutes); 

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});