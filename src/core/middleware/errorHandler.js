/**
 * @fileoverview Middleware de manejo de errores centralizado
 * @module core/middleware/errorHandler
 */

/**
 * Middleware de manejo de errores centralizado para Express
 * 
 * Captura todos los errores que ocurren en las rutas y los formatea
 * de manera consistente. Maneja errores específicos de Mongoose y
 * otros errores genéricos.
 * 
 * @param {Error} err - Objeto de error capturado
 * @param {string} [err.name] - Nombre del error (ej: 'CastError', 'ValidationError')
 * @param {string} err.message - Mensaje de error
 * @param {number} [err.statusCode] - Código de estado HTTP del error
 * @param {number} [err.code] - Código de error (ej: 11000 para duplicados en MongoDB)
 * @param {Object} [err.keyValue] - Objeto con el campo duplicado (para errores 11000)
 * @param {Object} [err.errors] - Objeto con errores de validación (para ValidationError)
 * @param {string} [err.stack] - Stack trace del error (solo en desarrollo)
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Función next de Express
 * 
 * @returns {void} Responde con JSON de error y código de estado apropiado
 * 
 * @example
 * // Errores manejados automáticamente:
 * // - CastError (ID inválido) → 404
 * // - Duplicate key (11000) → 400
 * // - ValidationError → 400
 * // - Otros errores → 500
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} ya existe`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
