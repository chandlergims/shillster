import { useState } from 'react';
import axios from 'axios';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

// API URL configuration - can be changed for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
        `${API_URL}/api/users/${user._id}/follow`,
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
          <img
            src={user.profilePicture || 'https://via.placeholder.com/50'}
            alt={user.handle}
            className="w-full h-full object-cover"
          />
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
              <span className="mr-3">{user.followers?.length || 0} followers</span>
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
