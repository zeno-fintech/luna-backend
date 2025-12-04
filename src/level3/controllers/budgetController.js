const asyncHandler = require('@core/utils/asyncHandler');
const Budget = require('@models/Budget');
const Transaction = require('@models/Transaction');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Presupuestos - Maneja CRUD de presupuestos
 * @module level3/controllers/budgetController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todos los presupuestos de un perfil
 * 
 * @route GET /api/v1/budgets?perfilID=xxx&año=2024&mes=1&categoria=Gastos
 * @access Private (requiere autenticación)
 */
exports.getBudgets = asyncHandler(async (req, res, next) => {
  const { perfilID, año, mes, categoria, periodo } = req.query;

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
  if (año) query.año = parseInt(año);
  if (mes) query.mes = parseInt(mes);
  if (categoria) query.categoria = categoria;
  if (periodo) query.periodo = periodo;

  const budgets = await Budget.find(query)
    .populate('categoriaID', 'nombre icono color')
    .sort({ año: -1, mes: -1 });

  res.status(200).json({
    success: true,
    count: budgets.length,
    data: budgets
  });
});

/**
 * Obtiene un presupuesto específico
 * 
 * @route GET /api/v1/budgets/:id
 * @access Private (requiere autenticación)
 */
exports.getBudget = asyncHandler(async (req, res, next) => {
  const budget = await Budget.findById(req.params.id)
    .populate('categoriaID', 'nombre icono color');

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: 'Presupuesto no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, budget.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este presupuesto'
    });
  }

  res.status(200).json({
    success: true,
    data: budget
  });
});

/**
 * Crea un nuevo presupuesto
 * 
 * @route POST /api/v1/budgets
 * @access Private (requiere autenticación)
 */
exports.createBudget = asyncHandler(async (req, res, next) => {
  const { perfilID, periodo, categoria, montoPresupuestado, año, mes, categoriaID } = req.body;

  if (!perfilID || !periodo || !categoria || !montoPresupuestado || !año) {
    return res.status(400).json({
      success: false,
      message: 'perfilID, periodo, categoria, montoPresupuestado y año son requeridos'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  // Si el periodo es "Mes", el mes es requerido
  if (periodo === 'Mes' && !mes) {
    return res.status(400).json({
      success: false,
      message: 'mes es requerido cuando periodo es "Mes"'
    });
  }

  const budget = await Budget.create({
    perfilID,
    periodo,
    categoria,
    montoPresupuestado,
    año: parseInt(año),
    mes: mes ? parseInt(mes) : null,
    categoriaID: categoriaID || null,
    montoReal: 0,
    desviacion: 0
  });

  // Recalcular monto real y desviación
  await budget.recalcularMontos();

  const populatedBudget = await Budget.findById(budget._id)
    .populate('categoriaID', 'nombre icono color');

  res.status(201).json({
    success: true,
    data: populatedBudget
  });
});

/**
 * Actualiza un presupuesto
 * 
 * @route PUT /api/v1/budgets/:id
 * @access Private (requiere autenticación)
 */
exports.updateBudget = asyncHandler(async (req, res, next) => {
  let budget = await Budget.findById(req.params.id);

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: 'Presupuesto no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, budget.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este presupuesto'
    });
  }

  budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Recalcular monto real y desviación
  await budget.recalcularMontos();

  const populatedBudget = await Budget.findById(budget._id)
    .populate('categoriaID', 'nombre icono color');

  res.status(200).json({
    success: true,
    data: populatedBudget
  });
});

/**
 * Elimina un presupuesto
 * 
 * @route DELETE /api/v1/budgets/:id
 * @access Private (requiere autenticación)
 */
exports.deleteBudget = asyncHandler(async (req, res, next) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    return res.status(404).json({
      success: false,
      message: 'Presupuesto no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, budget.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este presupuesto'
    });
  }

  await budget.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Presupuesto eliminado'
  });
});

