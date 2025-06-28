const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestion.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Autenticación global para sugerencias
router.use(authMiddleware);

// Obtener sugerencias por campo
router.get('/:field', suggestionController.getSuggestions);

// Obtener productos recientes
router.get('/recents/products', suggestionController.getRecentProducts);

module.exports = router;
