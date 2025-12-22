const express = require('express');
const {
  getDebts,
  getDebt,
  createDebt,
  updateDebt,
  deleteDebt,
  payDebt,
  getDebtsSummary,
  getDebtLevel,
  getTotalizador
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
 * /api/v1/debts/level:
 *   get:
 *     summary: Obtiene el nivel de deuda del perfil
 *     tags: [Debts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del perfil
 *       - in: query
 *         name: monthlyIncome
 *         schema:
 *           type: number
 *         description: Ingresos mensuales (opcional, se calcula automáticamente si no se proporciona)
 *     responses:
 *       200:
 *         description: Nivel de deuda calculado
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
 *                     level:
 *                       type: number
 *                       enum: [1, 2, 3, 4]
 *                       description: "1=Saludable, 2=Controlada, 3=En Riesgo, 4=Crítica"
 *                     levelName:
 *                       type: string
 *                     levelColor:
 *                       type: string
 *                     message:
 *                       type: string
 *                     totalDebt:
 *                       type: number
 *                     debtToIncomeRatio:
 *                       type: string
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/level', getDebtLevel);
router.get('/totalizador', getTotalizador);

/**
 * @swagger
 * /api/v1/debts/totalizador:
 *   get:
 *     summary: Obtiene el totalizador de deudas
 *     tags: [Debts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: perfilID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del perfil
 *     responses:
 *       200:
 *         description: Totalizador de deudas
 */
router.get('/totalizador', getTotalizador);

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
