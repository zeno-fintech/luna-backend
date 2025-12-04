const express = require('express');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('@level3/controllers/transactionController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Gestión de transacciones (ingresos/gastos)
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/transactions:
 *   get:
 *     summary: Obtiene todas las transacciones del usuario
 *     tags: [Transactions]
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
 *           enum: [Ingreso, Gasto, Transferencia]
 *         description: Filtrar por tipo de transacción
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *         description: Filtrar por mes (1-12)
 *       - in: query
 *         name: año
 *         schema:
 *           type: integer
 *         description: Filtrar por año
 *     responses:
 *       200:
 *         description: Lista de transacciones
 *   post:
 *     summary: Crea una nueva transacción
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - monto
 *               - perfilID
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [Ingreso, Gasto, Transferencia]
 *                 example: Gasto
 *               monto:
 *                 type: number
 *                 example: 50000
 *               glosa:
 *                 type: string
 *                 example: Compra en supermercado
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-04
 *               categoria:
 *                 type: string
 *                 example: Alimentación
 *               perfilID:
 *                 type: string
 *               cuentaID:
 *                 type: string
 *               esGastoFijo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Transacción creada exitosamente
 */
router.route('/')
  .get(getTransactions)
  .post(createTransaction);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Obtiene una transacción específica
 *     tags: [Transactions]
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
 *         description: Información de la transacción
 *   put:
 *     summary: Actualiza una transacción
 *     tags: [Transactions]
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
 *               glosa:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transacción actualizada
 *   delete:
 *     summary: Elimina una transacción
 *     tags: [Transactions]
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
 *         description: Transacción eliminada
 */
router.route('/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
