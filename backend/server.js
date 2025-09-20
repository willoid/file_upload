const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

// Create uploads folder if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

app.post('/upload', upload.single('file'), (req, res) => {
    // Simulate network delay
    setTimeout(() => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.json({
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
            message: 'Upload successful'
        });
    }, 1000);
});

app.listen(3001, () => {
    console.log('Upload server running on http://localhost:3001');
    console.log('Files will be saved to ./uploads/');
});
