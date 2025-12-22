const asyncHandler = require('@core/utils/asyncHandler');
const Debt = require('@models/Debt');
const Payment = require('@models/Payment');
const Profile = require('@models/Profile');
const debtLevelService = require('@level3/services/debtLevelService');

/**
 * @fileoverview Controlador de Deudas - Maneja CRUD de deudas y pagos
 * @module level3/controllers/debtController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todas las deudas de un perfil con filtros opcionales
 * 
 * @route GET /api/v1/debts?perfilID=xxx&estado=Activa&tipo=Bancaria
 * @access Private (requiere autenticación)
 * 
 * @param {string} req.query.perfilID - ID del perfil (requerido)
 * @param {string} [req.query.estado] - Filtrar por estado: 'Activa', 'Pagada', 'Vencida'
 * @param {string} [req.query.tipo] - Filtrar por tipo: 'Personal', 'Institucional', 'Bancaria', 'Comercial'
 */
exports.getDebts = asyncHandler(async (req, res, next) => {
  const { perfilID, estado, tipo } = req.query;

  if (!perfilID) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro perfilID es requerido'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado o no pertenece al usuario'
    });
  }

  // Construir query con filtros
  const query = { perfilID };
  if (estado) {
    query.estado = estado;
  }
  if (tipo) {
    query.tipo = tipo;
  }

  const debts = await Debt.find(query).sort({ fechaInicio: -1 });

  res.status(200).json({
    success: true,
    count: debts.length,
    data: debts
  });
});

/**
 * Obtiene una deuda específica con sus pagos
 * 
 * @route GET /api/v1/debts/:id
 * @access Private (requiere autenticación)
 */
exports.getDebt = asyncHandler(async (req, res, next) => {
  const debt = await Debt.findById(req.params.id).populate('perfilID');

  if (!debt) {
    return res.status(404).json({
      success: false,
      message: 'Deuda no encontrada'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (debt.perfilID.usuarioID.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para acceder a esta deuda'
    });
  }

  // Obtener pagos asociados
  const payments = await Payment.find({ deudaID: debt._id })
    .sort({ numeroCuota: 1, fecha: 1 });

  res.status(200).json({
    success: true,
    data: {
      debt,
      payments,
      summary: {
        totalPagado: debt.saldoPagado,
        totalPendiente: debt.saldoPendiente,
        cuotasPagadas: payments.filter(p => p.estado === 'pagado').length,
        cuotasPendientes: payments.filter(p => p.estado === 'pendiente').length,
        cuotasVencidas: payments.filter(p => p.estado === 'vencido').length
      }
    }
  });
});

/**
 * Crea una nueva deuda
 * 
 * Calcula automáticamente montoCuota y numeroCuotas según la lógica:
 * - Si tiene montoTotal y numeroCuotas → calcula montoCuota
 * - Si tiene abonoMensual sin montoTotal → usa abonoMensual como montoCuota
 * - Si tiene montoTotal y abonoMensual → calcula numeroCuotas
 * 
 * @route POST /api/v1/debts
 * @access Private (requiere autenticación)
 */
exports.createDebt = asyncHandler(async (req, res, next) => {
  const { perfilID, montoTotal, numeroCuotas, abonoMensual } = req.body;

  if (!perfilID) {
    return res.status(400).json({
      success: false,
      message: 'El perfilID es requerido'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado o no pertenece al usuario'
    });
  }

  // Validar que tenga al menos montoTotal o abonoMensual
  if (!montoTotal && !abonoMensual) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar montoTotal o abonoMensual'
    });
  }

  // Calcular valores automáticamente
  let montoCuotaCalculado = 0;
  let numeroCuotasCalculado = null;
  let saldoPendienteInicial = 0;

  if (montoTotal && numeroCuotas) {
    // Caso 1: Tiene monto total y número de cuotas
    montoCuotaCalculado = Math.round((montoTotal / numeroCuotas) * 100) / 100;
    numeroCuotasCalculado = numeroCuotas;
    saldoPendienteInicial = montoTotal;
  } else if (abonoMensual && !montoTotal) {
    // Caso 2: Solo tiene abono mensual (deuda abierta)
    montoCuotaCalculado = abonoMensual;
    numeroCuotasCalculado = null; // Sin plazo definido
    saldoPendienteInicial = 0; // Se actualizará con pagos
  } else if (montoTotal && abonoMensual) {
    // Caso 3: Tiene ambos, calcular número de cuotas
    numeroCuotasCalculado = Math.ceil(montoTotal / abonoMensual);
    montoCuotaCalculado = abonoMensual;
    saldoPendienteInicial = montoTotal;
  }

  const debtData = {
    ...req.body,
    perfilID,
    montoCuota: montoCuotaCalculado,
    numeroCuotas: numeroCuotasCalculado,
    saldoPendiente: saldoPendienteInicial,
    saldoPagado: 0
  };

  const debt = await Debt.create(debtData);

  res.status(201).json({
    success: true,
    data: debt
  });
});

