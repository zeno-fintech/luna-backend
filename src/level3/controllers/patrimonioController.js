const Activo = require('@models/Activo');
const Pasivo = require('@models/Pasivo');
const Profile = require('@models/Profile');
const asyncHandler = require('@core/utils/asyncHandler');
const { validateProfileOwnership } = require('@level3/services/auth/authService');

/**
 * @fileoverview Controlador de Patrimonio - Maneja CRUD de Activos y Pasivos
 * @module level3/controllers/patrimonioController
 */

// ==================== ACTIVOS ====================

/**
 * Obtiene todos los activos de un perfil
 * @route GET /api/v1/patrimonio/activos?perfilID=xxx&tipo=Cuenta Bancaria&categoria=Líquido
 */
exports.getActivos = asyncHandler(async (req, res, next) => {
  const { perfilID, tipo, categoria, liquidez, plazo } = req.query;

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

  // Construir query
  const query = { perfilID };
  if (tipo) query.tipo = tipo;
  if (categoria) query.categoria = categoria;
  if (liquidez) query.liquidez = liquidez;
  if (plazo) query.plazo = plazo;

  const activos = await Activo.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: activos.length,
    data: activos
  });
});

/**
 * Obtiene un activo específico
 * @route GET /api/v1/patrimonio/activos/:id
 */
exports.getActivo = asyncHandler(async (req, res, next) => {
  const activo = await Activo.findById(req.params.id);

  if (!activo) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  // Validar propiedad
  if (!(await validateProfileOwnership(req.user.id, activo.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  res.status(200).json({
    success: true,
    data: activo
  });
});

/**
 * Crea un nuevo activo
 * @route POST /api/v1/patrimonio/activos
 */
exports.createActivo = asyncHandler(async (req, res, next) => {
  const { perfilID, nombre, tipo, valor, moneda, presupuestoID, ...otrosCampos } = req.body;

  if (!perfilID || !nombre || !tipo || valor === undefined) {
    return res.status(400).json({
      success: false,
      message: 'perfilID, nombre, tipo y valor son requeridos'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  // Preparar presupuestoID como array
  const presupuestosIDs = presupuestoID 
    ? (Array.isArray(presupuestoID) ? presupuestoID : [presupuestoID])
    : [];

  const activo = await Activo.create({
    perfilID,
    nombre,
    tipo,
    valor,
    moneda: moneda || 'CLP',
    presupuestoID: presupuestosIDs,
    ...otrosCampos
  });

  res.status(201).json({
    success: true,
    data: activo
  });
});

/**
 * Actualiza un activo
 * @route PUT /api/v1/patrimonio/activos/:id
 */
exports.updateActivo = asyncHandler(async (req, res, next) => {
  let activo = await Activo.findById(req.params.id);

  if (!activo) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  // Validar propiedad
  if (!(await validateProfileOwnership(req.user.id, activo.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  // Manejar presupuestoID como array
  if (req.body.presupuestoID !== undefined) {
    req.body.presupuestoID = Array.isArray(req.body.presupuestoID) 
      ? req.body.presupuestoID 
      : [req.body.presupuestoID];
  }

  activo = await Activo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: activo
  });
});

/**
 * Elimina un activo
 * @route DELETE /api/v1/patrimonio/activos/:id
 */
exports.deleteActivo = asyncHandler(async (req, res, next) => {
  const activo = await Activo.findById(req.params.id);

  if (!activo) {
    return res.status(404).json({
      success: false,
      message: 'Activo no encontrado'
    });
  }

  // Validar propiedad
  if (!(await validateProfileOwnership(req.user.id, activo.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este activo'
    });
  }

  await activo.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Activo eliminado'
  });
});

// ==================== PASIVOS ====================

/**
 * Obtiene todos los pasivos de un perfil
 * @route GET /api/v1/patrimonio/pasivos?perfilID=xxx&tipo=Bancaria&plazo=Corto Plazo
 */
exports.getPasivos = asyncHandler(async (req, res, next) => {
  const { perfilID, tipo, categoria, plazo, estado } = req.query;

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

  // Construir query
  const query = { perfilID };
  if (tipo) query.tipo = tipo;
  if (categoria) query.categoria = categoria;
  if (plazo) query.plazo = plazo;
  if (estado) query.estado = estado;

  const pasivos = await Pasivo.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pasivos.length,
    data: pasivos
  });
});

/**
 * Obtiene un pasivo específico
 * @route GET /api/v1/patrimonio/pasivos/:id
 */
exports.getPasivo = asyncHandler(async (req, res, next) => {
  const pasivo = await Pasivo.findById(req.params.id);

  if (!pasivo) {
    return res.status(404).json({
      success: false,
      message: 'Pasivo no encontrado'
    });
  }

  // Validar propiedad
  if (!(await validateProfileOwnership(req.user.id, pasivo.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este pasivo'
    });
  }

  res.status(200).json({
    success: true,
    data: pasivo
  });
});

/**
 * Crea un nuevo pasivo
 * @route POST /api/v1/patrimonio/pasivos
 */
exports.createPasivo = asyncHandler(async (req, res, next) => {
  const { perfilID, nombre, tipo, prestador, montoTotal, saldoPendiente, presupuestoID, ...otrosCampos } = req.body;

  if (!perfilID || !nombre || !tipo || !prestador) {
    return res.status(400).json({
      success: false,
      message: 'perfilID, nombre, tipo y prestador son requeridos'
    });
  }

  // Validar propiedad del perfil
  if (!(await validateProfileOwnership(req.user.id, perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este perfil'
    });
  }

  // Preparar presupuestoID como array
  const presupuestosIDs = presupuestoID 
    ? (Array.isArray(presupuestoID) ? presupuestoID : [presupuestoID])
    : [];

  const pasivo = await Pasivo.create({
    perfilID,
    nombre,
    tipo,
    prestador,
    montoTotal: montoTotal || 0,
    saldoPendiente: saldoPendiente || montoTotal || 0,
    presupuestoID: presupuestosIDs,
    ...otrosCampos
  });

  res.status(201).json({
    success: true,
    data: pasivo
  });
});

/**
 * Actualiza un pasivo
 * @route PUT /api/v1/patrimonio/pasivos/:id
 */
exports.updatePasivo = asyncHandler(async (req, res, next) => {
  let pasivo = await Pasivo.findById(req.params.id);

  if (!pasivo) {
    return res.status(404).json({
      success: false,
      message: 'Pasivo no encontrado'
    });
  }

  // Validar propiedad
  if (!(await validateProfileOwnership(req.user.id, pasivo.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este pasivo'
    });
  }

  // Manejar presupuestoID como array
  if (req.body.presupuestoID !== undefined) {
    req.body.presupuestoID = Array.isArray(req.body.presupuestoID) 
      ? req.body.presupuestoID 
      : [req.body.presupuestoID];
  }

  pasivo = await Pasivo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: pasivo
  });
});

/**
 * Elimina un pasivo
 * @route DELETE /api/v1/patrimonio/pasivos/:id
 */
exports.deletePasivo = asyncHandler(async (req, res, next) => {
  const pasivo = await Pasivo.findById(req.params.id);

  if (!pasivo) {
    return res.status(404).json({
      success: false,
      message: 'Pasivo no encontrado'
    });
  }

  // Validar propiedad
  if (!(await validateProfileOwnership(req.user.id, pasivo.perfilID))) {
    return res.status(403).json({
      success: false,
      message: 'No tienes acceso a este pasivo'
    });
  }

  await pasivo.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Pasivo eliminado'
  });
});

