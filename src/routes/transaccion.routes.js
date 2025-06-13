const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccion.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, transaccionController.crearTransaccion);
router.get('/', authenticateToken, transaccionController.obtenerTransacciones);
router.get('/:id', authenticateToken, transaccionController.obtenerTransaccionPorId);
router.put('/:id', authenticateToken, transaccionController.actualizarTransaccion);
router.delete('/:id', authenticateToken, transaccionController.eliminarTransaccion);

module.exports = router;
