const asyncHandler = require('@core/utils/asyncHandler');
const AssetValuation = require('@models/AssetValuation');
const Asset = require('@models/Asset');
const Profile = require('@models/Profile');

/**
 * @fileoverview Controlador de Tasaciones de Activos
 * Maneja CRUD de historial de tasaciones de activos
 * @module level3/controllers/assetValuationController
 */

/**
 * Valida que un perfil pertenece al usuario autenticado
 */
const validateProfileOwnership = async (userId, profileId) => {
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};

/**
 * Obtiene todas las tasaciones de un activo
 * 
 * @route GET /api/v1/assets/:assetId/valuations
 * @access Private (requiere autenticación)
 */
exports.getAssetValuations = asyncHandler(async (req, res, next) => {
  const { assetId } = req.params;

  // Verificar que el activo existe y pertenece al usuario
  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  if (!(await validateProfileOwnership(req.user.id, asset.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  // Obtener todas las tasaciones ordenadas por fecha (más reciente primero)
  const valuations = await AssetValuation.find({ activoID: assetId })
    .sort({ fecha: -1 });

  res.status(200).json({
    success: true,
    count: valuations.length,
    data: valuations
  });
});

/**
 * Obtiene una tasación específica
 * 
 * @route GET /api/v1/assets/valuations/:id
 * @access Private (requiere autenticación)
 */
exports.getAssetValuation = asyncHandler(async (req, res, next) => {
  const valuation = await AssetValuation.findById(req.params.id)
    .populate('activoID', 'tipo descripcion valor');

  if (!valuation) {
    return res.status(404).json({
      success: false,
      message: 'Tasación no encontrada'
    });
  }

  // Verificar propiedad
  if (!(await validateProfileOwnership(req.user.id, valuation.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a esta tasación'
    });
  }

  res.status(200).json({
    success: true,
    data: valuation
  });
});

/**
 * Crea una nueva tasación
 * 
 * @route POST /api/v1/assets/:assetId/valuations
 * @access Private (requiere autenticación)
 */
exports.createAssetValuation = asyncHandler(async (req, res, next) => {
  const { assetId } = req.params;
  const {
    fecha,
    valorUF,
    valorUFEnCLP,
    valorDirectoCLP,
    tipoTasacion,
    institucion,
    observaciones,
    metadata
  } = req.body;

  // Verificar que el activo existe y pertenece al usuario
  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  if (!(await validateProfileOwnership(req.user.id, asset.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  // Validar que tenga al menos valorUF o valorDirectoCLP
  if (!valorUF && !valorDirectoCLP) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar valorUF o valorDirectoCLP'
    });
  }

  // Si tiene valorUF, debe tener valorUFEnCLP
  if (valorUF && !valorUFEnCLP) {
    return res.status(400).json({
      success: false,
      message: 'Si proporciona valorUF, debe proporcionar valorUFEnCLP'
    });
  }

  const valuation = await AssetValuation.create({
    activoID: assetId,
    perfilID: asset.perfilID,
    fecha: fecha || new Date(),
    valorUF: valorUF || null,
    valorUFEnCLP: valorUFEnCLP || null,
    valorDirectoCLP: valorDirectoCLP || null,
    tipoTasacion: tipoTasacion || 'Tasación Bancaria',
    institucion: institucion || null,
    observaciones: observaciones || null,
    metadata: metadata || {}
  });

  res.status(201).json({
    success: true,
    data: valuation
  });
});

/**
 * Actualiza una tasación
 * 
 * @route PUT /api/v1/assets/valuations/:id
 * @access Private (requiere autenticación)
 */
exports.updateAssetValuation = asyncHandler(async (req, res, next) => {
  let valuation = await AssetValuation.findById(req.params.id);

  if (!valuation) {
    return res.status(404).json({
      success: false,
      message: 'Tasación no encontrada'
    });
  }

  // Verificar propiedad
  if (!(await validateProfileOwnership(req.user.id, valuation.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a esta tasación'
    });
  }

  valuation = await AssetValuation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: valuation
  });
});

/**
 * Elimina una tasación
 * 
 * @route DELETE /api/v1/assets/valuations/:id
 * @access Private (requiere autenticación)
 */
exports.deleteAssetValuation = asyncHandler(async (req, res, next) => {
  const valuation = await AssetValuation.findById(req.params.id);

  if (!valuation) {
    return res.status(404).json({
      success: false,
      message: 'Tasación no encontrada'
    });
  }

  // Verificar propiedad
  if (!(await validateProfileOwnership(req.user.id, valuation.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a esta tasación'
    });
  }

  await valuation.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Tasación eliminada'
  });
});

