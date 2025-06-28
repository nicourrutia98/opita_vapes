const express = require('express');
const router = express.Router();
const transaccionController = require('../controllers/transaccion.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

router.post('/', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin', 'contador'),
    transaccionController.crearTransaccion
);
router.get('/', 
    authenticateToken,
    authorizeRoles('super_admin', 'admin', 'contador'), 
    transaccionController.obtenerTransacciones
);
router.get('/:id', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin', 'contador'),
    transaccionController.obtenerTransaccionPorId
);
router.put('/:id', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin', 'contador'),
    transaccionController.actualizarTransaccion
);
router.delete('/:id', 
    authenticateToken, 
    authorizeRoles('super_admin', 'admin', 'contador'),
    transaccionController.eliminarTransaccion
);

module.exports = router;
