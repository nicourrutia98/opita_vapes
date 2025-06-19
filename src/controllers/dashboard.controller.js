// controllers/dashboard.controller.js
const dashboardService = require('../services/dashboard.service');

class DashboardController {
  async getDashboardData(req, res, next) {
    try {
      const dashboardData = await dashboardService.getDashboardMetrics();
      
      res.status(200).json({
        success: true,
        data: dashboardData,
        message: 'Datos del dashboard obtenidos exitosamente'
      });
    } catch (error) {
      next(error); // Usa tu middleware de manejo de errores
    }
  }

  async getDashboardSummary(req, res, next) {
    try {
      const summary = await dashboardService.getDashboardMetrics();
      
      // Versión resumida para widgets rápidos
      res.status(200).json({
        success: true,
        data: {
          dailySales: summary.dailySales,
          lowStockCount: summary.lowStockCount,
          activeUsers: summary.activeUsers
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
