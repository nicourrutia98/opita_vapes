const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');



router.get('/me', 
    authenticateToken,
    authorizeRoles('super_admin', 'admin', 'contador', 'vendedor', 'cliente'), 
    usuarioController.obtenerUsuarioActual
);

router.post('/', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin'), 
    usuarioController.crearUsuario,
);
router.get('/', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin'), 
    usuarioController.obtenerUsuarios
);
router.get('/:id', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin'), 
    usuarioController.obtenerUsuarioPorId
);
router.put('/:id', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin'), 
    usuarioController.actualizarUsuario
);
router.delete('/:id', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin'), 
    usuarioController.eliminarUsuario
);

module.exports = router;
