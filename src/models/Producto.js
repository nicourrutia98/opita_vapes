class Producto {
  constructor({
    id,
    marca,
    modelo,
    sabores = [],
    emoji,
    nombre,
    precio,
    precioMayorX5,
    precioMayorX10,
    costoEmpresa,
    stock,
    sku,
    codigoBarras,
    fechaIngreso,
    capacidad,
    resistenciasCompatibles,
    colorVariante,
    proveedor,
    impuestos,
    tamaño,
    notasInternas,
    urlImagen,
    // Campos de auditoría
    fechaCreacion,
    fechaActualizacion,
    usuarioCreacion,
    usuarioActualizacion,
    activo = true
  }) {
    this.id = id;
    this.marca = marca;
    this.modelo = modelo;
    this.sabores = sabores;
    this.emoji = emoji;
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
    this.resistenciasCompatibles = resistenciasCompatibles;
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
    this.activo = activo;
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

    if (!this.emoji) errors.push('Emoji es requerido');
    if (!this.nombre) errors.push('Nombre del producto es requerido');
    if (!this.precio || this.precio <= 0) errors.push('Precio estándar debe ser mayor a 0');
    if (!this.precioMayorX5 || this.precioMayorX5 <= 0) errors.push('Precio x5+ debe ser mayor a 0');
    if (!this.precioMayorX10 || this.precioMayorX10 <= 0) errors.push('Precio x10+ debe ser mayor a 0');
    if (!this.costoEmpresa || this.costoEmpresa <= 0) errors.push('Costo empresa debe ser mayor a 0');
    if (this.stock < 0) errors.push('Stock no puede ser negativo');
    
    return errors;
  }
}

module.exports = Producto;
