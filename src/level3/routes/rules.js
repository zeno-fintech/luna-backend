const express = require('express');
const {
  getRules,
  getRule,
  createRule,
  updateRule,
  deleteRule
} = require('@level3/controllers/ruleController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Rules
 *     description: Gestión de reglas de presupuesto (50-30-20, etc.)
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/rules:
 *   get:
 *     summary: Obtiene todas las reglas del usuario
 *     tags: [Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: presupuestoID
 *         schema:
 *           type: string
 *         description: Filtrar por presupuesto
 *     responses:
 *       200:
 *         description: Lista de reglas
 *   post:
 *     summary: Crea una nueva regla de presupuesto
 *     tags: [Rules]
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
 *               - porcentaje
 *               - presupuestoID
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Necesidades
 *               porcentaje:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 50
 *               presupuestoID:
 *                 type: string
 *               icono:
 *                 type: string
 *                 example: 🏠
 *               color:
 *                 type: string
 *                 example: #3B82F6
 *     responses:
 *       201:
 *         description: Regla creada exitosamente
 *       400:
 *         description: Error de validación (máximo 4 reglas, suma debe ser 100%)
 */
router.route('/')
  .get(getRules)
  .post(createRule);

/**
 * @swagger
 * /api/v1/rules/{id}:
 *   get:
 *     summary: Obtiene una regla específica
 *     tags: [Rules]
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
 *         description: Información de la regla
 *   put:
 *     summary: Actualiza una regla
 *     tags: [Rules]
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
 *               porcentaje:
 *                 type: number
 *               icono:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Regla actualizada
 *   delete:
 *     summary: Elimina una regla
 *     tags: [Rules]
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
 *         description: Regla eliminada
 */
router.route('/:id')
  .get(getRule)
  .put(updateRule)
  .delete(deleteRule);

module.exports = router;
