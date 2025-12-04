const asyncHandler = require('@core/utils/asyncHandler');
const Savings = require('@models/Savings');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Ahorros - Maneja CRUD de ahorros e inversiones
 * @module level3/controllers/savingsController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todos los ahorros de un perfil
 * 
 * @route GET /api/v1/savings?perfilID=xxx&tipo=Ahorro
 * @access Private (requiere autenticación)
 */
exports.getSavings = asyncHandler(async (req, res, next) => {
  const { perfilID, tipo } = req.query;

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

  const query = { perfilID };
  if (tipo) query.tipo = tipo;

  const savings = await Savings.find(query)
    .populate('categoriaID', 'nombre icono color')
    .populate('reglaID', 'nombre porcentaje')
    .sort({ fecha: -1 });

  // Calcular totales
  const totalAhorros = savings
    .filter(s => s.tipo === 'Ahorro')
    .reduce((sum, s) => sum + s.monto, 0);
  
  const totalInversiones = savings
    .filter(s => s.tipo === 'Inversión')
    .reduce((sum, s) => sum + s.monto, 0);

  res.status(200).json({
    success: true,
    count: savings.length,
    totales: {
      ahorros: totalAhorros,
      inversiones: totalInversiones,
      total: totalAhorros + totalInversiones
    },
    data: savings
  });
});

/**
 * Obtiene un ahorro específico
 * 
 * @route GET /api/v1/savings/:id
 * @access Private (requiere autenticación)
 */
exports.getSaving = asyncHandler(async (req, res, next) => {
  const saving = await Savings.findById(req.params.id)
    .populate('categoriaID', 'nombre icono color')
    .populate('reglaID', 'nombre porcentaje');

  if (!saving) {
    return res.status(404).json({
      success: false,
      message: 'Ahorro no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, saving.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este ahorro'
    });
  }

  res.status(200).json({
    success: true,
    data: saving
  });
});

/**
 * Crea un nuevo ahorro
 * 
 * @route POST /api/v1/savings
 * @access Private (requiere autenticación)
 */
exports.createSaving = asyncHandler(async (req, res, next) => {
  const { perfilID, tipo, monto, fecha, categoriaID, reglaID, descripcion, tasaRendimiento } = req.body;

  if (!perfilID || !tipo || !monto) {
    return res.status(400).json({
      success: false,
      message: 'perfilID, tipo y monto son requeridos'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  const saving = await Savings.create({
    perfilID,
    tipo,
    monto,
    fecha: fecha || new Date(),
    categoriaID: categoriaID || null,
    reglaID: reglaID || null,
    descripcion: descripcion || null,
    tasaRendimiento: tasaRendimiento || 0
  });

  const populatedSaving = await Savings.findById(saving._id)
    .populate('categoriaID', 'nombre icono color')
    .populate('reglaID', 'nombre porcentaje');

  res.status(201).json({
    success: true,
    data: populatedSaving
  });
});

/**
 * Actualiza un ahorro
 * 
 * @route PUT /api/v1/savings/:id
 * @access Private (requiere autenticación)
 */
exports.updateSaving = asyncHandler(async (req, res, next) => {
  let saving = await Savings.findById(req.params.id);

  if (!saving) {
    return res.status(404).json({
      success: false,
      message: 'Ahorro no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, saving.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este ahorro'
    });
  }

  saving = await Savings.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('categoriaID', 'nombre icono color')
    .populate('reglaID', 'nombre porcentaje');

  res.status(200).json({
    success: true,
    data: saving
  });
});

/**
 * Elimina un ahorro
 * 
 * @route DELETE /api/v1/savings/:id
 * @access Private (requiere autenticación)
 */
exports.deleteSaving = asyncHandler(async (req, res, next) => {
  const saving = await Savings.findById(req.params.id);

  if (!saving) {
    return res.status(404).json({
      success: false,
      message: 'Ahorro no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, saving.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este ahorro'
    });
  }

  await saving.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Ahorro eliminado'
  });
});

