const { db } = require('../config/firebase');

class SaborService {
    // Obtener sabores por marca
    async obtenerSaboresPorMarca(marca) {
        try {
            const productosRef = db.collection('productos');
            const snapshot = await productosRef
                .where('marca', '==', marca)
                .get();
            
            const saboresMap = new Map();
            
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.sabor && data.emoji) {
                    saboresMap.set(data.sabor, {
                        sabor: data.sabor,
                        emoji: data.emoji
                    });
                }
            });
            
            return Array.from(saboresMap.values());
        } catch (error) {
            console.error('Error en obtenerSaboresPorMarca:', error);
            throw new Error('Error interno al obtener sabores');
        }
    }

    // Obtener emoji por sabor
    async obtenerEmojiPorSabor(sabor) {
        try {
            const saboresRef = db.collection('sabores');
            const snapshot = await saboresRef
                .where('nombre', '==', sabor)
                .limit(1)
                .get();
            
            return snapshot.empty ? '' : snapshot.docs[0].data().emoji;
        } catch (error) {
            console.error('Error en obtenerEmojiPorSabor:', error);
            throw new Error('Error interno al obtener emoji');
        }
    }
}

module.exports = new SaborService();
