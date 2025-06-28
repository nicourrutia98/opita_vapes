const admin = require('firebase-admin');
const Producto = require('../models/Producto');

class ProductoService {
  constructor() {
    this.db = admin.firestore();
    this.collection = 'productos';
  }

  // CREAR/ACTUALIZAR PRODUCTO CON LÓGICA DE AGRUPACIÓN Y SUMA DE STOCK
  async crearProducto(datosProducto, usuarioId) {
    try {
      if (!datosProducto.marca || !datosProducto.modelo) {
        throw new Error('Marca y modelo son requeridos');
      }

      // Buscar producto existente por marca y modelo
      const query = this.db.collection(this.collection)
        .where('marca', '==', datosProducto.marca)
        .where('modelo', '==', datosProducto.modelo)
        .limit(1);

      const snapshot = await query.get();

      if (!snapshot.empty) {
        // Producto existe: revisar si el sabor ya existe
        const doc = snapshot.docs[0];
        const productoExistente = Producto.fromFirestore(doc);

        // Buscar sabor por nombre (puedes cambiar a ID si lo prefieres)
        const nombreSaborNuevo = datosProducto.saborData.nombre;
        const stockASumar = datosProducto.saborData.stock || 0;
        let saborYaExiste = false;

        const nuevosSabores = productoExistente.sabores.map(sabor => {
          if (sabor.nombre === nombreSaborNuevo) {
            saborYaExiste = true;
            return {
              ...sabor,
              stock: (sabor.stock || 0) + stockASumar
            };
          }
          return sabor;
        });

        if (saborYaExiste) {
          // Sumar stock al sabor existente
          const updateData = {
            sabores: nuevosSabores,
            usuarioActualizacion: usuarioId,
            fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
          };
          await this.db.collection(this.collection).doc(doc.id).update(updateData);
          return await this.obtenerProductoPorId(doc.id);
        } else {
          // Agregar nuevo sabor
          const nuevoSabor = {
            ...datosProducto.saborData,
            id: Date.now().toString()
          };
          const updateData = {
            sabores: [...productoExistente.sabores, nuevoSabor],
            usuarioActualizacion: usuarioId,
            fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
          };
          await this.db.collection(this.collection).doc(doc.id).update(updateData);
          return await this.obtenerProductoPorId(doc.id);
        }
      } else {
        // Producto no existe: crear nuevo producto con el sabor
        const nuevoProducto = new Producto({
          ...datosProducto,
          sabores: [{
            ...datosProducto.saborData,
            id: Date.now().toString()
          }],
          usuarioCreacion: usuarioId,
          usuarioActualizacion: usuarioId,
          fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
          fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
        });

        const errores = nuevoProducto.validate();
        if (errores.length > 0) {
          throw new Error(`Errores de validación: ${errores.join(', ')}`);
        }

        const docRef = await this.db.collection(this.collection).add(
          nuevoProducto.toFirestore()
        );
        const docSnapshot = await docRef.get();
        return Producto.fromFirestore(docSnapshot);
      }
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // AGREGAR SABOR (con suma de stock si existe)
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

      let saboresFinales;
      if (saborYaExiste) {
        saboresFinales = nuevosSabores;
      } else {
        saboresFinales = [
          ...producto.sabores,
          {
            ...saborData,
            id: Date.now().toString()
          }
        ];
      }

      await this.db.collection(this.collection).doc(productoId).update({
        sabores: saboresFinales,
        usuarioActualizacion: usuarioId,
        fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
      });

      return await this.obtenerProductoPorId(productoId);
    } catch (error) {
      throw new Error(`Error al agregar sabor: ${error.message}`);
    }
  }

  // OBTENER PRODUCTOS (CON FILTROS)
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

  // ACTUALIZAR PRODUCTO
  async actualizarProducto(id, datosActualizacion, usuarioId) {
    try {
      await this.obtenerProductoPorId(id);

      const updateData = {
        ...datosActualizacion,
        usuarioActualizacion: usuarioId,
        fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
      };

      await this.db.collection(this.collection).doc(id).update(updateData);
      return await this.obtenerProductoPorId(id);
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  // OBTENER PRODUCTO POR ID
  async obtenerProductoPorId(id) {
    try {
      const doc = await this.db.collection(this.collection).doc(id).get();
      if (!doc.exists) throw new Error('Producto no encontrado');
      return Producto.fromFirestore(doc);
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  // ELIMINACIÓN LÓGICA
  async eliminarProducto(id, usuarioId) {
    try {
      await this.db.collection(this.collection).doc(id).update({
        activo: false,
        usuarioActualizacion: usuarioId,
        fechaActualizacion: admin.firestore.FieldValue.serverTimestamp()
      });
      return { mensaje: 'Producto eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

module.exports = new ProductoService();
