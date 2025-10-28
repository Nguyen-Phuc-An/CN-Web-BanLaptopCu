const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'public/uploads/products';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext) && allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type'), false);
};

const limits = {
  fileSize: parseInt(process.env.MAX_IMAGE_SIZE_BYTES || 5 * 1024 * 1024, 10), // default 5MB
  files: parseInt(process.env.MAX_IMAGE_FILES || 5, 10)
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;