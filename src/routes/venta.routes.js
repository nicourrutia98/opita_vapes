const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, ventaController.crearVenta);
router.get('/', authenticateToken, ventaController.obtenerVentas);
router.get('/:id', authenticateToken, ventaController.obtenerVentaPorId);
router.put('/:id', authenticateToken, ventaController.actualizarVenta);
router.delete('/:id', authenticateToken, ventaController.eliminarVenta);

module.exports = router;
