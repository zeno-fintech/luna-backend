/**
 * @fileoverview Utilidad para manejar funciones asíncronas y capturar errores automáticamente
 * @module core/utils/asyncHandler
 */

/**
 * Wrapper para funciones asíncronas que captura errores automáticamente
 * 
 * Esta función envuelve controladores asíncronos para evitar tener que usar
 * try-catch en cada uno. Los errores se pasan automáticamente al middleware
 * de manejo de errores de Express.
 * 
 * @param {Function} fn - Función asíncrona que recibe (req, res, next)
 * @returns {Function} Middleware de Express que maneja la función asíncrona
 * 
 * @example
 * // Uso en un controlador
 * exports.getUsers = asyncHandler(async (req, res, next) => {
 *   const users = await User.find();
 *   res.json({ success: true, data: users });
 * });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
