const express = require('express');
const {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount
} = require('@level3/controllers/accountController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getAccounts)
  .post(createAccount);

router.route('/:id')
  .get(getAccount)
  .put(updateAccount)
  .delete(deleteAccount);

module.exports = router;

