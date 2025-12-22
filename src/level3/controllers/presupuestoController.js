const asyncHandler = require('@core/utils/asyncHandler');
const Presupuesto = require('@models/Presupuesto');
const Income = require('@models/Income');
const Transaction = require('@models/Transaction');
const Rule = require('@models/Rule');
const Profile = require('@models/Profile');
const Asset = require('@models/Asset');
const Debt = require('@models/Debt');

/**
 * @fileoverview Controlador de Presupuestos - Maneja CRUD de presupuestos
 * @module level3/controllers/presupuestoController
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
 * @route GET /api/v1/presupuestos?perfilID=xxx&año=2024&mes=1
 * @access Private (requiere autenticación)
 */
exports.getPresupuestos = asyncHandler(async (req, res, next) => {
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

  const presupuestos = await Presupuesto.find(query)
    .populate('reglas')
    .sort({ año: -1, mes: -1 });

  res.status(200).json({
    success: true,
    count: presupuestos.length,
    data: presupuestos
  });
});

/**
 * Obtiene un presupuesto específico
 * 
 * @route GET /api/v1/presupuestos/:id
 * @access Private (requiere autenticación)
 */
exports.getPresupuesto = asyncHandler(async (req, res, next) => {
  const presupuesto = await Presupuesto.findById(req.params.id)
    .populate('reglas');

  if (!presupuesto) {
    return res.status(404).json({
      success: false,
      message: 'Presupuesto no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, presupuesto.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este presupuesto'
    });
  }

  // Obtener ingresos y gastos del presupuesto
  const ingresos = await Income.find({ presupuestoID: presupuesto._id });
  const gastos = await Transaction.find({ 
    presupuestoID: presupuesto._id,
    tipo: 'Gasto'
  }).populate('categoriaID reglaID');

  // Obtener activos y pasivos asociados
  const activos = await Asset.find({ presupuestoID: presupuesto._id });
  const pasivos = await Debt.find({ presupuestoID: presupuesto._id });

  res.status(200).json({
    success: true,
    data: {
      ...presupuesto.toObject(),
      ingresosDetalle: ingresos,
      gastosDetalle: gastos,
      activos: activos,
      pasivos: pasivos
    }
  });
});

/**
 * Crea un nuevo presupuesto
 * 
 * @route POST /api/v1/presupuestos
 * @access Private (requiere autenticación)
 */
