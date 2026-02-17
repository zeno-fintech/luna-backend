const express = require('express');
const router = express.Router();
const { protect } = require('@core/middleware/auth');
const {
  getActivos,
  getActivo,
  createActivo,
  updateActivo,
  deleteActivo,
  getPasivos,
  getPasivo,
  createPasivo,
  updatePasivo,
  deletePasivo,
  getResumen
} = require('@level3/controllers/patrimonioController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Activo:
 *       type: object
 *       required:
 *         - perfilID
 *         - nombre
 *         - tipo
 *         - valor
 *       properties:
 *         perfilID:
 *           type: string
 *           description: ID del perfil financiero
 *         nombre:
 *           type: string
 *           description: Nombre del activo
 *         tipo:
 *           type: string
 *           enum: [Cuenta Corriente, Cuenta Ahorro, Tarjeta de Crédito, Efectivo, Acciones, Bonos, Fondo Mutuo, Casa Propia, Departamento, Auto, Moto, Otro]
 *         categoria:
 *           type: string
 *           enum: [Líquido, Inversión, Bien Raíz, Vehículo, Otro]
 *         liquidez:
 *           type: string
 *           enum: [Corriente, No Corriente]
 *         plazo:
 *           type: string
 *           enum: [Corto Plazo, Largo Plazo]
 *         valor:
 *           type: number
 *           description: Valor del activo
 *         moneda:
 *           type: string
 *           enum: [CLP, UF, USD, COP, EUR, Otra]
 *         presupuestoID:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de presupuestos asociados
 *     Pasivo:
 *       type: object
 *       required:
 *         - perfilID
 *         - nombre
 *         - tipo
 *         - prestador
 *       properties:
 *         perfilID:
 *           type: string
 *         nombre:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [Personal, Institucional, Bancaria, Comercial]
 *         categoria:
 *           type: string
 *           enum: [Hipotecario, Automotriz, Tarjeta de Crédito, Consumo, Otro]
 *         plazo:
 *           type: string
 *           enum: [Corto Plazo, Largo Plazo]
 *         prestador:
 *           type: string
 *         montoTotal:
 *           type: number
 *         saldoPendiente:
 *           type: number
 *         presupuestoID:
 *           type: array
 *           items:
 *             type: string
 */

// ==================== ACTIVOS ====================

/**
 * @swagger
 * /api/v1/patrimonio/activos:
 *   get:
 *     summary: Obtiene todos los activos de un perfil
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *       - in: query
 *         name: liquidez
 *         schema:
 *           type: string
 *       - in: query
 *         name: plazo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de activos
 */
router.get('/activos', protect, getActivos);

/**
 * @swagger
 * /api/v1/patrimonio/activos/{id}:
 *   get:
 *     summary: Obtiene un activo específico
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Crea un nuevo activo
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Actualiza un activo
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Elimina un activo
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 */
router.get('/activos/:id', protect, getActivo);
router.post('/activos', protect, createActivo);
router.put('/activos/:id', protect, updateActivo);
router.delete('/activos/:id', protect, deleteActivo);

// ==================== PASIVOS ====================

/**
 * @swagger
 * /api/v1/patrimonio/pasivos:
 *   get:
 *     summary: Obtiene todos los pasivos de un perfil
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *       - in: query
 *         name: plazo
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de pasivos
 */
router.get('/pasivos', protect, getPasivos);

/**
 * @swagger
 * /api/v1/patrimonio/pasivos/{id}:
 *   get:
 *     summary: Obtiene un pasivo específico
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Crea un nuevo pasivo
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Actualiza un pasivo
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Elimina un pasivo
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 */
router.get('/pasivos/:id', protect, getPasivo);
router.post('/pasivos', protect, createPasivo);
router.put('/pasivos/:id', protect, updatePasivo);
router.delete('/pasivos/:id', protect, deletePasivo);

// ==================== RESUMEN ====================

/**
 * @swagger
 * /api/v1/patrimonio/resumen:
 *   get:
 *     summary: Obtiene el resumen completo de patrimonio (Activos, Pasivos y Patrimonio Neto)
 *     tags: [Patrimonio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resumen de patrimonio con Activos, Pasivos y Patrimonio Neto
 */
router.get('/resumen', protect, getResumen);

module.exports = router;
