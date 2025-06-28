const express = require('express');
const productoController = require('../controllers/producto.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

const router = express.Router();

// MIDDLEWARE DE AUTENTICACIÓN GLOBAL
router.use(authMiddleware);

// RUTAS PÚBLICAS
router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProductoPorId);

// RUTAS DE GESTIÓN DE SABORES
router.post('/:id/sabores', 
  authorizeRoles(['admin', 'super_admin']), 
  productoController.agregarSabor
);

router.put('/:id/sabores/:saborId', 
  authorizeRoles(['admin', 'super_admin']), 
  productoController.actualizarSabor
);

// RUTAS DE ADMINISTRACIÓN
router.post('/', 
  authorizeRoles(['admin', 'super_admin']), 
  productoController.crearProducto
);

router.put('/:id', 
  authorizeRoles(['admin', 'super_admin']), 
  productoController.actualizarProducto
);

router.delete('/:id', 
  authorizeRoles(['admin', 'super_admin']), 
  productoController.eliminarProducto
);

module.exports = router;
