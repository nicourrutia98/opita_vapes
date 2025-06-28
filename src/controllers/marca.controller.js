const marcaService = require('../services/marca.service');

exports.obtenerMarcas = async (req, res) => {
  try {
    const marcas = await marcaService.obtenerMarcasUnicas();
    res.status(200).json(marcas);
  } catch (error) {
    console.error('Error en controlador de marcas:', error);
    res.status(500).json({ 
      error: error.message || 'Error interno del servidor' 
    });
  }
};
