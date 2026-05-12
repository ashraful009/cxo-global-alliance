const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserServices,
  createUserService,
  updateUserService,
  deleteUserService,
} = require('../controllers/userServiceController');

router.get('/:userId', getUserServices);
router.post('/', protect, createUserService);
router.put('/:id', protect, updateUserService);
router.delete('/:id', protect, deleteUserService);

module.exports = router;
