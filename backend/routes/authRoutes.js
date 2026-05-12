const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { register, login, getMe, updateProfile } = require('../controllers/authController');

router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch(
  '/profile',
  protect,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage',   maxCount: 1 },
  ]),
  updateProfile
);

module.exports = router;
