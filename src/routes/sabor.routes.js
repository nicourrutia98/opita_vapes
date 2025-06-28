const express = require('express');
const router = express.Router();
const saborController = require('../controllers/sabor.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

// Ruta para obtener sabores por marca
router.get('/',
    authenticateToken,
    authorizeRoles('super_admin', 'admin', 'vendedor'),
    saborController.obtenerSaboresPorMarca
);

// Ruta para obtener emoji por sabor
router.get('/emoji',
    authenticateToken,
    authorizeRoles('super_admin', 'admin', 'vendedor'),
    saborController.obtenerEmojiPorSabor
);

module.exports = router;
