const express = require('express');
const {
  getFinancialSummary,
  getNetWorth,
  getFinancialScore
} = require('@level3/controllers/summaryController');
const {
  getUserInsights,
  getSpendingInsights
} = require('@level3/controllers/insightsController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

// Summary endpoints
router.get('/summary', getFinancialSummary);
router.get('/net-worth', getNetWorth);
router.get('/financial-score', getFinancialScore);

// Insights endpoints (with AI hooks)
router.get('/insights', getUserInsights);
router.get('/insights/spending', getSpendingInsights);

module.exports = router;

