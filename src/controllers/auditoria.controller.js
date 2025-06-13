const auditoriaService = require('../services/auditoria.service');

exports.registrarEvento = async (req, res) => {
  try {
    const evento = await auditoriaService.registrarEvento(req.body);
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar evento de auditoría', detalle: error.message });
  }
};

exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await auditoriaService.obtenerEventos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos de auditoría', detalle: error.message });
  }
};

exports.obtenerEventoPorId = async (req, res) => {
  try {
    const evento = await auditoriaService.obtenerEventoPorId(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener evento de auditoría', detalle: error.message });
  }
};
