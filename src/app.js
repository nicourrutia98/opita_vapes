// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const clienteRoutes = require('./routes/cliente.routes');
const productoRoutes = require('./routes/producto.routes');
const ventaRoutes = require('./routes/venta.routes');
const transaccionRoutes = require('./routes/transaccion.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const auditoriaRoutes = require('./routes/auditoria.routes');
const rolRoutes = require('./routes/rol.routes');

// Crea la instancia de Express
const app = express();

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());

// Ruta de prueba para verificar que el backend responde
app.get('/api/ping', (req, res) => {
  res.json({ message: 'API de Opita Vapes funcionando correctamente' });
});

app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api/roles', rolRoutes);

module.exports = app;
