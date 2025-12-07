const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones básicas
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario en la base de datos
    const users = await query(
      'SELECT id, username, password_hash, nombre, email, role FROM usuarios WHERE username = ? AND activo = TRUE',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];

    // En producción, verificaríamos la contraseña hasheada
    // Por ahora, para demo, aceptamos 'admin' como contraseña
    const isValidPassword = password === 'admin'; // En producción: await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Crear token JWT
    const tokenPayload = {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      role: user.role
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Registrar actividad
    await query(
      'INSERT INTO actividades (usuario_id, tipo_actividad, descripcion) VALUES (?, ?, ?)',
      [user.id, 'login', 'Inicio de sesión exitoso']
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token requerido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }
      res.json({ valid: true, user: decoded });
    });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Logout (opcional, para registrar actividad)
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      await query(
        'INSERT INTO actividades (usuario_id, tipo_actividad, descripcion) VALUES (?, ?, ?)',
        [decoded.id, 'logout', 'Cierre de sesión']
      );
    }

    res.json({ success: true, message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;