const { db } = require('../config/firebase');
const Producto = require('../models/Producto'); // Asumiendo que tienes un modelo

async function obtenerSugerenciasPorCampo(field) {
  try {
    let query = db.collection('productos').where('activo', '==', true);
    const snapshot = await query.get();

    const suggestions = new Set();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Manejo especial para sabores
      if (field === 'sabor') {
        if (data.sabores && Array.isArray(data.sabores)) {
          data.sabores.forEach(sabor => {
            if (sabor.nombre) suggestions.add(sabor.nombre);
          });
        }
      } 
      // Campos normales (marca, modelo)
      else if (data[field]) {
        suggestions.add(data[field]);
      }
    });

    return Array.from(suggestions).sort();
  } catch (error) {
    console.error(`Error obteniendo sugerencias para ${field}:`, error);
    throw new Error('Error al cargar sugerencias');
  }
}

async function obtenerProductosRecientes(limite = 5) {
  try {
    const snapshot = await db.collection('productos')
      .where('activo', '==', true)
      .orderBy('fechaCreacion', 'desc')
      .limit(limite)
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return new Producto({ id: doc.id, ...data });
    });
  } catch (error) {
    console.error('Error obteniendo productos recientes:', error);
    throw new Error('Error al cargar productos recientes');
  }
}

module.exports = {
  obtenerSugerenciasPorCampo,
  obtenerProductosRecientes
};
