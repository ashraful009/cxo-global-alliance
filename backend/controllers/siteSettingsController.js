const asyncHandler = require('express-async-handler');
const SiteSettings = require('../models/SiteSettings');

// @desc    Get hero settings (public)
// @route   GET /api/settings/hero
// @access  Public
const getHeroSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOne({});
  if (settings) {
    res.json({
      heroText: settings.heroText,
      heroSubtext: settings.heroSubtext,
      heroMediaType: settings.heroMediaType,
      heroMediaUrl: settings.heroMediaUrl,
    });
  } else {
    res.json(null);
  }
});

// @desc    Get all site settings (public)
// @route   GET /api/settings
// @access  Public
const getSiteSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOne({});
  res.json(settings || {});
});

// @desc    Update site settings (partial — only fields sent are updated)
// @route   PUT /api/settings
// @access  Private/Admin
const updateSiteSettings = asyncHandler(async (req, res) => {
  const settingsData = { ...req.body };

  // Handle nested socialLinks sent as flat fields (e.g. socialLinks[facebook])
  // or as a JSON string
  if (typeof settingsData.socialLinks === 'string') {
    try { settingsData.socialLinks = JSON.parse(settingsData.socialLinks); } catch { delete settingsData.socialLinks; }
  }

  // Handle uploaded files (upload.fields used on this route)
  const files = req.files || {};
  if (files.heroMedia && files.heroMedia[0]) {
    settingsData.heroMediaUrl = files.heroMedia[0].path;
  }
  if (files.presidentImage && files.presidentImage[0]) {
    settingsData.presidentImage = files.presidentImage[0].path;
  }

  const updatedSettings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: settingsData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json(updatedSettings);
});

// @desc    Update hero settings only
// @route   PUT /api/settings/hero
// @access  Private/Admin
const updateHeroSettings = asyncHandler(async (req, res) => {
  const { heroText, heroSubtext, heroMediaType } = req.body;
  const settingsData = {};
  if (heroText !== undefined) settingsData.heroText = heroText;
  if (heroSubtext !== undefined) settingsData.heroSubtext = heroSubtext;
  if (heroMediaType !== undefined) settingsData.heroMediaType = heroMediaType;
  if (req.file) settingsData.heroMediaUrl = req.file.path;

  const updatedSettings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: settingsData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.json({
    heroText: updatedSettings.heroText,
    heroSubtext: updatedSettings.heroSubtext,
    heroMediaType: updatedSettings.heroMediaType,
    heroMediaUrl: updatedSettings.heroMediaUrl,
  });
});

module.exports = {
  getHeroSettings,
  getSiteSettings,
  updateSiteSettings,
  updateHeroSettings,
};
