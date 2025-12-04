const express = require('express');
const {
  suggestBoardIcon,
  suggestFixedExpenses
} = require('@level3/controllers/aiSuggestionsController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.get('/suggest-board-icon', suggestBoardIcon);
router.get('/suggest-fixed-expenses', suggestFixedExpenses);

module.exports = router;

