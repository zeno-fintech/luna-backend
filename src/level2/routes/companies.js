const express = require('express');
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companyController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create and list require tenant_owner or tenant_admin
router.route('/')
  .get(authorize('TENANT_OWNER', 'TENANT_ADMIN'), getCompanies)
  .post(authorize('TENANT_OWNER', 'TENANT_ADMIN'), createCompany);

// Individual company routes allow company_admin as well
router.route('/:id')
  .get(authorize('TENANT_OWNER', 'TENANT_ADMIN', 'COMPANY_ADMIN'), getCompany)
  .put(authorize('TENANT_OWNER', 'TENANT_ADMIN', 'COMPANY_ADMIN'), updateCompany)
  .delete(authorize('TENANT_OWNER', 'TENANT_ADMIN'), deleteCompany);

module.exports = router;

