const asyncHandler = require('@core/utils/asyncHandler');
const Currency = require('@models/Currency');

/**
 * @fileoverview Controlador de Monedas - Obtiene información de monedas y sus formatos
 * @module level3/controllers/currencyController
 */

/**
 * Obtiene todas las monedas activas con sus formatos
 * 
 * Este endpoint es público (no requiere autenticación) ya que la información
 * de monedas es general y no contiene datos sensibles.
 * 
 * @route GET /api/v1/currencies
 * @access Public
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - count: Número de monedas encontradas
 * - data: Array de objetos Currency con formato
 * 
 * @example
 * // GET /api/v1/currencies
 * // Retorna todas las monedas activas con sus formatos
 */
exports.getCurrencies = asyncHandler(async (req, res, next) => {
  const currencies = await Currency.find({ isActive: true })
    .select('codigo nombre simbolo formato isActive')
    .sort({ codigo: 1 });

  res.status(200).json({
    success: true,
    count: currencies.length,
    data: currencies
  });
});

/**
 * Obtiene una moneda específica por su código
 * 
 * @route GET /api/v1/currencies/:codigo
 * @access Public
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.codigo - Código de la moneda (ej: "CLP", "USD")
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Currency completo
 * 
 * @throws {404} Si la moneda no existe
 * 
 * @example
 * // GET /api/v1/currencies/CLP
 */
exports.getCurrency = asyncHandler(async (req, res, next) => {
  const currency = await Currency.findOne({ 
    codigo: req.params.codigo.toUpperCase(),
    isActive: true 
  });

  if (!currency) {
    return res.status(404).json({
      success: false,
      message: 'Moneda no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: currency
  });
});

