const asyncHandler = require('@core/utils/asyncHandler');
const adminMetricsService = require('@level1/services/adminMetricsService');

/**
 * @fileoverview Controlador de Admin - Proporciona métricas y overview global (Nivel 1 - Superadmin)
 * @module level1/controllers/adminController
 */

/**
 * Obtiene un overview global del sistema
 * 
 * Retorna métricas agregadas de todo el ecosistema incluyendo total de tenants,
 * usuarios, companies, transacciones, ingresos, etc. Solo disponible para SUPERADMIN.
 * 
 * @route GET /api/v1/admin/overview
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con overview global que incluye:
 *   - totalTenants: Número total de tenants
 *   - totalUsers: Número total de usuarios
 *   - totalCompanies: Número total de companies
 *   - totalTransactions: Número total de transacciones
 *   - mrr: Monthly Recurring Revenue total
 *   - arr: Annual Recurring Revenue total
 *   - usuariosPorTenant: Distribución de usuarios por tenant
 *   - ingresosPorTenant: Distribución de ingresos por tenant
 * 
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * 
 * @example
 * // GET /api/v1/admin/overview
 * // Retorna métricas globales del sistema
 */
exports.getGlobalOverview = asyncHandler(async (req, res, next) => {
  const overview = await adminMetricsService.getGlobalOverview();

  res.status(200).json({
    success: true,
    data: overview
  });
});

/**
 * Obtiene detalles completos de un tenant específico
 * 
 * Retorna información detallada de un tenant incluyendo métricas, usuarios,
 * companies, transacciones, ingresos, etc. Solo disponible para SUPERADMIN.
 * 
 * @route GET /api/v1/admin/tenants/:id/details
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del tenant del cual obtener detalles
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto con detalles del tenant que incluye:
 *   - tenant: Información básica del tenant
 *   - usuarios: Total y distribución de usuarios
 *   - companies: Total y lista de companies
 *   - transacciones: Total y estadísticas de transacciones
 *   - ingresos: Ingresos totales y por período
 *   - metricas: Métricas adicionales
 * 
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * @throws {404} Si el tenant no existe
 * 
 * @example
 * // GET /api/v1/admin/tenants/507f1f77bcf86cd799439011/details
 */
exports.getTenantDetails = asyncHandler(async (req, res, next) => {
  const tenantId = req.params.id;
  
  const details = await adminMetricsService.getTenantDetails(tenantId);

  res.status(200).json({
    success: true,
    data: details
  });
});

/**
 * Calcula y guarda un snapshot de métricas
 * 
 * Calcula métricas para un scope específico (global, tenant, company, user)
 * y las guarda como snapshot para análisis histórico. Solo disponible para SUPERADMIN.
 * 
 * @route POST /api/v1/admin/metrics/calculate
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object} req.body - Parámetros para calcular métricas
 * @param {string} req.body.scope - Scope de las métricas (requerido: 'global', 'tenant', 'company', 'user')
 * @param {string} [req.body.targetId] - ID del target (requerido si scope no es 'global')
 * @param {string} req.body.period - Período de las métricas (requerido: 'day', 'week', 'month', 'year')
 * @param {string} req.body.periodValue - Valor del período (requerido, ej: '2024-01' para month)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - message: "Métricas calculadas y guardadas exitosamente"
 * 
 * @throws {400} Si faltan parámetros requeridos
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * 
 * @example
 * // Request body
 * {
 *   "scope": "tenant",
 *   "targetId": "507f1f77bcf86cd799439011",
 *   "period": "month",
 *   "periodValue": "2024-01"
 * }
 */
exports.calculateMetricsSnapshot = asyncHandler(async (req, res, next) => {
  const { scope, targetId, period, periodValue } = req.body;

  if (!scope || !period || !periodValue) {
    return res.status(400).json({
      success: false,
      message: 'scope, period y periodValue son requeridos'
    });
  }

  await adminMetricsService.calculateAndSaveSnapshot(scope, targetId, period, periodValue);

  res.status(200).json({
    success: true,
    message: 'Métricas calculadas y guardadas exitosamente'
  });
});

/**
 * Obtiene snapshots de métricas guardados
 * 
 * Retorna una lista de snapshots de métricas previamente calculados y guardados,
 * con filtros opcionales por scope, target, período, etc.
 * 
 * @route GET /api/v1/admin/metrics/snapshots
 * @access Private (SUPERADMIN únicamente)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {Object} req.query - Query parameters para filtrar
 * @param {string} [req.query.scope] - Filtrar por scope ('global', 'tenant', 'company', 'user')
 * @param {string} [req.query.targetId] - Filtrar por ID del target
 * @param {string} [req.query.period] - Filtrar por período ('day', 'week', 'month', 'year')
 * @param {number} [req.query.limit=50] - Número máximo de snapshots a retornar
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - count: Número de snapshots encontrados
 * - data: Array de objetos MetricsSnapshot ordenados por fecha (más recientes primero)
 * 
 * @throws {403} Si el usuario no tiene rol SUPERADMIN
 * 
 * @example
 * // GET /api/v1/admin/metrics/snapshots?scope=tenant&period=month&limit=100
 */
exports.getMetricsSnapshots = asyncHandler(async (req, res, next) => {
  const { scope, targetId, period, limit = 50 } = req.query;
  
  const query = {};
  if (scope) query.scope = scope;
  if (targetId) query.targetId = targetId;
  if (period) query.period = period;

  const MetricsSnapshot = require('@models/MetricsSnapshot');
  const snapshots = await MetricsSnapshot.find(query)
    .sort({ calculatedAt: -1 })
    .limit(Number.parseInt(limit));

  res.status(200).json({
    success: true,
    count: snapshots.length,
    data: snapshots
  });
});
