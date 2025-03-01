import { FollowRequest } from '../types';
import { pendingToast } from '../utils/toastStyles';
import RewardsSection from './RewardsSection';

// Helper function for profile picture URLs
const getImageUrl = (path: string, baseUrl: string) => {
  if (!path) return '';
  // If path already starts with http or https, return as is
  if (path.startsWith('http')) return path;
  
  // If path starts with /uploads, it's a static file path, not an API endpoint
  if (path.startsWith('/uploads')) {
    // For static files, we don't need the API_URL at all, just use the path directly
    // This is because uploads are served from the root of the domain
    return path;
  }
  
  // For API endpoints, use the full baseUrl
  return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
};

interface FollowRequestsSectionProps {
  pendingRequests: FollowRequest[];
  loadingRequests: boolean;
  userRole: 'user' | 'shiller';
  handleAcceptRequest: (requestId: string) => void;
  handleDeclineRequest: (requestId: string) => void;
  handleCancelRequest: (requestId: string) => void;
  API_URL: string;
}

const FollowRequestsSection = ({
  pendingRequests,
  loadingRequests,
  userRole,
  handleAcceptRequest,
  handleDeclineRequest,
  handleCancelRequest,
  API_URL
}: FollowRequestsSectionProps) => {
  // Ensure pendingRequests is an array
  const requests = Array.isArray(pendingRequests) ? pendingRequests : [];
  
  // Render the pending requests
  const renderPendingRequests = () => {
    if (loadingRequests) {
      return Array.from({ length: 3 }).map((_, index) => (
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

    if (requests.length === 0) {
      return <div className="text-[#a8aab0] text-center py-4">No pending requests</div>;
    }

    return requests.map((request) => {
      // Determine which user to display based on role
      const displayUser = userRole === 'shiller' 
        ? request.requester 
        : (typeof request.recipient === 'string' 
          ? { _id: request.recipient, handle: 'Unknown', profilePicture: '', walletAddress: '', role: 'user' as const } 
          : request.recipient);
      
      return (
        <div key={request._id} className="bg-[#24272e] border border-[#282b33] p-3 hover:border-[#97ef83]/30 transition-colors duration-200 rounded-lg">
          <div className="flex items-center mb-2">
            {displayUser.profilePicture ? (
              <img 
                src={`/api/images/profile/${displayUser._id}`} 
                alt={displayUser.handle}
                className="w-8 h-8 rounded-full object-cover mr-3"
                onError={(e) => {
                  // Fallback to letter if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = "w-8 h-8 bg-[#4779ff] rounded-full flex items-center justify-center text-white font-bold mr-3";
                    fallback.textContent = displayUser.handle.charAt(0).toUpperCase();
                    parent.insertBefore(fallback, target.nextSibling);
                  }
                }}
              />
            ) : (
              <div className="w-8 h-8 bg-[#4779ff] rounded-full flex items-center justify-center text-white font-bold mr-3">
                {displayUser.handle.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="text-[#fbfcff]">@{displayUser.handle}</div>
              <div className="text-[#a8aab0] text-xs">
                {new Date(request.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-2">
            {userRole === 'shiller' ? (
              <>
                <button 
                  className="bg-[#97ef83] hover:bg-[#97ef83]/90 text-[#192d2c] px-2 py-1 text-xs flex-1 rounded-md font-medium transition-colors duration-200"
                  onClick={() => handleAcceptRequest(request._id)}
                >
                  accept
                </button>
                <button 
                  className="bg-[#24272e] hover:bg-[#282b33] text-white px-2 py-1 text-xs flex-1 border border-[#282b33] rounded-md transition-colors duration-200"
                  onClick={() => handleDeclineRequest(request._id)}
                >
                  decline
                </button>
              </>
            ) : (
              <button 
                className="bg-[#ff6a6a] hover:bg-[#ff6a6a]/90 text-white px-2 py-1 text-xs w-full rounded-md border border-[#ff6a6a]/30 transition-colors duration-200"
                onClick={() => handleCancelRequest(request._id)}
              >
                cancel
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="mt-4 grid grid-cols-12 gap-4">
      <div className="col-span-3 bg-[#1b1d22] border border-[#282b33] p-4 rounded-xl">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 bg-[#97ef83] rounded-full mr-2"></div>
          <h2 className="text-[#97ef83] font-bold uppercase tracking-wider">
            {userRole === 'shiller' ? 'incoming_requests' : 'follow_requests'}
          </h2>
          <span className="ml-auto bg-[#24272e] text-[#97ef83] px-2 py-0.5 text-sm font-bold rounded-md">{requests.length}</span>
        </div>
        
        <div className="space-y-2">
          {renderPendingRequests()}
        </div>
      </div>
      
      <div className="col-span-9 bg-[#1b1d22] border border-[#282b33] p-4 rounded-xl">
        <RewardsSection userRole={userRole} />
      </div>
    </div>
  );
};

export default FollowRequestsSection;
