const asyncHandler = require('@core/utils/asyncHandler');
const aiService = require('@core/services/ai/aiService');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Sugerencias IA - Proporciona sugerencias inteligentes
 * @module level3/controllers/aiSuggestionsController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Sugiere un icono para un tablero financiero basado en su nombre
 * 
 * @route GET /api/v1/ai/suggest-board-icon?nombre=Casa
 * @access Private (requiere autenticación)
 */
exports.suggestBoardIcon = asyncHandler(async (req, res, next) => {
  const { nombre } = req.query;

  if (!nombre) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro nombre es requerido'
    });
  }

  const icono = await aiService.suggestBoardIcon(nombre);

  res.status(200).json({
    success: true,
    data: {
      nombre,
      iconoSugerido: icono
    }
  });
});

/**
 * Sugiere gastos que deberían marcarse como fijos
 * 
 * Analiza los gastos de los últimos meses y sugiere cuáles deberían
 * marcarse como fijos si se repiten 2-3 meses consecutivos.
 * 
 * @route GET /api/v1/ai/suggest-fixed-expenses?perfilID=xxx&presupuestoID=xxx
 * @access Private (requiere autenticación)
 */
exports.suggestFixedExpenses = asyncHandler(async (req, res, next) => {
  const { perfilID, presupuestoID } = req.query;

  if (!perfilID) {
    return res.status(400).json({
      success: false,
      message: 'perfilID es requerido'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  const sugerencias = await aiService.suggestFixedExpenses(perfilID, presupuestoID);

  res.status(200).json({
    success: true,
    count: sugerencias.length,
    data: sugerencias
  });
});

