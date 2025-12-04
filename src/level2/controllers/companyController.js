const asyncHandler = require('@core/utils/asyncHandler');
const Company = require('@models/Company');
const Tenant = require('@models/Tenant');

/**
 * @fileoverview Controlador de Companies - Maneja CRUD de empresas para tenants
 * @module level2/controllers/companyController
 */

/**
 * Crea una nueva empresa (company) dentro del tenant del usuario autenticado
 * 
 * Crea una nueva empresa asociada al tenant del usuario que hace el request.
 * Solo usuarios con rol TENANT_OWNER o TENANT_ADMIN pueden crear empresas.
 * 
 * @route POST /api/v1/tenant/companies
 * @access Private (TENANT_OWNER, TENANT_ADMIN)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object|string} req.user.tenantId - ID del tenant del usuario
 * @param {string} req.user.id - ID del usuario que crea la empresa
 * @param {Object} req.body - Datos de la empresa a crear
 * @param {string} req.body.name - Nombre de la empresa (requerido)
 * @param {string} [req.body.industry] - Industria de la empresa (opcional)
 * @param {string} [req.body.country] - País de la empresa (opcional)
 * @param {string} [req.body.city] - Ciudad de la empresa (opcional)
 * @param {number} [req.body.size] - Tamaño de la empresa en empleados (opcional, default: 0)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Company creado con todos sus datos
 * 
 * @throws {400} Si faltan datos requeridos
 * @throws {403} Si el usuario no tiene permisos (no es TENANT_OWNER o TENANT_ADMIN)
 * @throws {500} Si hay un error al crear la empresa
 * 
 * @example
 * // Request body
 * {
 *   "name": "Empresa Ejemplo S.A.",
 *   "industry": "Tecnología",
 *   "country": "CL",
 *   "city": "Santiago"
 * }
 */
exports.createCompany = asyncHandler(async (req, res, next) => {
  // Ensure company belongs to user's tenant
  const companyData = {
    ...req.body,
    tenantId: req.user.tenantId._id || req.user.tenantId,
    createdBy: req.user.id
  };

  const company = await Company.create(companyData);

  res.status(201).json({
    success: true,
    data: company
  });
});

/**
 * Obtiene todas las empresas del tenant del usuario autenticado
 * 
 * Retorna una lista de todas las empresas que pertenecen al tenant
 * del usuario autenticado. Solo usuarios con rol TENANT_OWNER o TENANT_ADMIN
 * pueden ver esta lista.
 * 
 * @route GET /api/v1/tenant/companies
 * @access Private (TENANT_OWNER, TENANT_ADMIN)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object|string} req.user.tenantId - ID del tenant del usuario
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - count: Número total de empresas encontradas
 * - data: Array de objetos Company con datos completos, incluyendo información del creador
 * 
 * @throws {403} Si el usuario no tiene permisos
 * 
 * @example
 * // Response
 * {
 *   "success": true,
 *   "count": 5,
 *   "data": [
 *     { "_id": "...", "name": "Empresa 1", ... },
 *     { "_id": "...", "name": "Empresa 2", ... }
 *   ]
 * }
 */
exports.getCompanies = asyncHandler(async (req, res, next) => {
  const tenantId = req.user.tenantId._id || req.user.tenantId;

  const companies = await Company.find({ tenantId })
    .populate('createdBy', 'nombres apellidos correo')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies
  });
});

/**
 * Obtiene una empresa específica por su ID
 * 
 * Retorna los datos completos de una empresa si pertenece al tenant
 * del usuario autenticado. Permite acceso a TENANT_OWNER, TENANT_ADMIN y COMPANY_ADMIN.
 * 
 * @route GET /api/v1/tenant/companies/:id
 * @access Private (TENANT_OWNER, TENANT_ADMIN, COMPANY_ADMIN)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object|string} req.user.tenantId - ID del tenant del usuario
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la empresa a obtener
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Company completo con información del creador
 * 
 * @throws {403} Si el usuario no tiene permisos
 * @throws {404} Si la empresa no existe o no pertenece al tenant del usuario
 * 
 * @example
 * // URL: GET /api/v1/tenant/companies/507f1f77bcf86cd799439011
 */
exports.getCompany = asyncHandler(async (req, res, next) => {
  const tenantId = req.user.tenantId._id || req.user.tenantId;
  const companyId = req.params.id;

  const company = await Company.findOne({
    _id: companyId,
    tenantId
  }).populate('createdBy', 'nombres apellidos correo');

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Empresa no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: company
  });
});

/**
 * Actualiza los datos de una empresa existente
 * 
 * Permite modificar los datos de una empresa que pertenece al tenant
 * del usuario autenticado. Solo usuarios con rol TENANT_OWNER, TENANT_ADMIN
 * o COMPANY_ADMIN pueden actualizar empresas.
 * 
 * @route PUT /api/v1/tenant/companies/:id
 * @access Private (TENANT_OWNER, TENANT_ADMIN, COMPANY_ADMIN)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object|string} req.user.tenantId - ID del tenant del usuario
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la empresa a actualizar
 * @param {Object} req.body - Datos a actualizar (campos opcionales)
 * @param {string} [req.body.name] - Nuevo nombre de la empresa
 * @param {string} [req.body.industry] - Nueva industria
 * @param {string} [req.body.country] - Nuevo país
 * @param {string} [req.body.city] - Nueva ciudad
 * @param {number} [req.body.size] - Nuevo tamaño
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Company actualizado
 * 
 * @throws {403} Si el usuario no tiene permisos
 * @throws {404} Si la empresa no existe o no pertenece al tenant
 * @throws {400} Si los datos proporcionados son inválidos
 * 
 * @example
 * // Request body (todos los campos son opcionales)
 * {
 *   "name": "Nuevo Nombre S.A.",
 *   "size": 100
 * }
 */
exports.updateCompany = asyncHandler(async (req, res, next) => {
  const tenantId = req.user.tenantId._id || req.user.tenantId;
  const companyId = req.params.id;

  let company = await Company.findOne({
    _id: companyId,
    tenantId
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Empresa no encontrada'
    });
  }

  company = await Company.findByIdAndUpdate(companyId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: company
  });
});

/**
 * Elimina una empresa del sistema
 * 
 * Elimina permanentemente una empresa que pertenece al tenant del usuario
 * autenticado. Solo usuarios con rol TENANT_OWNER o TENANT_ADMIN pueden
 * eliminar empresas.
 * 
 * @route DELETE /api/v1/tenant/companies/:id
 * @access Private (TENANT_OWNER, TENANT_ADMIN)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object|string} req.user.tenantId - ID del tenant del usuario
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la empresa a eliminar
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - message: "Empresa eliminada"
 * 
 * @throws {403} Si el usuario no tiene permisos
 * @throws {404} Si la empresa no existe o no pertenece al tenant
 * 
 * @example
 * // URL: DELETE /api/v1/tenant/companies/507f1f77bcf86cd799439011
 */
exports.deleteCompany = asyncHandler(async (req, res, next) => {
  const tenantId = req.user.tenantId._id || req.user.tenantId;
  const companyId = req.params.id;

  const company = await Company.findOne({
    _id: companyId,
    tenantId
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Empresa no encontrada'
    });
  }

  await company.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Empresa eliminada'
  });
});
