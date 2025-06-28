const { db } = require('../config/firebase');
const saborService = require('../services/sabor.service'); // Importa el servicio

// Función para obtener sabores por marca
exports.obtenerSaboresPorMarca = async (req, res) => {
    try {
        const marca = req.query.marca;
        if (!marca) return res.status(400).json({ error: 'Parámetro "marca" requerido' });

        // Usa el servicio para obtener los sabores
        const sabores = await saborService.obtenerSaboresPorMarca(marca);
        res.status(200).json(sabores);
    } catch (error) {
        console.error('Error al obtener sabores por marca:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función para obtener emoji por sabor
exports.obtenerEmojiPorSabor = async (req, res) => {
    try {
        const sabor = req.query.sabor;
        if (!sabor) return res.status(400).json({ error: 'Parámetro "sabor" requerido' });

        // Usa el servicio para obtener el emoji
        const emoji = await saborService.obtenerEmojiPorSabor(sabor);
        res.status(200).json({ emoji });
    } catch (error) {
        console.error('Error al obtener emoji:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
