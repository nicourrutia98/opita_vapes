const productoService = require('../services/producto.service');

exports.crearProducto = async (req, res) => {
  try {
    const nuevoProducto = await productoService.crearProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto', detalle: error.message });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: error.message });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await productoService.obtenerProductoPorId(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto', detalle: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await productoService.actualizarProducto(req.params.id, req.body);
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto', detalle: error.message });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    await productoService.eliminarProducto(req.params.id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto', detalle: error.message });
  }
};
