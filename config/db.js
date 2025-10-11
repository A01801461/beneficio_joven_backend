//----------------------------------------------------------
// /config/db.js
//
// Archivo de configuracion de conexion a la BD.
// Para testear localmente con XAMPP, seguir indicaciones en README.md
//
// Fecha: 11-Oct-2025
// Autores: Equipo 2 - Gpo 401
//----------------------------------------------------------

const mysql = require('mysql2'); // motor MySQL v12
const dotenv = require('dotenv'); // importar archivo .env

dotenv.config();

// intentar conexion a la BD
const pool = mysql.createPool({
  host: process.env.DB_HOST, // host de la bd
  user: process.env.DB_USER, // usuario de MySQL
  password: process.env.DB_PASSWORD, // passowrd del usuario
  database: process.env.DB_NAME, // nombre de la BD
  port: process.env.DB_PORT || 3306,  // Puerto default de MySQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();