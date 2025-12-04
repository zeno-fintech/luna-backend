const express = require('express');
const {
  suggestBoardIcon,
  suggestFixedExpenses
} = require('@level3/controllers/aiSuggestionsController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: AI Suggestions
 *     description: Sugerencias basadas en IA
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/ai/suggest-board-icon:
 *   get:
 *     summary: Sugiere un icono para un tablero financiero basado en su nombre
 *     tags: [AI Suggestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del tablero financiero
 *         example: Casa
 *     responses:
 *       200:
 *         description: Icono sugerido (emoji)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     icono:
 *                       type: string
 *                       example: 🏠
 */
router.get('/suggest-board-icon', suggestBoardIcon);

/**
 * @swagger
 * /api/v1/ai/suggest-fixed-expenses:
 *   get:
 *     summary: Sugiere gastos fijos basados en transacciones históricas
 *     tags: [AI Suggestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del perfil
 *       - in: query
 *         name: tableroID
 *         schema:
 *           type: string
 *         description: ID del tablero financiero
 *     responses:
 *       200:
 *         description: Lista de gastos sugeridos para marcar como fijos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       glosa:
 *                         type: string
 *                       monto:
 *                         type: number
 *                       frecuencia:
 *                         type: string
 */
router.get('/suggest-fixed-expenses', suggestFixedExpenses);

module.exports = router;
