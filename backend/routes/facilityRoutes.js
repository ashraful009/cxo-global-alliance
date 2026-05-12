const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} = require('../controllers/facilityController');

// Public routes
router.get('/', getFacilities);
router.get('/:id', getFacilityById);

// Admin only routes
router.post('/', protect, admin, createFacility);
router.put('/:id', protect, admin, updateFacility);
router.delete('/:id', protect, admin, deleteFacility);

module.exports = router;
