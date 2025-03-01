import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { errorToast } from '../utils/toastStyles';

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
  if (!path) return '';
  // If path already starts with http or https, return as is
  if (path.startsWith('http')) return path;
  
  // If path starts with /uploads, it's a static file path, not an API endpoint
  if (path.startsWith('/uploads')) {
    // For static files, we don't need the API_URL at all, just use the path directly
    // This is because uploads are served from the root of the domain
    return path;
  }
  
  // For API endpoints, use the full API_URL
  return path.startsWith('/') ? `${API_URL}${path}` : `${API_URL}/${path}`;
};

interface NewShillInfo {
  _id: string;
  creator: {
    _id: string;
    handle: string;
    profilePicture?: string;
  };
  createdAt: string;
}

const NewShillsSection = () => {
  const [newShills, setNewShills] = useState<NewShillInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewShills();
  }, []);

  const fetchNewShills = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl('/shills/recent'));
      
      // We only want to show the creator info, not the actual shill content
      if (Array.isArray(response.data)) {
        setNewShills(response.data);
      } else {
        // If response.data is not an array, set newShills to an empty array
        setNewShills([]);
        console.error('Expected array but got:', typeof response.data);
      }
    } catch (error) {
      console.error('Error fetching new shills:', error);
      errorToast('Failed to load new shills');
      // Set to empty array on error
      setNewShills([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-[#97ef83] rounded-full mr-2"></div>
        <h2 className="text-[#97ef83] font-bold uppercase tracking-wider">new_shills</h2>
      </div>
      
      <div className="bg-[#24272e] border border-[#282b33] p-4 rounded-lg max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-[#a8aab0]">Loading...</div>
          </div>
        ) : Array.isArray(newShills) && newShills.length > 0 ? (
          <div className="space-y-4">
            {newShills.map((shill) => (
              <div key={shill._id} className="bg-[#1b1d22] border border-[#282b33] p-3 rounded-lg">
                <div className="flex items-center">
                  {shill.creator.profilePicture ? (
                    <img 
                      src={`/api/images/profile/${shill.creator._id}`} 
                      alt={shill.creator.handle} 
                      className="w-10 h-10 rounded-full object-cover mr-3 border border-[#282b33]"
                      onError={(e) => {
                        // Fallback to letter if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = "w-10 h-10 bg-[#4779ff] rounded-full flex items-center justify-center text-white font-bold border border-[#4779ff]";
                          fallback.textContent = shill.creator.handle.charAt(0).toUpperCase();
                          parent.insertBefore(fallback, target);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[#4779ff] rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {shill.creator.handle.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-[#fbfcff] font-medium">@{shill.creator.handle}</div>
                    <div className="text-xs text-[#a8aab0]">
                      created a new shill {new Date(shill.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[#a8aab0] text-sm italic">
                  Shill content is private until accepted
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-[#a8aab0]">
            No new shills found
          </div>
        )}
      </div>
    </div>
  );
};

export default NewShillsSection;
