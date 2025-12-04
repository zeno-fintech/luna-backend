const express = require('express');
const {
  getFinancialBoards,
  getFinancialBoard,
  createFinancialBoard,
  updateFinancialBoard,
  deleteFinancialBoard
} = require('@level3/controllers/financialBoardController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Financial Boards
 *     description: Gestión de tableros financieros mensuales
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/financial-boards:
 *   get:
 *     summary: Obtiene todos los tableros financieros del usuario
 *     tags: [Financial Boards]
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
 *         description: Lista de tableros financieros
 *   post:
 *     summary: Crea un nuevo tablero financiero
 *     tags: [Financial Boards]
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
 *         description: Tablero financiero creado exitosamente
 */
router.route('/')
  .get(getFinancialBoards)
  .post(createFinancialBoard);

/**
 * @swagger
 * /api/v1/financial-boards/{id}:
 *   get:
 *     summary: Obtiene un tablero financiero específico
 *     tags: [Financial Boards]
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
 *         description: Información del tablero financiero
 *   put:
 *     summary: Actualiza un tablero financiero
 *     tags: [Financial Boards]
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
 *         description: Tablero financiero actualizado
 *   delete:
 *     summary: Elimina un tablero financiero
 *     tags: [Financial Boards]
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
 *         description: Tablero financiero eliminado
 */
router.route('/:id')
  .get(getFinancialBoard)
  .put(updateFinancialBoard)
  .delete(deleteFinancialBoard);

module.exports = router;
