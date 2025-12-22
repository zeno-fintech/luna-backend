const express = require('express');
const {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome
} = require('@level3/controllers/incomeController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Incomes
 *     description: Gestión de ingresos
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/incomes:
 *   get:
 *     summary: Obtiene todos los ingresos del usuario
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *       - in: query
 *         name: presupuestoID
 *         schema:
 *           type: string
 *         description: Filtrar por presupuesto
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [recurrente, ocasional]
 *         description: Filtrar por tipo de ingreso
 *     responses:
 *       200:
 *         description: Lista de ingresos
 *   post:
 *     summary: Crea un nuevo ingreso
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - glosa
 *               - monto
 *               - perfilID
 *             properties:
 *               glosa:
 *                 type: string
 *                 example: Sueldo mensual
 *               monto:
 *                 type: number
 *                 example: 2800000
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-01
 *               tipo:
 *                 type: string
 *                 enum: [recurrente, ocasional]
 *                 example: recurrente
 *               presupuestoID:
 *                 type: string
 *                 description: ID del presupuesto asociado
 *               perfilID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingreso creado exitosamente
 */
router.route('/')
  .get(getIncomes)
  .post(createIncome);

/**
 * @swagger
 * /api/v1/incomes/{id}:
 *   get:
 *     summary: Obtiene un ingreso específico
 *     tags: [Incomes]
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
 *         description: Información del ingreso
 *   put:
 *     summary: Actualiza un ingreso
 *     tags: [Incomes]
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
 *               glosa:
 *                 type: string
 *               monto:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Ingreso actualizado
 *   delete:
 *     summary: Elimina un ingreso
 *     tags: [Incomes]
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
 *         description: Ingreso eliminado
 */
router.route('/:id')
  .get(getIncome)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;
