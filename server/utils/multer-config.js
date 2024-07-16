import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Directory where uploads will be stored
const uploadDirectory = './uploads';

// Ensure the directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Set destination to your uploadDirectory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage });

export { upload };
