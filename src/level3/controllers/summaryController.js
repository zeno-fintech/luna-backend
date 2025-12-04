const asyncHandler = require('@core/utils/asyncHandler');
const financialSummaryService = require('@level3/services/financialSummaryService');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Summary - Proporciona resúmenes financieros completos (Nivel 3 - Usuario)
 * @module level3/controllers/summaryController
 */

/**
 * Obtiene un resumen financiero completo del usuario
 * 
 * Retorna un resumen completo de la situación financiera del usuario incluyendo
 * patrimonio neto, cash flow, deudas, activos, score financiero, etc.
 * 
 * @route GET /api/v1/app/summary
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.profileId] - ID del perfil del cual obtener el resumen (opcional, usa el primero si no se especifica)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con resumen financiero completo que incluye:
 *   - netWorth: Patrimonio neto (activos - pasivos)
 *   - cashFlow: Flujo de caja (ingresos, gastos, neto)
 *   - debts: Información de deudas (total, cantidad, próximos pagos)
 *   - assets: Información de activos (total, cantidad)
 *   - financialScore: Score financiero (0-100) y grado (A-F)
 *   - savings: Información de ahorros
 * 
 * @throws {404} Si el usuario no tiene perfiles
 * 
 * @example
 * // GET /api/v1/app/summary
 * // GET /api/v1/app/summary?profileId=507f1f77bcf86cd799439011
 */
exports.getFinancialSummary = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { profileId } = req.query;

  const summary = await financialSummaryService.getFinancialSummary(userId, profileId);

  res.status(200).json({
    success: true,
    data: summary
  });
});

/**
 * Obtiene solo el patrimonio neto (net worth) del usuario
 * 
 * Calcula y retorna el patrimonio neto que es la diferencia entre
 * activos totales y pasivos (deudas) totales.
 * 
 * @route GET /api/v1/app/net-worth
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.profileId] - ID del perfil (opcional, usa el primero si no se especifica)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con patrimonio neto que incluye:
 *   - netWorth: Valor del patrimonio neto (número)
 *   - assets: Total de activos
 *   - liabilities: Total de pasivos/deudas
 *   - breakdown: Desglose detallado de activos y pasivos
 * 
 * @throws {404} Si el usuario no tiene perfiles
 * 
 * @example
 * // GET /api/v1/app/net-worth
 * // GET /api/v1/app/net-worth?profileId=507f1f77bcf86cd799439011
 */
exports.getNetWorth = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { profileId } = req.query;

  const profiles = await Profile.find({ usuarioID: userId });
  const profileIds = profiles.map(p => p._id);
  const targetProfileId = profileId || profileIds[0];

  if (!targetProfileId) {
    return res.status(404).json({
      success: false,
      message: 'No se encontró perfil para el usuario'
    });
  }

  const netWorth = await financialSummaryService.calculateNetWorth(targetProfileId);

  res.status(200).json({
    success: true,
    data: netWorth
  });
});

/**
 * Obtiene solo el score financiero del usuario
 * 
 * Calcula y retorna el score financiero (0-100) basado en múltiples factores
 * como ahorros, deudas, ingresos, gastos, etc. También incluye un grado (A-F).
 * 
 * @route GET /api/v1/app/financial-score
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.profileId] - ID del perfil (opcional, usa el primero si no se especifica)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con score financiero que incluye:
 *   - score: Score numérico (0-100)
 *   - grade: Grado del score ('A', 'B', 'C', 'D', 'F')
 *   - factors: Factores que influyen en el score
 *   - recommendations: Recomendaciones para mejorar el score
 * 
 * @throws {404} Si el usuario no tiene perfiles
 * 
 * @example
 * // GET /api/v1/app/financial-score
 * // GET /api/v1/app/financial-score?profileId=507f1f77bcf86cd799439011
 */
exports.getFinancialScore = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { profileId } = req.query;

  const profiles = await Profile.find({ usuarioID: userId });
  const profileIds = profiles.map(p => p._id);
  const targetProfileId = profileId || profileIds[0];

  if (!targetProfileId) {
    return res.status(404).json({
      success: false,
      message: 'No se encontró perfil para el usuario'
    });
  }

  const score = await financialSummaryService.calculateFinancialScore(targetProfileId, userId);

  res.status(200).json({
    success: true,
    data: score
  });
});
