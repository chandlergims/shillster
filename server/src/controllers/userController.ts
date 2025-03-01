import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import FollowRequest from '../models/FollowRequest';

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { handle, password, walletAddress } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ handle });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Get profile picture path (if provided)
    // Ensure the path is correct for Railway
    const profilePicture = req.file ? `/uploads/${(req.file as Express.Multer.File).filename}` : '';
    console.log(`Profile picture path: ${profilePicture}`);

    // Create user
    const user = await User.create({
      handle,
      password,
      walletAddress,
      profilePicture,
    });

    if (user) {
      // Cast user._id to string to fix TypeScript error
      const userId = String(user._id);
      res.status(201).json({
        _id: user._id,
        handle: user.handle,
        walletAddress: user.walletAddress,
        profilePicture: user.profilePicture,
        role: user.role,
        token: generateToken(userId),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { handle, password } = req.body;

    // Find user by handle
    const user = await User.findOne({ handle });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password as string))) {
      // Cast user._id to string to fix TypeScript error
      const userId = String(user._id);
      res.json({
        _id: user._id,
        handle: user.handle,
        walletAddress: user.walletAddress,
        profilePicture: user.profilePicture,
        role: user.role,
        token: generateToken(userId),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      res.json({
        _id: user._id,
        handle: user.handle,
        walletAddress: user.walletAddress,
        profilePicture: user.profilePicture,
        role: user.role,
        followers: user.followers,
        following: user.following,
        shills: user.shills,
        points: user.points,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Get new users (recently joined)
// @route   GET /api/users/new
// @access  Public
export const getNewUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Get top shillers
// @route   GET /api/users/top-shillers
// @access  Public
export const getTopShillers = async (req: Request, res: Response): Promise<void> => {
  try {
    const shillers = await User.find({ role: 'shiller' })
      .sort({ points: -1 })
      .limit(10)
      .select('-password -walletAddress'); // Exclude password and wallet address
    res.json(shillers);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Send follow request
// @route   POST /api/users/:id/follow
// @access  Private
export const sendFollowRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user?._id;

    // Check if user exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if already following
    if (userToFollow.followers.includes(currentUserId as any)) {
      res.status(400).json({ message: 'Already following this user' });
      return;
    }

    // Check if request already exists
    const existingRequest = await FollowRequest.findOne({
      requester: currentUserId,
      recipient: userId,
    });

    if (existingRequest) {
      res.status(400).json({ message: 'Follow request already sent' });
      return;
    }

    // Create follow request
    const followRequest = await FollowRequest.create({
      requester: currentUserId,
      recipient: userId,
    });

    res.status(201).json(followRequest);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Accept/Decline follow request
// @route   PUT /api/users/follow-requests/:id
// @access  Private
export const respondToFollowRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;

    // Find the follow request
    const followRequest = await FollowRequest.findById(requestId);

    if (!followRequest) {
      res.status(404).json({ message: 'Follow request not found' });
      return;
    }

    // Check if the current user is the recipient
    if (followRequest.recipient.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to respond to this request' });
      return;
    }

    // Update the status
    followRequest.status = status;
    await followRequest.save();

    // If accepted, update followers/following
    if (status === 'accepted') {
      await User.findByIdAndUpdate(followRequest.recipient, {
        $addToSet: { followers: followRequest.requester },
      });

      await User.findByIdAndUpdate(followRequest.requester, {
        $addToSet: { following: followRequest.recipient },
      });
    }

    res.json({ message: `Follow request ${status}` });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Get pending follow requests
// @route   GET /api/users/follow-requests
// @access  Private
export const getPendingFollowRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    // Cast req.user._id to mongoose.Types.ObjectId to fix TypeScript error
    const userId = req.user._id;
    
    // Get the user's role to determine which requests to return
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    let pendingRequests;
    
    if (user.role === 'shiller') {
      // Shillers see incoming requests (where they are the recipient)
      pendingRequests = await FollowRequest.find({
        recipient: userId,
        status: 'pending',
      }).populate('requester', 'handle profilePicture walletAddress role');
    } else {
      // Regular users see outgoing requests (where they are the requester)
      pendingRequests = await FollowRequest.find({
        requester: userId,
        status: 'pending',
      }).populate('recipient', 'handle profilePicture walletAddress role');
    }

    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Delete follow request
// @route   DELETE /api/users/follow-requests/:id
// @access  Private
export const deleteFollowRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = req.params.id;
    const currentUserId = req.user?._id;

    // Find the follow request
    const followRequest = await FollowRequest.findById(requestId);

    if (!followRequest) {
      res.status(404).json({ message: 'Follow request not found' });
      return;
    }

    // Check if the current user is the requester or recipient
    if (
      followRequest.requester.toString() !== currentUserId?.toString() &&
      followRequest.recipient.toString() !== currentUserId?.toString()
    ) {
      res.status(403).json({ message: 'Not authorized to delete this request' });
      return;
    }

    // Delete the follow request
    await FollowRequest.findByIdAndDelete(requestId);

    res.json({ message: 'Follow request deleted' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Get users that the current user is following
// @route   GET /api/users/following
// @access  Private
export const getFollowing = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = req.user._id;
    
    // Get the user with populated following
    const user = await User.findById(userId).populate('following', 'handle profilePicture walletAddress role points shills');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// @desc    Get users who are following the current user
// @route   GET /api/users/followers
// @access  Private
export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = req.user._id;
    
    // Get the user with populated followers
    const user = await User.findById(userId).populate('followers', 'handle profilePicture walletAddress role points shills');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};
