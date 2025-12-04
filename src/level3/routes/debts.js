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

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getDebts)
  .post(createDebt);

// Resumen de deudas
router.get('/summary', getDebtsSummary);

router.route('/:id')
  .get(getDebt)
  .put(updateDebt)
  .delete(deleteDebt);

// Ruta especial para pagar desde el detalle
router.post('/:id/pay', payDebt);

module.exports = router;

