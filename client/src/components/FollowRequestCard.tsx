import { useState } from 'react';
import axios from 'axios';
import { FollowRequest } from '../types';
import { useAuth } from '../context/AuthContext';

// API URL configuration - can be changed for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface FollowRequestCardProps {
  request: FollowRequest;
  onAction: () => void;
}

const FollowRequestCard = ({ request, onAction }: FollowRequestCardProps) => {
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (status: 'accepted' | 'declined') => {
    if (!state.isAuthenticated) return;

    try {
      setIsLoading(true);
      await axios.put(
        `${API_URL}/api/users/follow-requests/${request._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${state.user?.token}`,
          },
        }
      );
      onAction();
    } catch (error) {
      console.error(`Error ${status} follow request:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#24272e] border border-[#282b33] rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img
            src={request.requester.profilePicture || 'https://via.placeholder.com/50'}
            alt={request.requester.handle}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to letter if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.classList.add('bg-[#4779ff]', 'flex', 'items-center', 'justify-center');
                const fallback = document.createElement('span');
                fallback.className = "text-white font-bold text-lg";
                fallback.textContent = request.requester.handle.charAt(0).toUpperCase();
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
        <div>
          <h3 className="text-[#fbfcff] font-medium">@{request.requester.handle}</h3>
          <p className="text-[#a8aab0] text-sm">wants to follow you</p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleAction('accepted')}
          disabled={isLoading}
          className="bg-[#97ef83] hover:bg-[#97ef83]/90 text-[#192d2c] px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Accept
        </button>
        <button
          onClick={() => handleAction('declined')}
          disabled={isLoading}
          className="bg-[#ff6a6a] hover:bg-[#ff6a6a]/90 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default FollowRequestCard;
