import express from 'express';
import { protect } from '../middleware/auth';
import {
  createShill,
  getActiveShill,
  getMyActiveShill,
  cancelShill,
  getFollowedShills,
  acceptShill,
  declineShill,
  recordShillResult,
  getRecentShills
} from '../controllers/shillController';

const router = express.Router();

// Create a new shill
router.post('/', protect, createShill);

// Get active shill for a specific user
router.get('/user/:userId', protect, getActiveShill);

// Get current user's active shill
router.get('/me', protect, getMyActiveShill);

// Cancel a shill
router.put('/:shillId/cancel', protect, cancelShill);

// Get active shills from followed users
router.get('/followed', protect, getFollowedShills);

// Accept a shill
router.put('/:shillId/accept', protect, acceptShill);

// Decline a shill
router.put('/:shillId/decline', protect, declineShill);

// Record profit/loss for a shill
router.post('/:shillId/result', protect, recordShillResult);

// Get recent shills
router.get('/recent', getRecentShills);

export default router;
