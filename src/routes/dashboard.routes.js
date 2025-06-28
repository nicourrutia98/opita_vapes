const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas del dashboard
router.get(
  '/', 
  authorizeRoles('super_admin', 'admin', 'contador'), 
  dashboardController.getDashboardData
);

router.get(
  '/summary', 
  authorizeRoles('super_admin', 'admin', 'contador', 'vendedor'), 
  dashboardController.getDashboardSummary
);

module.exports = router;
