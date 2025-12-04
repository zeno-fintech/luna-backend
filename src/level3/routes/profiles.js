const express = require('express');
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} = require('@level3/controllers/profileController');
const { protect, authorize } = require('@core/middleware/auth');

const router = express.Router();

// All routes require authentication and USER role (Level 3)
router.use(protect);
router.use(authorize('USER'));

router.route('/')
  .get(getProfiles)
  .post(createProfile);

router.route('/:id')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;

