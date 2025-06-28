const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

router.post('/', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin', 'contador'),
    ventaController.crearVenta
);
router.get('/', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin', 'contador'),
    ventaController.obtenerVentas
);
router.get('/:id', 
    authenticateToken,
    authorizeRoles('super_admin', 'admin', 'contador'), 
    ventaController.obtenerVentaPorId
);
router.put('/:id', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin', 'contador'),
    ventaController.actualizarVenta
);
router.delete('/:id', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin', 'contador'),
    ventaController.eliminarVenta
);

module.exports = router;
