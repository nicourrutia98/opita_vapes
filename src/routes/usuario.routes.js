const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, usuarioController.crearUsuario);
router.get('/', authenticateToken, usuarioController.obtenerUsuarios);
router.get('/:id', authenticateToken, usuarioController.obtenerUsuarioPorId);
router.put('/:id', authenticateToken, usuarioController.actualizarUsuario);
router.delete('/:id', authenticateToken, usuarioController.eliminarUsuario);

module.exports = router;
