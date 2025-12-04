const asyncHandler = require('@core/utils/asyncHandler');
const tenantMetricsService = require('@level2/services/tenantMetricsService');

/**
 * @fileoverview Controlador de Dashboard - Proporciona dashboards para tenants y companies (Nivel 2)
 * @module level2/controllers/dashboardController
 */

/**
 * Obtiene el dashboard del tenant del usuario autenticado
 * 
 * Retorna métricas y estadísticas agregadas del tenant incluyendo usuarios,
 * companies, transacciones, ingresos, etc. Solo disponible para usuarios con
 * rol TENANT_OWNER o TENANT_ADMIN.
 * 
 * @route GET /api/v1/tenant/dashboard
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
 * - data: Objeto con:
 *   - tenant: Información básica del tenant (id, name)
 *   - metrics: Métricas del tenant que incluyen:
 *     - totalUsers: Total de usuarios en el tenant
 *     - activeUsers: Usuarios activos
 *     - totalCompanies: Total de companies
 *     - totalTransactions: Total de transacciones
 *     - ingresos: Ingresos totales
 *     - gastos: Gastos totales
 *     - balance: Balance neto
 *     - mrr: Monthly Recurring Revenue (si aplica)
 * 
 * @throws {403} Si el usuario no tiene rol TENANT_OWNER o TENANT_ADMIN
 * 
 * @example
 * // GET /api/v1/tenant/dashboard
 * // Retorna dashboard del tenant del usuario autenticado
 */
exports.getTenantDashboard = asyncHandler(async (req, res, next) => {
  const tenantId = req.user.tenantId._id || req.user.tenantId;

  const metrics = await tenantMetricsService.getTenantMetrics(tenantId);

  res.status(200).json({
    success: true,
    data: {
      tenant: {
        id: tenantId,
        name: req.user.tenantId.name || 'N/A'
      },
      metrics
    }
  });
});

/**
 * Obtiene el dashboard de una company específica
 * 
 * Retorna métricas y estadísticas de una company que pertenece al tenant
 * del usuario autenticado. Solo disponible para usuarios con rol
 * TENANT_OWNER, TENANT_ADMIN o COMPANY_ADMIN.
 * 
 * @route GET /api/v1/tenant/dashboard/companies/:id/dashboard
 * @access Private (TENANT_OWNER, TENANT_ADMIN, COMPANY_ADMIN)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object|string} req.user.tenantId - ID del tenant del usuario
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID de la company de la cual obtener el dashboard
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con:
 *   - company: Información básica de la company (id)
 *   - metrics: Métricas de la company que incluyen:
 *     - totalUsers: Total de usuarios en la company
 *     - activeUsers: Usuarios activos
 *     - totalTransactions: Total de transacciones
 *     - ingresos: Ingresos totales de usuarios de la company
 *     - gastos: Gastos totales
 *     - balance: Balance neto
 *     - saludFinanciera: Score promedio de salud financiera
 * 
 * @throws {403} Si el usuario no tiene permisos o la company no pertenece al tenant
 * @throws {404} Si la company no existe
 * 
 * @example
 * // GET /api/v1/tenant/dashboard/companies/507f1f77bcf86cd799439011/dashboard
 */
exports.getCompanyDashboard = asyncHandler(async (req, res, next) => {
  const companyId = req.params.id;
  const tenantId = req.user.tenantId._id || req.user.tenantId;

  const metrics = await tenantMetricsService.getCompanyMetrics(companyId, tenantId);

  res.status(200).json({
    success: true,
    data: {
      company: {
        id: companyId
      },
      metrics
    }
  });
});