/**
 * Actualiza una deuda existente
 * 
 * @route PUT /api/v1/debts/:id
 * @access Private (requiere autenticación)
 */
exports.updateDebt = asyncHandler(async (req, res, next) => {
  const debt = await Debt.findById(req.params.id).populate('perfilID');

  if (!debt) {
    return res.status(404).json({
      success: false,
      message: 'Deuda no encontrada'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (debt.perfilID.usuarioID.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para modificar esta deuda'
    });
  }

  // Si se actualiza montoTotal o numeroCuotas, recalcular montoCuota
  const { montoTotal, numeroCuotas, abonoMensual } = req.body;
  
  if (montoTotal || numeroCuotas || abonoMensual) {
    // Recalcular valores
    let montoCuotaCalculado = debt.montoCuota;
    let numeroCuotasCalculado = debt.numeroCuotas;

    const newMontoTotal = montoTotal || debt.montoTotal;
    const newNumeroCuotas = numeroCuotas || debt.numeroCuotas;
    const newAbonoMensual = abonoMensual || debt.abonoMensual;

    if (newMontoTotal && newNumeroCuotas) {
      montoCuotaCalculado = Math.round((newMontoTotal / newNumeroCuotas) * 100) / 100;
      numeroCuotasCalculado = newNumeroCuotas;
    } else if (newAbonoMensual && !newMontoTotal) {
      montoCuotaCalculado = newAbonoMensual;
    } else if (newMontoTotal && newAbonoMensual) {
      numeroCuotasCalculado = Math.ceil(newMontoTotal / newAbonoMensual);
      montoCuotaCalculado = newAbonoMensual;
    }

    req.body.montoCuota = montoCuotaCalculado;
    if (numeroCuotasCalculado) {
      req.body.numeroCuotas = numeroCuotasCalculado;
    }
  }

  const updatedDebt = await Debt.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: updatedDebt
  });
});

/**
 * Elimina una deuda
 * 
 * @route DELETE /api/v1/debts/:id
 * @access Private (requiere autenticación)
 */
exports.deleteDebt = asyncHandler(async (req, res, next) => {
  const debt = await Debt.findById(req.params.id).populate('perfilID');

  if (!debt) {
    return res.status(404).json({
      success: false,
      message: 'Deuda no encontrada'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (debt.perfilID.usuarioID.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para eliminar esta deuda'
    });
  }

  // Eliminar pagos asociados
  await Payment.deleteMany({ deudaID: debt._id });

  // Eliminar deuda
  await debt.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Deuda eliminada correctamente'
  });
});

/**
 * Registra un pago de deuda desde el detalle
 * 
 * Permite pagar una cuota específica o un monto personalizado
 * Valida que no se pague la misma cuota dos veces
 * 
 * @route POST /api/v1/debts/:id/pay
 * @access Private (requiere autenticación)
 */
