const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 3306),
};

const databaseName = process.env.DB_NAME || 'order_service';

const pool = mysql.createPool({
  ...dbConfig,
  database: databaseName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const createOrdersTableSQL = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
    console.log(`Database ${databaseName} is ready.`);
  } catch (error) {
    console.error('Failed to ensure database exists:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

async function init() {
  await ensureDatabaseExists();
  const connection = await pool.getConnection();
  try {
    await connection.query(createOrdersTableSQL);
    console.log('Orders table is ready.');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

init().catch((err) => {
  console.error('Fatal database initialization error. Exiting...', err.message);
  process.exit(1);
});

module.exports = pool;
