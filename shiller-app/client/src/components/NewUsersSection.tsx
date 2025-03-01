import { User } from '../types';
import { pendingToast } from '../utils/toastStyles';
import { toast } from 'react-toastify';
import NewShillsSection from './NewShillsSection';
import RewardsSection from './RewardsSection';

interface NewUsersSectionProps {
  newUsers: User[];
  loadingNewUsers: boolean;
  currentUserId?: string;
  handleFollowUser: (userId: string, handle: string) => void;
  API_URL: string;
  userRole: 'user' | 'shiller';
}

const NewUsersSection = ({
  newUsers,
  loadingNewUsers,
  currentUserId,
  handleFollowUser,
  API_URL,
  userRole
}: NewUsersSectionProps) => {
  // Render new users
  const renderNewUsers = () => {
    if (loadingNewUsers) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-[#24272e] border border-[#282b33] p-3 animate-pulse rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#282b33] mr-3 rounded-full"></div>
            <div>
              <div className="h-3 w-20 bg-[#282b33] mb-2 rounded"></div>
              <div className="h-2 w-24 bg-[#282b33] rounded"></div>
            </div>
          </div>
        </div>
      ));
    }

    // Ensure newUsers is an array before calling slice and map
    if (!Array.isArray(newUsers)) {
      return <div className="text-[#a8aab0] text-center py-4">No new users found</div>;
    }

    return newUsers.slice(0, 4).map((user) => (
      <div 
        key={user._id} 
        className="bg-[#24272e] border border-[#282b33] p-3 hover:border-[#97ef83]/30 transition-colors duration-200 rounded-lg"
      >
        <div className="flex items-center">
          {/* Always use the green profile picture */}
          <div className="w-8 h-8 bg-[#97ef83] rounded-full flex items-center justify-center text-[#1b1d22] font-bold mr-4">
            {user.handle.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-[#fbfcff]">@{user.handle}</div>
            <div className="text-[#a8aab0] text-xs">Joined 2/25/2025</div>
          </div>
          {/* Only show follow button if the user is a shiller and not the current user */}
          {user.role === 'shiller' && (!currentUserId || user._id !== currentUserId) && (
            <button 
              className="ml-auto w-6 h-6 border border-[#97ef83] hover:bg-[#97ef83]/10 transition-colors duration-200 flex items-center justify-center rounded-md"
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening the modal when clicking the follow button
                handleFollowUser(user._id, user.handle);
              }}
            >
              <span className="text-[#97ef83] text-xs">+</span>
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="mt-4 grid grid-cols-12 gap-4">
      <div className="col-span-3 bg-[#1b1d22] border border-[#282b33] p-4 rounded-xl">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 bg-[#97ef83] rounded-full mr-2"></div>
          <h2 className="text-[#97ef83] font-bold uppercase tracking-wider">new_users</h2>
          <span className="ml-auto bg-[#24272e] text-[#97ef83] px-2 py-0.5 text-sm font-bold rounded-md">
            {Array.isArray(newUsers) ? newUsers.length : 0}
          </span>
        </div>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {renderNewUsers()}
        </div>
      </div>
      
      <div className="col-span-9 bg-[#1b1d22] border border-[#282b33] p-4 rounded-xl">
        <NewShillsSection />
      </div>
    </div>
  );
};

export default NewUsersSection;
