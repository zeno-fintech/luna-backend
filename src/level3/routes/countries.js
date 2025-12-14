const express = require('express');
const {
  getCountries,
  getCountry
} = require('@level3/controllers/countryController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Countries
 *     description: Información de países (público, no requiere autenticación)
 */

/**
 * @swagger
 * /api/v1/countries:
 *   get:
 *     summary: Obtiene todos los países activos
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *           enum: [Norteamérica, Centroamérica, Sudamérica, Caribe]
 *         description: Filtrar por región
 *     responses:
 *       200:
 *         description: Lista de países activos
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
 */
router.get('/', getCountries);

/**
 * @swagger
 * /api/v1/countries/{codigo}:
 *   get:
 *     summary: Obtiene un país específico por su código
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: "Código del país (ej: CL, US, CO)"
 *         example: CL
 *     responses:
 *       200:
 *         description: Información del país
 *       404:
 *         description: País no encontrado
 */
router.get('/:codigo', getCountry);

module.exports = router;

