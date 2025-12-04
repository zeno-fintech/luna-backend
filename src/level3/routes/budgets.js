const express = require('express');
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget
} = require('@level3/controllers/budgetController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Budgets
 *     description: Gestión de presupuestos mensuales
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/budgets:
 *   get:
 *     summary: Obtiene todos los presupuestos del usuario
 *     tags: [Budgets]
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
 *         description: Filtrar por mes
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de presupuestos
 *   post:
 *     summary: Crea un nuevo presupuesto
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoria
 *               - monto
 *               - perfilID
 *               - año
 *               - mes
 *             properties:
 *               categoria:
 *                 type: string
 *                 example: Alimentación
 *               monto:
 *                 type: number
 *                 example: 300000
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
 *     responses:
 *       201:
 *         description: Presupuesto creado exitosamente
 */
router.route('/')
  .get(getBudgets)
  .post(createBudget);

/**
 * @swagger
 * /api/v1/budgets/{id}:
 *   get:
 *     summary: Obtiene un presupuesto específico
 *     tags: [Budgets]
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
 *     tags: [Budgets]
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
 *               monto:
 *                 type: number
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Presupuesto actualizado
 *   delete:
 *     summary: Elimina un presupuesto
 *     tags: [Budgets]
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
  .get(getBudget)
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;
