const admin = require('firebase-admin');

class DashboardService {
  constructor() {
    this.db = admin.firestore();
  }

  async getDashboardMetrics() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Ejecutar consultas en paralelo para mejor rendimiento
      const [
        dailySalesData,
        lowStockData,
        totalUsersData
      ] = await Promise.all([
        this.getDailySales(today),
        this.getLowStockProducts(),
        this.getActiveUsers(today)
      ]);

      return {
        dailySales: dailySalesData.total,
        dailySalesCount: dailySalesData.count,
        lowStockCount: lowStockData.length,
        lowStockProducts: lowStockData,
        activeUsers: totalUsersData,
        recentSales: dailySalesData.recent,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error obteniendo métricas del dashboard: ${error.message}`);
    }
  }

  async getDailySales(today) {
    const ventasSnapshot = await this.db.collection('ventas')
      .where('fecha', '>=', today.toISOString())
      .orderBy('fecha', 'desc')
      .get();

    let total = 0;
    const recent = [];

    ventasSnapshot.forEach(doc => {
      const data = doc.data();
      total += data.total || 0;
      if (recent.length < 5) {
        recent.push({
          id: doc.id,
          fecha: data.fecha,
          total: data.total,
          usuarioId: data.usuarioId
        });
      }
    });

    return {
      total,
      count: ventasSnapshot.size,
      recent
    };
  }

  async getLowStockProducts() {
    const productosSnapshot = await this.db.collection('productos')
      .where('stock', '<', 10)
      .orderBy('stock', 'asc')
      .get();

    return productosSnapshot.docs.map(doc => ({
      id: doc.id,
      nombre: doc.data().nombre,
      stock: doc.data().stock,
      precio: doc.data().precio
    }));
  }

  async getActiveUsers(today) {
    const ventasSnapshot = await this.db.collection('ventas')
      .where('fecha', '>=', today.toISOString())
      .get();

    const activeUserIds = new Set();
    ventasSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.usuarioId) activeUserIds.add(data.usuarioId);
    });

    return activeUserIds.size;
  }
}

module.exports = new DashboardService();
