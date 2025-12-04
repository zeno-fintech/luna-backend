const jwt = require('jsonwebtoken');

/**
 * @fileoverview Utilidad para generar tokens JWT con contexto multi-tenant
 * @module core/utils/generateToken
 */

/**
 * Genera un token JWT para un usuario con su contexto multi-tenant
 * 
 * Crea un token JWT que incluye el ID del usuario, su tenantId, companyId
 * y roles. Este token se usa para autenticar requests posteriores y mantener
 * el contexto del usuario en el sistema multi-tenant.
 * 
 * @param {Object} user - Objeto usuario del cual generar el token
 * @param {string|Object} user._id - ID del usuario (MongoDB ObjectId)
 * @param {string|Object} [user.id] - ID alternativo del usuario
 * @param {string|Object} [user.tenantId] - ID del tenant al que pertenece el usuario
 * @param {string|Object} [user.companyId] - ID de la company a la que pertenece (opcional)
 * @param {Array<string|Object>} [user.roles] - Array de roles del usuario
 * 
 * @returns {string} Token JWT firmado que expira según JWT_EXPIRE (default: 7 días)
 * 
 * @throws {Error} Si JWT_SECRET no está configurado en las variables de entorno
 * 
 * @example
 * // Generar token para un usuario
 * const user = {
 *   _id: "507f1f77bcf86cd799439011",
 *   tenantId: "507f1f77bcf86cd799439012",
 *   companyId: "507f1f77bcf86cd799439013",
 *   roles: ["USER"]
 * };
 * const token = generateToken(user);
 * // Retorna: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
const generateToken = (user) => {
  // Extract role names if roles are populated objects, otherwise use IDs
  let roleNames = [];
  if (user.roles && user.roles.length > 0) {
    roleNames = user.roles.map(role => {
      if (typeof role === 'object' && role.name) {
        return role.name;
      }
      return role.toString();
    });
  }

  const payload = {
    id: user._id || user.id,
    tenantId: user.tenantId?._id || user.tenantId,
    companyId: user.companyId?._id || user.companyId,
    roles: roleNames
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = generateToken;
