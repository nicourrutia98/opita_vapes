const suggestionService = require('../services/suggestion.service');

class SuggestionController {
    async getSuggestions(req, res) {
        try {
            const { field } = req.params;
            const search = req.query.search || '';
            
            // Lista de campos permitidos para sugerencias
            const camposPermitidos = [
                'nombre', 'marca', 'modelo', 'sabor', 'proveedor', 
                'colorVariante', 'resistenciaCompatibles', 'tamano',
                'precio', 'precioMayorX5', 'precioMayorX10', 'costoEmpresa',
                'categoria', 'tipo', 'nivelNicotina'
            ];
            
            // Validar que el campo solicitado es permitido
            if (!camposPermitidos.includes(field)) {
                return res.status(400).json({
                    success: false,
                    message: `Campo '${field}' no válido para sugerencias. Campos permitidos: ${camposPermitidos.join(', ')}`
                });
            }
            
            // Obtener sugerencias del servicio
            const suggestions = await suggestionService.obtenerSugerenciasPorCampo(field, search);
            
            res.status(200).json({
                success: true,
                data: suggestions
            });
        } catch (error) {
            console.error(`Error en getSuggestions para campo ${field}:`, error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno al obtener sugerencias'
            });
        }
    }

    async getRecentProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            
            // Validar límite máximo
            if (limit > 50) {
                return res.status(400).json({
                    success: false,
                    message: 'El límite máximo es 50 productos'
                });
            }
            
            const productos = await suggestionService.obtenerProductosRecientes(limit);
            
            res.status(200).json({
                success: true,
                data: productos
            });
        } catch (error) {
            console.error('Error en getRecentProducts:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error interno al obtener productos recientes'
            });
        }
    }
}

module.exports = new SuggestionController();
