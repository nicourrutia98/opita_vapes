const suggestionService = require('../services/suggestion.service');

class SuggestionController {
    async getSuggestions(req, res) {
        try {
            const { field } = req.params;
            const suggestions = await suggestionService.obtenerSugerenciasPorCampo(field);
            
            res.status(200).json(suggestions);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getRecentProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const productos = await suggestionService.obtenerProductosRecientes(limit);
            
            res.status(200).json({
                success: true,
                data: productos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new SuggestionController();
