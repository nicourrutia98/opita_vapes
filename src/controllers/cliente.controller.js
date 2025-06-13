const clienteService = require('../services/cliente.service');

exports.crearCliente = async (req, res) => {
  try {
    const nuevoCliente = await clienteService.crearCliente(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cliente', detalle: error.message });
  }
};

exports.obtenerClientes = async (req, res) => {
  try {
    const clientes = await clienteService.obtenerClientes();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener clientes', detalle: error.message });
  }
};

exports.obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await clienteService.obtenerClientePorId(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cliente', detalle: error.message });
  }
};

exports.actualizarCliente = async (req, res) => {
  try {
    const clienteActualizado = await clienteService.actualizarCliente(req.params.id, req.body);
    res.json(clienteActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cliente', detalle: error.message });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    await clienteService.eliminarCliente(req.params.id);
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cliente', detalle: error.message });
  }
};
