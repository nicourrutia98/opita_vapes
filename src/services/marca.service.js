// src/services/marca.service.js
const { db } = require('../config/firebase');

class MarcaService {
  constructor() {
    this.marcasCache = [];
    this.lastUpdated = null;
    this.ttl = 1000 * 60 * 5; // 5 minutos
  }

  async obtenerMarcasUnicas() {
    // Si la caché está vigente, devuelve la caché
    if (this.lastUpdated && Date.now() - this.lastUpdated < this.ttl) {
      return this.marcasCache;
    }
    // Si no, consulta Firestore
    const productosRef = db.collection('productos');
    const snapshot = await productosRef.select('marca').get();

    const marcasSet = new Set();
    snapshot.forEach(doc => {
      const marca = doc.data().marca;
      if (marca) marcasSet.add(marca);
    });
    const marcas = Array.from(marcasSet).sort();

    // Actualiza la caché
    this.marcasCache = marcas;
    this.lastUpdated = Date.now();

    return marcas;
  }
}

module.exports = new MarcaService();
