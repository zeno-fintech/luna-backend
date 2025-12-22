const express = require('express');
const {
  getPresupuestos,
  getPresupuesto,
  createPresupuesto,
  updatePresupuesto,
  deletePresupuesto,
  getTotalizador
} = require('@level3/controllers/presupuestoController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Presupuestos
 *     description: Gestión de presupuestos mensuales
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/presupuestos/totalizador:
 *   get:
 *     summary: Obtiene el totalizador de todos los presupuestos
 *     tags: [Presupuestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del perfil
 *       - in: query
 *         name: año
 *         schema:
 *           type: integer
 *         description: Filtrar por año
 *     responses:
 *       200:
 *         description: Totalizador de presupuestos
 */
router.get('/totalizador', getTotalizador);

/**
 * @swagger
 * /api/v1/presupuestos:
 *   get:
 *     summary: Obtiene todos los presupuestos del usuario
 *     tags: [Presupuestos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *       - in: query
 *         name: año
 *         schema:
 *           type: integer
 *         description: Filtrar por año
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Filtrar por mes (1-12)
 *     responses:
 *       200:
 *         description: Lista de presupuestos
 *   post:
 *     summary: Crea un nuevo presupuesto
 *     tags: [Presupuestos]
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
 *               - perfilID
 *               - año
 *               - mes
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Depto
 *               perfilID:
 *                 type: string
 *               año:
 *                 type: integer
 *                 example: 2024
 *               mes:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 example: 12
 *               moneda:
 *                 type: string
 *                 example: CLP
 *               icono:
 *                 type: string
 *                 example: 🏠
 *               color:
 *                 type: string
 *                 example: #3B82F6
 *               porcentajeIngresos:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 100
 *     responses:
 *       201:
 *         description: Presupuesto creado exitosamente
 */
router.route('/')
  .get(getPresupuestos)
  .post(createPresupuesto);

/**
 * @swagger
 * /api/v1/presupuestos/{id}:
 *   get:
 *     summary: Obtiene un presupuesto específico
 *     tags: [Presupuestos]
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
 *         description: Información del presupuesto
 *   put:
 *     summary: Actualiza un presupuesto
 *     tags: [Presupuestos]
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
 *               icono:
 *                 type: string
 *               color:
 *                 type: string
 *               porcentajeIngresos:
 *                 type: number
 *     responses:
 *       200:
 *         description: Presupuesto actualizado
 *   delete:
 *     summary: Elimina un presupuesto
 *     tags: [Presupuestos]
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
 *         description: Presupuesto eliminado
 */
router.route('/:id')
  .get(getPresupuesto)
  .put(updatePresupuesto)
  .delete(deletePresupuesto);

module.exports = router;

