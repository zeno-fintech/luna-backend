const express = require('express');
const {
  getFinancialSummary,
  getNetWorth,
  getFinancialScore
} = require('@level3/controllers/summaryController');
const {
  getUserInsights,
  getSpendingInsights
} = require('@level3/controllers/insightsController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: App
 *     description: Resúmenes y insights financieros generales
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/app/summary:
 *   get:
 *     summary: Obtiene un resumen financiero general del usuario
 *     tags: [App]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen financiero completo con todos los datos principales
 */
router.get('/summary', getFinancialSummary);

/**
 * @swagger
 * /api/v1/app/net-worth:
 *   get:
 *     summary: Calcula el patrimonio neto del usuario
 *     tags: [App]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *     responses:
 *       200:
 *         description: Patrimonio neto calculado (Activos - Pasivos + Efectivo + Ahorros)
 */
router.get('/net-worth', getNetWorth);

/**
 * @swagger
 * /api/v1/app/financial-score:
 *   get:
 *     summary: Calcula el score financiero del usuario
 *     tags: [App]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *     responses:
 *       200:
 *         description: Score financiero (0-100) basado en múltiples factores
 */
router.get('/financial-score', getFinancialScore);

/**
 * @swagger
 * /api/v1/app/insights:
 *   get:
 *     summary: Obtiene insights y recomendaciones financieras
 *     tags: [App]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *     responses:
 *       200:
 *         description: Insights financieros con recomendaciones basadas en IA
 */
router.get('/insights', getUserInsights);

/**
 * @swagger
 * /api/v1/app/insights/spending:
 *   get:
 *     summary: Obtiene insights específicos sobre gastos
 *     tags: [App]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *       - in: query
 *         name: meses
 *         schema:
 *           type: integer
 *           default: 3
 *         description: Número de meses a analizar
 *     responses:
 *       200:
 *         description: Análisis detallado de patrones de gastos
 */
router.get('/insights/spending', getSpendingInsights);

module.exports = router;
