const { db } = require('../config/firebase');

const CLIENTES_COLLECTION = 'clientes';

async function crearCliente(data) {
  const docRef = await db.collection(CLIENTES_COLLECTION).add(data);
  return { id: docRef.id, ...data };
}

async function obtenerClientes() {
  const snapshot = await db.collection(CLIENTES_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function obtenerClientePorId(id) {
  const doc = await db.collection(CLIENTES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function actualizarCliente(id, data) {
  await db.collection(CLIENTES_COLLECTION).doc(id).update(data);
  return { id, ...data };
}

async function eliminarCliente(id) {
  await db.collection(CLIENTES_COLLECTION).doc(id).delete();
  return { id };
}

module.exports = {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
};