exports.createPresupuesto = asyncHandler(async (req, res, next) => {
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
  let monedaPresupuesto = moneda;
  if (!monedaPresupuesto) {
    const profile = await Profile.findById(perfilID);
    monedaPresupuesto = profile?.configuracion?.moneda || 'CLP';
  }

  // Generar id_mes
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const id_mes = `${meses[mes - 1]}-${año}`;

  // Verificar si ya existe un presupuesto para este mes
  const existingPresupuesto = await Presupuesto.findOne({
    perfilID,
    año: parseInt(año),
    mes: parseInt(mes)
  });

  if (existingPresupuesto) {
    return res.status(400).json({
      success: false,
      message: 'Ya existe un presupuesto para este mes'
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

  const presupuesto = await Presupuesto.create({
    perfilID,
    nombre,
    moneda: monedaPresupuesto,
    año: parseInt(año),
    mes: parseInt(mes),
    id_mes,
    porcentajeIngresos: porcentajeIngresos || 100,
    icono: iconoSugerido,
    imagen: imagen || null,
    color: color || '#3B82F6'
  });

  // Crear reglas por defecto (50%, 30%, 20%) si no existen reglas personalizadas
  const existingRules = await Rule.find({ presupuestoID: presupuesto._id });
  
  if (existingRules.length === 0) {
    const reglasDefault = [
      {
        presupuestoID: presupuesto._id,
        porcentaje: 50,
        nombre: 'Gastos Fijos',
        color: '#EF4444',
        icono: 'home'
      },
      {
        presupuestoID: presupuesto._id,
        porcentaje: 30,
        nombre: 'Gastos Variables',
        color: '#F59E0B',
        icono: 'shopping-cart'
      },
      {
        presupuestoID: presupuesto._id,
        porcentaje: 20,
        nombre: 'Ahorro',
        color: '#10B981',
        icono: 'piggy-bank'
      }
    ];

    const reglasCreadas = await Rule.insertMany(reglasDefault);
    
    // Agregar reglas al presupuesto
    presupuesto.reglas = reglasCreadas.map(r => r._id);
    await presupuesto.save();

    // Recalcular montos de cada regla
    for (const regla of reglasCreadas) {
      await regla.recalcularMontos();
    }
  }

  // Si hay presupuestos anteriores, copiar gastos fijos
  const previousPresupuesto = await Presupuesto.findOne({
    perfilID,
    $or: [
      { año: parseInt(año) - 1, mes: 12 },
      { año: parseInt(año), mes: parseInt(mes) - 1 }
    ]
  }).sort({ año: -1, mes: -1 });

  if (previousPresupuesto) {
    const gastosFijos = await Transaction.find({
      presupuestoID: previousPresupuesto._id,
      tipo: 'Gasto',
      esGastoFijo: true
    });

    // Copiar gastos fijos al nuevo presupuesto
    for (const gasto of gastosFijos) {
      await Transaction.create({
        perfilID,
        presupuestoID: presupuesto._id,
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

    // Recalcular totales del nuevo presupuesto
    await presupuesto.recalcularTotales();
  }

  res.status(201).json({
    success: true,
    data: presupuesto
  });
});

/**
 * Actualiza un presupuesto
 * 
 * @route PUT /api/v1/presupuestos/:id
 * @access Private (requiere autenticación)
 */
exports.updatePresupuesto = asyncHandler(async (req, res, next) => {
  let presupuesto = await Presupuesto.findById(req.params.id);

  if (!presupuesto) {
    return res.status(404).json({
      success: false,
      message: 'Presupuesto no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, presupuesto.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este presupuesto'
    });
  }

  presupuesto = await Presupuesto.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Recalcular totales si se actualizó
  await presupuesto.recalcularTotales();

  res.status(200).json({
    success: true,
    data: presupuesto
  });
});

/**
 * Elimina un presupuesto
 * 
 * @route DELETE /api/v1/presupuestos/:id
 * @access Private (requiere autenticación)
 */
exports.deletePresupuesto = asyncHandler(async (req, res, next) => {
  const presupuesto = await Presupuesto.findById(req.params.id);

  if (!presupuesto) {
    return res.status(404).json({
      success: false,
      message: 'Presupuesto no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, presupuesto.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este presupuesto'
    });
  }

  // Eliminar ingresos y reglas asociadas
  await Income.deleteMany({ presupuestoID: presupuesto._id });
  await Rule.deleteMany({ presupuestoID: presupuesto._id });
  
  // Desasociar transacciones, activos y pasivos
  await Transaction.updateMany(
    { presupuestoID: presupuesto._id },
    { $unset: { presupuestoID: 1 } }
  );
  await Asset.updateMany(
    { presupuestoID: presupuesto._id },
    { $unset: { presupuestoID: 1 } }
  );
  await Debt.updateMany(
    { presupuestoID: presupuesto._id },
    { $unset: { presupuestoID: 1 } }
  );

  await presupuesto.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Presupuesto eliminado'
  });
});

/**
 * Obtiene el totalizador de presupuestos
 * 
 * @route GET /api/v1/presupuestos/totalizador?perfilID=xxx
 * @access Private (requiere autenticación)
 */
exports.getTotalizador = asyncHandler(async (req, res, next) => {
  const { perfilID, año } = req.query;

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

  const presupuestos = await Presupuesto.find(query);

  const totalizador = {
    totalPresupuestos: presupuestos.length,
    totalIngresos: presupuestos.reduce((sum, p) => sum + (p.ingresos || 0), 0),
    totalGastos: presupuestos.reduce((sum, p) => sum + (p.gastos || 0), 0),
    totalSaldo: presupuestos.reduce((sum, p) => sum + (p.saldo || 0), 0),
    porMes: presupuestos.map(p => ({
      mes: p.mes,
      año: p.año,
      nombre: p.nombre,
      ingresos: p.ingresos,
      gastos: p.gastos,
      saldo: p.saldo
    }))
  };

  res.status(200).json({
    success: true,
    data: totalizador
  });
});