exports.payDebt = asyncHandler(async (req, res, next) => {
  const { monto, numeroCuota, fecha, transaccionID, fechaVencimiento } = req.body;

  const debt = await Debt.findById(req.params.id).populate('perfilID');

  if (!debt) {
    return res.status(404).json({
      success: false,
      message: 'Deuda no encontrada'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (debt.perfilID.usuarioID.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para pagar esta deuda'
    });
  }

  // Validar monto
  const montoPago = monto || debt.montoCuota;
  if (montoPago <= 0) {
    return res.status(400).json({
      success: false,
      message: 'El monto del pago debe ser mayor a 0'
    });
  }

  // Determinar número de cuota si no se proporciona
  const cuotasPagadas = await Payment.countDocuments({
    deudaID: debt._id,
    estado: 'pagado'
  });
  const numeroCuotaPago = numeroCuota || (cuotasPagadas + 1);

  // Validar que la cuota no esté ya pagada
  const cuotaExistente = await Payment.findOne({
    deudaID: debt._id,
    numeroCuota: numeroCuotaPago,
    estado: 'pagado'
  });

  if (cuotaExistente) {
    return res.status(400).json({
      success: false,
      message: `La cuota ${numeroCuotaPago} ya está pagada`,
      data: {
        cuotaPagada: cuotaExistente,
        siguienteCuota: numeroCuotaPago + 1
      }
    });
  }

  // Crear el pago
  const payment = await Payment.create({
    deudaID: debt._id,
    perfilID: debt.perfilID._id,
    monto: montoPago,
    numeroCuota: numeroCuotaPago,
    fecha: fecha || new Date(),
    estado: 'pagado',
    transaccionID,
    fechaVencimiento
  });

  // Actualizar saldos de la deuda
  const nuevoSaldoPagado = debt.saldoPagado + montoPago;
  const nuevoSaldoPendiente = Math.max(0, debt.saldoPendiente - montoPago);

  const updateData = {
    saldoPagado: nuevoSaldoPagado,
    saldoPendiente: nuevoSaldoPendiente
  };

  // Si el saldo pendiente llega a 0, marcar como pagada
  if (nuevoSaldoPendiente === 0) {
    updateData.estado = 'Pagada';
  }

  const updatedDebt = await Debt.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: {
      payment,
      debt: updatedDebt
    }
  });
});

/**
 * Obtiene un resumen completo de deudas de un perfil
 * 
 * Retorna estadísticas agregadas: total de deudas activas, total pendiente,
 * próximos vencimientos, distribución por tipo, etc.
 * 
 * @route GET /api/v1/debts/summary?perfilID=xxx
 * @access Private (requiere autenticación)
 */
exports.getDebtsSummary = asyncHandler(async (req, res, next) => {
  const { perfilID } = req.query;

  if (!perfilID) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro perfilID es requerido'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado o no pertenece al usuario'
    });
  }

  // Obtener todas las deudas del perfil
  const debts = await Debt.find({ perfilID });
  
  // Obtener pagos próximos a vencer (próximos 30 días)
  const hoy = new Date();
  const proximos30Dias = new Date();
  proximos30Dias.setDate(hoy.getDate() + 30);

  const proximosPagos = await Payment.find({
    perfilID,
    estado: 'pendiente',
    fechaVencimiento: {
      $gte: hoy,
      $lte: proximos30Dias
    }
  })
    .populate('deudaID', 'nombre prestador montoCuota')
    .sort({ fechaVencimiento: 1 })
    .limit(10);

  // Calcular estadísticas
  const totalDeudas = debts.length;
  const deudasActivas = debts.filter(d => d.estado === 'Activa').length;
  const deudasPagadas = debts.filter(d => d.estado === 'Pagada').length;
  const deudasVencidas = debts.filter(d => d.estado === 'Vencida').length;

  const totalPendiente = debts
    .filter(d => d.estado === 'Activa')
    .reduce((sum, d) => sum + (d.saldoPendiente || 0), 0);

  const totalPagado = debts
    .reduce((sum, d) => sum + (d.saldoPagado || 0), 0);

  const totalDeuda = debts
    .filter(d => d.estado === 'Activa')
    .reduce((sum, d) => sum + (d.montoTotal || 0), 0);

  // Distribución por tipo
  const porTipo = {
    Personal: debts.filter(d => d.tipo === 'Personal' && d.estado === 'Activa').length,
    Institucional: debts.filter(d => d.tipo === 'Institucional' && d.estado === 'Activa').length,
    Bancaria: debts.filter(d => d.tipo === 'Bancaria' && d.estado === 'Activa').length,
    Comercial: debts.filter(d => d.tipo === 'Comercial' && d.estado === 'Activa').length
  };

  // Distribución por moneda
  const porMoneda = debts
    .filter(d => d.estado === 'Activa')
    .reduce((acc, d) => {
      const moneda = d.moneda || 'CLP';
      acc[moneda] = (acc[moneda] || 0) + (d.saldoPendiente || 0);
      return acc;
    }, {});

  // Próximos vencimientos (de deudas)
  const deudasConVencimiento = debts
    .filter(d => d.estado === 'Activa' && d.fechaVencimiento)
    .filter(d => {
      const vencimiento = new Date(d.fechaVencimiento);
      return vencimiento >= hoy && vencimiento <= proximos30Dias;
    })
    .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento))
    .slice(0, 5);

  res.status(200).json({
    success: true,
    data: {
      resumen: {
        totalDeudas,
        deudasActivas,
        deudasPagadas,
        deudasVencidas,
        totalPendiente,
        totalPagado,
        totalDeuda
      },
      distribucion: {
        porTipo,
        porMoneda
      },
      proximosVencimientos: {
        deudas: deudasConVencimiento.map(d => ({
          id: d._id,
          nombre: d.nombre,
          prestador: d.prestador,
          saldoPendiente: d.saldoPendiente,
          fechaVencimiento: d.fechaVencimiento
        })),
        pagos: proximosPagos.map(p => ({
          id: p._id,
          deuda: {
            id: p.deudaID._id,
            nombre: p.deudaID.nombre,
            prestador: p.deudaID.prestador
          },
          numeroCuota: p.numeroCuota,
          monto: p.monto,
          fechaVencimiento: p.fechaVencimiento
        }))
      }
    }
  });
});

