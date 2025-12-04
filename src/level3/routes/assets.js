const express = require('express');
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
} = require('@level3/controllers/assetController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getAssets)
  .post(createAsset);

router.route('/:id')
  .get(getAsset)
  .put(updateAsset)
  .delete(deleteAsset);

module.exports = router;

