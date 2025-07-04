const { db } = require('../config/firebase');
const Producto = require('../models/Producto');

async function obtenerSugerenciasPorCampo(field, search = '') {
  try {
    let query = db.collection('productos').where('activo', '==', true);
    const snapshot = await query.get();

    // Manejo especial para campos complejos
    if (field === 'sabor') {
      return manejarSabores(snapshot, search);
    }
    
    // Manejo especial para campos relacionados con marca/modelo
    if (['categoria', 'tipo', 'nivelNicotina', 'colorVariante', 
         'resistenciaCompatibles', 'tamano', 'nombre', 'precio',
         'precioMayorX5', 'precioMayorX10', 'costoEmpresa'].includes(field)) {
      return manejarCamposRelacionados(snapshot, field, search);
    }

    // Campos simples
    return manejarCamposSimples(snapshot, field, search);
    
  } catch (error) {
    console.error(`Error obteniendo sugerencias para ${field}:`, error);
    throw new Error('Error al cargar sugerencias');
  }
}

// Función para manejar sabores
function manejarSabores(snapshot, search) {
  const saboresMap = new Map();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.sabores && Array.isArray(data.sabores)) {
      data.sabores.forEach(sabor => {
        if (sabor.nombre) {
          if (!saboresMap.has(sabor.nombre) || 
              (!saboresMap.get(sabor.nombre).emoji && sabor.emoji)) {
            saboresMap.set(sabor.nombre, {
              nombre: sabor.nombre,
              emoji: sabor.emoji || ''
            });
          }
        }
      });
    }
  });

  let resultados = Array.from(saboresMap.values());
  if (search) {
    const searchLower = search.toLowerCase();
    resultados = resultados.filter(s => 
      s.nombre.toLowerCase().includes(searchLower)
    );
  }
  
  return resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));
}
function manejarCamposRelacionados(snapshot, field, search) {
  const suggestions = new Map();
  const searchLower = search.toLowerCase();

  snapshot.forEach(doc => {
    const data = doc.data();
    const value = data[field];
    
    if (value) {
      // Agrupar por combinación de marca/modelo si existe
      const key = (data.marca && data.modelo) 
        ? `${data.marca.toLowerCase()}-${data.modelo.toLowerCase()}` 
        : 'general';
      
      if (!suggestions.has(key)) {
        suggestions.set(key, new Set());
      }
      
      if (typeof value === 'string') {
        if (!search || value.toLowerCase().includes(searchLower)) {
          suggestions.get(key).add(value);
        }
      }
    }
  });

  // Convertir a estructura plana
  const resultados = new Set();
  for (const setValues of suggestions.values()) {
    setValues.forEach(value => resultados.add(value));
  }
  
  return Array.from(resultados).sort();
}
function manejarCamposSimples(snapshot, field, search) {
  const suggestions = new Set();
  const searchLower = search.toLowerCase();

  snapshot.forEach(doc => {
    const data = doc.data();
    const value = data[field];
    
    if (value !== undefined && value !== null) {
      const valueStr = String(value);
      
      if (!search || valueStr.toLowerCase().includes(searchLower)) {
        suggestions.add(value);
      }
    }
  });
  
  return Array.from(suggestions).sort();
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
