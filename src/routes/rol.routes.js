const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

// Solo super_admin puede asignar roles
router.put('/:uid',
  authenticateToken,
  authorizeRoles('super_admin'),
  rolController.asignarRoles
);

module.exports = router;