/**
 * Obtiene el historial de evolución de valor de un activo
 * 
 * @route GET /api/v1/assets/:assetId/valuations/history
 * @access Private (requiere autenticación)
 */
exports.getAssetValuationHistory = asyncHandler(async (req, res, next) => {
  const { assetId } = req.params;

  // Verificar que el activo existe y pertenece al usuario
  const asset = await Asset.findById(assetId);
  if (!asset) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  if (!(await validateProfileOwnership(req.user.id, asset.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  // Obtener todas las tasaciones ordenadas por fecha (más antigua primero)
  const valuations = await AssetValuation.find({ activoID: assetId })
    .sort({ fecha: 1 });

  // Calcular evolución
  const evolution = valuations.map((val, index) => {
    const previousVal = index > 0 ? valuations[index - 1] : null;
    let change = null;
    let changePercent = null;
    let trend = null; // 'up', 'down', 'stable'

    if (previousVal && previousVal.valorCLP && val.valorCLP) {
      change = val.valorCLP - previousVal.valorCLP;
      changePercent = ((change / previousVal.valorCLP) * 100).toFixed(2);
      
      // Determinar tendencia
      if (change > 0) {
        trend = 'up'; // Apreciación (propiedades generalmente)
      } else if (change < 0) {
        trend = 'down'; // Depreciación (vehículos generalmente)
      } else {
        trend = 'stable';
      }
    }

    return {
      fecha: val.fecha,
      valorUF: val.valorUF,
      valorUFEnCLP: val.valorUFEnCLP,
      valorCLP: val.valorCLP,
      tipoTasacion: val.tipoTasacion,
      institucion: val.institucion,
      cambio: change,
      cambioPorcentaje: changePercent,
      trend: trend, // 'up', 'down', 'stable'
      observaciones: val.observaciones
    };
  });

  res.status(200).json({
    success: true,
    data: {
      activo: {
        id: asset._id,
        tipo: asset.tipo,
        descripcion: asset.descripcion,
        valorActual: asset.valor
      },
      historial: evolution,
      resumen: {
        primeraTasacion: valuations.length > 0 ? valuations[0].fecha : null,
        ultimaTasacion: valuations.length > 0 ? valuations[valuations.length - 1].fecha : null,
        totalTasaciones: valuations.length,
        valorInicial: valuations.length > 0 ? valuations[0].valorCLP : null,
        valorFinal: valuations.length > 0 ? valuations[valuations.length - 1].valorCLP : null,
        cambioTotal: valuations.length > 1 
          ? valuations[valuations.length - 1].valorCLP - valuations[0].valorCLP 
          : null,
        cambioTotalPorcentaje: valuations.length > 1 && valuations[0].valorCLP
          ? (((valuations[valuations.length - 1].valorCLP - valuations[0].valorCLP) / valuations[0].valorCLP) * 100).toFixed(2)
          : null,
        tendencia: valuations.length > 1 && valuations[0].valorCLP
          ? (valuations[valuations.length - 1].valorCLP > valuations[0].valorCLP ? 'up' : 'down')
          : null,
        // Para propiedades: apreciación, para vehículos: depreciación
        tipoActivo: asset.tipo,
        interpretacion: valuations.length > 1 && valuations[0].valorCLP
          ? (asset.tipo === 'Vehículos' 
              ? 'Depreciación esperada para vehículos'
              : asset.tipo === 'Propiedades'
              ? 'Apreciación esperada para propiedades'
              : 'Evolución del valor')
          : null
      }
    }
  });
});

