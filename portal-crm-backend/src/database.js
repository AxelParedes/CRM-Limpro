const sql = require('mssql');

const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'PortalCRM',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false, // Cambiar a true para Azure
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

const getPool = async () => {
  if (!pool) {
    pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
  }
  return pool;
};

const query = async (queryText, params = {}) => {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Agregar parámetros si existen
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.query(queryText);
    return result.recordset;
  } catch (error) {
    console.error('Error en consulta SQL:', error);
    throw error;
  }
};

module.exports = {
  sql,
  getPool,
  query
};