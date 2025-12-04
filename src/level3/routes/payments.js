const express = require('express');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
} = require('@level3/controllers/paymentController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Gestión de pagos de deudas
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     summary: Obtiene todos los pagos del usuario
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *       - in: query
 *         name: deudaID
 *         schema:
 *           type: string
 *         description: Filtrar por deuda específica
 *     responses:
 *       200:
 *         description: Lista de pagos
 *   post:
 *     summary: Crea un nuevo pago de deuda
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deudaID
 *               - monto
 *             properties:
 *               deudaID:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               monto:
 *                 type: number
 *                 example: 150000
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-04
 *               cuentaID:
 *                 type: string
 *                 description: ID de la cuenta desde donde se paga
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 */
router.route('/')
  .get(getPayments)
  .post(createPayment);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   get:
 *     summary: Obtiene un pago específico
 *     tags: [Payments]
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
 *         description: Información del pago
 *   put:
 *     summary: Actualiza un pago
 *     tags: [Payments]
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
 *               monto:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Pago actualizado
 *   delete:
 *     summary: Elimina un pago
 *     tags: [Payments]
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
 *         description: Pago eliminado
 */
router.route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

module.exports = router;