// ==================== RESUMEN DE PATRIMONIO ====================

/**
 * Obtiene el resumen completo de patrimonio (Activos, Pasivos y Patrimonio Neto)
 * @route GET /api/v1/patrimonio/resumen?perfilID=xxx
 */
exports.getResumen = asyncHandler(async (req, res, next) => {
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

  // Obtener todos los activos
  const activos = await Activo.find({ perfilID });
  const totalActivos = activos.reduce((sum, a) => sum + (a.valor || 0), 0);

  // Obtener todos los pasivos activos
  const pasivos = await Pasivo.find({ 
    perfilID,
    estado: { $ne: 'Pagada' }
  });
  const totalPasivos = pasivos.reduce((sum, p) => sum + (p.saldoPendiente || 0), 0);

  // Calcular patrimonio neto
  const patrimonioNeto = totalActivos - totalPasivos;

  // Desglose por categorías
  const activosPorCategoria = activos.reduce((acc, a) => {
    const cat = a.categoria || 'Otro';
    acc[cat] = (acc[cat] || 0) + (a.valor || 0);
    return acc;
  }, {});

  const activosPorLiquidez = activos.reduce((acc, a) => {
    const liq = a.liquidez || 'Corriente';
    acc[liq] = (acc[liq] || 0) + (a.valor || 0);
    return acc;
  }, {});

  const pasivosPorTipo = pasivos.reduce((acc, p) => {
    const tipo = p.tipo || 'Otro';
    acc[tipo] = (acc[tipo] || 0) + (p.saldoPendiente || 0);
    return acc;
  }, {});

  const pasivosPorPlazo = pasivos.reduce((acc, p) => {
    const plazo = p.plazo || 'Corto Plazo';
    acc[plazo] = (acc[plazo] || 0) + (p.saldoPendiente || 0);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: {
      activos: {
        total: totalActivos,
        cantidad: activos.length,
        porCategoria: activosPorCategoria,
        porLiquidez: activosPorLiquidez,
        detalle: activos.map(a => ({
          id: a._id,
          nombre: a.nombre,
          tipo: a.tipo,
          categoria: a.categoria,
          liquidez: a.liquidez,
          valor: a.valor,
          moneda: a.moneda
        }))
      },
      pasivos: {
        total: totalPasivos,
        cantidad: pasivos.length,
        porTipo: pasivosPorTipo,
        porPlazo: pasivosPorPlazo,
        detalle: pasivos.map(p => ({
          id: p._id,
          nombre: p.nombre,
          tipo: p.tipo,
          categoria: p.categoria,
          plazo: p.plazo,
          saldoPendiente: p.saldoPendiente,
          estado: p.estado,
          moneda: p.moneda
        }))
      },
      patrimonioNeto: patrimonioNeto,
      ratio: totalActivos > 0 ? (totalPasivos / totalActivos) * 100 : 0 // Ratio de endeudamiento
    }
  });
});