/**
 * Obtiene el nivel de deuda de un perfil
 * 
 * Calcula el nivel de deuda basado en estado de pago, ratio deuda/ingresos, etc.
 * 
 * @route GET /api/v1/debts/level?perfilID=xxx
 * @access Private (requiere autenticación)
 */
exports.getDebtLevel = asyncHandler(async (req, res, next) => {
  const { perfilID, monthlyIncome } = req.query;

  if (!perfilID) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro perfilID es requerido'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado o no pertenece al usuario'
    });
  }

  const monthlyIncomeNum = monthlyIncome ? parseFloat(monthlyIncome) : null;
  const debtLevel = await debtLevelService.calculateDebtLevel(perfilID, monthlyIncomeNum);

  res.status(200).json({
    success: true,
    data: debtLevel
  });
});

/**
 * Obtiene el totalizador de deudas
 * 
 * @route GET /api/v1/debts/totalizador?perfilID=xxx
 * @access Private (requiere autenticación)
 */
exports.getTotalizador = asyncHandler(async (req, res, next) => {
  const { perfilID } = req.query;

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

  const debts = await Debt.find({ perfilID });

  // Agrupar por categoría
  const totalPorCategoria = {};
  const totalGeneral = debts.reduce((sum, debt) => {
    const categoria = debt.categoria || 'Otro';
    if (!totalPorCategoria[categoria]) {
      totalPorCategoria[categoria] = {
        cantidad: 0,
        montoTotal: 0,
        saldoPendiente: 0,
        saldoPagado: 0,
        deudas: []
      };
    }
    totalPorCategoria[categoria].cantidad += 1;
    totalPorCategoria[categoria].montoTotal += debt.montoTotal || 0;
    totalPorCategoria[categoria].saldoPendiente += debt.saldoPendiente || 0;
    totalPorCategoria[categoria].saldoPagado += debt.saldoPagado || 0;
    totalPorCategoria[categoria].deudas.push({
      id: debt._id,
      nombre: debt.nombre,
      prestador: debt.prestador,
      montoTotal: debt.montoTotal,
      saldoPendiente: debt.saldoPendiente,
      estado: debt.estado
    });
    return sum + (debt.saldoPendiente || 0);
  }, 0);

  // Agrupar por estado
  const totalPorEstado = {
    Activa: debts.filter(d => d.estado === 'Activa').reduce((sum, d) => sum + (d.saldoPendiente || 0), 0),
    Pagada: debts.filter(d => d.estado === 'Pagada').reduce((sum, d) => sum + (d.saldoPagado || 0), 0),
    Vencida: debts.filter(d => d.estado === 'Vencida').reduce((sum, d) => sum + (d.saldoPendiente || 0), 0)
  };

  res.status(200).json({
    success: true,
    data: {
      totalGeneral,
      totalPorCategoria,
      totalPorEstado,
      cantidadTotal: debts.length,
      cantidadActivas: debts.filter(d => d.estado === 'Activa').length,
      cantidadPagadas: debts.filter(d => d.estado === 'Pagada').length,
      cantidadVencidas: debts.filter(d => d.estado === 'Vencida').length
    }
  });
});

