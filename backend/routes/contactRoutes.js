const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { submitContactMessage, getContactCount, getContactMessages, markAsRead, deleteMessage } = require('../controllers/contactController');

router.post('/', submitContactMessage);

router.get('/count', protect, admin, getContactCount);
router.get('/', protect, admin, getContactMessages);
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
