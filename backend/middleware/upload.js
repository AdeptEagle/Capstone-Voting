import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { UPLOAD_LIMITS } from "../config/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'candidate-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: UPLOAD_LIMITS.fileSize
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// New middleware for handling base64 image data
const handleBase64Image = (req, res, next) => {
  // If there's a base64 image in the request body, process it
  if (req.body.photoBase64) {
    try {
      const base64Data = req.body.photoBase64;
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64String = matches[2];
        
        // Validate mime type
        if (!mimeType.startsWith('image/')) {
          return res.status(400).json({ error: 'Only image files are allowed!' });
        }
        
        // Generate filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = mimeType.split('/')[1];
        const filename = `candidate-${uniqueSuffix}.${extension}`;
        
        // Store the base64 data as the photoUrl (we'll serve it directly)
        req.body.photoUrl = `data:${mimeType};base64,${base64String}`;
        
        console.log('📁 Base64 image processed:', {
          filename,
          mimeType,
          size: base64String.length
        });
      } else {
        return res.status(400).json({ error: 'Invalid base64 image format!' });
      }
    } catch (error) {
      console.error('❌ Error processing base64 image:', error);
      return res.status(400).json({ error: 'Error processing image data!' });
    }
  }
  
  next();
};

export { upload, uploadsDir, handleBase64Image }; 