const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage,
  coverImage: user.coverImage,
  dateOfBirth: user.dateOfBirth,
  nationality: user.nationality,
  gender: user.gender,
  phone: user.phone,
  presentAddress: user.presentAddress,
  organizationName: user.organizationName,
  designation: user.designation,
  organizationType: user.organizationType,
  companyLocation: user.companyLocation,
  companyWebsite: user.companyWebsite,
  companyDescription: user.companyDescription,
  membershipType: user.membershipType,
  reference: user.reference,
  bio: user.bio,
  socialLinks: user.socialLinks,
  declarationAccepted: user.declarationAccepted,
  createdAt: user.createdAt,
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const {
    name, email, password,
    dateOfBirth, nationality, gender, phone, presentAddress,
    organizationName, designation, organizationType,
    companyLocation, companyWebsite, companyDescription,
    membershipType, reference, bio,
    declarationAccepted,
  } = req.body;

  // Declaration must be accepted
  if (declarationAccepted !== 'true' && declarationAccepted !== true) {
    res.status(400);
    throw new Error('You must accept the declaration to register');
  }

  // Required fields
  if (!name || !email || !password || !phone || !organizationName || !designation || !presentAddress) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('Email already in use');
  }

  // Parse socialLinks (sent as JSON string from FormData)
  let socialLinks = {};
  if (req.body.socialLinks) {
    try { socialLinks = JSON.parse(req.body.socialLinks); } catch { /* ignore */ }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: 'user',
    profileImage: req.file ? req.file.path : '',
    dateOfBirth: dateOfBirth || undefined,
    nationality: nationality || '',
    gender: gender || undefined,
    phone,
    presentAddress,
    organizationName,
    designation,
    organizationType: organizationType || 'Other',
    companyLocation: companyLocation || '',
    companyWebsite: companyWebsite || '',
    companyDescription: companyDescription || '',
    membershipType: membershipType || 'General Member',
    reference: reference || '',
    bio: bio || '',
    socialLinks,
    declarationAccepted: true,
  });

  const token = generateToken(user._id, user.role);
  res.status(201).json({ token, user: formatUser(user) });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const token = generateToken(user._id, user.role);
  res.json({ token, user: formatUser(user) });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json(formatUser(user));
});

// @desc    Update profile
// @route   PATCH /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }

  const updatableFields = [
    'name', 'dateOfBirth', 'nationality', 'gender', 'phone', 'presentAddress',
    'organizationName', 'designation', 'organizationType',
    'companyLocation', 'companyWebsite', 'companyDescription',
    'membershipType', 'reference', 'bio',
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  // socialLinks sent as JSON string
  if (req.body.socialLinks) {
    try {
      const sl = typeof req.body.socialLinks === 'string'
        ? JSON.parse(req.body.socialLinks)
        : req.body.socialLinks;
      user.socialLinks = { ...(user.socialLinks || {}), ...sl };
    } catch { /* ignore */ }
  }

  // Handle file uploads — route uses upload.fields([profileImage, coverImage])
  const files = req.files || {};
  if (files.profileImage?.[0]) user.profileImage = files.profileImage[0].path;
  if (files.coverImage?.[0])   user.coverImage   = files.coverImage[0].path;
  // Fallback for single-file upload
  if (req.file) user.profileImage = req.file.path;

  const updated = await user.save();
  res.json(formatUser(updated));
});

module.exports = { register, login, getMe, updateProfile };
