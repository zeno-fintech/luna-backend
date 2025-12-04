const asyncHandler = require('@core/utils/asyncHandler');
const Transaction = require('@models/Transaction');
const Account = require('@models/Account');
const Debt = require('@models/Debt');
const Payment = require('@models/Payment');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Transacciones - Maneja CRUD de transacciones financieras
 * @module level3/controllers/transactionController
 */

/**
 * Obtiene todas las transacciones de un perfil con filtros opcionales
 * 
 * Retorna una lista paginada de transacciones filtradas por perfil, tipo,
 * rango de fechas, etc. Incluye información de categoría, cuenta y regla asociadas.
 * 
 * @route GET /api/v1/transactions
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.perfilID - ID del perfil del cual obtener transacciones (requerido)
 * @param {string} [req.query.tipo] - Tipo de transacción a filtrar ('Ingreso' o 'Gasto')
 * @param {string} [req.query.fechaDesde] - Fecha de inicio del rango (formato: YYYY-MM-DD)
 * @param {string} [req.query.fechaHasta] - Fecha de fin del rango (formato: YYYY-MM-DD)
 * @param {number} [req.query.limit=50] - Número máximo de transacciones por página
 * @param {number} [req.query.page=1] - Número de página a obtener
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - count: Número de transacciones en la página actual
 * - total: Número total de transacciones que coinciden con los filtros
 * - page: Número de página actual
 * - pages: Número total de páginas
 * - data: Array de objetos Transaction con información de categoría, cuenta y regla
 * 
 * @throws {400} Si falta el parámetro perfilID
 * 
 * @example
 * // GET /api/v1/transactions?perfilID=507f1f77bcf86cd799439011&tipo=Gasto&page=1&limit=20
 */
exports.getTransactions = asyncHandler(async (req, res, next) => {
  const { perfilID, tipo, fechaDesde, fechaHasta, limit = 50, page = 1 } = req.query;

  // Build query
  const query = { perfilID };

  if (tipo) {
    query.tipo = tipo;
  }

  if (fechaDesde || fechaHasta) {
    query.fecha = {};
    if (fechaDesde) query.fecha.$gte = new Date(fechaDesde);
    if (fechaHasta) query.fecha.$lte = new Date(fechaHasta);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const transactions = await Transaction.find(query)
    .populate('categoriaID', 'nombre icono color')
    .populate('cuentaID', 'nombre banco tipoCuenta')
    .populate('reglaID', 'nombre color')
    .sort({ fecha: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Transaction.countDocuments(query);

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: transactions
  });
});

/**
 * Obtiene una transacción específica por su ID
 * 
 * Retorna los datos completos de una transacción incluyendo información
 * de la categoría, cuenta y regla asociadas.
 * 
 * @route GET /api/v1/transactions/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la transacción a obtener (MongoDB ObjectId)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Transaction completo con información de categoría, cuenta y regla
 * 
 * @throws {404} Si la transacción no existe
 * 
 * @example
 * // GET /api/v1/transactions/507f1f77bcf86cd799439011
 */
exports.getTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('categoriaID', 'nombre icono color')
    .populate('cuentaID', 'nombre banco tipoCuenta')
    .populate('reglaID', 'nombre color');

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transacción no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: transaction
  });
});

/**
 * Crea una nueva transacción financiera
 * 
 * Crea una nueva transacción y actualiza automáticamente el saldo disponible
 * de la cuenta asociada si se especifica una cuenta.
 * 
 * @route POST /api/v1/transactions
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.body - Datos de la transacción a crear
 * @param {string} req.body.perfilID - ID del perfil al que pertenece la transacción (requerido)
 * @param {string} req.body.tipo - Tipo de transacción: 'Ingreso' o 'Gasto' (requerido)
 * @param {number} req.body.monto - Monto de la transacción (requerido, debe ser positivo)
 * @param {string} req.body.descripcion - Descripción de la transacción (requerido)
 * @param {Date|string} req.body.fecha - Fecha de la transacción (requerido)
 * @param {string} [req.body.categoriaID] - ID de la categoría asociada (opcional)
 * @param {string} [req.body.cuentaID] - ID de la cuenta asociada (opcional, si se especifica actualiza el saldo)
 * @param {string} [req.body.reglaID] - ID de la regla asociada (opcional)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Transaction creado con información de categoría, cuenta y regla
 * 
 * @throws {400} Si faltan datos requeridos o son inválidos
 * @throws {404} Si la cuenta especificada no existe
 * 
 * @example
 * // Request body
 * {
 *   "perfilID": "507f1f77bcf86cd799439011",
 *   "tipo": "Gasto",
 *   "monto": 50000,
 *   "descripcion": "Compra en supermercado",
 *   "fecha": "2024-01-15",
 *   "categoriaID": "507f1f77bcf86cd799439012",
 *   "cuentaID": "507f1f77bcf86cd799439013"
 * }
 */
