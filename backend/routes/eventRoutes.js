const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getEvents, getEventCount, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/count', protect, admin, getEventCount);
router.get('/:id', getEventById);

router.post('/', protect, admin, upload.single('image'), createEvent);
router.put('/:id', protect, admin, upload.single('image'), updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

module.exports = router;
