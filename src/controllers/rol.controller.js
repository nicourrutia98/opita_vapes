const { admin, db } = require('../config/firebase');

exports.asignarRoles = async (req, res) => {
  const { uid } = req.params;
  const { roles } = req.body;

  try {
    // 1. Actualizar Custom Claims en Firebase Auth
    await admin.auth().setCustomUserClaims(uid, { roles });
    
    // 2. Sincronizar con Firestore (opcional pero recomendado)
    await db.collection('usuarios').doc(uid).set({ roles }, { merge: true });

    res.json({ 
      mensaje: 'Roles actualizados',
      roles: roles 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al asignar roles',
      detalle: error.message 
    });
  }
};
