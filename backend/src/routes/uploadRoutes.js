const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, authorize } = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});


router.post('/', protect, authorize('vendor'), upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image file" });
        }

        const stream = cloudinary.uploader.upload_stream(
            { folder: 'quick-pick' },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary error:", error);
                    return res.status(500).json({ message: 'Image upload failed' });
                }

                res.status(200).json({
                    message: 'Image uploaded successfully',
                    imageUrl: result.secure_url
                });
            }
        );

        stream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;