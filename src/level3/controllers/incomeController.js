const asyncHandler = require('@core/utils/asyncHandler');
const Income = require('@models/Income');
const FinancialBoard = require('@models/FinancialBoard');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Ingresos - Maneja CRUD de ingresos
 * @module level3/controllers/incomeController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todos los ingresos de un perfil (opcionalmente filtrados por tablero)
 * 
 * @route GET /api/v1/incomes?perfilID=xxx&tableroID=xxx&tipo=recurrente
 * @access Private (requiere autenticación)
 */
exports.getIncomes = asyncHandler(async (req, res, next) => {
  const { perfilID, tableroID, tipo } = req.query;

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
  if (tableroID) query.tableroID = tableroID;
  if (tipo) query.tipo = tipo;

  const incomes = await Income.find(query)
    .populate('tableroID', 'nombre moneda')
    .sort({ fecha: -1 });

  res.status(200).json({
    success: true,
    count: incomes.length,
    data: incomes
  });
});

/**
 * Obtiene un ingreso específico
 * 
 * @route GET /api/v1/incomes/:id
 * @access Private (requiere autenticación)
 */
exports.getIncome = asyncHandler(async (req, res, next) => {
  const income = await Income.findById(req.params.id)
    .populate('tableroID', 'nombre moneda');

  if (!income) {
    return res.status(404).json({
      success: false,
      message: 'Ingreso no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, income.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este ingreso'
    });
  }

  res.status(200).json({
    success: true,
    data: income
  });
});

/**
 * Crea un nuevo ingreso
 * 
 * Si tableroID está definido, va directo a ese tablero.
 * Si no, se divide entre los tableros activos del mes según porcentajeDistribucion.
 * Si hay solo 1 tablero, 100% va a ese tablero automáticamente.
 * 
 * @route POST /api/v1/incomes
 * @access Private (requiere autenticación)
 */
exports.createIncome = asyncHandler(async (req, res, next) => {
  const { perfilID, tableroID, glosa, monto, fecha, tipo, porcentajeDistribucion } = req.body;

  if (!perfilID || !glosa || !monto) {
    return res.status(400).json({
      success: false,
      message: 'perfilID, glosa y monto son requeridos'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  // Si tableroID está definido, crear ingreso directo
  if (tableroID) {
    const board = await FinancialBoard.findById(tableroID);
    if (!board || board.perfilID.toString() !== perfilID) {
      return res.status(400).json({
        success: false,
        message: 'Tablero no válido o no pertenece al perfil'
      });
    }

    const income = await Income.create({
      perfilID,
      tableroID,
      glosa,
      monto,
      fecha: fecha || new Date(),
      tipo: tipo || 'ocasional'
    });

    // Actualizar totales del tablero
    await board.recalcularTotales();

    return res.status(201).json({
      success: true,
      data: income
    });
  }

  // Si no hay tableroID, crear ingreso sin asignar (el usuario lo asignará manualmente)
  // NO se divide automáticamente entre tableros (solo si el usuario lo solicita explícitamente)
  const income = await Income.create({
    perfilID,
    glosa,
    monto,
    fecha: fecha || new Date(),
    tipo: tipo || 'ocasional',
    porcentajeDistribucion: porcentajeDistribucion || null
  });

  res.status(201).json({
    success: true,
    data: income,
    message: 'Ingreso creado. Asigna un tableroID si deseas asociarlo a un tablero específico.'
  });
});

/**
 * Actualiza un ingreso
 * 
 * @route PUT /api/v1/incomes/:id
 * @access Private (requiere autenticación)
 */
exports.updateIncome = asyncHandler(async (req, res, next) => {
  let income = await Income.findById(req.params.id);

  if (!income) {
    return res.status(404).json({
      success: false,
      message: 'Ingreso no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, income.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este ingreso'
    });
  }

  const oldTableroID = income.tableroID;

  income = await Income.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Recalcular totales de tableros afectados
  if (oldTableroID) {
    const oldBoard = await FinancialBoard.findById(oldTableroID);
    if (oldBoard) await oldBoard.recalcularTotales();
  }

  if (income.tableroID && income.tableroID.toString() !== oldTableroID?.toString()) {
    const newBoard = await FinancialBoard.findById(income.tableroID);
    if (newBoard) await newBoard.recalcularTotales();
  }

  res.status(200).json({
    success: true,
    data: income
  });
});

/**
 * Elimina un ingreso
 * 
 * @route DELETE /api/v1/incomes/:id
 * @access Private (requiere autenticación)
 */
exports.deleteIncome = asyncHandler(async (req, res, next) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    return res.status(404).json({
      success: false,
      message: 'Ingreso no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, income.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este ingreso'
    });
  }

  const tableroID = income.tableroID;

  await income.deleteOne();

  // Recalcular totales del tablero si tenía uno asignado
  if (tableroID) {
    const board = await FinancialBoard.findById(tableroID);
    if (board) await board.recalcularTotales();
  }

  res.status(200).json({
    success: true,
    message: 'Ingreso eliminado'
  });
});

