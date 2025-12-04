const express = require('express');
const {
  getRules,
  getRule,
  createRule,
  updateRule,
  deleteRule
} = require('@level3/controllers/ruleController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getRules)
  .post(createRule);

router.route('/:id')
  .get(getRule)
  .put(updateRule)
  .delete(deleteRule);

module.exports = router;

