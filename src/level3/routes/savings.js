const express = require('express');
const {
  getSavings,
  getSaving,
  createSaving,
  updateSaving,
  deleteSaving
} = require('@level3/controllers/savingsController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getSavings)
  .post(createSaving);

router.route('/:id')
  .get(getSaving)
  .put(updateSaving)
  .delete(deleteSaving);

module.exports = router;

