const express = require('express');
const {
  getSavings,
  getSaving,
  createSaving,
  updateSaving,
  deleteSaving
} = require('@level3/controllers/savingsController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Savings
 *     description: Gestión de ahorros e inversiones
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/savings:
 *   get:
 *     summary: Obtiene todos los ahorros del usuario
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [Ahorro, Inversión, Fondo de Emergencia]
 *         description: Filtrar por tipo de ahorro
 *     responses:
 *       200:
 *         description: Lista de ahorros
 *   post:
 *     summary: Crea un nuevo ahorro o inversión
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - tipo
 *               - monto
 *               - perfilID
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Fondo de Emergencia
 *               tipo:
 *                 type: string
 *                 enum: [Ahorro, Inversión, Fondo de Emergencia]
 *                 example: Ahorro
 *               monto:
 *                 type: number
 *                 example: 5000000
 *               moneda:
 *                 type: string
 *                 example: CLP
 *               meta:
 *                 type: number
 *                 example: 10000000
 *               descripcion:
 *                 type: string
 *                 example: Ahorro para emergencias
 *               perfilID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ahorro creado exitosamente
 */
router.route('/')
  .get(getSavings)
  .post(createSaving);

/**
 * @swagger
 * /api/v1/savings/{id}:
 *   get:
 *     summary: Obtiene un ahorro específico
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del ahorro
 *   put:
 *     summary: Actualiza un ahorro
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               monto:
 *                 type: number
 *               meta:
 *                 type: number
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ahorro actualizado
 *   delete:
 *     summary: Elimina un ahorro
 *     tags: [Savings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ahorro eliminado
 */
router.route('/:id')
  .get(getSaving)
  .put(updateSaving)
  .delete(deleteSaving);

module.exports = router;
