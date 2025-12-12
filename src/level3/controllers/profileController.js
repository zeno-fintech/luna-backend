const asyncHandler = require('@core/utils/asyncHandler');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Perfiles - Maneja CRUD de perfiles financieros de usuarios
 * @module level3/controllers/profileController
 */

/**
 * Obtiene todos los perfiles del usuario autenticado
 * 
 * Retorna una lista de todos los perfiles financieros asociados al usuario
 * que está haciendo el request. Cada usuario puede tener múltiples perfiles
 * para organizar sus finanzas (ej: personal, familiar, negocio).
 * 
 * @route GET /api/v1/profiles
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
 * - count: Número de perfiles encontrados
 * - data: Array de objetos Profile del usuario
 * 
 * @example
 * // GET /api/v1/profiles
 * // Retorna todos los perfiles del usuario autenticado
 */
exports.getProfiles = asyncHandler(async (req, res, next) => {
  const profiles = await Profile.find({ usuarioID: req.user.id });

  // Retornar información completa de cada perfil
  const profilesData = profiles.map(profile => profile.getInformacionCompleta());

  res.status(200).json({
    success: true,
    count: profiles.length,
    data: profilesData
  });
});

/**
 * Obtiene un perfil específico por su ID con información completa
 * 
 * Retorna los datos completos de un perfil si pertenece al usuario autenticado,
 * incluyendo información básica, configuración y estado de verificación.
 * 
 * @route GET /api/v1/profiles/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del perfil a obtener (MongoDB ObjectId)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Profile completo con información completa
 * 
 * @throws {404} Si el perfil no existe o no pertenece al usuario
 * 
 * @example
 * // GET /api/v1/profiles/507f1f77bcf86cd799439011
 */
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({
    _id: req.params.id,
    usuarioID: req.user.id
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado'
    });
  }

  // Retornar información completa usando el método helper
  const informacionCompleta = profile.getInformacionCompleta();

  res.status(200).json({
    success: true,
    data: informacionCompleta
  });
});

/**
 * Crea un nuevo perfil financiero para el usuario autenticado
 * 
 * Permite crear un nuevo perfil financiero que el usuario puede usar para
 * organizar sus transacciones, cuentas y otros datos financieros.
 * 
 * @route POST /api/v1/profiles
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado (se asigna automáticamente)
 * @param {Object} req.body - Datos del perfil a crear
 * @param {string} req.body.nombrePerfil - Nombre del perfil (requerido)
 * @param {string} [req.body.tipo] - Tipo de perfil: 'persona' | 'empresa' (opcional, default: 'persona')
 * @param {boolean} [req.body.isDefault] - Si es el perfil por defecto (opcional, default: false)
 * @param {boolean} [req.body.isPrincipal] - Si es el perfil principal (opcional, default: false)
 * @param {Object} [req.body.informacionBasica] - Información básica del perfil
 * @param {string} [req.body.informacionBasica.nombres] - Nombres
 * @param {string} [req.body.informacionBasica.apellidos] - Apellidos
 * @param {Date} [req.body.informacionBasica.fechaNacimiento] - Fecha de nacimiento
 * @param {string} [req.body.informacionBasica.sexo] - Sexo: 'M' | 'F' | 'Otro'
 * @param {string} [req.body.informacionBasica.paisResidencia] - País de residencia
 * @param {Object} [req.body.informacionBasica.domicilio] - Dirección completa
 * @param {string} [req.body.informacionBasica.correo] - Correo (opcional para empresas)
 * @param {string} [req.body.informacionBasica.correoRespaldo] - Correo de respaldo
 * @param {string} [req.body.informacionBasica.telefono] - Teléfono
 * @param {Object} [req.body.configuracion] - Configuración del perfil
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Profile creado
 * 
 * @throws {400} Si faltan datos requeridos o son inválidos
 * 
 * @example
 * // Request body - Perfil persona
 * {
 *   "nombrePerfil": "Franco",
 *   "tipo": "persona",
 *   "isPrincipal": true,
 *   "informacionBasica": {
 *     "nombres": "Franco",
 *     "apellidos": "Castro",
 *     "fechaNacimiento": "1990-01-15",
 *     "sexo": "M",
 *     "paisResidencia": "CL",
 *     "domicilio": {
 *       "calle": "Av. Principal",
 *       "numero": "123",
 *       "comuna": "Santiago"
 *     },
 *     "correo": "franco@example.com",
 *     "telefono": "+56912345678"
 *   }
 * }
 */
