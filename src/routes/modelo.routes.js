const express = require('express');
const router = express.Router();
const modeloController = require('../controllers/modelo.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

router.get('/',
    authenticateToken,
    authorizeRoles('super_admin', 'admin', 'vendedor'),
    modeloController.obtenerModelosPorMarca
);

module.exports = router;
