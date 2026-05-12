const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cxo_uploads',
    allowedFormats: ['jpeg', 'jpg', 'png', 'webp'],
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cxo_uploads',
    resource_type: 'auto',
  },
});

const limits = { fileSize: 10 * 1024 * 1024 }; // 10 MB

const upload = multer({ storage, limits });

// Named helpers used in routes
upload.uploadSingle          = multer({ storage, limits }).single('image');
upload.uploadProfileImage    = multer({ storage, limits }).single('profileImage');
upload.uploadProfileImages   = multer({ storage, limits }).fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage',   maxCount: 1 },
]);
upload.uploadHeroMedia       = multer({ storage: videoStorage, limits }).single('heroMedia');
upload.uploadSettingsFields  = multer({ storage: videoStorage, limits }).fields([
  { name: 'heroMedia',      maxCount: 1 },
  { name: 'presidentImage', maxCount: 1 },
]);

module.exports = upload;
