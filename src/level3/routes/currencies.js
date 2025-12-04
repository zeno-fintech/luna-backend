const express = require('express');
const {
  getCurrencies,
  getCurrency
} = require('@level3/controllers/currencyController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Currencies
 *     description: Información de monedas y formatos (público, no requiere autenticación)
 */

/**
 * @swagger
 * /api/v1/currencies:
 *   get:
 *     summary: Obtiene todas las monedas activas con sus formatos
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: Lista de monedas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       codigo:
 *                         type: string
 *                         example: CLP
 *                       nombre:
 *                         type: string
 *                         example: Peso Chileno
 *                       simbolo:
 *                         type: string
 *                         example: "$"
 *                       formato:
 *                         type: object
 */
router.get('/', getCurrencies);

/**
 * @swagger
 * /api/v1/currencies/{codigo}:
 *   get:
 *     summary: Obtiene una moneda específica por su código
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la moneda (ej: CLP, USD, COP)
 *         example: CLP
 *     responses:
 *       200:
 *         description: Información de la moneda con formato
 *       404:
 *         description: Moneda no encontrada
 */
router.get('/:codigo', getCurrency);

module.exports = router;

