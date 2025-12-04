const asyncHandler = require('@core/utils/asyncHandler');
const Payment = require('@models/Payment');
const Debt = require('@models/Debt');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Pagos - Maneja CRUD de pagos de deudas
 * @module level3/controllers/paymentController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todos los pagos de un perfil (opcionalmente filtrados por deuda)
 * 
 * @route GET /api/v1/payments?perfilID=xxx&deudaID=xxx
 * @access Private (requiere autenticación)
 */
exports.getPayments = asyncHandler(async (req, res, next) => {
  const { perfilID, deudaID } = req.query;

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

  const query = { perfilID };
  if (deudaID) {
    query.deudaID = deudaID;
  }

  const payments = await Payment.find(query)
    .populate('deudaID', 'nombre prestador montoTotal')
    .populate('transaccionID', 'monto fecha detalle')
    .sort({ fecha: -1, numeroCuota: 1 });

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

/**
 * Obtiene un pago específico
 * 
 * @route GET /api/v1/payments/:id
 * @access Private (requiere autenticación)
 */
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('deudaID')
    .populate('transaccionID')
    .populate('perfilID');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Pago no encontrado'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (payment.perfilID.usuarioID.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para acceder a este pago'
    });
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

/**
 * Crea un nuevo pago
 * 
 * Actualiza automáticamente los saldos de la deuda asociada
 * 
 * @route POST /api/v1/payments
 * @access Private (requiere autenticación)
 */
exports.createPayment = asyncHandler(async (req, res, next) => {
  const { perfilID, deudaID, monto, numeroCuota, fecha, transaccionID, fechaVencimiento } = req.body;

  if (!perfilID || !deudaID || !monto) {
    return res.status(400).json({
      success: false,
      message: 'perfilID, deudaID y monto son requeridos'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado o no pertenece al usuario'
    });
  }

  // Verificar que la deuda existe y pertenece al perfil
  const debt = await Debt.findOne({ _id: deudaID, perfilID });
  if (!debt) {
    return res.status(404).json({
      success: false,
      message: 'Deuda no encontrada o no pertenece al perfil'
    });
  }

  // Determinar número de cuota si no se proporciona
  let numeroCuotaPago = numeroCuota;
  if (!numeroCuotaPago) {
    const cuotasPagadas = await Payment.countDocuments({
      deudaID: debt._id,
      estado: 'pagado'
    });
    numeroCuotaPago = cuotasPagadas + 1;
  }

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
    perfilID,
    deudaID,
    monto,
    numeroCuota: numeroCuotaPago,
    fecha: fecha || new Date(),
    estado: 'pagado',
    transaccionID,
    fechaVencimiento
  });

  // Actualizar saldos de la deuda
  const nuevoSaldoPagado = debt.saldoPagado + monto;
  const nuevoSaldoPendiente = Math.max(0, debt.saldoPendiente - monto);

  const updateData = {
    saldoPagado: nuevoSaldoPagado,
    saldoPendiente: nuevoSaldoPendiente
  };

  // Si el saldo pendiente llega a 0, marcar como pagada
  if (nuevoSaldoPendiente === 0) {
    updateData.estado = 'Pagada';
  }

  await Debt.findByIdAndUpdate(deudaID, updateData);

  const updatedPayment = await Payment.findById(payment._id)
    .populate('deudaID')
    .populate('transaccionID');

  res.status(201).json({
    success: true,
    data: updatedPayment
  });
});

/**
 * Actualiza un pago existente
 * 
 * @route PUT /api/v1/payments/:id
 * @access Private (requiere autenticación)
 */
exports.updatePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate('perfilID');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Pago no encontrado'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (payment.perfilID.usuarioID.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para modificar este pago'
    });
  }

  // Si se actualiza el monto, recalcular saldos de la deuda
  if (req.body.monto && req.body.monto !== payment.monto) {
    const debt = await Debt.findById(payment.deudaID);
    if (debt) {
      const diferencia = req.body.monto - payment.monto;
      const nuevoSaldoPagado = debt.saldoPagado + diferencia;
      const nuevoSaldoPendiente = Math.max(0, debt.saldoPendiente - diferencia);

      await Debt.findByIdAndUpdate(payment.deudaID, {
        saldoPagado: nuevoSaldoPagado,
        saldoPendiente: nuevoSaldoPendiente,
        estado: nuevoSaldoPendiente === 0 ? 'Pagada' : debt.estado
      });
    }
  }

  const updatedPayment = await Payment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).populate('deudaID').populate('transaccionID');

  res.status(200).json({
    success: true,
    data: updatedPayment
  });
});

/**
 * Elimina un pago
 * 
 * Recalcula los saldos de la deuda al eliminar el pago
 * 
 * @route DELETE /api/v1/payments/:id
 * @access Private (requiere autenticación)
 */
exports.deletePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate('perfilID');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Pago no encontrado'
    });
  }

  // Verificar que el perfil pertenece al usuario
  if (payment.perfilID.usuarioID.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para eliminar este pago'
    });
  }

  // Recalcular saldos de la deuda
  const debt = await Debt.findById(payment.deudaID);
  if (debt) {
    const nuevoSaldoPagado = Math.max(0, debt.saldoPagado - payment.monto);
    const nuevoSaldoPendiente = debt.saldoPendiente + payment.monto;

    await Debt.findByIdAndUpdate(payment.deudaID, {
      saldoPagado: nuevoSaldoPagado,
      saldoPendiente: nuevoSaldoPendiente,
      estado: nuevoSaldoPendiente > 0 ? 'Activa' : debt.estado
    });
  }

  await payment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Pago eliminado correctamente'
  });
});

