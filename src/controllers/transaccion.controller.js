const transaccionService = require('../services/transaccion.service');

exports.crearTransaccion = async (req, res) => {
  try {
    const nuevaTransaccion = await transaccionService.crearTransaccion(req.body);
    res.status(201).json(nuevaTransaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear transacción', detalle: error.message });
  }
};

exports.obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await transaccionService.obtenerTransacciones();
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacciones', detalle: error.message });
  }
};

exports.obtenerTransaccionPorId = async (req, res) => {
  try {
    const transaccion = await transaccionService.obtenerTransaccionPorId(req.params.id);
    if (!transaccion) return res.status(404).json({ error: 'Transacción no encontrada' });
    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transacción', detalle: error.message });
  }
};

exports.actualizarTransaccion = async (req, res) => {
  try {
    const transaccionActualizada = await transaccionService.actualizarTransaccion(req.params.id, req.body);
    res.json(transaccionActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar transacción', detalle: error.message });
  }
};

exports.eliminarTransaccion = async (req, res) => {
  try {
    await transaccionService.eliminarTransaccion(req.params.id);
    res.json({ mensaje: 'Transacción eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar transacción', detalle: error.message });
  }
};
