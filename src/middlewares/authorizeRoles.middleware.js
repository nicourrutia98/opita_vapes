module.exports = (...allowedRoles) => (req, res, next) => {
  if (!req.user?.roles?.length) {
    return res.status(403).json({ error: 'Acceso denegado: sin roles asignados' });
  }

  const hasRole = allowedRoles.some(role => req.user.roles.includes(role));
  if (!hasRole) {
    return res.status(403).json({ error: 'Permisos insuficientes para esta acción' });
  }

  next();
};
