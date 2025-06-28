module.exports = (...allowedRoles) => (req, res, next) => {
  // 1. Aplanar allowedRoles (eliminar arrays anidados)
  const flattenedRoles = allowedRoles.flat(); // ¡Corrección clave!

  // 2. Verificar autenticación
  if (!req.user) {
    return res.status(403).json({ error: 'Usuario no autenticado' });
  }
  
  // 3. Validar estructura de roles
  if (!Array.isArray(req.user.roles) || req.user.roles.length === 0) {
    return res.status(403).json({ 
      error: 'Usuario sin roles asignados',
      debug: `Roles recibidos: ${JSON.stringify(req.user.roles)}`
    });
  }

  // 4. Verificar permisos con roles aplanados
  const hasPermission = flattenedRoles.some(
    role => req.user.roles.includes(role)
  );
  
  if (!hasPermission) {
    return res.status(403).json({ 
      error: 'Permisos insuficientes',
      requiredRoles: flattenedRoles, // Mostrar roles planos
      userRoles: req.user.roles
    });
  }

  next();
};
