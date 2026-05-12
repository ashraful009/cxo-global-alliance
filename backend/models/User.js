const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Auth
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['user', 'member', 'admin'], default: 'user' },

    // Images
    profileImage: { type: String, default: '' },
    coverImage:   { type: String, default: '' },

    // Personal
    dateOfBirth:    { type: Date },
    nationality:    { type: String, default: '' },
    gender:         { type: String, enum: ['Male', 'Female'], default: undefined },
    phone:          { type: String, default: '' },
    presentAddress: { type: String, default: '' },

    // Organization
    organizationName: { type: String, default: '' },
    designation:      { type: String, default: '' },
    organizationType: {
      type: String,
      enum: ['Private Company', 'Public Company', 'Government', 'NGO/Non-Profit', 'Startup', 'Multinational', 'Other'],
      default: 'Other',
    },
    companyLocation:    { type: String, default: '' },
    companyWebsite:     { type: String, default: '' },
    companyDescription: { type: String, default: '' },

    // Membership
    membershipType: { type: String, enum: ['General Member', 'Life Member'], default: 'General Member' },
    reference:      { type: String, default: '' },

    // About
    bio: { type: String, default: '' },

    // Social
    socialLinks: {
      linkedin:  { type: String, default: '' },
      facebook:  { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter:   { type: String, default: '' },
      website:   { type: String, default: '' },
    },

    // Declaration
    declarationAccepted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
