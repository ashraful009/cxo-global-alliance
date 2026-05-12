const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getMembers, getUserCount, getAllUsers, updateUserRole, getUserProfile } = require('../controllers/userController');

router.get('/members', getMembers);
router.get('/count', protect, admin, getUserCount);
router.get('/', protect, admin, getAllUsers);
router.get('/:id/profile', protect, getUserProfile);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
