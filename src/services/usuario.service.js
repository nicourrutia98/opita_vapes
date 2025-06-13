const { db } = require('../config/firebase');
const USUARIOS_COLLECTION = 'usuarios';

async function crearUsuario(data) {
  const docRef = await db.collection(USUARIOS_COLLECTION).add(data);
  return { id: docRef.id, ...data };
}

async function obtenerUsuarios() {
  const snapshot = await db.collection(USUARIOS_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function obtenerUsuarioPorId(id) {
  const doc = await db.collection(USUARIOS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function actualizarUsuario(id, data) {
  await db.collection(USUARIOS_COLLECTION).doc(id).update(data);
  return { id, ...data };
}

async function eliminarUsuario(id) {
  await db.collection(USUARIOS_COLLECTION).doc(id).delete();
  return { id };
}

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};
