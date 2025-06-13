const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, productoController.crearProducto);
router.get('/', authenticateToken, productoController.obtenerProductos);
router.get('/:id', authenticateToken, productoController.obtenerProductoPorId);
router.put('/:id', authenticateToken, productoController.actualizarProducto);
router.delete('/:id', authenticateToken, productoController.eliminarProducto);

module.exports = router;
