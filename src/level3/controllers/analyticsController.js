const asyncHandler = require('@core/utils/asyncHandler');
const analyticsService = require('@level3/services/analytics/analyticsService');

/**
 * @fileoverview Controlador de Analytics - Proporciona análisis y resúmenes financieros
 * @module level3/controllers/analyticsController
 */

/**
 * Obtiene un resumen financiero para un perfil en un mes y año específicos
 * 
 * Retorna un resumen completo de la situación financiera del perfil incluyendo
 * ingresos, gastos, balance neto, categorías principales, etc.
 * 
 * @route GET /api/v1/analytics/summary
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.perfilID - ID del perfil del cual obtener el resumen (requerido)
 * @param {number} [req.query.mes] - Mes del resumen (1-12, opcional, default: mes actual)
 * @param {number} [req.query.año] - Año del resumen (opcional, default: año actual)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con resumen financiero que incluye:
 *   - ingresos: Total de ingresos del mes
 *   - gastos: Total de gastos del mes
 *   - balance: Balance neto (ingresos - gastos)
 *   - categorias: Desglose por categorías
 *   - tendencias: Comparación con meses anteriores
 * 
 * @throws {400} Si falta el parámetro perfilID
 * @throws {404} Si el perfil no existe
 * 
 * @example
 * // GET /api/v1/analytics/summary?perfilID=507f1f77bcf86cd799439011&mes=1&año=2024
 */
exports.getFinancialSummary = asyncHandler(async (req, res, _next) => {
  const { perfilID, mes, año } = req.query;
  const currentDate = new Date();
  const month = mes || currentDate.getMonth() + 1;
  const year = año || currentDate.getFullYear();

  const summary = await analyticsService.getFinancialSummary(perfilID, month, year);

  res.status(200).json({
    success: true,
    data: summary
  });
});

/**
 * Obtiene tendencias mensuales de un perfil
 * 
 * Retorna un análisis de tendencias financieras durante los últimos N meses,
 * mostrando la evolución de ingresos, gastos y balance en el tiempo.
 * 
 * @route GET /api/v1/analytics/trends
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.perfilID - ID del perfil del cual obtener las tendencias (requerido)
 * @param {number} [req.query.meses=6] - Número de meses a analizar (opcional, default: 6)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con tendencias que incluye:
 *   - periodos: Array de objetos con datos por mes
 *   - tendenciaIngresos: Tendencia de ingresos (creciente/decreciente/estable)
 *   - tendenciaGastos: Tendencia de gastos
 *   - proyeccion: Proyección para el próximo mes
 * 
 * @throws {400} Si falta el parámetro perfilID
 * @throws {404} Si el perfil no existe
 * 
 * @example
 * // GET /api/v1/analytics/trends?perfilID=507f1f77bcf86cd799439011&meses=12
 */
exports.getMonthlyTrends = asyncHandler(async (req, res, _next) => {
  const { perfilID, meses = 6 } = req.query;

  const trends = await analyticsService.getMonthlyTrends(perfilID, Number.parseInt(meses));

  res.status(200).json({
    success: true,
    data: trends
  });
});
