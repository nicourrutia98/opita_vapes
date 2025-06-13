const usuarioService = require('../services/usuario.service');

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await usuarioService.crearUsuario(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
};

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
  }
};

exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario', detalle: error.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    await usuarioService.eliminarUsuario(req.params.id);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
  }
};
