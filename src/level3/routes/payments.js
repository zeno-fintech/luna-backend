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

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getPayments)
  .post(createPayment);

router.route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

module.exports = router;

