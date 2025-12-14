const express = require('express');
const {
  getAssetValuations,
  getAssetValuation,
  createAssetValuation,
  updateAssetValuation,
  deleteAssetValuation,
  getAssetValuationHistory
} = require('@level3/controllers/assetValuationController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Asset Valuations
 *     description: Gestión de historial de tasaciones de activos
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/assets/{assetId}/valuations:
 *   get:
 *     summary: Obtiene todas las tasaciones de un activo
 *     tags: [Asset Valuations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del activo
 *     responses:
 *       200:
 *         description: Lista de tasaciones
 *       404:
 *         description: Activo no encontrado
 *   post:
 *     summary: Crea una nueva tasación para un activo
 *     tags: [Asset Valuations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del activo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - valorUF
 *               - valorUFEnCLP
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2021-01-15"
 *               valorUF:
 *                 type: number
 *                 example: 4444
 *                 description: "Valor en UF"
 *               valorUFEnCLP:
 *                 type: number
 *                 example: 35000
 *                 description: "Valor de 1 UF en CLP en el momento de la tasación"
 *               valorDirectoCLP:
 *                 type: number
 *                 example: 155540000
 *                 description: "Valor directo en CLP (alternativa a valorUF)"
 *               tipoTasacion:
 *                 type: string
 *                 enum: [Compra, Tasación Bancaria, Avalúo Fiscal, Tasación Comercial, Otro]
 *                 example: Compra
 *               institucion:
 *                 type: string
 *                 example: "Santander Chile"
 *               observaciones:
 *                 type: string
 *                 example: "Tasación realizada al momento de la compra"
 *     responses:
 *       201:
 *         description: Tasación creada exitosamente
 *       400:
 *         description: Error de validación
 */
router.route('/:assetId/valuations')
  .get(getAssetValuations)
  .post(createAssetValuation);

/**
 * @swagger
 * /api/v1/assets/{assetId}/valuations/history:
 *   get:
 *     summary: Obtiene el historial completo de evolución de valor de un activo
 *     tags: [Asset Valuations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del activo
 *     responses:
 *       200:
 *         description: Historial de evolución con resumen
 *       404:
 *         description: Activo no encontrado
 */
router.get('/:assetId/valuations/history', getAssetValuationHistory);

/**
 * @swagger
 * /api/v1/assets/valuations/{id}:
 *   get:
 *     summary: Obtiene una tasación específica
 *     tags: [Asset Valuations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tasación
 *     responses:
 *       200:
 *         description: Información de la tasación
 *       404:
 *         description: Tasación no encontrada
 *   put:
 *     summary: Actualiza una tasación
 *     tags: [Asset Valuations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tasación
 *     responses:
 *       200:
 *         description: Tasación actualizada
 *       404:
 *         description: Tasación no encontrada
 *   delete:
 *     summary: Elimina una tasación
 *     tags: [Asset Valuations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tasación
 *     responses:
 *       200:
 *         description: Tasación eliminada
 *       404:
 *         description: Tasación no encontrada
 */
router.route('/valuations/:id')
  .get(getAssetValuation)
  .put(updateAssetValuation)
  .delete(deleteAssetValuation);

module.exports = router;

