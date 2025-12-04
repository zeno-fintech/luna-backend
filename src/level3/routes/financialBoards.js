const express = require('express');
const {
  getFinancialBoards,
  getFinancialBoard,
  createFinancialBoard,
  updateFinancialBoard,
  deleteFinancialBoard
} = require('@level3/controllers/financialBoardController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getFinancialBoards)
  .post(createFinancialBoard);

router.route('/:id')
  .get(getFinancialBoard)
  .put(updateFinancialBoard)
  .delete(deleteFinancialBoard);

module.exports = router;

