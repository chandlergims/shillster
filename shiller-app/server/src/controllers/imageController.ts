import { Request, Response } from 'express';
import User from '../models/User';
import * as jdenticon from 'jdenticon';

// @desc    Generate and serve profile picture
// @route   GET /api/images/profile/:userId
// @access  Public
export const serveProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // If user has a profile picture URL that starts with http, redirect to it
    if (user.profilePicture && user.profilePicture.startsWith("http")) {
      res.redirect(user.profilePicture);
      return;
    }

    // Generate a random identicon based on the user's ID
    const size = 200; // Size of the identicon in pixels
    const png = jdenticon.toPng(userId, size);
    
    // Set the content type and send the PNG data
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(png);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
