const { admin, db } = require('../config/firebase');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decodedToken.uid);
    
    // Obtener roles desde Firestore (opcional para sincronización)
    const userDoc = await db.collection('usuarios').doc(user.uid).get();
    
    req.user = {
      uid: user.uid,
      email: user.email,
      roles: user.customClaims?.roles || [],
      ...userDoc.data()
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido', detalle: error.message });
  }
};
