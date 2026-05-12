const asyncHandler = require('express-async-handler');
const Facility = require('../models/Facility');

// @desc    Get all facilities
// @route   GET /api/facilities
// @access  Public
const getFacilities = asyncHandler(async (req, res) => {
  const facilities = await Facility.find({}).sort({ order: 1 });
  res.json(facilities);
});

// @desc    Get facility by ID
// @route   GET /api/facilities/:id
// @access  Public
const getFacilityById = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);

  if (facility) {
    res.json(facility);
  } else {
    res.status(404);
    throw new Error('Facility not found');
  }
});

// @desc    Create a facility
// @route   POST /api/facilities
// @access  Private/Admin
const createFacility = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;

  const facility = new Facility({
    title,
    description,
    order: order || 0,
  });

  const createdFacility = await facility.save();
  res.status(201).json(createdFacility);
});

// @desc    Update a facility
// @route   PUT /api/facilities/:id
// @access  Private/Admin
const updateFacility = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;

  const facility = await Facility.findById(req.params.id);

  if (facility) {
    facility.title = title || facility.title;
    facility.description = description || facility.description;
    facility.order = order !== undefined ? order : facility.order;

    const updatedFacility = await facility.save();
    res.json(updatedFacility);
  } else {
    res.status(404);
    throw new Error('Facility not found');
  }
});

// @desc    Delete a facility
// @route   DELETE /api/facilities/:id
// @access  Private/Admin
const deleteFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);

  if (facility) {
    await facility.deleteOne();
    res.json({ message: 'Facility removed' });
  } else {
    res.status(404);
    throw new Error('Facility not found');
  }
});

module.exports = {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
