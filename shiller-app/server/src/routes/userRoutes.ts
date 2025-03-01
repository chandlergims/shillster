import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getUsers, 
  getNewUsers, 
  getTopShillers,
  sendFollowRequest,
  respondToFollowRequest,
  getPendingFollowRequests,
  deleteFollowRequest,
  getFollowing,
  getFollowers
} from '../controllers/userController';
import { protect, uploadMiddleware } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads with proper path resolution
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __dirname = path.resolve();
    const uploadsDir = path.join(__dirname, 'uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Public routes
router.post('/', upload.single('profilePicture'), uploadMiddleware, registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/new', getNewUsers);
router.get('/top-shillers', getTopShillers);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.post('/:id/follow', protect, sendFollowRequest);
router.put('/follow-requests/:id', protect, respondToFollowRequest);
router.get('/follow-requests', protect, getPendingFollowRequests);
router.delete('/follow-requests/:id', protect, deleteFollowRequest);
router.get('/following', protect, getFollowing);
router.get('/followers', protect, getFollowers);

export default router;
