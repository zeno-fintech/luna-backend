const express = require('express');
const {
  getIncomes,
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome
} = require('@level3/controllers/incomeController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getIncomes)
  .post(createIncome);

router.route('/:id')
  .get(getIncome)
  .put(updateIncome)
  .delete(deleteIncome);

module.exports = router;

