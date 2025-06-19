class Sale {
  constructor(data) {
    this.id = data.id;
    this.fecha = data.fecha;
    this.productos = data.productos || [];
    this.total = data.total || 0;
    this.usuarioId = data.usuarioId;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  // Métodos utilitarios
  getFormattedTotal() {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(this.total);
  }

  static fromFirestore(doc) {
    return new Sale({ id: doc.id, ...doc.data() });
  }
}

module.exports = Sale;
