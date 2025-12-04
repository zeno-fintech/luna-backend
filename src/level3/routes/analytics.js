const express = require('express');
const {
  getFinancialSummary,
  getMonthlyTrends
} = require('@level3/controllers/analyticsController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.get('/summary', getFinancialSummary);
router.get('/trends', getMonthlyTrends);

module.exports = router;

