const admin = require('firebase-admin');
const Producto = require('../models/Producto');

class ProductoService {
  constructor() {
    this.db = admin.firestore();
    this.collection = 'productos';
  }

  // ---------- MÉTODOS DE AUDITORÍA ----------
  _setAuditoriaCreacion(obj, usuarioId) {
    return {
      ...obj,
      usuarioCreacion: usuarioId,
      usuarioActualizacion: usuarioId,
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
      fechaActualizacion: admin.firestore.FieldValue.serverTimestamp(),
      activo: true
    };
  }

  _setAuditoriaActualizacion(obj, usuarioId) {
    return {
      ...obj,
      usuarioActualizacion: usuarioId,
      fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
    };
  }

  // ---------- CREAR O ACTUALIZAR PRODUCTO ----------
  async crearProducto(datosProducto, usuarioId) {
    try {
      if (!datosProducto.marca || !datosProducto.modelo) {
        throw new Error('Marca y modelo son requeridos');
      }

      if (!Array.isArray(datosProducto.sabores) || datosProducto.sabores.length === 0) {
        throw new Error('Debe incluir al menos un sabor');
      }

      const primerSabor = datosProducto.sabores[0];
      const nombreSaborNuevo = primerSabor.sabor;
      const stockASumar = primerSabor.stock || 0;

      const query = this.db.collection(this.collection)
        .where('marca', '==', datosProducto.marca)
        .where('modelo', '==', datosProducto.modelo)
        .where('activo', '==', true)  // ¡Filtro CRUCIAL!
        .limit(1);

      const snapshot = await query.get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const productoExistente = Producto.fromFirestore(doc);
        const nombreSaborNuevo = primerSabor.sabor;

        let saborYaExiste = false;

        const nuevosSabores = productoExistente.sabores.map(sabor => {
          if (sabor.nombre === nombreSaborNuevo) {
            return {
              ...sabor,
              stock: (sabor.stock || 0) + stockASumar
            };
          }
          return sabor;
        });

        const saboresFinales = saborYaExiste
          ? nuevosSabores
          : [
              ...productoExistente.sabores, 
              {
                nombre: nombreSaborNuevo, // Campo CORRECTO
                stock: stockASumar,
                emoji: primerSabor.emoji,
                id: Date.now().toString()
              }
            ];

        const updateData = this._setAuditoriaActualizacion({ sabores: saboresFinales }, usuarioId);
        await this.db.collection(this.collection).doc(doc.id).update(updateData);

        return await this.obtenerProductoPorId(doc.id);
      } else {
        const nuevosSabores = datosProducto.sabores.map(s => ({
          nombre: s.sabor,
          stock: s.stock,
          emoji: s.emoji,
          id: Date.now().toString()
        }));
        const nuevoProducto = new Producto({
          ...datosProducto,
          sabores: nuevosSabores
        });

        const errores = nuevoProducto.validate();
        if (errores.length > 0) {
          throw new Error(`Errores de validación: ${errores.join(', ')}`);
        }

        const datosConAuditoria = this._setAuditoriaCreacion(nuevoProducto.toFirestore(), usuarioId);
        const docRef = await this.db.collection(this.collection).add(datosConAuditoria);
        const docSnapshot = await docRef.get();
        return Producto.fromFirestore(docSnapshot);
      }
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // ---------- AGREGAR SABOR A PRODUCTO EXISTENTE ----------
  async agregarSabor(productoId, saborData, usuarioId) {
    try {
      const producto = await this.obtenerProductoPorId(productoId);
      const nombreSaborNuevo = saborData.nombre;
      const stockASumar = saborData.stock || 0;
      let saborYaExiste = false;

      const nuevosSabores = producto.sabores.map(sabor => {
        if (sabor.nombre === nombreSaborNuevo) {
          saborYaExiste = true;
          return {
            ...sabor,
            stock: (sabor.stock || 0) + stockASumar
          };
        }
        return sabor;
      });

      const saboresFinales = saborYaExiste
        ? nuevosSabores
        : [...producto.sabores, { ...saborData, id: Date.now().toString() }];

      const updateData = this._setAuditoriaActualizacion({ sabores: saboresFinales }, usuarioId);
      await this.db.collection(this.collection).doc(productoId).update(updateData);

      return await this.obtenerProductoPorId(productoId);
    } catch (error) {
      throw new Error(`Error al agregar sabor: ${error.message}`);
    }
  }

  // ---------- OBTENER TODOS LOS PRODUCTOS ----------
  async obtenerProductos(filtros = {}) {
    try {
      let query = this.db.collection(this.collection).where('activo', '==', true);

      if (filtros.marca) query = query.where('marca', '==', filtros.marca);
      if (filtros.modelo) query = query.where('modelo', '==', filtros.modelo);

      const snapshot = await query.get();
      return snapshot.docs.map(doc => Producto.fromFirestore(doc));
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  // ---------- OBTENER POR ID ----------
  async obtenerProductoPorId(id) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) throw new Error('Producto no encontrado');
      return Producto.fromFirestore(doc);
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  // ---------- ACTUALIZAR PRODUCTO ----------
  async actualizarProducto(id, datosActualizacion, usuarioId) {
    try {
      await this.obtenerProductoPorId(id);

      const updateData = this._setAuditoriaActualizacion(datosActualizacion, usuarioId);
      await this.db.collection(this.collection).doc(id).update(updateData);

      return await this.obtenerProductoPorId(id);
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  // ---------- ELIMINACIÓN LÓGICA ----------
  async eliminarProducto(id, usuarioId) {
    try {
      const updateData = this._setAuditoriaActualizacion({ activo: false }, usuarioId);
      await this.db.collection(this.collection).doc(id).update(updateData);
      return { mensaje: 'Producto eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

module.exports = new ProductoService();
