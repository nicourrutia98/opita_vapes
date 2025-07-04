const productoService = require('../services/producto.service');

class ProductoController {
  // CREAR PRODUCTO (CON LÓGICA DE AGRUPACIÓN Y SUMA DE STOCK)
  async crearProducto(req, res) {
    try {
      // Validación actualizada: ahora espera array "sabores"
      if (!req.body.marca || !req.body.modelo || !req.body.sabores || req.body.sabores.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Marca, modelo y al menos un sabor son requeridos'
        });
      }
      const usuarioId = req.user.uid; // Cambiado de .id a .uid
      const producto = await productoService.crearProducto(req.body, usuarioId);

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: producto
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
  }

  // AGREGAR SABOR A PRODUCTO EXISTENTE (CON SUMA DE STOCK SI EXISTE)
  async agregarSabor(req, res) {
    try {
      const { id: productoId } = req.params;
      const usuarioId = req.user.uid; // Cambiado de .id a .uid
      const saborData = req.body;

      const productoActualizado = await productoService.agregarSabor(
        productoId,
        saborData,
        usuarioId
      );

      // Determinar si se sumó stock o se añadió un nuevo sabor
      const saborExistente = productoActualizado.sabores.find(s => s.nombre === saborData.nombre);
      const mensaje = saborExistente && saborExistente.stock > saborData.stock
        ? 'Stock actualizado en sabor existente'
        : 'Nuevo sabor agregado';

      res.status(200).json({
        success: true,
        message: mensaje,
        data: productoActualizado
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // OBTENER TODOS LOS PRODUCTOS
  async obtenerProductos(req, res) {
    try {
      const filtros = req.query;
      const productos = await productoService.obtenerProductos(filtros);
      res.status(200).json({
        success: true,
        data: productos,
        total: productos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // OBTENER PRODUCTO POR ID
  async obtenerProductoPorId(req, res) {
    try {
      const { id } = req.params;
      const producto = await productoService.obtenerProductoPorId(id);
      res.status(200).json({
        success: true,
        data: producto
      });
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // ACTUALIZAR SABOR ESPECÍFICO (NO SUMA STOCK, ACTUALIZA VALORES)
  async actualizarSabor(req, res) {
    try {
      const { id: productoId, saborId } = req.params;
      const usuarioId = req.user.uid; // Cambiado de .id a .uid

      const producto = await productoService.obtenerProductoPorId(productoId);

      const nuevosSabores = producto.sabores.map(sabor => {
        if (sabor.id === saborId) {
          return { ...sabor, ...req.body };
        }
        return sabor;
      });

      const productoActualizado = await productoService.actualizarProducto(
        productoId,
        { sabores: nuevosSabores },
        usuarioId
      );

      res.status(200).json({
        success: true,
        message: 'Sabor actualizado',
        data: productoActualizado
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ACTUALIZAR PRODUCTO (CAMPOS GENERALES, NO SABORES)
  async actualizarProducto(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.uid; // Cambiado de .id a .uid

      if (req.body.sabores) {
        throw new Error('Use el endpoint específico para actualizar sabores');
      }

      const producto = await productoService.actualizarProducto(
        id,
        req.body,
        usuarioId
      );

      res.status(200).json({
        success: true,
        message: 'Producto actualizado',
        data: producto
      });
    } catch (error) {
      const statusCode = error.message.includes('no encontrado') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // ELIMINAR PRODUCTO (SOFT DELETE)
  async eliminarProducto(req, res) {
    try {
      const { id } = req.params;
      const usuarioId = req.user.uid; // Cambiado de .id a .uid

      const resultado = await productoService.eliminarProducto(id, usuarioId);

      res.status(200).json({
        success: true,
        message: resultado.mensaje
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ProductoController();
