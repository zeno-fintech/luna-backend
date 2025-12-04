const asyncHandler = require('@core/utils/asyncHandler');
const Asset = require('@models/Asset');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Activos - Maneja CRUD de activos
 * @module level3/controllers/assetController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todos los activos de un perfil
 * 
 * @route GET /api/v1/assets?perfilID=xxx&tipo=Propiedades
 * @access Private (requiere autenticación)
 */
exports.getAssets = asyncHandler(async (req, res, next) => {
  const { perfilID, tipo } = req.query;

  if (!perfilID) {
    return res.status(400).json({
      success: false,
      message: 'perfilID es requerido'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  const query = { perfilID };
  if (tipo) query.tipo = tipo;

  const assets = await Asset.find(query)
    .sort({ fecha: -1 });

  // Calcular total por tipo
  const totalPorTipo = {};
  const totalGeneral = assets.reduce((sum, asset) => {
    if (!totalPorTipo[asset.tipo]) {
      totalPorTipo[asset.tipo] = 0;
    }
    totalPorTipo[asset.tipo] += asset.valor;
    return sum + asset.valor;
  }, 0);

  res.status(200).json({
    success: true,
    count: assets.length,
    totalGeneral,
    totalPorTipo,
    data: assets
  });
});

/**
 * Obtiene un activo específico
 * 
 * @route GET /api/v1/assets/:id
 * @access Private (requiere autenticación)
 */
exports.getAsset = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, asset.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  res.status(200).json({
    success: true,
    data: asset
  });
});

/**
 * Crea un nuevo activo
 * 
 * @route POST /api/v1/assets
 * @access Private (requiere autenticación)
 */
exports.createAsset = asyncHandler(async (req, res, next) => {
  const { perfilID, tipo, valor, fecha, descripcion } = req.body;

  if (!perfilID || !tipo || !valor) {
    return res.status(400).json({
      success: false,
      message: 'perfilID, tipo y valor son requeridos'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  const asset = await Asset.create({
    perfilID,
    tipo,
    valor,
    fecha: fecha || new Date(),
    descripcion: descripcion || null
  });

  res.status(201).json({
    success: true,
    data: asset
  });
});

/**
 * Actualiza un activo
 * 
 * @route PUT /api/v1/assets/:id
 * @access Private (requiere autenticación)
 */
exports.updateAsset = asyncHandler(async (req, res, next) => {
  let asset = await Asset.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, asset.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: asset
  });
});

/**
 * Elimina un activo
 * 
 * @route DELETE /api/v1/assets/:id
 * @access Private (requiere autenticación)
 */
exports.deleteAsset = asyncHandler(async (req, res, next) => {
  const asset = await Asset.findById(req.params.id);

  if (!asset) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, asset.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  await asset.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Activo eliminado'
  });
});

