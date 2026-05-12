const asyncHandler = require('express-async-handler');
const UserService = require('../models/UserService');

const getUserServices = asyncHandler(async (req, res) => {
  const services = await UserService.find({ user: req.params.userId }).sort({ order: 1 });
  res.json(services);
});

const createUserService = asyncHandler(async (req, res) => {
  const { title, description, icon, order } = req.body;
  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description are required');
  }
  const service = await UserService.create({
    user: req.user._id,
    title,
    description,
    icon: icon || '',
    order: order || 0,
  });
  res.status(201).json(service);
});

const updateUserService = asyncHandler(async (req, res) => {
  const service = await UserService.findById(req.params.id);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  if (service.user.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  const { title, description, icon, order } = req.body;
  if (title !== undefined) service.title = title;
  if (description !== undefined) service.description = description;
  if (icon !== undefined) service.icon = icon;
  if (order !== undefined) service.order = order;
  res.json(await service.save());
});

const deleteUserService = asyncHandler(async (req, res) => {
  const service = await UserService.findById(req.params.id);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  if (service.user.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  await service.deleteOne();
  res.json({ message: 'Service removed' });
});

module.exports = { getUserServices, createUserService, updateUserService, deleteUserService };