exports.createTransaction = asyncHandler(async (req, res, next) => {
  const { perfilID, deudaID, numeroCuota, monto } = req.body;

  // Si se especifica deudaID, validar que existe y pertenece al perfil
  if (deudaID) {
    if (!perfilID) {
      return res.status(400).json({
        success: false,
        message: 'perfilID es requerido cuando se especifica deudaID'
      });
    }

    // Verificar que el perfil pertenece al usuario
    const profile = await Profile.findOne({ _id: perfilID, usuarioID: req.user.id });
    if (!profile) {
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
  }

  const transaction = await Transaction.create(req.body);

  // Update account balance if account is specified
  if (transaction.cuentaID) {
    const account = await Account.findById(transaction.cuentaID);
    if (account) {
      if (transaction.tipo === 'Ingreso') {
        account.saldoDisponible += transaction.monto;
      } else if (transaction.tipo === 'Gasto') {
        account.saldoDisponible -= transaction.monto;
      }
      await account.save();
    }
  }

  // Actualizar totales del tablero si está asociado
  if (transaction.tableroID) {
    const FinancialBoard = require('@models/FinancialBoard');
    const board = await FinancialBoard.findById(transaction.tableroID);
    if (board) {
      await board.recalcularTotales();
    }
  }

  // Actualizar regla si el gasto tiene reglaID
  if (transaction.tipo === 'Gasto' && transaction.reglaID) {
    const Rule = require('@models/Rule');
    const rule = await Rule.findById(transaction.reglaID);
    if (rule) {
      await rule.recalcularMontos();
    }
  }

  // Si es un gasto con deuda asociada, crear el pago automáticamente
  if (transaction.tipo === 'Gasto' && transaction.deudaID) {
    const debt = await Debt.findById(transaction.deudaID);
    if (debt) {
      // Determinar número de cuota
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
        // Si la cuota ya está pagada, buscar la siguiente disponible
        const todasLasCuotas = await Payment.find({
          deudaID: debt._id,
          estado: 'pagado'
        }).sort({ numeroCuota: -1 });

        const ultimaCuotaPagada = todasLasCuotas.length > 0 
          ? todasLasCuotas[0].numeroCuota 
          : 0;
        
        numeroCuotaPago = ultimaCuotaPagada + 1;
      }

      // Usar el monto de la transacción o el monto de la cuota
      const montoPago = monto || transaction.monto || debt.montoCuota;

      // Crear el pago
      const payment = await Payment.create({
        perfilID: transaction.perfilID,
        deudaID: transaction.deudaID,
        monto: montoPago,
        numeroCuota: numeroCuotaPago,
        fecha: transaction.fecha,
        estado: 'pagado',
        transaccionID: transaction._id
      });

      // Actualizar saldos de la deuda
      const nuevoSaldoPagado = debt.saldoPagado + montoPago;
      const nuevoSaldoPendiente = Math.max(0, debt.saldoPendiente - montoPago);

      const updateData = {
        saldoPagado: nuevoSaldoPagado,
        saldoPendiente: nuevoSaldoPendiente
      };

      if (nuevoSaldoPendiente === 0) {
        updateData.estado = 'Pagada';
      }

      await Debt.findByIdAndUpdate(transaction.deudaID, updateData);

      // Cargar la transacción con el pago creado
      const transactionWithPayment = await Transaction.findById(transaction._id)
        .populate('categoriaID', 'nombre icono color')
        .populate('cuentaID', 'nombre banco tipoCuenta')
        .populate('reglaID', 'nombre color')
        .populate('deudaID', 'nombre prestador montoTotal');

      return res.status(201).json({
        success: true,
        data: transactionWithPayment,
        payment: payment
      });
    }
  }

  const populatedTransaction = await Transaction.findById(transaction._id)
    .populate('categoriaID', 'nombre icono color')
    .populate('cuentaID', 'nombre banco tipoCuenta')
    .populate('reglaID', 'nombre color')
    .populate('deudaID', 'nombre prestador montoTotal');

  res.status(201).json({
    success: true,
    data: populatedTransaction
  });
});

