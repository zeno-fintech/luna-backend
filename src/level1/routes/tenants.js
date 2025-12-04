const express = require('express');
const {
  createTenant,
  getTenants,
  getTenant,
  updateTenant,
  deleteTenant
} = require('../controllers/tenantController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and superadmin role
router.use(protect);
router.use(authorize('SUPERADMIN'));

router.route('/')
  .get(getTenants)
  .post(createTenant);

router.route('/:id')
  .get(getTenant)
  .put(updateTenant)
  .delete(deleteTenant);

module.exports = router;

