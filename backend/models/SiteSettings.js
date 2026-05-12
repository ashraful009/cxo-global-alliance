const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    heroText: String,
    heroSubtext: String,
    heroMediaType: {
      type: String,
      enum: ['image', 'video'],
    },
    heroMediaUrl: String,
    presidentName: String,
    presidentDesignation: String,
    presidentImage: String,
    presidentMessage: String,
    missionText: String,
    visionText: String,
    officeAddress: String,
    phone1: String,
    phone2: String,
    email: String,
    membershipBenefits: [
      {
        title: String,
        description: String,
        icon: String,
      },
    ],
    socialLinks: {
      facebook: String,
      linkedin: String,
      instagram: String,
      tiktok: String,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
module.exports = SiteSettings;
