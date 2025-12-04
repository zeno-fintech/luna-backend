const express = require('express');
const {
  getDebts,
  getDebt,
  createDebt,
  updateDebt,
  deleteDebt,
  payDebt,
  getDebtsSummary
} = require('@level3/controllers/debtController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Debts
 *     description: Gestión de deudas
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/debts:
 *   get:
 *     summary: Obtiene todas las deudas del usuario
 *     tags: [Debts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         description: Filtrar por perfil
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [Activa, Pagada, Vencida]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de deudas
 *   post:
 *     summary: Crea una nueva deuda
 *     tags: [Debts]
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
 *               - montoTotal
 *               - perfilID
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Préstamo Auto
 *               institucion:
 *                 type: string
 *                 example: Banco Santander
 *               montoTotal:
 *                 type: number
 *                 example: 5000000
 *               plazo:
 *                 type: integer
 *                 example: 36
 *               abonoMensual:
 *                 type: number
 *                 example: 150000
 *               moneda:
 *                 type: string
 *                 example: CLP
 *               tipo:
 *                 type: string
 *                 enum: [Persona, Institucion]
 *                 example: Institucion
 *               perfilID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Deuda creada exitosamente
 */
router.route('/')
  .get(getDebts)
  .post(createDebt);

/**
 * @swagger
 * /api/v1/debts/summary:
 *   get:
 *     summary: Obtiene un resumen de todas las deudas
 *     tags: [Debts]
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
 *         description: Resumen de deudas con totales y estadísticas
 */
router.get('/summary', getDebtsSummary);

/**
 * @swagger
 * /api/v1/debts/{id}:
 *   get:
 *     summary: Obtiene una deuda específica
 *     tags: [Debts]
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
 *         description: Información de la deuda
 *   put:
 *     summary: Actualiza una deuda
 *     tags: [Debts]
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
 *               montoTotal:
 *                 type: number
 *               abonoMensual:
 *                 type: number
 *     responses:
 *       200:
 *         description: Deuda actualizada
 *   delete:
 *     summary: Elimina una deuda
 *     tags: [Debts]
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
 *         description: Deuda eliminada
 */
router.route('/:id')
  .get(getDebt)
  .put(updateDebt)
  .delete(deleteDebt);

/**
 * @swagger
 * /api/v1/debts/{id}/pay:
 *   post:
 *     summary: Registra un pago de deuda
 *     tags: [Debts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monto
 *             properties:
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
 *       200:
 *         description: Pago registrado exitosamente
 *       400:
 *         description: Error de validación o monto excede el saldo pendiente
 */
router.post('/:id/pay', payDebt);

module.exports = router;
