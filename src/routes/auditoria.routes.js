const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoria.controller');
const authorizeRoles = require('../middlewares/authorizeRoles.middleware');

router.post('/', 
    authorizeRoles('super_admin', 'admin', 'contador'),
    auditoriaController.registrarEvento
);
router.get('/', 
    authorizeRoles('super_admin', 'admin', 'contador'),
    auditoriaController.obtenerEventos
);
router.get('/:id', 
    authorizeRoles('super_admin', 'admin', 'contador'),
    auditoriaController.obtenerEventoPorId
);

module.exports = router;
