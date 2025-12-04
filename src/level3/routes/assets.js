const express = require('express');
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
} = require('@level3/controllers/assetController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Assets
 *     description: Gestión de activos (propiedades, vehículos, etc.)
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/assets:
 *   get:
 *     summary: Obtiene todos los activos del usuario
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [Propiedades, Vehículos, Inversiones, Otros]
 *         description: Filtrar por tipo de activo
 *     responses:
 *       200:
 *         description: Lista de activos
 *   post:
 *     summary: Crea un nuevo activo
 *     tags: [Assets]
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
 *               - tipo
 *               - valor
 *               - perfilID
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Departamento Las Condes
 *               tipo:
 *                 type: string
 *                 enum: [Propiedades, Vehículos, Inversiones, Otros]
 *                 example: Propiedades
 *               valor:
 *                 type: number
 *                 example: 150000000
 *               moneda:
 *                 type: string
 *                 example: CLP
 *               descripcion:
 *                 type: string
 *                 example: Departamento de 80m² en Las Condes
 *               perfilID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Activo creado exitosamente
 */
router.route('/')
  .get(getAssets)
  .post(createAsset);

/**
 * @swagger
 * /api/v1/assets/{id}:
 *   get:
 *     summary: Obtiene un activo específico
 *     tags: [Assets]
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
 *         description: Información del activo
 *   put:
 *     summary: Actualiza un activo
 *     tags: [Assets]
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
 *               valor:
 *                 type: number
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activo actualizado
 *   delete:
 *     summary: Elimina un activo
 *     tags: [Assets]
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
 *         description: Activo eliminado
 */
router.route('/:id')
  .get(getAsset)
  .put(updateAsset)
  .delete(deleteAsset);

module.exports = router;
