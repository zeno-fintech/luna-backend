const asyncHandler = require('@core/utils/asyncHandler');
const Category = require('@models/Category');

/**
 * @fileoverview Controlador de Categorías - Maneja CRUD de categorías
 * @module level3/controllers/categoryController
 */

/**
 * Obtiene todas las categorías disponibles
 * 
 * @route GET /api/v1/categories?tipo=Gasto
 * @access Private (requiere autenticación)
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
  const { tipo } = req.query;

  const query = {};
  if (tipo) {
    query.$or = [
      { tipo },
      { tipo: 'Ambos' }
    ];
  }

  const categories = await Category.find(query)
    .sort({ nombre: 1 });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

/**
 * Obtiene una categoría específica
 * 
 * @route GET /api/v1/categories/:id
 * @access Private (requiere autenticación)
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Categoría no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: category
  });
});

/**
 * Crea una nueva categoría personalizada
 * 
 * @route POST /api/v1/categories
 * @access Private (requiere autenticación)
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { nombre, icono, imagen, color, tipo } = req.body;

  if (!nombre) {
    return res.status(400).json({
      success: false,
      message: 'El nombre de la categoría es requerido'
    });
  }

  // Verificar si ya existe una categoría con ese nombre
  const existingCategory = await Category.findOne({ nombre: nombre.trim() });
  if (existingCategory) {
    return res.status(400).json({
      success: false,
      message: 'Ya existe una categoría con ese nombre'
    });
  }

  const category = await Category.create({
    nombre: nombre.trim(),
    icono: icono || null,
    imagen: imagen || null,
    color: color || '#000000',
    tipo: tipo || 'Gasto',
    isSystem: false
  });

  res.status(201).json({
    success: true,
    data: category
  });
});

/**
 * Actualiza una categoría
 * 
 * @route PUT /api/v1/categories/:id
 * @access Private (requiere autenticación)
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Categoría no encontrada'
    });
  }

  // No permitir editar categorías del sistema
  if (category.isSystem) {
    return res.status(403).json({
      success: false,
      message: 'No se pueden editar categorías del sistema'
    });
  }

  // Si se cambia el nombre, verificar que no exista otra con ese nombre
  if (req.body.nombre && req.body.nombre.trim() !== category.nombre) {
    const existingCategory = await Category.findOne({ 
      nombre: req.body.nombre.trim(),
      _id: { $ne: category._id }
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: category
  });
});

/**
 * Elimina una categoría
 * 
 * @route DELETE /api/v1/categories/:id
 * @access Private (requiere autenticación)
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Categoría no encontrada'
    });
  }

  // No permitir eliminar categorías del sistema
  if (category.isSystem) {
    return res.status(403).json({
      success: false,
      message: 'No se pueden eliminar categorías del sistema'
    });
  }

  // Verificar si hay transacciones usando esta categoría
  const Transaction = require('@models/Transaction');
  const transactionsWithCategory = await Transaction.countDocuments({
    categoriaID: category._id
  });

  if (transactionsWithCategory > 0) {
    return res.status(400).json({
      success: false,
      message: `No se puede eliminar la categoría porque está siendo usada en ${transactionsWithCategory} transacción(es)`
    });
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Categoría eliminada'
  });
});

