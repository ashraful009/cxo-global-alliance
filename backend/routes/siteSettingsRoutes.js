const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getHeroSettings,
  getSiteSettings,
  updateSiteSettings,
  updateHeroSettings,
} = require('../controllers/siteSettingsController');

// Public routes — /hero must come before / to avoid route shadowing
router.get('/hero', getHeroSettings);
router.get('/', getSiteSettings);

// Admin only routes
router.put(
  '/hero',
  protect, admin,
  upload.single('heroMedia'),
  updateHeroSettings
);

router.put(
  '/',
  protect, admin,
  upload.fields([
    { name: 'heroMedia', maxCount: 1 },
    { name: 'presidentImage', maxCount: 1 },
  ]),
  updateSiteSettings
);

module.exports = router;
