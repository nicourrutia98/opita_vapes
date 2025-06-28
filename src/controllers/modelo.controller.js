const { db } = require('../config/firebase');

exports.obtenerModelosPorMarca = async (req, res) => {
    try {
        const marca = req.query.marca;
        if (!marca) return res.status(400).json({ error: 'Parámetro "marca" requerido' });

        const productosRef = db.collection('productos');
        const snapshot = await productosRef
            .where('marca', '==', marca)
            .select('modelo')
            .get();

        if (snapshot.empty) return res.json([]);

        const modelosSet = new Set();
        snapshot.forEach(doc => {
            const modelo = doc.data().modelo;
            if (modelo) modelosSet.add(modelo);
        });

        res.status(200).json(Array.from(modelosSet));
    } catch (error) {
        console.error('Error al obtener modelos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
