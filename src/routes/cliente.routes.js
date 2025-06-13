const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, clienteController.crearCliente);
router.get('/', authenticateToken, clienteController.obtenerClientes);
router.get('/:id', authenticateToken, clienteController.obtenerClientePorId);
router.put('/:id', authenticateToken, clienteController.actualizarCliente);
router.delete('/:id', authenticateToken, clienteController.eliminarCliente);

module.exports = router;
