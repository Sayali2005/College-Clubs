// upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // make sure this file exports configured cloudinary

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'college_event_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

// ✅ Correct export:
module.exports = upload;
