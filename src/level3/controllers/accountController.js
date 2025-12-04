const asyncHandler = require('@core/utils/asyncHandler');
const Account = require('@models/Account');

/**
 * @fileoverview Controlador de Cuentas - Maneja CRUD de cuentas bancarias y financieras
 * @module level3/controllers/accountController
 */

/**
 * Obtiene todas las cuentas del usuario autenticado
 * 
 * Retorna una lista de todas las cuentas bancarias y financieras asociadas
 * al usuario que está haciendo el request.
 * 
 * @route GET /api/v1/accounts
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - count: Número de cuentas encontradas
 * - data: Array de objetos Account del usuario
 * 
 * @example
 * // GET /api/v1/accounts
 * // Retorna todas las cuentas del usuario autenticado
 */
exports.getAccounts = asyncHandler(async (req, res, next) => {
  const { perfilID } = req.query;

  if (!perfilID) {
    return res.status(400).json({
      success: false,
      message: 'El parámetro perfilID es requerido'
    });
  }

  // Verificar que el perfil pertenece al usuario
  const Profile = require('@models/Profile');
  const profile = await Profile.findOne({ _id: perfilID, usuarioID: req.user.id });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado o no pertenece al usuario'
    });
  }

  const accounts = await Account.find({ perfilID });

  res.status(200).json({
    success: true,
    count: accounts.length,
    data: accounts
  });
});

/**
 * Obtiene una cuenta específica por su ID
 * 
 * Retorna los datos completos de una cuenta si pertenece al usuario autenticado.
 * 
 * @route GET /api/v1/accounts/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la cuenta a obtener (MongoDB ObjectId)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Account completo
 * 
 * @throws {404} Si la cuenta no existe o no pertenece al usuario
 * 
 * @example
 * // GET /api/v1/accounts/507f1f77bcf86cd799439011
 */
exports.getAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findOne({
    _id: req.params.id,
    usuarioID: req.user.id
  });

  if (!account) {
    return res.status(404).json({
      success: false,
      message: 'Cuenta no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: account
  });
});

/**
 * Crea una nueva cuenta bancaria o financiera
 * 
 * Permite crear una nueva cuenta (corriente, ahorro, tarjeta de crédito, etc.)
 * asociada al usuario autenticado.
 * 
 * @route POST /api/v1/accounts
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado (se asigna automáticamente)
 * @param {Object} req.body - Datos de la cuenta a crear
 * @param {string} req.body.nombre - Nombre de la cuenta (requerido, ej: "Cuenta Corriente")
 * @param {string} req.body.tipo - Tipo de cuenta (requerido, ej: "corriente", "ahorro", "credito")
 * @param {string} [req.body.banco] - Nombre del banco (opcional)
 * @param {string} [req.body.numero] - Número de cuenta (opcional)
 * @param {number} [req.body.saldoInicial] - Saldo inicial de la cuenta (opcional, default: 0)
 * @param {number} [req.body.saldoDisponible] - Saldo disponible (opcional, se inicializa con saldoInicial)
 * @param {string} [req.body.moneda] - Moneda de la cuenta (opcional, default: "CLP")
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Account creado
 * 
 * @throws {400} Si faltan datos requeridos o son inválidos
 * 
 * @example
 * // Request body
 * {
 *   "nombre": "Cuenta Corriente",
 *   "tipo": "corriente",
 *   "banco": "Banco de Chile",
 *   "numero": "1234567890",
 *   "saldoInicial": 1000000,
 *   "moneda": "CLP"
 * }
 */
exports.createAccount = asyncHandler(async (req, res, next) => {
  req.body.usuarioID = req.user.id;
  const account = await Account.create(req.body);

  res.status(201).json({
    success: true,
    data: account
  });
});

/**
 * Actualiza una cuenta existente
 * 
 * Permite modificar los datos de una cuenta que pertenece al usuario autenticado.
 * 
 * @route PUT /api/v1/accounts/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la cuenta a actualizar
 * @param {Object} req.body - Datos a actualizar (todos los campos son opcionales)
 * @param {string} [req.body.nombre] - Nuevo nombre de la cuenta
 * @param {string} [req.body.tipo] - Nuevo tipo
 * @param {string} [req.body.banco] - Nuevo banco
 * @param {number} [req.body.saldoDisponible] - Nuevo saldo disponible
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Account actualizado
 * 
 * @throws {404} Si la cuenta no existe o no pertenece al usuario
 * @throws {400} Si los datos proporcionados son inválidos
 * 
 * @example
 * // Request body (todos los campos son opcionales)
 * {
 *   "saldoDisponible": 1500000
 * }
 */
exports.updateAccount = asyncHandler(async (req, res, next) => {
  let account = await Account.findOne({
    _id: req.params.id,
    usuarioID: req.user.id
  });

  if (!account) {
    return res.status(404).json({
      success: false,
      message: 'Cuenta no encontrada'
    });
  }

  account = await Account.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: account
  });
});

/**
 * Elimina una cuenta del sistema
 * 
 * Elimina permanentemente una cuenta que pertenece al usuario autenticado.
 * 
 * @route DELETE /api/v1/accounts/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la cuenta a eliminar
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - message: "Cuenta eliminada"
 * 
 * @throws {404} Si la cuenta no existe o no pertenece al usuario
 * 
 * @example
 * // DELETE /api/v1/accounts/507f1f77bcf86cd799439011
 */
exports.deleteAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findOne({
    _id: req.params.id,
    usuarioID: req.user.id
  });

  if (!account) {
    return res.status(404).json({
      success: false,
      message: 'Cuenta no encontrada'
    });
  }

  await account.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Cuenta eliminada'
  });
});
