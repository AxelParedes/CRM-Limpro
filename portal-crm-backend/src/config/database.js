const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'portalcrm',
  user: process.env.DB_USER || 'crm_user',
  password: process.env.DB_PASSWORD || 'CRMPrueba!123', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  
};



// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para ejecutar consultas
const query = async (sql, params = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Ejecutando consulta:', sql.substring(0, 100) + '...');
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error en consulta MySQL:', error.message);
    console.error('Consulta:', sql);
    console.error('Parámetros:', params);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a MySQL establecida correctamente');
    
    // Probar consulta simple
    const [result] = await connection.execute('SELECT 1 + 1 as result');
    console.log('Consulta de prueba exitosa:', result);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('Error conectando a MySQL:', error.message);
    console.log('📝 Configuración usada:');
    console.log('   Host:', dbConfig.host);
    console.log('   Puerto:', dbConfig.port);
    console.log('   Base de datos:', dbConfig.database);
    console.log('   Usuario:', dbConfig.user);
    console.log('   ¿Contraseña proporcionada?:', dbConfig.password ? 'Sí' : 'No');
    return false;
  }
};

module.exports = {
  query,
  testConnection,
  pool
};