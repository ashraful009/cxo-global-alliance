const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getServices, getServiceCount, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');

router.get('/', getServices);
router.get('/count', protect, admin, getServiceCount);
router.get('/:id', getServiceById);

router.post('/', protect, admin, upload.single('image'), createService);
router.put('/:id', protect, admin, upload.single('image'), updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;
