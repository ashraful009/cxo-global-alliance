const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');

const getEvents = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const query = Event.find({}).sort({ date: -1 });
  if (limit > 0) query.limit(limit);
  res.json(await query);
});

const getEventCount = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let count;
  if (status === 'upcoming') {
    count = await Event.countDocuments({ date: { $gt: new Date() } });
  } else if (status === 'closed') {
    count = await Event.countDocuments({ date: { $lte: new Date() } });
  } else {
    count = await Event.countDocuments({});
  }
  res.json({ count });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) { res.status(404); throw new Error('Event not found'); }
  res.json(event);
});

const createEvent = asyncHandler(async (req, res) => {
  const { title, date, time, location, details, registrationLink } = req.body;
  const image = req.file ? req.file.path : '';
  const event = await Event.create({ title, image, date, time, location, details, registrationLink });
  res.status(201).json(event);
});

const updateEvent = asyncHandler(async (req, res) => {
  const { title, date, time, location, details, registrationLink } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) { res.status(404); throw new Error('Event not found'); }

  if (title) event.title = title;
  if (date) event.date = date;
  if (time) event.time = time;
  if (location) event.location = location;
  if (details) event.details = details;
  if (registrationLink) event.registrationLink = registrationLink;
  if (req.file) event.image = req.file.path;

  res.json(await event.save());
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) { res.status(404); throw new Error('Event not found'); }
  await event.deleteOne();
  res.json({ message: 'Event removed' });
});

module.exports = { getEvents, getEventCount, getEventById, createEvent, updateEvent, deleteEvent };
