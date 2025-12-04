const asyncHandler = require('@core/utils/asyncHandler');
const Rule = require('@models/Rule');
const FinancialBoard = require('@models/FinancialBoard');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Reglas - Maneja CRUD de reglas de presupuesto
 * @module level3/controllers/ruleController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todas las reglas de un tablero financiero
 * 
 * @route GET /api/v1/rules?tableroID=xxx
 * @access Private (requiere autenticación)
 */
exports.getRules = asyncHandler(async (req, res, next) => {
  const { tableroID } = req.query;

  if (!tableroID) {
    return res.status(400).json({
      success: false,
      message: 'tableroID es requerido'
    });
  }

  // Validar que el tablero existe y pertenece al usuario
  const board = await FinancialBoard.findById(tableroID);
  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'Tablero financiero no encontrado'
    });
  }

  if (!(await validateProfileOwnership(req.user.id, board.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este tablero'
    });
  }

  const rules = await Rule.find({ tableroID })
    .sort({ porcentaje: -1 });

  // Calcular total de porcentajes
  const totalPorcentaje = rules.reduce((sum, r) => sum + r.porcentaje, 0);
  const isValid = totalPorcentaje === 100 && rules.length >= 2 && rules.length <= 4;

  res.status(200).json({
    success: true,
    count: rules.length,
    totalPorcentaje,
    isValid, // true si suma 100% y está entre 2-4 reglas
    canAddMore: rules.length < 4,
    canDelete: rules.length > 2,
    data: rules
  });
});

/**
 * Obtiene una regla específica
 * 
 * @route GET /api/v1/rules/:id
 * @access Private (requiere autenticación)
 */
exports.getRule = asyncHandler(async (req, res, next) => {
  const rule = await Rule.findById(req.params.id)
    .populate('tableroID', 'nombre moneda');

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: 'Regla no encontrada'
    });
  }

  // Validar propiedad del tablero
  const board = await FinancialBoard.findById(rule.tableroID);
  if (!(await validateProfileOwnership(req.user.id, board.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a esta regla'
    });
  }

  res.status(200).json({
    success: true,
    data: rule
  });
});

/**
 * Crea una nueva regla de presupuesto
 * 
 * @route POST /api/v1/rules
 * @access Private (requiere autenticación)
 */
exports.createRule = asyncHandler(async (req, res, next) => {
  const { tableroID, porcentaje, nombre, color, icono, imagen } = req.body;

  if (!tableroID || !porcentaje || !nombre) {
    return res.status(400).json({
      success: false,
      message: 'tableroID, porcentaje y nombre son requeridos'
    });
  }

  // Validar que el tablero existe y pertenece al usuario
  const board = await FinancialBoard.findById(tableroID);
  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'Tablero financiero no encontrado'
    });
  }

  if (!(await validateProfileOwnership(req.user.id, board.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este tablero'
    });
  }

  // Validar cantidad de reglas (mínimo 2, máximo 4)
  const existingRules = await Rule.find({ tableroID });
  
  if (existingRules.length >= 4) {
    return res.status(400).json({
      success: false,
      message: 'No se pueden crear más de 4 reglas por tablero'
    });
  }

  // Validar que el porcentaje no exceda 100% cuando se sume con otras reglas
  const totalPorcentaje = existingRules.reduce((sum, r) => sum + r.porcentaje, 0);
  const nuevoTotal = totalPorcentaje + porcentaje;
  
  if (nuevoTotal > 100) {
    return res.status(400).json({
      success: false,
      message: `El porcentaje total de las reglas no puede exceder 100%. Actual: ${totalPorcentaje}%, intentando agregar: ${porcentaje}%`
    });
  }

  const rule = await Rule.create({
    tableroID,
    porcentaje,
    nombre: nombre.trim(),
    color: color || '#000000',
    icono: icono || null,
    imagen: imagen || null
  });

  // Recalcular montos de la regla
  await rule.recalcularMontos();

  // Agregar la regla al tablero
  board.reglas.push(rule._id);
  await board.save();

  // Verificar si el total suma 100% después de crear
  const allRules = await Rule.find({ tableroID });
  const finalTotalPorcentaje = allRules.reduce((sum, r) => sum + r.porcentaje, 0);
  const isValid = finalTotalPorcentaje === 100 && allRules.length >= 2 && allRules.length <= 4;

  res.status(201).json({
    success: true,
    data: rule,
    totalPorcentaje: finalTotalPorcentaje,
    isValid,
    message: isValid 
      ? 'Regla creada correctamente' 
      : `Regla creada. Advertencia: El total actual es ${finalTotalPorcentaje}%. Debe sumar exactamente 100%.`
  });
});

/**
 * Actualiza una regla
 * 
 * @route PUT /api/v1/rules/:id
 * @access Private (requiere autenticación)
 */
exports.updateRule = asyncHandler(async (req, res, next) => {
  let rule = await Rule.findById(req.params.id);

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: 'Regla no encontrada'
    });
  }

  // Validar propiedad del tablero
  const board = await FinancialBoard.findById(rule.tableroID);
  if (!(await validateProfileOwnership(req.user.id, board.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a esta regla'
    });
  }

  // Si se actualiza el porcentaje, validar que no exceda 100%
  if (req.body.porcentaje !== undefined) {
    const existingRules = await Rule.find({ 
      tableroID: rule.tableroID,
      _id: { $ne: rule._id }
    });
    const totalPorcentaje = existingRules.reduce((sum, r) => sum + r.porcentaje, 0);
    const nuevoTotal = totalPorcentaje + req.body.porcentaje;
    
    if (nuevoTotal > 100) {
      return res.status(400).json({
        success: false,
        message: `El porcentaje total de las reglas no puede exceder 100%. Actual: ${totalPorcentaje}%, intentando actualizar a: ${req.body.porcentaje}%`
      });
    }
  }

  rule = await Rule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Recalcular montos
  await rule.recalcularMontos();

  // Verificar si el total suma 100% después de actualizar
  const allRules = await Rule.find({ tableroID: rule.tableroID });
  const finalTotalPorcentaje = allRules.reduce((sum, r) => sum + r.porcentaje, 0);
  const isValid = finalTotalPorcentaje === 100 && allRules.length >= 2 && allRules.length <= 4;

  res.status(200).json({
    success: true,
    data: rule,
    totalPorcentaje: finalTotalPorcentaje,
    isValid,
    message: isValid 
      ? 'Regla actualizada correctamente' 
      : `Regla actualizada. Advertencia: El total actual es ${finalTotalPorcentaje}%. Debe sumar exactamente 100%.`
  });
});

/**
 * Elimina una regla
 * 
 * @route DELETE /api/v1/rules/:id
 * @access Private (requiere autenticación)
 */
exports.deleteRule = asyncHandler(async (req, res, next) => {
  const rule = await Rule.findById(req.params.id);

  if (!rule) {
    return res.status(404).json({
      success: false,
      message: 'Regla no encontrada'
    });
  }

  // Validar propiedad del tablero
  const board = await FinancialBoard.findById(rule.tableroID);
  if (!(await validateProfileOwnership(req.user.id, board.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a esta regla'
    });
  }

  // Validar que no quede menos de 2 reglas
  const remainingRules = await Rule.find({ 
    tableroID: rule.tableroID,
    _id: { $ne: rule._id }
  });

  if (remainingRules.length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Debe haber al menos 2 reglas por tablero. No se puede eliminar esta regla.'
    });
  }

  // Remover la regla del tablero
  board.reglas = board.reglas.filter(r => r.toString() !== rule._id.toString());
  await board.save();

  await rule.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Regla eliminada'
  });
});

