const { db } = require('../config/firebase');

class ModeloService {
    async obtenerModelosUnicosPorMarca(marca) {
        const productosRef = db.collection('productos');
        const snapshot = await productosRef
            .where('marca', '==', marca)
            .select('modelo')
            .get();
        
        const modelos = new Set();
        snapshot.forEach(doc => modelos.add(doc.data().modelo));
        
        return Array.from(modelos);
    }
}

module.exports = new ModeloService();
