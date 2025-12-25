const express = require('express');
const upload = require('../config/upload');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;