exports.createProfile = asyncHandler(async (req, res, next) => {
  req.body.usuarioID = req.user.id;
  
  // Mapear 'nombre' a 'nombrePerfil' si viene (para compatibilidad)
  if (req.body.nombre && !req.body.nombrePerfil) {
    req.body.nombrePerfil = req.body.nombre;
    delete req.body.nombre;
  }
  
  // Normalizar tipo: convertir 'Personal' a 'persona', 'Empresa' a 'empresa'
  if (req.body.tipo) {
    const tipoLower = req.body.tipo.toLowerCase();
    if (tipoLower === 'personal' || tipoLower === 'persona') {
      req.body.tipo = 'persona';
    } else if (tipoLower === 'empresa' || tipoLower === 'company') {
      req.body.tipo = 'empresa';
    }
  }
  
  // Mapear 'moneda' del nivel raíz a 'configuracion.moneda' si viene
  if (req.body.moneda && !req.body.configuracion) {
    req.body.configuracion = {
      moneda: req.body.moneda
    };
    delete req.body.moneda;
  } else if (req.body.moneda && req.body.configuracion) {
    req.body.configuracion.moneda = req.body.moneda;
    delete req.body.moneda;
  }
  
  // Si es perfil principal, asociar correo del usuario si no se proporciona
  if (req.body.isPrincipal && !req.body.informacionBasica?.correo) {
    const User = require('@models/User');
    const user = await User.findById(req.user.id);
    if (user && user.correo) {
      if (!req.body.informacionBasica) {
        req.body.informacionBasica = {};
      }
      req.body.informacionBasica.correo = user.correo;
    }
  }
  
  const profile = await Profile.create(req.body);

  res.status(201).json({
    success: true,
    data: profile.getInformacionCompleta()
  });
});

/**
 * Actualiza un perfil existente
 * 
 * Permite modificar los datos de un perfil que pertenece al usuario autenticado.
 * Puede actualizar información básica, configuración, y establecer como principal.
 * 
 * @route PUT /api/v1/profiles/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del perfil a actualizar
 * @param {Object} req.body - Datos a actualizar (todos los campos son opcionales)
 * @param {string} [req.body.nombrePerfil] - Nuevo nombre del perfil
 * @param {string} [req.body.tipo] - Nuevo tipo: 'persona' | 'empresa'
 * @param {boolean} [req.body.isPrincipal] - Establecer como perfil principal
 * @param {Object} [req.body.informacionBasica] - Actualizar información básica
 * @param {Object} [req.body.configuracion] - Actualizar configuración
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Profile actualizado
 * 
 * @throws {404} Si el perfil no existe o no pertenece al usuario
 * @throws {400} Si los datos proporcionados son inválidos
 * 
 * @example
 * // Request body (todos los campos son opcionales)
 * {
 *   "nombrePerfil": "Franco Actualizado",
 *   "isPrincipal": true,
 *   "informacionBasica": {
 *     "telefono": "+56987654321",
 *     "correoRespaldo": "backup@example.com"
 *   }
 * }
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  let profile = await Profile.findOne({
    _id: req.params.id,
    usuarioID: req.user.id
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado'
    });
  }

  // Si se está estableciendo como principal y tiene correo del usuario
  if (req.body.isPrincipal && !req.body.informacionBasica?.correo) {
    const User = require('@models/User');
    const user = await User.findById(req.user.id);
    if (user && user.correo) {
      if (!req.body.informacionBasica) {
        req.body.informacionBasica = {};
      }
      if (!profile.informacionBasica?.correo) {
        req.body.informacionBasica.correo = user.correo;
      }
    }
  }

  profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: profile.getInformacionCompleta()
  });
});

/**
 * Elimina un perfil del sistema
 * 
 * Elimina permanentemente un perfil que pertenece al usuario autenticado.
 * No se puede eliminar el perfil por defecto.
 * 
 * @route DELETE /api/v1/profiles/:id
 * @access Private (requiere autenticación)
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.user - Usuario autenticado (agregado por middleware protect)
 * @param {string} req.user.id - ID del usuario autenticado
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.id - ID del perfil a eliminar
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - message: "Perfil eliminado"
 * 
 * @throws {404} Si el perfil no existe o no pertenece al usuario
 * @throws {400} Si se intenta eliminar el perfil por defecto
 * 
 * @example
 * // DELETE /api/v1/profiles/507f1f77bcf86cd799439011
 */
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({
    _id: req.params.id,
    usuarioID: req.user.id
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Perfil no encontrado'
    });
  }

  if (profile.isDefault) {
    return res.status(400).json({
      success: false,
      message: 'No se puede eliminar el perfil por defecto'
    });
  }

  await profile.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Perfil eliminado'
  });
});
