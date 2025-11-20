const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'user_service'
};

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const ensureUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;
`;

const ensureDatabaseExists = async () => {
  let adminConnection;
  try {
    adminConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  } finally {
    if (adminConnection) await adminConnection.end();
  }
};

(async () => {
  let connection;
  try {
    await ensureDatabaseExists();
    connection = await pool.getConnection();
    await connection.query(ensureUsersTableQuery);
    console.log('Connected to MySQL and ensured users table exists.');
  } catch (error) {
    console.error('MySQL initialization error:', error.message);
    process.exitCode = 1;
  } finally {
    if (connection) connection.release();
  }
})();

module.exports = pool;
