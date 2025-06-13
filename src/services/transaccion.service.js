const { db } = require('../config/firebase');

const TRANSACCIONES_COLLECTION = 'transacciones';

async function crearTransaccion(data) {
  // data debe incluir: tipo, monto, descripcion, fecha, venta_id (opcional)
  const docRef = await db.collection(TRANSACCIONES_COLLECTION).add(data);
  return { id: docRef.id, ...data };
}

async function obtenerTransacciones() {
  const snapshot = await db.collection(TRANSACCIONES_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function obtenerTransaccionPorId(id) {
  const doc = await db.collection(TRANSACCIONES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function actualizarTransaccion(id, data) {
  await db.collection(TRANSACCIONES_COLLECTION).doc(id).update(data);
  return { id, ...data };
}

async function eliminarTransaccion(id) {
  await db.collection(TRANSACCIONES_COLLECTION).doc(id).delete();
  return { id };
}

module.exports = {
  crearTransaccion,
  obtenerTransacciones,
  obtenerTransaccionPorId,
  actualizarTransaccion,
  eliminarTransaccion,
};
