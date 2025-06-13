const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoria.controller');

router.post('/', auditoriaController.registrarEvento);
router.get('/', auditoriaController.obtenerEventos);
router.get('/:id', auditoriaController.obtenerEventoPorId);

module.exports = router;
