require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// 1. IMPORTANTE: Inicialización explícita de Firebase
const { admin } = require('./config/firebase'); // Asegura que Firebase se inicialice al inicio

const clienteRoutes = require('./routes/cliente.routes');
const productoRoutes = require('./routes/producto.routes');
const ventaRoutes = require('./routes/venta.routes');
const transaccionRoutes = require('./routes/transaccion.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const auditoriaRoutes = require('./routes/auditoria.routes');
const rolRoutes = require('./routes/rol.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const saborRoutes = require('./routes/sabor.routes');
const marcaRoutes = require('./routes/marca.routes');
const modeloRoutes = require('./routes/modelo.routes');
const suggestionRoutes = require('./routes/suggestion.routes');

const app = express();

// 2. Middlewares globales (orden crítico)
app.use(cors());
app.use(bodyParser.json());

// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ message: 'API de Opita Vapes funcionando correctamente' });
});

// 3. Middleware de diagnóstico (opcional pero útil)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sabores', saborRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/modelos', modeloRoutes);
app.use('/api/suggestions', suggestionRoutes);

// 4. Middleware de errores (DEBE ir al final)
app.use((err, req, res, next) => {
  console.error('🔥 Error no controlado:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : 'Oculto en producción'
  });
});

module.exports = app;
