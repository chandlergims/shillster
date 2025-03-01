import { User } from '../types';

// API URL configuration - can be changed for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for profile picture URLs
const getImageUrl = (userId: string) => {
  if (!userId) return '';
  return `/api/images/profile/${userId}`;
};

interface FollowingSectionProps {
  followingUsers: User[];
  userRole: 'user' | 'shiller';
  onSelectUser: (user: User) => void;
  selectedUserId: string | null;
  API_URL?: string;
}

const FollowingSection = ({ 
  followingUsers, 
  userRole, 
  onSelectUser, 
  selectedUserId,
  API_URL: propApiUrl
}: FollowingSectionProps) => {
  // Use the API_URL from props if provided, otherwise use the environment variable
  const apiUrl = propApiUrl || API_URL;
  
  // Ensure followingUsers is an array
  const users = Array.isArray(followingUsers) ? followingUsers : [];
  
  return (
    <div className="col-span-3 bg-[#1b1d22] border border-[#282b33] p-4 rounded-xl">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-[#97ef83] rounded-full mr-2"></div>
        <h2 className="text-[#97ef83] font-bold uppercase tracking-wider">
          {userRole === 'shiller' ? 'followers' : 'following'}
        </h2>
        <span className="ml-auto bg-[#24272e] text-[#97ef83] px-2 py-0.5 text-sm font-bold rounded-md">{users.length}</span>
      </div>
      
      <div className="space-y-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
        {users.length > 0 ? (
          users.map((user) => (
            <div 
              key={user._id} 
              className={`bg-[#24272e] border border-[#282b33] p-3 hover:bg-[#282b33] transition-colors duration-200 cursor-pointer rounded-lg ${selectedUserId === user._id ? 'border-[#97ef83]' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <div className="flex items-center">
                {user.profilePicture ? (
                    <img 
                      src={'https://via.placeholder.com/50'}
                      alt={user.handle}
                      className="w-8 h-8 rounded-full object-cover mr-3"
                    onError={(e) => {
                      // Fallback to letter if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = "w-8 h-8 bg-[#97ef83] rounded-full flex items-center justify-center text-[#1b1d22] font-bold mr-3";
                        fallback.textContent = user.handle.charAt(0).toUpperCase();
                        parent.insertBefore(fallback, target.nextSibling);
                      }
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-[#97ef83] rounded-full flex items-center justify-center text-[#1b1d22] font-bold mr-3">
                    {user.handle.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-[#fbfcff]">@{user.handle}</div>
                  <div className="text-[#a8aab0] text-xs">
                    <span className="text-[#97ef83]">{user.followers || 0}</span> followers • 
                    <span className="text-[#97ef83] ml-1">{user.shills || 0}</span> shills
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-[#a8aab0]">
            No {userRole === 'shiller' ? 'followers' : 'following'} found
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingSection;
