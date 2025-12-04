const express = require('express');
const {
  getFinancialSummary,
  getMonthlyTrends
} = require('@level3/controllers/analyticsController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Análisis y reportes financieros
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/analytics/summary:
 *   get:
 *     summary: Obtiene un resumen financiero del usuario
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Mes para el resumen
 *       - in: query
 *         name: año
 *         schema:
 *           type: integer
 *         description: Año para el resumen
 *     responses:
 *       200:
 *         description: Resumen financiero con ingresos, gastos, balance, etc.
 */
router.get('/summary', getFinancialSummary);

/**
 * @swagger
 * /api/v1/analytics/trends:
 *   get:
 *     summary: Obtiene tendencias financieras mensuales
 *     tags: [Analytics]
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
 *           default: 6
 *         description: Número de meses a analizar
 *     responses:
 *       200:
 *         description: Tendencias mensuales de ingresos y gastos
 */
router.get('/trends', getMonthlyTrends);

module.exports = router;
