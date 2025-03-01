import { User } from '../types';
import { pendingToast } from '../utils/toastStyles';

// Helper function for profile picture URLs
const getImageUrl = (path: string, baseUrl: string) => {
  if (!path) return '';
  // If path already starts with http or https, return as is
  if (path.startsWith('http')) return path;
  // If path already starts with /, don't add another /
  return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
};

interface TopShillersSectionProps {
  topShillers: User[];
  loadingShillers: boolean;
  currentUserId: string | undefined;
  handleFollowUser: (userId: string, handle: string) => void;
  API_URL: string;
}

const TopShillersSection = ({ 
  topShillers, 
  loadingShillers, 
  currentUserId, 
  handleFollowUser,
  API_URL
}: TopShillersSectionProps) => {
  // Render top shillers
  const renderTopShillers = () => {
    if (loadingShillers) {
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

    return topShillers.slice(0, 6).map((shiller) => (
      <div 
        key={shiller._id} 
        className="bg-[#24272e] border border-[#282b33] p-3 hover:border-[#97ef83]/30 transition-colors duration-200 rounded-lg"
      >
        <div className="flex items-center">
          {shiller.profilePicture ? (
            <img 
              src={getImageUrl(shiller.profilePicture || '', API_URL)} 
              alt={shiller.handle}
              className="w-8 h-8 rounded-full object-cover mr-3"
              onError={(e) => {
                // Fallback to letter if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = "w-8 h-8 bg-[#4779ff] rounded-full flex items-center justify-center text-white font-bold mr-3";
                  fallback.textContent = shiller.handle.charAt(0).toUpperCase();
                  parent.insertBefore(fallback, target.nextSibling);
                }
              }}
            />
          ) : (
            <div className="w-8 h-8 bg-[#4779ff] rounded-full flex items-center justify-center text-white font-bold mr-3">
              {shiller.handle.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-[#fbfcff]">@{shiller.handle}</div>
            <div className="text-[#a8aab0] text-xs">
              <span className="text-[#97ef83]">{shiller.followers || 0}</span> followers • 
              <span className="text-[#97ef83] ml-1">{shiller.shills || 0}</span> shills
            </div>
          </div>
          {/* Only show follow button if not the current user */}
          {(!currentUserId || shiller._id !== currentUserId) && (
            <button 
              className="ml-auto w-6 h-6 border border-[#97ef83] hover:bg-[#97ef83]/10 transition-colors duration-200 flex items-center justify-center rounded-md"
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening the modal when clicking the follow button
                handleFollowUser(shiller._id, shiller.handle);
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
    <div className="col-span-3 bg-[#1b1d22] border border-[#282b33] p-4 rounded-xl">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-[#97ef83] rounded-full mr-2"></div>
        <h2 className="text-[#97ef83] font-bold uppercase tracking-wider">approved_shillers</h2>
        <span className="ml-auto bg-[#24272e] text-[#97ef83] px-2 py-0.5 text-sm font-bold rounded-md">{topShillers.length}</span>
      </div>
      
      <div className="space-y-2">
        {renderTopShillers()}
      </div>
    </div>
  );
};

export default TopShillersSection;
