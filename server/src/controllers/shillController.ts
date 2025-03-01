import { Request, Response } from 'express';
import Shill from '../models/Shill';
import User from '../models/User';
import mongoose from 'mongoose';
import '../models/CompletedShill';
import '../models/ShillResult';

// Create a new shill
export const createShill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokenAddress, reason } = req.body;
    const userId = req.user?._id;

    if (!tokenAddress || !reason) {
      res.status(400).json({ message: 'Token address and reason are required' });
      return;
    }

    // Validate that the user is a shiller
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.role !== 'shiller') {
      res.status(403).json({ message: 'Only shillers can create shills' });
      return;
    }

    // Check if user already has an active shill
    const existingActiveShill = await Shill.findOne({ creator: userId, active: true });
    if (existingActiveShill) {
      res.status(400).json({ message: 'You already have an active shill. Cancel it before creating a new one.' });
      return;
    }

    // Create new shill
    const newShill = new Shill({
      creator: userId,
      tokenAddress,
      reason,
      active: true,
      createdAt: new Date()
    });

    await newShill.save();

    // Return the created shill
    res.status(201).json(newShill);
  } catch (error) {
    console.error('Error creating shill:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Get active shill for a user
export const getActiveShill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    // Find active shill for the user
    const activeShill = await Shill.findOne({ creator: userId, active: true })
      .populate('creator', 'handle profilePicture');

    if (!activeShill) {
      res.status(404).json({ message: 'No active shill found for this user' });
      return;
    }

    res.status(200).json(activeShill);
  } catch (error) {
    console.error('Error getting active shill:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Get active shill for current user
export const getMyActiveShill = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    // Find active shill for the current user
    const activeShill = await Shill.findOne({ creator: userId, active: true });

    if (!activeShill) {
      res.status(404).json({ message: 'No active shill found' });
      return;
    }

    res.status(200).json(activeShill);
  } catch (error) {
    console.error('Error getting active shill:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Cancel active shill
export const cancelShill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shillId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(shillId)) {
      res.status(400).json({ message: 'Invalid shill ID' });
      return;
    }

    // Find the shill
    const shill = await Shill.findById(shillId);

    if (!shill) {
      res.status(404).json({ message: 'Shill not found' });
      return;
    }

    // Check if the user is the creator of the shill
    if (shill.creator.toString() !== userId?.toString()) {
      res.status(403).json({ message: 'You can only cancel your own shills' });
      return;
    }

    // Check if the shill is already inactive
    if (!shill.active) {
      res.status(400).json({ message: 'This shill is already inactive' });
      return;
    }

    // Update the shill to inactive
    shill.active = false;
    await shill.save();

    res.status(200).json({ message: 'Shill cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling shill:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Get active shills for followed users
export const getFollowedShills = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    // Get the user with populated following
    const user = await User.findById(userId).populate('following');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get the IDs of users being followed
    const followingIds = user.following.map(followedUser => 
      typeof followedUser === 'string' ? followedUser : followedUser._id
    );

    // Import CompletedShill model
    const CompletedShill = mongoose.model('CompletedShill');
    
    // Get the IDs of shills that the user has already completed
    const completedShills = await CompletedShill.find({ user: userId });
    const completedShillIds = completedShills.map(cs => cs.shill);

    // Find active shills from followed users that the user hasn't completed yet
    const shills = await Shill.find({ 
      creator: { $in: followingIds }, 
      active: true,
      _id: { $nin: completedShillIds } // Exclude completed shills
    }).populate('creator', 'handle profilePicture');

    res.status(200).json(shills);
  } catch (error) {
    console.error('Error getting followed shills:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Accept a shill
export const acceptShill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shillId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(shillId)) {
      res.status(400).json({ message: 'Invalid shill ID' });
      return;
    }

    // Find the shill
    const shill = await Shill.findById(shillId);

    if (!shill) {
      res.status(404).json({ message: 'Shill not found' });
      return;
    }

    // Check if the shill is already accepted or declined
    if (shill.status !== 'pending') {
      res.status(400).json({ message: `This shill is already ${shill.status}` });
      return;
    }

    // Update the shill status to accepted
    shill.status = 'accepted';
    await shill.save();

    res.status(200).json({ message: 'Shill accepted successfully', shill });
  } catch (error) {
    console.error('Error accepting shill:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Decline a shill
export const declineShill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shillId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(shillId)) {
      res.status(400).json({ message: 'Invalid shill ID' });
      return;
    }

    // Find the shill
    const shill = await Shill.findById(shillId);

    if (!shill) {
      res.status(404).json({ message: 'Shill not found' });
      return;
    }

    // Check if the shill is already accepted or declined
    if (shill.status !== 'pending') {
      res.status(400).json({ message: `This shill is already ${shill.status}` });
      return;
    }

    // Update the shill status to declined
    shill.status = 'declined';
    await shill.save();

    res.status(200).json({ message: 'Shill declined successfully' });
  } catch (error) {
    console.error('Error declining shill:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Get recent shills
export const getRecentShills = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the 10 most recent shills, sorted by creation date
    const recentShills = await Shill.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('creator', 'handle profilePicture');

    // Return only the necessary information (no shill content)
    const shillsWithoutContent = recentShills.map(shill => ({
      _id: shill._id,
      creator: shill.creator,
      createdAt: shill.createdAt
    }));

    res.status(200).json(shillsWithoutContent);
  } catch (error) {
    console.error('Error getting recent shills:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Record profit/loss for a shill
export const recordShillResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shillId } = req.params;
    const { result } = req.body; // 'profit' or 'loss'
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(shillId)) {
      res.status(400).json({ message: 'Invalid shill ID' });
      return;
    }

    if (result !== 'profit' && result !== 'loss') {
      res.status(400).json({ message: 'Result must be either "profit" or "loss"' });
      return;
    }

    // Find the shill
    const shill = await Shill.findById(shillId);

    if (!shill) {
      res.status(404).json({ message: 'Shill not found' });
      return;
    }

    // Check if the shill is accepted
    if (shill.status !== 'accepted') {
      res.status(400).json({ message: 'Can only record results for accepted shills' });
      return;
    }

    // Import ShillResult model
    const ShillResult = mongoose.model('ShillResult');

    // Check if user already recorded a result for this shill
    const existingResult = await ShillResult.findOne({ shill: shillId, user: userId });
    
    if (existingResult) {
      // Update existing result
      existingResult.result = result;
      await existingResult.save();
    } else {
      // Create new result
      const newResult = new ShillResult({
        shill: shillId,
        user: userId,
        result
      });
      await newResult.save();
    }

    // Update profit/loss count on the shill
    if (result === 'profit') {
      shill.profitCount = (shill.profitCount || 0) + 1;
    } else {
      shill.lossCount = (shill.lossCount || 0) + 1;
    }
    await shill.save();

    // Update the shiller's streak if needed
    const shiller = await User.findById(shill.creator);
    if (shiller) {
      // Get all results for this shill
      const allResults = await ShillResult.find({ shill: shillId });
      const profitCount = allResults.filter(r => r.result === 'profit').length;
      const lossCount = allResults.filter(r => r.result === 'loss').length;
      
      // If more profits than losses, increase streak
      if (profitCount > lossCount) {
        shiller.currentStreak = (shiller.currentStreak || 0) + 1;
      } else {
        // Reset streak if more losses
        shiller.currentStreak = 0;
      }
      
      // Increment total shills count
      shiller.shills = (shiller.shills || 0) + 1;
      
      await shiller.save();
    }

    // Mark the shill as completed for this user
    // Import CompletedShill model
    const CompletedShill = mongoose.model('CompletedShill');
    
    // Check if the shill is already marked as completed for this user
    const existingCompletedShill = await CompletedShill.findOne({ shill: shillId, user: userId });
    
    if (!existingCompletedShill) {
      // Create a new completed shill record
      const newCompletedShill = new CompletedShill({
        shill: shillId,
        user: userId
      });
      await newCompletedShill.save();
    }

    res.status(200).json({ 
      message: `${result.charAt(0).toUpperCase() + result.slice(1)} recorded successfully`,
      profitCount: shill.profitCount,
      lossCount: shill.lossCount,
      completed: true
    });
  } catch (error) {
    console.error('Error recording shill result:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
