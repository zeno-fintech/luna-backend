const express = require('express');
const {
  getTenantDashboard,
  getCompanyDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Tenant dashboard
router.get('/', authorize('TENANT_OWNER', 'TENANT_ADMIN'), getTenantDashboard);

// Company dashboard
router.get('/companies/:id/dashboard', authorize('TENANT_OWNER', 'TENANT_ADMIN', 'COMPANY_ADMIN'), getCompanyDashboard);

module.exports = router;

