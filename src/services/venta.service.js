const { db } = require('../config/firebase');

const VENTAS_COLLECTION = 'ventas';

async function crearVenta(data) {
  // data debe incluir: cliente_id, cliente_nombre, fecha, total, estado, detalles (array de productos vendidos)
  const { detalles, ...ventaInfo } = data;
  const ventaRef = await db.collection(VENTAS_COLLECTION).add(ventaInfo);

  // Guardar los detalles como subcolección
  if (Array.isArray(detalles)) {
    const batch = db.batch();
    detalles.forEach(detalle => {
      const detalleRef = ventaRef.collection('detalles').doc();
      batch.set(detalleRef, detalle);
    });
    await batch.commit();
  }

  return { id: ventaRef.id, ...ventaInfo, detalles: detalles || [] };
}

async function obtenerVentas() {
  const snapshot = await db.collection(VENTAS_COLLECTION).get();
  const ventas = [];
  for (const doc of snapshot.docs) {
    const detallesSnap = await doc.ref.collection('detalles').get();
    const detalles = detallesSnap.docs.map(det => ({ id: det.id, ...det.data() }));
    ventas.push({ id: doc.id, ...doc.data(), detalles });
  }
  return ventas;
}

async function obtenerVentaPorId(id) {
  const doc = await db.collection(VENTAS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  const detallesSnap = await doc.ref.collection('detalles').get();
  const detalles = detallesSnap.docs.map(det => ({ id: det.id, ...det.data() }));
  return { id: doc.id, ...doc.data(), detalles };
}

async function actualizarVenta(id, data) {
  await db.collection(VENTAS_COLLECTION).doc(id).update(data);
  return { id, ...data };
}

async function eliminarVenta(id) {
  // Elimina detalles primero
  const detallesSnap = await db.collection(VENTAS_COLLECTION).doc(id).collection('detalles').get();
  const batch = db.batch();
  detallesSnap.docs.forEach(det => batch.delete(det.ref));
  await batch.commit();
  // Elimina la venta
  await db.collection(VENTAS_COLLECTION).doc(id).delete();
  return { id };
}

module.exports = {
  crearVenta,
  obtenerVentas,
  obtenerVentaPorId,
  actualizarVenta,
  eliminarVenta,
};
