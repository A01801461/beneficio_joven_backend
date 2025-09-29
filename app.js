const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const os = require('os');  // Para obtener IP de red
const db = require('./config/db');  // Importar DB para verificar conexión
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const couponRoutes = require('./routes/couponRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', couponRoutes);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // Escucha en todas las interfaces para acceso en red

// Verificar conexión a DB al iniciar
db.query('SELECT 1')
  .then(() => console.log('Conexión a DB (XAMPP MySQL) exitosa'))
  .catch(err => console.error('Error en conexión a DB:', err.message));

app.listen(PORT, HOST, () => {
  // Obtener IP local de red (IPv4 no interna)
  const interfaces = os.networkInterfaces();
  let localIp = '127.0.0.1';  // Fallback
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
    if (localIp !== '127.0.0.1') break;
  }

  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://${localIp}:${PORT}`);
});