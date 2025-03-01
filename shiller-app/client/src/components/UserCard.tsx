import { useState } from 'react';
import axios from 'axios';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

// API URL configuration - can be changed for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to ensure we don't duplicate /api in the URL
const getApiUrl = (endpoint: string) => {
  // If API_URL already ends with /api, don't add it again
  if (API_URL.endsWith('/api')) {
    return `${API_URL}${endpoint}`;
  }
  return `${API_URL}/api${endpoint}`;
};

// Helper function for profile picture URLs
const getImageUrl = (path: string) => {
  if (!path) return 'https://via.placeholder.com/50';
  // If path already starts with http or https, return as is
  if (path.startsWith('http')) return path;
  
  // Just return a placeholder image
  return 'https://via.placeholder.com/50';
};

interface UserCardProps {
  user: User;
  isShiller?: boolean;
  onFollow?: () => void;
}

const UserCard = ({ user, isShiller = false, onFollow }: UserCardProps) => {
  const { state } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!state.isAuthenticated) return;

    try {
      setIsLoading(true);
      await axios.post(
        getApiUrl(`/users/${user._id}/follow`),
        {},
        {
          headers: {
            Authorization: `Bearer ${state.user?.token}`,
          },
        }
      );
      setIsFollowing(true);
      if (onFollow) onFollow();
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          {user.profilePicture ? (
            <img
              src={getImageUrl(user.profilePicture)}
              alt={user.handle}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to letter if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('bg-[#97ef83]', 'flex', 'items-center', 'justify-center');
                  const fallback = document.createElement('span');
                  fallback.className = "text-[#1b1d22] font-bold text-lg";
                  fallback.textContent = user.handle.charAt(0).toUpperCase();
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-[#97ef83] flex items-center justify-center">
              <span className="text-[#1b1d22] font-bold text-lg">{user.handle.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="text-white font-medium">@{user.handle}</h3>
            {isShiller && (
              <span className="ml-2 bg-green-500 text-xs text-white px-2 py-1 rounded">
                Shiller
              </span>
            )}
          </div>
          {isShiller && (
            <div className="text-gray-400 text-sm mt-1">
              <span className="mr-3">
                {Array.isArray(user.followers) ? user.followers.length : user.followers || 0} followers
              </span>
              <span>{user.shills || 0} shills</span>
            </div>
          )}
        </div>
      </div>

      {state.isAuthenticated && state.user?._id !== user._id && (
        <button
          onClick={handleFollow}
          disabled={isFollowing || isLoading}
          className={`px-3 py-1 rounded text-sm ${
            isFollowing
              ? 'bg-gray-600 text-gray-300'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isLoading ? 'Loading...' : isFollowing ? 'Requested' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;
