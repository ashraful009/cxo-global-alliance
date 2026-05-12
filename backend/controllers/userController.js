const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const UserService = require('../models/UserService');

const getMembers = asyncHandler(async (req, res) => {
  const members = await User.find({ role: 'member' })
    .select('name designation organizationName bio profileImage role membershipType')
    .sort({ createdAt: -1 });
  res.json(members);
});

const getUserCount = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const count = await User.countDocuments(filter);
  res.json({ count });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

const updateUserRole = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('You cannot change your own role');
  }
  const { role } = req.body;
  const validRoles = ['user', 'member', 'admin'];
  if (!validRoles.includes(role)) {
    res.status(400);
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.role = role;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
});

// @desc    Get full public profile of a user (member/admin access only)
// @route   GET /api/users/:id/profile
// @access  Private (member or admin)
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user || (req.user.role !== 'member' && req.user.role !== 'admin')) {
    res.status(403);
    throw new Error('Access denied. Members only.');
  }
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  const services = await UserService.find({ user: req.params.id }).sort({ order: 1 });
  res.json({ ...user.toObject(), services });
});

module.exports = { getMembers, getUserCount, getAllUsers, updateUserRole, getUserProfile };
