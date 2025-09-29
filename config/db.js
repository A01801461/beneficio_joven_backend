const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,  // Puerto default de MySQL en XAMPP
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exporta pool con soporte para async/await (compatible con XAMPP MySQL)
module.exports = pool.promise();