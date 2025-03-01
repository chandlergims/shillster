import { useState } from 'react';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { warningToast, successToast, errorToast } from '../utils/toastStyles';

// API URL configuration - can be changed for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onFollowSuccess?: () => void; // Optional callback for when a follow request is successful
}

const UserProfileModal = ({ user, isOpen, onClose, onFollowSuccess }: UserProfileModalProps) => {
  // Get current user from auth context
  const { state: authState } = useAuth();
  const currentUserId = authState.user?._id;
  
  if (!isOpen || !user) return null;
  
  // Check if this is the current user's profile
  const isCurrentUser = currentUserId && user._id === currentUserId;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-gray-800 p-6 w-full max-w-md animate-slideIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-green-500 font-bold uppercase tracking-wider">user_profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            [x]
          </button>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 mr-4 relative">
            {user.profilePicture ? (
              <>
                <img 
                  src={`/api/images/profile/${user._id}`} 
                  alt={user.handle}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    // Hide the image on error
                    (e.target as HTMLImageElement).style.display = 'none';
                    // Show the fallback (it's already in the DOM)
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback element (hidden by default) */}
                <div 
                  className="w-full h-full bg-green-500 rounded-full absolute top-0 left-0 flex items-center justify-center text-white font-bold text-xl"
                  style={{ display: 'none' }}
                >
                  {user.handle.charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.handle.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="text-white text-xl font-medium">@{user.handle}</div>
            {user.role === 'shiller' && (
              <span className="inline-block mt-1 text-xs text-white bg-green-500 px-2 py-0.5">Shiller</span>
            )}
          </div>
        </div>
        
        <div className="space-y-4 border-t border-gray-800 pt-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Wallet Address:</span>
            <span className="text-white font-mono">{user.walletAddress.substring(0, 6)}...{user.walletAddress.substring(user.walletAddress.length - 4)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Role:</span>
            <span className="text-white">{user.role}</span>
          </div>
          
          {user.points !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Points:</span>
              <span className="text-white">{user.points.toLocaleString()}</span>
            </div>
          )}
          
          {user.shills !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Shills:</span>
              <span className="text-white">{user.shills}</span>
            </div>
          )}
          
          {typeof user.followers === 'number' && (
            <div className="flex justify-between">
              <span className="text-gray-500">Followers:</span>
              <span className="text-white">{user.followers.toLocaleString()}</span>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex space-x-4">
          <button 
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 border border-gray-700 flex-1"
          >
            close
          </button>
          {!isCurrentUser && (
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 border border-green-600 flex-1"
              onClick={async () => {
                if (!currentUserId) {
                  warningToast('Please login to follow users');
                  return;
                }
                
                try {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    warningToast('Please login to follow users');
                    return;
                  }
                  
                  await axios.post(
                    `/api/users/${user._id}/follow`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  
                  successToast(`Follow request sent to @${user.handle}`);
                  onClose(); // Close the modal after sending the request
                } catch (error) {
                  console.error('Error sending follow request:', error);
                  errorToast('Failed to send follow request');
                }
              }}
            >
              follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
