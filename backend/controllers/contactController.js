const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');

const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please provide name, email, subject, and message');
  }
  const contactMessage = await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: 'Message sent successfully', data: contactMessage });
});

const getContactCount = asyncHandler(async (req, res) => {
  const filter = req.query.unread === 'true' ? { isRead: false } : {};
  const count = await ContactMessage.countDocuments(filter);
  res.json({ count });
});

const getContactMessages = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const filter = req.query.unread === 'true' ? { isRead: false } : {};
  const query = ContactMessage.find(filter).sort({ createdAt: -1 });
  if (limit > 0) query.limit(limit);
  res.json(await query);
});

const markAsRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) { res.status(404); throw new Error('Message not found'); }
  message.isRead = !message.isRead;
  res.json(await message.save());
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) { res.status(404); throw new Error('Message not found'); }
  await message.deleteOne();
  res.json({ message: 'Message removed' });
});

module.exports = { submitContactMessage, getContactCount, getContactMessages, markAsRead, deleteMessage };
