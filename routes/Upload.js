// filepath: e:\projects\notes-backend\routes\Upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST /api/upload - Admin only
router.post('/', auth, admin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the file path and original filename for saving in the note
  res.json({ 
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname
  });
});

module.exports = router;