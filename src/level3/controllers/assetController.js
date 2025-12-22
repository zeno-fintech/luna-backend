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
  const {
    perfilID,
    tipo,
    valor,
    moneda,
    fecha,
    descripcion,
    // Campos de propiedades
    rol,
    direccion,
    comuna,
    avaluoFiscal,
    valorComercial,
    grupoPropiedad,
    tipoPropiedad,
    metrosTotales,
    metrosConstruidos,
    metrosTerreno,
    numeroDormitorios,
    numeroBanos,
    numeroEstacionamientos,
    piso,
    // Campos de vehículos
    marca,
    modelo,
    año,
    kilometraje,
    patente,
    color,
    // Metadata
    metadata
  } = req.body;

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
    moneda: moneda || 'CLP',
    fecha: fecha || new Date(),
    descripcion: descripcion || null,
    // Campos de propiedades
    rol: rol || null,
    direccion: direccion || null,
    comuna: comuna || null,
    avaluoFiscal: avaluoFiscal || null,
    valorComercial: valorComercial || null,
    grupoPropiedad: grupoPropiedad || null,
    tipoPropiedad: tipoPropiedad || null,
    metrosTotales: metrosTotales || null,
    metrosConstruidos: metrosConstruidos || null,
    metrosTerreno: metrosTerreno || null,
    numeroDormitorios: numeroDormitorios || null,
    numeroBanos: numeroBanos || null,
    numeroEstacionamientos: numeroEstacionamientos || null,
    piso: piso || null,
    // Campos de vehículos
    marca: marca || null,
    modelo: modelo || null,
    año: año || null,
    kilometraje: kilometraje || null,
    patente: patente || null,
    color: color || null,
    // Metadata
    metadata: metadata || {}
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

/**
 * Obtiene el totalizador de activos
 * 
 * @route GET /api/v1/assets/totalizador?perfilID=xxx
 * @access Private (requiere autenticación)
 */
exports.getTotalizador = asyncHandler(async (req, res, next) => {
  const { perfilID } = req.query;

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

  const assets = await Asset.find({ perfilID });

  // Agrupar por tipo
  const totalPorTipo = {};
  const totalGeneral = assets.reduce((sum, asset) => {
    if (!totalPorTipo[asset.tipo]) {
      totalPorTipo[asset.tipo] = {
        cantidad: 0,
        valorTotal: 0,
        activos: []
      };
    }
    totalPorTipo[asset.tipo].cantidad += 1;
    totalPorTipo[asset.tipo].valorTotal += asset.valor;
    totalPorTipo[asset.tipo].activos.push({
      id: asset._id,
      nombre: asset.descripcion || asset.tipo,
      valor: asset.valor,
      moneda: asset.moneda
    });
    return sum + asset.valor;
  }, 0);

  // Agrupar por categoría (Líquidos, Inversiones, Bienes Raíces, Vehículos, Otros)
  const categorias = {
    'Líquidos': ['Efectivo', 'Cuenta Corriente', 'Cuenta Ahorro', 'Fondo Mutuo Corto Plazo'],
    'Inversiones': ['Acciones', 'Bonos', 'Fondo Mutuo', 'Criptomonedas', 'Depósito a Plazo'],
    'Bienes Raíces': ['Casa Propia', 'Departamento', 'Terreno', 'Propiedad Inversión'],
    'Vehículos': ['Auto', 'Moto'],
    'Otros': ['Joyas', 'Obras de Arte', 'Equipamiento', 'Otros']
  };

  const totalPorCategoria = {};
  Object.keys(categorias).forEach(categoria => {
    totalPorCategoria[categoria] = {
      cantidad: 0,
      valorTotal: 0
    };
    categorias[categoria].forEach(tipo => {
      if (totalPorTipo[tipo]) {
        totalPorCategoria[categoria].cantidad += totalPorTipo[tipo].cantidad;
        totalPorCategoria[categoria].valorTotal += totalPorTipo[tipo].valorTotal;
      }
    });
  });

  res.status(200).json({
    success: true,
    data: {
      totalGeneral,
      totalPorTipo,
      totalPorCategoria,
      cantidadTotal: assets.length
    }
  });
});

