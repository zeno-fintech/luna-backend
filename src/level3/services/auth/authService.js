const User = require('@models/User');
const Profile = require('@models/Profile');
const generateToken = require('@core/utils/generateToken');

/**
 * @fileoverview Servicio de autenticación - Lógica de negocio para registro, login y gestión de usuarios
 * @module level3/services/auth/authService
 */

/**
 * Registra un nuevo usuario en el sistema
 * 
 * Crea un nuevo usuario con los datos proporcionados, hashea automáticamente
 * la contraseña, crea un perfil por defecto y genera un token JWT para
 * autenticación inmediata.
 * 
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.nombres - Nombres del usuario (requerido)
 * @param {string} userData.apellidos - Apellidos del usuario (requerido)
 * @param {string} userData.correo - Correo electrónico del usuario (requerido, debe ser único)
 * @param {string} userData.password - Contraseña del usuario (requerido, mínimo 6 caracteres, se hashea automáticamente)
 * @param {string} [userData.telefono] - Teléfono del usuario (opcional)
 * @param {string} [userData.domicilio] - Domicilio del usuario (opcional)
 * @param {string} userData.tenantId - ID del tenant al que pertenece el usuario (requerido)
 * 
 * @returns {Promise<Object>} Objeto con:
 * - success: true
 * - token: Token JWT para autenticación
 * - user: Datos del usuario creado (sin contraseña)
 *   - id: ID del usuario
 *   - nombres: Nombres del usuario
 *   - apellidos: Apellidos del usuario
 *   - correo: Correo electrónico
 *   - telefono: Teléfono (si se proporcionó)
 *   - condicion: Condición del usuario (default: "Titular")
 * - profile: Perfil por defecto creado
 *   - id: ID del perfil
 *   - nombrePerfil: Nombre del perfil (nombres + apellidos)
 * 
 * @throws {Error} "El usuario ya existe" - Si el correo ya está registrado
 * @throws {Error} Si hay un error al crear el usuario o perfil
 * 
 * @example
 * const userData = {
 *   nombres: "Juan",
 *   apellidos: "Pérez",
 *   correo: "juan@example.com",
 *   password: "password123",
 *   tenantId: "507f1f77bcf86cd799439011"
 * };
 * const result = await authService.register(userData);
 * // result.token puede usarse para autenticar requests
 */
exports.register = async (userData) => {
  const { nombres, apellidos, correo, password, telefono, domicilio } = userData;

  // Check if user exists
  const existingUser = await User.findOne({ correo });
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  // Create user
  const user = await User.create({
    nombres,
    apellidos,
    correo,
    password,
    telefono,
    domicilio
  });

  // Create default profile
  const profile = await Profile.create({
    usuarioID: user._id,
    nombrePerfil: `${nombres} ${apellidos}`,
    isDefault: true
  });

  // Generate token with user context
  const token = generateToken(user);

  return {
    success: true,
    token,
    user: {
      id: user._id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      telefono: user.telefono,
      condicion: user.condicion
    },
    profile: {
      id: profile._id,
      nombrePerfil: profile.nombrePerfil
    }
  };
};

/**
 * Autentica un usuario con correo y contraseña
 * 
 * Verifica las credenciales del usuario y si son correctas, genera un
 * token JWT para autenticación. La contraseña se compara usando bcrypt.
 * 
 * @param {string} correo - Correo electrónico del usuario (requerido)
 * @param {string} password - Contraseña del usuario en texto plano (requerido)
 * 
 * @returns {Promise<Object>} Objeto con:
 * - success: true
 * - token: Token JWT para autenticación
 * - user: Datos del usuario autenticado (sin contraseña)
 *   - id: ID del usuario
 *   - nombres: Nombres del usuario
 *   - apellidos: Apellidos del usuario
 *   - correo: Correo electrónico
 *   - telefono: Teléfono (si existe)
 *   - condicion: Condición del usuario
 * - profile: Perfil por defecto del usuario (si existe)
 *   - id: ID del perfil
 *   - nombrePerfil: Nombre del perfil
 * 
 * @throws {Error} "Por favor ingresa correo y contraseña" - Si faltan credenciales
 * @throws {Error} "Credenciales inválidas" - Si el usuario no existe o la contraseña es incorrecta
 * @throws {Error} "Usuario inactivo" - Si el usuario existe pero está marcado como inactivo
 * 
 * @example
 * const token = await authService.login("juan@example.com", "password123");
 * // Retorna token JWT y datos del usuario
 */
exports.login = async (correo, password) => {
  // Validate email & password
  if (!correo || !password) {
    throw new Error('Por favor ingresa correo y contraseña');
  }

  // Check for user
  const user = await User.findOne({ correo }).select('+password');

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  if (!user.isActive) {
    throw new Error('Usuario inactivo');
  }

  // Populate roles before generating token
  await user.populate('roles', 'name level');

  // Generate token with user context
  const token = generateToken(user);

  // Get default profile
  const profile = await Profile.findOne({ usuarioID: user._id, isDefault: true });

  return {
    success: true,
    token,
    user: {
      id: user._id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      telefono: user.telefono,
      condicion: user.condicion
    },
    profile: profile ? {
      id: profile._id,
      nombrePerfil: profile.nombrePerfil
    } : null
  };
};

/**
 * Obtiene los datos completos del usuario y sus perfiles
 * 
 * Retorna la información completa del usuario incluyendo todos sus perfiles
 * asociados. Útil para obtener el contexto completo del usuario autenticado.
 * 
 * @param {string} userId - ID del usuario a obtener (MongoDB ObjectId)
 * 
 * @returns {Promise<Object>} Objeto con:
 * - user: Datos completos del usuario (sin contraseña)
 *   - id: ID del usuario
 *   - nombres: Nombres del usuario
 *   - apellidos: Apellidos del usuario
 *   - correo: Correo electrónico
 *   - telefono: Teléfono (si existe)
 *   - condicion: Condición del usuario
 *   - domicilio: Domicilio (si existe)
 *   - id_plan: ID del plan asociado (si existe)
 * - profiles: Array de todos los perfiles asociados al usuario
 * 
 * @throws {Error} "Usuario no encontrado" - Si el usuario no existe
 * 
 * @example
 * const userData = await authService.getMe("507f1f77bcf86cd799439011");
 * // Retorna usuario y todos sus perfiles
 */
exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const profiles = await Profile.find({ usuarioID: userId });

  return {
    user: {
      id: user._id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      telefono: user.telefono,
      condicion: user.condicion,
      domicilio: user.domicilio,
      id_plan: user.id_plan
    },
    profiles
  };
};
