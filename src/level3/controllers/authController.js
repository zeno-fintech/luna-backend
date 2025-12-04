const asyncHandler = require('@core/utils/asyncHandler');
const authService = require('@level3/services/auth/authService');

/**
 * @fileoverview Controlador de autenticación - Maneja registro, login y obtención de usuario actual
 * @module level3/controllers/authController
 */

/**
 * Registra un nuevo usuario en el sistema
 * 
 * Crea un nuevo usuario con los datos proporcionados, hashea la contraseña,
 * crea un perfil por defecto y genera un token JWT para autenticación.
 * 
 * @route POST /api/v1/auth/register
 * @access Public
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.body - Datos del usuario a registrar
 * @param {string} req.body.nombres - Nombres del usuario (requerido)
 * @param {string} req.body.apellidos - Apellidos del usuario (requerido)
 * @param {string} req.body.correo - Correo electrónico del usuario (requerido, único)
 * @param {string} req.body.password - Contraseña del usuario (requerido, mínimo 6 caracteres)
 * @param {string} [req.body.telefono] - Teléfono del usuario (opcional)
 * @param {string} [req.body.domicilio] - Domicilio del usuario (opcional)
 * @param {string} req.body.tenantId - ID del tenant al que pertenece el usuario (requerido)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: {
 *   - token: Token JWT para autenticación
 *   - user: Datos del usuario creado (sin contraseña)
 *   - profile: Perfil por defecto creado
 *   }
 * 
 * @throws {400} Si faltan datos requeridos o el correo ya existe
 * @throws {500} Si hay un error al crear el usuario
 * 
 * @example
 * // Request body
 * {
 *   "nombres": "Juan",
 *   "apellidos": "Pérez",
 *   "correo": "juan@example.com",
 *   "password": "password123",
 *   "tenantId": "507f1f77bcf86cd799439011"
 * }
 */
exports.register = asyncHandler(async (req, res, _next) => {
  const result = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: result
  });
});

/**
 * Autentica un usuario y genera un token JWT
 * 
 * Verifica las credenciales del usuario (correo y contraseña) y si son
 * correctas, genera un token JWT que puede usarse para autenticar
 * requests posteriores.
 * 
 * @route POST /api/v1/auth/login
 * @access Public
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.body - Credenciales del usuario
 * @param {string} req.body.correo - Correo electrónico del usuario (requerido)
 * @param {string} req.body.password - Contraseña del usuario (requerido)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: {
 *   - token: Token JWT para autenticación
 *   - user: Datos del usuario autenticado (sin contraseña)
 *   - profile: Perfil por defecto del usuario (si existe)
 *   }
 * 
 * @throws {400} Si faltan correo o contraseña
 * @throws {401} Si las credenciales son incorrectas
 * @throws {401} Si el usuario está inactivo
 * 
 * @example
 * // Request body
 * {
 *   "correo": "juan@example.com",
 *   "password": "password123"
 * }
 */
exports.login = asyncHandler(async (req, res, _next) => {
  const { correo, password } = req.body;

  const result = await authService.login(correo, password);

  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * Obtiene los datos del usuario actualmente autenticado
 * 
 * Retorna la información completa del usuario que está haciendo el request,
 * incluyendo sus perfiles asociados. Requiere autenticación previa.
 * 
 * @route GET /api/v1/auth/me
 * @access Private (requiere token JWT válido)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: {
 *   - user: Datos completos del usuario (sin contraseña)
 *   - profiles: Array de perfiles asociados al usuario
 *   }
 * 
 * @throws {401} Si no hay token válido en el request
 * @throws {404} Si el usuario no existe
 * 
 * @example
 * // Headers requeridos
 * Authorization: Bearer <token>
 */
exports.getMe = asyncHandler(async (req, res, _next) => {
  const result = await authService.getMe(req.user.id);

  res.status(200).json({
    success: true,
    data: result
  });
});
