import express from 'express';
import { serveProfilePicture } from '../controllers/imageController';

const router = express.Router();

// Route to serve profile pictures
router.get('/profile/:userId', serveProfilePicture);

export default router;
