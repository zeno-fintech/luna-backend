const express = require('express');
const {
  getGlobalOverview,
  getTenantDetails,
  calculateMetricsSnapshot,
  getMetricsSnapshots
} = require('../controllers/adminController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and superadmin role
router.use(protect);
router.use(authorize('SUPERADMIN'));

// Overview
router.get('/overview', getGlobalOverview);

// Tenant details
router.get('/tenants/:id/details', getTenantDetails);

// Metrics
router.post('/metrics/calculate', calculateMetricsSnapshot);
router.get('/metrics/snapshots', getMetricsSnapshots);

module.exports = router;

