const ventaService = require('../services/venta.service');

exports.crearVenta = async (req, res) => {
  try {
    const nuevaVenta = await ventaService.crearVenta(req.body);
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear venta', detalle: error.message });
  }
};

exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await ventaService.obtenerVentas();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ventas', detalle: error.message });
  }
};

exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await ventaService.obtenerVentaPorId(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener venta', detalle: error.message });
  }
};

exports.actualizarVenta = async (req, res) => {
  try {
    const ventaActualizada = await ventaService.actualizarVenta(req.params.id, req.body);
    res.json(ventaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar venta', detalle: error.message });
  }
};

exports.eliminarVenta = async (req, res) => {
  try {
    await ventaService.eliminarVenta(req.params.id);
    res.json({ mensaje: 'Venta eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar venta', detalle: error.message });
  }
};
