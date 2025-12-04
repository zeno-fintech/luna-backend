const asyncHandler = require('@core/utils/asyncHandler');
const Country = require('@models/Country');

/**
 * @fileoverview Controlador de Países - Obtiene información de países disponibles
 * @module level3/controllers/countryController
 */

/**
 * Obtiene todos los países activos
 * 
 * Este endpoint es público (no requiere autenticación) ya que la información
 * de países es general y no contiene datos sensibles.
 * 
 * @route GET /api/v1/countries
 * @access Public
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.region] - Filtrar por región (Norteamérica, Centroamérica, Sudamérica, Caribe)
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - count: Número de países encontrados
 * - data: Array de objetos Country
 * 
 * @example
 * // GET /api/v1/countries
 * // GET /api/v1/countries?region=Sudamérica
 */
exports.getCountries = asyncHandler(async (req, res, next) => {
  const { region } = req.query;
  
  const query = { isActive: true };
  if (region) {
    query.region = region;
  }

  const countries = await Country.find(query)
    .select('nombre codigo codigoISO monedaDefault codigoTelefono region bandera configuracion isActive')
    .sort({ nombre: 1 });

  res.status(200).json({
    success: true,
    count: countries.length,
    data: countries
  });
});

/**
 * Obtiene un país específico por su código
 * 
 * @route GET /api/v1/countries/:codigo
 * @access Public
 * 
 * @param {Object} req - Request de Express
 * @param {Object} req.params - Parámetros de la ruta
 * @param {string} req.params.codigo - Código del país (ej: "CL", "US")
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {Object} Respuesta JSON con:
 * - success: true
 * - data: Objeto Country completo
 * 
 * @throws {404} Si el país no existe o no está activo
 * 
 * @example
 * // GET /api/v1/countries/CL
 */
exports.getCountry = asyncHandler(async (req, res, next) => {
  const country = await Country.findOne({ 
    codigo: req.params.codigo.toUpperCase(),
    isActive: true 
  });

  if (!country) {
    return res.status(404).json({
      success: false,
      message: 'País no encontrado o no está disponible'
    });
  }

  res.status(200).json({
    success: true,
    data: country
  });
});

