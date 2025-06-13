const { db } = require('../config/firebase');

const PRODUCTOS_COLLECTION = 'productos';

async function crearProducto(data) {
  const docRef = await db.collection(PRODUCTOS_COLLECTION).add(data);
  return { id: docRef.id, ...data };
}

async function obtenerProductos() {
  const snapshot = await db.collection(PRODUCTOS_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function obtenerProductoPorId(id) {
  const doc = await db.collection(PRODUCTOS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function actualizarProducto(id, data) {
  await db.collection(PRODUCTOS_COLLECTION).doc(id).update(data);
  return { id, ...data };
}

async function eliminarProducto(id) {
  await db.collection(PRODUCTOS_COLLECTION).doc(id).delete();
  return { id };
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};
