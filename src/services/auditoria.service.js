const { db } = require('../config/firebase');
const AUDITORIA_COLLECTION = 'auditoria';

async function registrarEvento(data) {
  const docRef = await db.collection(AUDITORIA_COLLECTION).add(data);
  return { id: docRef.id, ...data };
}

async function obtenerEventos() {
  const snapshot = await db.collection(AUDITORIA_COLLECTION).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function obtenerEventoPorId(id) {
  const doc = await db.collection(AUDITORIA_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

module.exports = {
  registrarEvento,
  obtenerEventos,
  obtenerEventoPorId,
};
