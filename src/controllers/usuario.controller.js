const admin = require('firebase-admin');
const usuarioService = require('../services/usuario.service');

// Crear usuario
exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await usuarioService.crearUsuario(req.body);
    res.status(201).json({ success: true, data: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al crear usuario', detalle: error.message });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener usuarios', detalle: error.message });
  }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
    if (!usuario) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener usuario', detalle: error.message });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);
    res.json({ success: true, data: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar usuario', detalle: error.message });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    await usuarioService.eliminarUsuario(req.params.id);
    res.json({ success: true, mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar usuario', detalle: error.message });
  }
};

// Obtener usuario autenticado (/me)
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    // Verifica el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Busca el usuario en Firestore
    const userDoc = await admin.firestore()
      .collection('usuarios')
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        ...userDoc.data()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al obtener usuario actual', detalle: error.message });
  }
};
