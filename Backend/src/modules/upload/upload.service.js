'use strict';
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('../../utils/AppError');
const env = require('../../config/env');

const uploadDir = path.resolve(env.upload.path);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${req.user.id}-${unique}${ext}`);
  },
});

const allowedMimes = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'application/pdf',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new AppError(400, 'Tipo de arquivo não permitido'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.upload.maxMb * 1024 * 1024 },
});

function getFileInfo(file) {
  return {
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`,
  };
}

function deleteFile(filename) {
  const filepath = path.join(uploadDir, filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
}

module.exports = { upload, getFileInfo, deleteFile };
