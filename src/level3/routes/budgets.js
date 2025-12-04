const express = require('express');
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget
} = require('@level3/controllers/budgetController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getBudgets)
  .post(createBudget);

router.route('/:id')
  .get(getBudget)
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;