/**
 * Actualiza una transacción existente
 * 
 * Actualiza los datos de una transacción y recalcula automáticamente
 * el saldo de la cuenta asociada si el monto o tipo cambian.
 * 
 * @route PUT /api/v1/transactions/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la transacción a actualizar
 * @param {Object} req.body - Datos a actualizar (todos los campos son opcionales)
 * @param {string} [req.body.tipo] - Nuevo tipo de transacción
 * @param {number} [req.body.monto] - Nuevo monto
 * @param {string} [req.body.descripcion] - Nueva descripción
 * @param {Date|string} [req.body.fecha] - Nueva fecha
 * @param {string} [req.body.categoriaID] - Nueva categoría
 * @param {string} [req.body.cuentaID] - Nueva cuenta
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Transaction actualizado con información de categoría, cuenta y regla
 * 
 * @throws {404} Si la transacción no existe
 * @throws {400} Si los datos proporcionados son inválidos
 * 
 * @example
 * // Request body (todos los campos son opcionales)
 * {
 *   "monto": 55000,
 *   "descripcion": "Compra actualizada en supermercado"
 * }
 */
exports.updateTransaction = asyncHandler(async (req, res, next) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transacción no encontrada'
    });
  }

  const oldTableroID = transaction.tableroID;

  // If amount or type changed, update account balance
  if (req.body.monto || req.body.tipo) {
    const oldAccount = await Account.findById(transaction.cuentaID);
    if (oldAccount) {
      // Revert old transaction
      if (transaction.tipo === 'Ingreso') {
        oldAccount.saldoDisponible -= transaction.monto;
      } else if (transaction.tipo === 'Gasto') {
        oldAccount.saldoDisponible += transaction.monto;
      }
      await oldAccount.save();
    }
  }

  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('categoriaID', 'nombre icono color')
    .populate('cuentaID', 'nombre banco tipoCuenta')
    .populate('reglaID', 'nombre color')
    .populate('tableroID', 'nombre moneda');

  // Update new account balance
  if (transaction.cuentaID) {
    const account = await Account.findById(transaction.cuentaID);
    if (account) {
      if (transaction.tipo === 'Ingreso') {
        account.saldoDisponible += transaction.monto;
      } else if (transaction.tipo === 'Gasto') {
        account.saldoDisponible -= transaction.monto;
      }
      await account.save();
    }
  }

  // Actualizar totales de tableros afectados
  const FinancialBoard = require('@models/FinancialBoard');
  if (oldTableroID) {
    const oldBoard = await FinancialBoard.findById(oldTableroID);
    if (oldBoard) await oldBoard.recalcularTotales();
  }
  if (transaction.tableroID && transaction.tableroID.toString() !== oldTableroID?.toString()) {
    const newBoard = await FinancialBoard.findById(transaction.tableroID);
    if (newBoard) await newBoard.recalcularTotales();
  }

  // Actualizar reglas afectadas
  const Rule = require('@models/Rule');
  const oldReglaID = transaction.reglaID;
  if (oldReglaID) {
    const oldRule = await Rule.findById(oldReglaID);
    if (oldRule) await oldRule.recalcularMontos();
  }
  if (req.body.reglaID && req.body.reglaID.toString() !== oldReglaID?.toString()) {
    const newRule = await Rule.findById(req.body.reglaID);
    if (newRule) await newRule.recalcularMontos();
  }

  res.status(200).json({
    success: true,
    data: transaction
  });
});

/**
 * Elimina una transacción del sistema
 * 
 * Elimina permanentemente una transacción y revierte automáticamente
 * el saldo de la cuenta asociada si existe.
 * 
 * @route DELETE /api/v1/transactions/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la transacción a eliminar
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - message: "Transacción eliminada"
 * 
 * @throws {404} Si la transacción no existe
 * 
 * @example
 * // DELETE /api/v1/transactions/507f1f77bcf86cd799439011
 */
exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: 'Transacción no encontrada'
    });
  }

  const tableroID = transaction.tableroID;

  // Revert account balance
  if (transaction.cuentaID) {
    const account = await Account.findById(transaction.cuentaID);
    if (account) {
      if (transaction.tipo === 'Ingreso') {
        account.saldoDisponible -= transaction.monto;
      } else if (transaction.tipo === 'Gasto') {
        account.saldoDisponible += transaction.monto;
      }
      await account.save();
    }
  }

  await transaction.deleteOne();

  // Actualizar totales del tablero si estaba asociado
  if (tableroID) {
    const FinancialBoard = require('@models/FinancialBoard');
    const board = await FinancialBoard.findById(tableroID);
    if (board) await board.recalcularTotales();
  }

  // Actualizar regla si el gasto tenía reglaID
  if (transaction.reglaID) {
    const Rule = require('@models/Rule');
    const rule = await Rule.findById(transaction.reglaID);
    if (rule) await rule.recalcularMontos();
  }

  res.status(200).json({
    success: true,
    message: 'Transacción eliminada'
  });
});
