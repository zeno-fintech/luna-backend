const jwt = require('jsonwebtoken');
const User = require('@models/User');
const Role = require('@models/Role');

/**
 * @fileoverview Middleware de autenticación y autorización para rutas protegidas
 * @module core/middleware/auth
 */

/**
 * Middleware que protege rutas verificando el token JWT del usuario
 * 
 * Verifica que el request tenga un token JWT válido en el header Authorization
 * o en las cookies. Si el token es válido, carga el usuario completo con sus
 * roles, tenant y company en req.user.
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.headers - Headers del request
 * @param {string} [req.headers.authorization] - Header con formato "Bearer <token>"
 * @param {Object} [req.cookies] - Cookies del request
 * @param {string} [req.cookies.token] - Token JWT en cookie
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {void} Si el token es válido, llama a next(). Si no, responde con error 401
 * 
 * @throws {401} Si no hay token en el request
 * @throws {401} Si el token es inválido o expiró
 * @throws {401} Si el usuario no existe o está inactivo
 * 
 * @example
 * // Uso en una ruta
 * router.get('/profile', protect, getProfile);
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Debug: Log token presence (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Auth Debug:', {
      hasAuthHeader: !!req.headers.authorization,
      authHeader: req.headers.authorization ? req.headers.authorization.substring(0, 20) + '...' : null,
      hasToken: !!token,
      path: req.path
    });
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado para acceder a esta ruta',
      debug: process.env.NODE_ENV === 'development' ? {
        hasAuthHeader: !!req.headers.authorization,
        authHeaderValue: req.headers.authorization || 'No Authorization header'
      } : undefined
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token with roles populated
    req.user = await User.findById(decoded.id)
      .select('-password')
      .populate('roles', 'name level permissions')
      .populate('tenantId', 'name slug type')
      .populate('companyId', 'name');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    // Set multi-tenant context from token (may be more recent than DB)
    // But keep populated roles from DB as they have full role information
    req.user.tenantId = decoded.tenantId || req.user.tenantId;
    req.user.companyId = decoded.companyId || req.user.companyId;
    // Don't override populated roles from DB - they have name, level, permissions
    // Only use token roles if DB roles are not populated
    if (!req.user.roles || req.user.roles.length === 0 || typeof req.user.roles[0] === 'string') {
      req.user.roles = decoded.roles || req.user.roles;
    }

    next();
  } catch (error) {
    // Debug: Log error details (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Token verification error:', error.message);
    }
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      debug: process.env.NODE_ENV === 'development' ? {
        error: error.message
      } : undefined
    });
  }
};

/**
 * Middleware que autoriza el acceso basado en roles del usuario
 * 
 * Verifica que el usuario autenticado tenga uno de los roles permitidos.
 * Debe usarse después del middleware protect().
 * 
 * @param {...string} allowedRoles - Lista de roles permitidos (ej: 'SUPERADMIN', 'USER')
 * @returns {Function} Middleware de Express que verifica los roles
 * 
 * @throws {403} Si el usuario no tiene ninguno de los roles permitidos
 * 
 * @example
 * // Solo permite acceso a SUPERADMIN
 * router.get('/admin', protect, authorize('SUPERADMIN'), getAdmin);
 * 
 * // Permite acceso a múltiples roles
 * router.get('/dashboard', protect, authorize('TENANT_OWNER', 'TENANT_ADMIN'), getDashboard);
 */
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || req.user.roles.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a esta ruta'
      });
    }

    // Check if user has any of the allowed roles
    // Roles can be objects (populated from DB) or strings (from token or ObjectId)
    const userRoleNames = req.user.roles.map(role => {
      if (typeof role === 'object' && role.name) {
        return role.name.toUpperCase();
      }
      if (typeof role === 'string') {
        return role.toUpperCase();
      }
      // If it's an ObjectId, we can't get the name without querying
      return null;
    }).filter(name => name !== null);

    // SUPERADMIN (Nivel 1) tiene acceso a TODO - puede acceder a cualquier endpoint
    if (userRoleNames.includes('SUPERADMIN')) {
      return next();
    }

    // Para otros roles, verificar que tengan uno de los roles permitidos
    const hasAccess = allowedRoles.some(allowedRole => 
      userRoleNames.includes(allowedRole.toUpperCase())
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a esta ruta'
      });
    }

    next();
  };
};

/**
 * Middleware que agrega el tenantId del usuario al request
 * 
 * Extrae el tenantId del usuario autenticado y lo agrega a req.tenantId
 * para facilitar el filtrado de consultas por tenant.
 * 
 * @param {Object} req - Request de Express (debe tener req.user)
 * @param {Object} req.user - Usuario autenticado
 * @param {Object|string} req.user.tenantId - ID del tenant del usuario
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {void} Agrega req.tenantId y llama a next()
 * 
 * @example
 * router.get('/data', protect, scopeByTenant, (req, res) => {
 *   // req.tenantId está disponible aquí
 *   const data = await Model.find({ tenantId: req.tenantId });
 * });
 */
exports.scopeByTenant = (req, res, next) => {
  if (req.user && req.user.tenantId) {
    req.tenantId = req.user.tenantId._id || req.user.tenantId;
  }
  next();
};

/**
 * Middleware que agrega el companyId del usuario al request
 * 
 * Extrae el companyId del usuario autenticado y lo agrega a req.companyId
 * para facilitar el filtrado de consultas por company.
 * 
 * @param {Object} req - Request de Express (debe tener req.user)
 * @param {Object} req.user - Usuario autenticado
 * @param {Object|string} [req.user.companyId] - ID de la company del usuario (opcional)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {void} Agrega req.companyId (si existe) y llama a next()
 * 
 * @example
 * router.get('/company-data', protect, scopeByCompany, (req, res) => {
 *   if (req.companyId) {
 *     const data = await Model.find({ companyId: req.companyId });
 *   }
 * });
 */
exports.scopeByCompany = (req, res, next) => {
  if (req.user && req.user.companyId) {
    req.companyId = req.user.companyId._id || req.user.companyId;
  }
  next();
};
