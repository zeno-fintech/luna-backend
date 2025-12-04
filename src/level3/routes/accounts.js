const express = require('express');
const {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount
} = require('@level3/controllers/accountController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Accounts
 *     description: Gestión de cuentas bancarias
 */

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

/**
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     summary: Obtiene todas las cuentas del usuario
 *     tags: [Accounts]
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
 *         description: Filtrar por tipo de cuenta
 *     responses:
 *       200:
 *         description: Lista de cuentas
 *   post:
 *     summary: Crea una nueva cuenta bancaria
 *     tags: [Accounts]
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
 *               - perfilID
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Cuenta Corriente Banco Falabella
 *               tipo:
 *                 type: string
 *                 enum: [Corriente, Ahorro, Inversión, Efectivo]
 *                 example: Corriente
 *               banco:
 *                 type: string
 *                 example: Banco Falabella
 *               numero:
 *                 type: string
 *                 example: 1234567890
 *               saldo:
 *                 type: number
 *                 example: 500000
 *               moneda:
 *                 type: string
 *                 example: CLP
 *               perfilID:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Cuenta creada exitosamente
 */
router.route('/')
  .get(getAccounts)
  .post(createAccount);

/**
 * @swagger
 * /api/v1/accounts/{id}:
 *   get:
 *     summary: Obtiene una cuenta específica
 *     tags: [Accounts]
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
 *         description: Información de la cuenta
 *   put:
 *     summary: Actualiza una cuenta
 *     tags: [Accounts]
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
 *               saldo:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cuenta actualizada
 *   delete:
 *     summary: Elimina una cuenta
 *     tags: [Accounts]
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
 *         description: Cuenta eliminada
 */
router.route('/:id')
  .get(getAccount)
  .put(updateAccount)
  .delete(deleteAccount);

module.exports = router;

