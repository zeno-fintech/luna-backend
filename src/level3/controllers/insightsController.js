const asyncHandler = require('@core/utils/asyncHandler');
const insightsService = require('@level3/services/insightsService');

/**
 * @fileoverview Controlador de Insights - Proporciona insights financieros con IA (Nivel 3 - Usuario)
 * @module level3/controllers/insightsController
 */

/**
 * Obtiene insights financieros del usuario con soporte de IA
 * 
 * Retorna insights financieros personalizados que pueden incluir análisis
 * básico y análisis avanzado con IA (si está habilitado). Los insights incluyen
 * información sobre patrimonio neto, tasa de ahorro, salud de deudas, score financiero, etc.
 * 
 * @route GET /api/v1/app/insights
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.profileId] - ID del perfil del cual obtener insights (opcional)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con insights que incluye:
 *   - insights: Objeto con:
 *     - basic: Insights básicos siempre disponibles (netWorth, savingsRate, debtHealth, financialScore)
 *     - ai: Insights avanzados con IA (si está habilitado, null si no)
 *   - aiEnabled: Boolean indicando si IA está habilitada
 *   - recommendations: Array de recomendaciones basadas en los datos
 * 
 * @example
 * // GET /api/v1/app/insights
 * // GET /api/v1/app/insights?profileId=507f1f77bcf86cd799439011
 */
exports.getUserInsights = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { profileId } = req.query;

  const insights = await insightsService.getUserInsights(userId, profileId);

  res.status(200).json({
    success: true,
    data: insights
  });
});

/**
 * Obtiene insights específicos sobre patrones de gastos
 * 
 * Analiza los patrones de gastos del usuario durante un período específico
 * y retorna información sobre categorías principales, tendencias, anomalías, etc.
 * 
 * @route GET /api/v1/app/insights/spending
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.profileId] - ID del perfil (opcional)
 * @param {string} [req.query.period='30days'] - Período a analizar (opcional, default: '30days', opciones: '7days', '30days', '90days', '1year')
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con insights de gastos que incluye:
 *   - insights: Objeto con:
 *     - topCategories: Array de categorías principales con montos
 *     - trends: Array de tendencias de gastos en el tiempo
 *     - anomalies: Array de gastos anómalos detectados
 *   - aiEnabled: Boolean indicando si IA está habilitada para análisis avanzado
 * 
 * @example
 * // GET /api/v1/app/insights/spending
 * // GET /api/v1/app/insights/spending?profileId=507f1f77bcf86cd799439011&period=90days
 */
exports.getSpendingInsights = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { profileId, period = '30days' } = req.query;

  const insights = await insightsService.getSpendingInsights(userId, profileId, period);

  res.status(200).json({
    success: true,
    data: insights
  });
});
