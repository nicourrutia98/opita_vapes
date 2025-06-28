const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marca.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

router.get(
  '/',
  authenticateToken,
  authorizeRoles('super_admin', 'admin', 'vendedor'),
  marcaController.obtenerMarcas
);

module.exports = router;
