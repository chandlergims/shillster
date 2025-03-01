import { Request, Response } from 'express';
import User from '../models/User';
import fs from 'fs';
import path from 'path';

// @desc    Serve profile picture
// @route   GET /api/images/profile/:userId
// @access  Public
export const serveProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilePicture) {
      res.status(404).send("Image not found");
      return;
    }

    // If stored as a URL (Cloudinary/S3), just redirect
    if (user.profilePicture.startsWith("http")) {
      res.redirect(user.profilePicture);
      return;
    }

    // If stored as a file path, serve the image
    const uploadsDir = path.join(__dirname, '../../uploads');
    const imagePath = path.join(uploadsDir, path.basename(user.profilePicture));
    
    console.log(`Serving image from: ${imagePath}`);
    console.log(`Original profile picture path: ${user.profilePicture}`);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`File not found: ${imagePath}`);
      res.status(404).send("File not found");
      return;
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
