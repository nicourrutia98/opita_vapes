const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

router.post('/', 
    authorizeRoles('super_admin', 'admin', 'contador'),
    authenticateToken, clienteController.crearCliente
);
router.get('/', 
    authorizeRoles('super_admin', 'admin', 'contador'),
    authenticateToken, clienteController.obtenerClientes
);
router.get('/:id', 
    authorizeRoles('super_admin', 'admin', 'contador'),
    authenticateToken, clienteController.obtenerClientePorId
);
router.put('/:id', authenticateToken, clienteController.actualizarCliente);
router.delete('/:id', authenticateToken, clienteController.eliminarCliente);

module.exports = router;
