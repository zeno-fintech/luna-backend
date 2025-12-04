const asyncHandler = require('@core/utils/asyncHandler');
const FinancialBoard = require('@models/FinancialBoard');
const Income = require('@models/Income');
const Transaction = require('@models/Transaction');
const Rule = require('@models/Rule');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Tableros Financieros - Maneja CRUD de tableros financieros
 * @module level3/controllers/financialBoardController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todos los tableros financieros de un perfil
 * 
 * @route GET /api/v1/financial-boards?perfilID=xxx&año=2024&mes=1
 * @access Private (requiere autenticación)
 */
exports.getFinancialBoards = asyncHandler(async (req, res, next) => {
  const { perfilID, año, mes } = req.query;

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

  const boards = await FinancialBoard.find(query)
    .populate('reglas')
    .sort({ año: -1, mes: -1 });

  res.status(200).json({
    success: true,
    count: boards.length,
    data: boards
  });
});

/**
 * Obtiene un tablero financiero específico
 * 
 * @route GET /api/v1/financial-boards/:id
 * @access Private (requiere autenticación)
 */
exports.getFinancialBoard = asyncHandler(async (req, res, next) => {
  const board = await FinancialBoard.findById(req.params.id)
    .populate('reglas');

  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'Tablero financiero no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, board.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este tablero'
    });
  }

  // Obtener ingresos y gastos del tablero
  const ingresos = await Income.find({ tableroID: board._id });
  const gastos = await Transaction.find({ 
    tableroID: board._id,
    tipo: 'Gasto'
  }).populate('categoriaID reglaID');

  res.status(200).json({
    success: true,
    data: {
      ...board.toObject(),
      ingresosDetalle: ingresos,
      gastosDetalle: gastos
    }
  });
});

/**
 * Crea un nuevo tablero financiero
 * 
 * @route POST /api/v1/financial-boards
 * @access Private (requiere autenticación)
 */
exports.createFinancialBoard = asyncHandler(async (req, res, next) => {
  const { perfilID, nombre, moneda, año, mes, porcentajeIngresos, icono, imagen, color } = req.body;

  if (!perfilID || !nombre || !año || !mes) {
    return res.status(400).json({
      success: false,
      message: 'perfilID, nombre, año y mes son requeridos'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  // Obtener moneda del perfil si no se especifica
  let monedaTablero = moneda;
  if (!monedaTablero) {
    const profile = await Profile.findById(perfilID);
    monedaTablero = profile?.configuracion?.moneda || 'CLP';
  }

  // Generar id_mes
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const id_mes = `${meses[mes - 1]}-${año}`;

  // Verificar si ya existe un tablero para este mes
  const existingBoard = await FinancialBoard.findOne({
    perfilID,
    año: parseInt(año),
    mes: parseInt(mes)
  });

  if (existingBoard) {
    return res.status(400).json({
      success: false,
      message: 'Ya existe un tablero financiero para este mes'
    });
  }

  // Sugerir icono automáticamente si no se proporciona
  let iconoSugerido = icono;
  if (!iconoSugerido) {
    const aiService = require('@core/services/ai/aiService');
    try {
      iconoSugerido = await aiService.suggestBoardIcon(nombre);
    } catch (error) {
      // Si falla la sugerencia, usar icono por defecto
      iconoSugerido = 'wallet';
    }
  }

  const board = await FinancialBoard.create({
    perfilID,
    nombre,
    moneda: monedaTablero,
    año: parseInt(año),
    mes: parseInt(mes),
    id_mes,
    porcentajeIngresos: porcentajeIngresos || 100,
    icono: iconoSugerido,
    imagen: imagen || null,
    color: color || '#3B82F6'
  });

  // Crear reglas por defecto (50%, 30%, 20%) si no existen reglas personalizadas
  const Rule = require('@models/Rule');
  const existingRules = await Rule.find({ tableroID: board._id });
  
  if (existingRules.length === 0) {
    const reglasDefault = [
      {
        tableroID: board._id,
        porcentaje: 50,
        nombre: 'Gastos Fijos',
        color: '#EF4444',
        icono: 'home'
      },
      {
        tableroID: board._id,
        porcentaje: 30,
        nombre: 'Gastos Variables',
        color: '#F59E0B',
        icono: 'shopping-cart'
      },
      {
        tableroID: board._id,
        porcentaje: 20,
        nombre: 'Ahorro',
        color: '#10B981',
        icono: 'piggy-bank'
      }
    ];

    const reglasCreadas = await Rule.insertMany(reglasDefault);
    
    // Agregar reglas al tablero
    board.reglas = reglasCreadas.map(r => r._id);
    await board.save();

    // Recalcular montos de cada regla
    for (const regla of reglasCreadas) {
      await regla.recalcularMontos();
    }
  }

  // Si hay tableros anteriores, copiar gastos fijos
  const previousBoard = await FinancialBoard.findOne({
    perfilID,
    $or: [
      { año: parseInt(año) - 1, mes: 12 },
      { año: parseInt(año), mes: parseInt(mes) - 1 }
    ]
  }).sort({ año: -1, mes: -1 });

  if (previousBoard) {
    const gastosFijos = await Transaction.find({
      tableroID: previousBoard._id,
      tipo: 'Gasto',
      esGastoFijo: true
    });

    // Copiar gastos fijos al nuevo tablero
    for (const gasto of gastosFijos) {
      await Transaction.create({
        perfilID,
        tableroID: board._id,
        tipo: 'Gasto',
        monto: gasto.monto,
        detalle: gasto.detalle,
        categoriaID: gasto.categoriaID,
        reglaID: gasto.reglaID,
        metodoPago: gasto.metodoPago,
        esGastoFijo: true,
        fecha: new Date(año, mes - 1, gasto.fecha.getDate())
      });
    }

    // Recalcular totales del nuevo tablero
    await board.recalcularTotales();
  }

  res.status(201).json({
    success: true,
    data: board
  });
});

/**
 * Actualiza un tablero financiero
 * 
 * @route PUT /api/v1/financial-boards/:id
 * @access Private (requiere autenticación)
 */
exports.updateFinancialBoard = asyncHandler(async (req, res, next) => {
  let board = await FinancialBoard.findById(req.params.id);

  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'Tablero financiero no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, board.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este tablero'
    });
  }

  board = await FinancialBoard.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Recalcular totales si se actualizó
  await board.recalcularTotales();

  res.status(200).json({
    success: true,
    data: board
  });
});

/**
 * Elimina un tablero financiero
 * 
 * @route DELETE /api/v1/financial-boards/:id
 * @access Private (requiere autenticación)
 */
exports.deleteFinancialBoard = asyncHandler(async (req, res, next) => {
  const board = await FinancialBoard.findById(req.params.id);

  if (!board) {
    return res.status(404).json({
      success: false,
      message: 'Tablero financiero no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, board.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este tablero'
    });
  }

  // Eliminar ingresos y reglas asociadas
  await Income.deleteMany({ tableroID: board._id });
  await Rule.deleteMany({ tableroID: board._id });
  
  // Eliminar transacciones asociadas (o solo desasociarlas)
  await Transaction.updateMany(
    { tableroID: board._id },
    { $unset: { tableroID: 1 } }
  );

  await board.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Tablero financiero eliminado'
  });
});

