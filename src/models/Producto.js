class Producto {
  constructor({
    id,
    marca,
    modelo,
    sabores = [],
    nombre,
    precio = 0,
    precioMayorX5 = 0,
    precioMayorX10 = 0,
    costoEmpresa = 0,
    stock = 0,
    sku = '',
    codigoBarras = '',
    fechaIngreso = '',
    capacidad = 0,
    resistenciaCompatibles = '',
    colorVariante = '',
    proveedor = '',
    impuestos = 0,
    tamaño = '',
    notasInternas = '',
    urlImagen = '',
    fechaCreacion,
    fechaActualizacion,
    usuarioCreacion,
    usuarioActualizacion,
    activo = true
  }) {
    this.id = id;
    this.marca = marca;
    this.modelo = modelo;
    this.sabores = sabores; // [{ sabor, stock, emoji }]
    this.nombre = nombre;
    this.precio = parseFloat(precio) || 0;
    this.precioMayorX5 = parseFloat(precioMayorX5) || 0;
    this.precioMayorX10 = parseFloat(precioMayorX10) || 0;
    this.costoEmpresa = parseFloat(costoEmpresa) || 0;
    this.stock = parseInt(stock) || 0;
    this.sku = sku;
    this.codigoBarras = codigoBarras;
    this.fechaIngreso = fechaIngreso;
    this.capacidad = parseFloat(capacidad) || 0;
    this.resistenciaCompatibles = resistenciaCompatibles || '';
    this.colorVariante = colorVariante;
    this.proveedor = proveedor;
    this.impuestos = parseFloat(impuestos) || 0;
    this.tamaño = tamaño;
    this.notasInternas = notasInternas;
    this.urlImagen = urlImagen;
    this.fechaCreacion = fechaCreacion || new Date().toISOString();
    this.fechaActualizacion = fechaActualizacion || new Date().toISOString();
    this.usuarioCreacion = usuarioCreacion;
    this.usuarioActualizacion = usuarioActualizacion;
    this.activo = activo !== false; // true por defecto
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Producto({
      id: doc.id,
      ...data
    });
  }

  get stockTotal() {
    return this.sabores.reduce((total, sabor) => total + (sabor.stock || 0), 0);
  }

  get listaSabores() {
    return this.sabores.map(s => `${s.emoji} ${s.sabor}`).join(', ');
  }

  toFirestore() {
    const obj = { ...this };
    delete obj.id; // El ID se maneja separadamente en Firestore
    return obj;
  }

  // Validaciones
  validate() {
    const errors = [];
    if (!this.marca) errors.push('Marca es requerida');
    if (!this.sabores || this.sabores.length === 0) {
      errors.push('Al menos un sabor es requerido');
    }
    this.sabores.forEach((sabor, idx) => {
      if (!sabor.nombre) errors.push(`El sabor #${idx + 1} debe tener nombre`);
      if (!sabor.emoji) errors.push(`El sabor "${sabor.nombre || idx + 1}" debe tener emoji`);
    });
    if (!this.nombre) errors.push('Nombre del producto es requerido');
    if (this.precio <= 0) errors.push('Precio estándar debe ser mayor a 0');
    if (this.precioMayorX5 <= 0) errors.push('Precio x5+ debe ser mayor a 0');
    if (this.precioMayorX10 <= 0) errors.push('Precio x10+ debe ser mayor a 0');
    if (this.costoEmpresa <= 0) errors.push('Costo empresa debe ser mayor a 0');
    if (this.stock < 0) errors.push('Stock no puede ser negativo');
    return errors;
  }
}

module.exports = Producto;
