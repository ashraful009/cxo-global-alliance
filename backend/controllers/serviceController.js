const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');

const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({}).sort({ order: 1 });
  res.json(services);
});

const getServiceCount = asyncHandler(async (req, res) => {
  const count = await Service.countDocuments({});
  res.json({ count });
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  res.json(service);
});

const createService = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const image = req.file ? req.file.path : '';
  const service = await Service.create({ title, description, image, order: order || 0 });
  res.status(201).json(service);
});

const updateService = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const service = await Service.findById(req.params.id);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  if (title) service.title = title;
  if (description) service.description = description;
  if (order !== undefined) service.order = order;
  if (req.file) service.image = req.file.path;
  res.json(await service.save());
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) { res.status(404); throw new Error('Service not found'); }
  await service.deleteOne();
  res.json({ message: 'Service removed' });
});

module.exports = { getServices, getServiceCount, getServiceById, createService, updateService, deleteService };
