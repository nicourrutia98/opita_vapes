const { admin, db } = require('../config/firebase');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Obtener documento de Firestore
    const userDoc = await db.collection('usuarios').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado en Firestore' });
    }
    
    const userData = userDoc.data();
    
    
    const roles = userData.role 
      ? (Array.isArray(userData.role) ? userData.role : [userData.role]) 
      : [];
    
    // Construir objeto de usuario
    req.user = {
      uid,
      email: decodedToken.email,
      roles,  // Array garantizado
      ...userData
    };

    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Token inválido', 
      detalle: error.message 
    });
  }
};
