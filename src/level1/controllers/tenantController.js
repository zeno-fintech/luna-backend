const asyncHandler = require('@core/utils/asyncHandler');
const Tenant = require('@models/Tenant');
const User = require('@models/User');

/**
 * @fileoverview Controlador de Tenants - Maneja CRUD de tenants (Nivel 1 - Superadmin)
 * @module level1/controllers/tenantController
 */

/**
 * Crea un nuevo tenant en el sistema
 * 
 * Permite crear un nuevo tenant (marca propia, partner o creador) que puede
 * tener su propio branding, configuración y usuarios. Solo usuarios con rol
 * SUPERADMIN pueden crear tenants.
 * 
 * @route POST /api/v1/admin/tenants
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario que crea el tenant
 * @param {Object} req.body - Datos del tenant a crear
 * @param {string} req.body.name - Nombre del tenant (requerido, ej: "LUNA Finance")
 * @param {string} req.body.slug - Slug único del tenant (requerido, ej: "luna-finance", solo minúsculas, números y guiones)
 * @param {string} req.body.type - Tipo de tenant (requerido: 'own_brand', 'partner', 'creator')
 * @param {Object} [req.body.branding] - Configuración de branding (opcional)
 * @param {string} [req.body.branding.logo] - URL del logo (opcional)
 * @param {string} [req.body.branding.primaryColor] - Color primario (opcional, default: '#000000')
 * @param {string} [req.body.branding.secondaryColor] - Color secundario (opcional)
 * @param {string} [req.body.branding.domain] - Dominio del tenant (opcional)
 * @param {string} [req.body.defaultCurrency] - Moneda por defecto (opcional, default: 'CLP')
 * @param {string} [req.body.defaultCountry] - País por defecto (opcional)
 * @param {Object} [req.body.config] - Configuración de features (opcional)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Tenant creado con todos sus datos
 * 
 * @throws {400} Si faltan datos requeridos o el slug ya existe
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * 
 * @example
 * // Request body
 * {
 *   "name": "LUNA Finance",
 *   "slug": "luna-finance",
 *   "type": "own_brand",
 *   "branding": {
 *     "primaryColor": "#0066CC",
 *     "domain": "app.lunafinance.com"
 *   },
 *   "defaultCurrency": "CLP",
 *   "defaultCountry": "CL"
 * }
 */
exports.createTenant = asyncHandler(async (req, res, next) => {
  const tenantData = {
    ...req.body,
    createdBy: req.user.id
  };

  const tenant = await Tenant.create(tenantData);

  res.status(201).json({
    success: true,
    data: tenant
  });
});

/**
 * Obtiene todos los tenants del sistema
 * 
 * Retorna una lista completa de todos los tenants registrados en el sistema,
 * ordenados por fecha de creación (más recientes primero).
 * 
 * @route GET /api/v1/admin/tenants
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - count: Número total de tenants
 * - data: Array de objetos Tenant con información del creador
 * 
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * 
 * @example
 * // GET /api/v1/admin/tenants
 * // Retorna todos los tenants del sistema
 */
exports.getTenants = asyncHandler(async (req, res, next) => {
  const tenants = await Tenant.find()
    .populate('createdBy', 'nombres apellidos correo')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tenants.length,
    data: tenants
  });
});

/**
 * Obtiene un tenant específico por su ID
 * 
 * Retorna los datos completos de un tenant incluyendo información del creador.
 * 
 * @route GET /api/v1/admin/tenants/:id
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del tenant a obtener (MongoDB ObjectId)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Tenant completo con información del creador
 * 
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * @throws {404} Si el tenant no existe
 * 
 * @example
 * // GET /api/v1/admin/tenants/507f1f77bcf86cd799439011
 */
exports.getTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findById(req.params.id)
    .populate('createdBy', 'nombres apellidos correo');

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: tenant
  });
});

/**
 * Actualiza un tenant existente
 * 
 * Permite modificar los datos de un tenant. Solo usuarios con rol SUPERADMIN
 * pueden actualizar tenants.
 * 
 * @route PUT /api/v1/admin/tenants/:id
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del tenant a actualizar
 * @param {Object} req.body - Datos a actualizar (todos los campos son opcionales)
 * @param {string} [req.body.name] - Nuevo nombre del tenant
 * @param {Object} [req.body.branding] - Nueva configuración de branding
 * @param {string} [req.body.defaultCurrency] - Nueva moneda por defecto
 * @param {Object} [req.body.config] - Nueva configuración de features
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Tenant actualizado
 * 
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * @throws {404} Si el tenant no existe
 * @throws {400} Si los datos proporcionados son inválidos
 * 
 * @example
 * // Request body (todos los campos son opcionales)
 * {
 *   "branding": {
 *     "primaryColor": "#0066FF"
 *   }
 * }
 */
exports.updateTenant = asyncHandler(async (req, res, next) => {
  let tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant no encontrado'
    });
  }

  tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: tenant
  });
});

/**
 * Elimina un tenant del sistema
 * 
 * Elimina permanentemente un tenant. Esta acción debe usarse con precaución
 * ya que puede afectar a todos los usuarios y datos asociados al tenant.
 * Solo usuarios con rol SUPERADMIN pueden eliminar tenants.
 * 
 * @route DELETE /api/v1/admin/tenants/:id
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del tenant a eliminar
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - message: "Tenant eliminado"
 * 
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * @throws {404} Si el tenant no existe
 * 
 * @example
 * // DELETE /api/v1/admin/tenants/507f1f77bcf86cd799439011
 */
exports.deleteTenant = asyncHandler(async (req, res, next) => {
  const tenant = await Tenant.findById(req.params.id);

  if (!tenant) {
    return res.status(404).json({
      success: false,
      message: 'Tenant no encontrado'
    });
  }

  await tenant.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Tenant eliminado'
  });
});
