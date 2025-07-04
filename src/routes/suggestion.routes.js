const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestion.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// Obtener sugerencias por campo con parámetro de búsqueda
router.get('/:field', suggestionController.getSuggestions);

// Obtener productos recientes
router.get('/recents/products', suggestionController.getRecentProducts);

module.exports = router;
