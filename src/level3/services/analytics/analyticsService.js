const Transaction = require('@models/Transaction');
const Presupuesto = require('@models/Presupuesto');

/**
 * @fileoverview Servicio de Analytics - Proporciona análisis financieros y tendencias
 * @module level3/services/analytics/analyticsService
 */

/**
 * Obtiene un resumen financiero para un perfil en un mes y año específicos
 * 
 * Calcula ingresos, gastos, saldo y estadísticas de transacciones para un perfil
 * en un período mensual específico.
 * 
 * @param {string} perfilID - ID del perfil del cual obtener el resumen (MongoDB ObjectId)
 * @param {number} mes - Mes del resumen (1-12)
 * @param {number} año - Año del resumen (ej: 2024)
 * 
 * @returns {Promise<Object>} Objeto con resumen financiero que incluye:
 * - ingresos: Total de ingresos del mes (número)
 * - gastos: Total de gastos del mes (número)
 * - saldo: Balance neto del mes (ingresos - gastos)
 * - totalTransacciones: Número total de transacciones del mes
 * - gastosPorCategoria: Array de objetos con gastos por categoría (actualmente vacío, pendiente implementación)
 * 
 * @throws {Error} Si hay un error al consultar la base de datos
 * 
 * @example
 * const summary = await getFinancialSummary('507f1f77bcf86cd799439011', 1, 2024);
 * // Retorna: { ingresos: 1000000, gastos: 500000, saldo: 500000, totalTransacciones: 25, gastosPorCategoria: [] }
 */
exports.getFinancialSummary = async (perfilID, mes, año) => {
  const startDate = new Date(año, mes - 1, 1);
  const endDate = new Date(año, mes, 0, 23, 59, 59);

  const transactions = await Transaction.find({
    perfilID,
    fecha: {
      $gte: startDate,
      $lte: endDate
    }
  });

  const ingresos = transactions
    .filter(t => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const gastos = transactions
    .filter(t => t.tipo === 'Gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const saldo = ingresos - gastos;

  // Get expenses by category (will be populated if needed)
  const gastosPorCategoria = {};

  return {
    ingresos,
    gastos,
    saldo,
    totalTransacciones: transactions.length,
    gastosPorCategoria: Object.values(gastosPorCategoria)
  };
};

/**
 * Obtiene tendencias mensuales de un perfil
 * 
 * Calcula el resumen financiero para los últimos N meses y retorna
 * una lista de tendencias que muestra la evolución en el tiempo.
 * 
 * @param {string} perfilID - ID del perfil del cual obtener las tendencias (MongoDB ObjectId)
 * @param {number} [meses=6] - Número de meses a analizar (opcional, default: 6)
 * 
 * @returns {Promise<Array>} Array de objetos con tendencias mensuales, cada uno incluye:
 * - mes: Número del mes (1-12)
 * - año: Año del período
 * - mesNombre: Nombre del mes en español (ej: "enero")
 * - ingresos: Total de ingresos del mes
 * - gastos: Total de gastos del mes
 * - saldo: Balance neto del mes
 * - totalTransacciones: Número de transacciones del mes
 * - gastosPorCategoria: Array de gastos por categoría
 * 
 * @throws {Error} Si hay un error al consultar la base de datos
 * 
 * @example
 * const trends = await getMonthlyTrends('507f1f77bcf86cd799439011', 12);
 * // Retorna: [{ mes: 1, año: 2024, mesNombre: "enero", ingresos: 1000000, ... }, ...]
 */
exports.getMonthlyTrends = async (perfilID, meses = 6) => {
  const trends = [];
  const today = new Date();

  for (let i = meses - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();

    const summary = await this.getFinancialSummary(perfilID, mes, año);
    trends.push({
      mes,
      año,
      mesNombre: date.toLocaleString('es-ES', { month: 'long' }),
      ...summary
    });
  }

  return trends;
};
