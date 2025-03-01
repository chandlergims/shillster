import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { User, FollowRequest, Shill } from '../types';
import UserProfileModal from '../components/UserProfileModal';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  successToast, 
  pendingToast, 
  alreadyFollowingToast, 
  warningToast, 
  errorToast, 
  acceptToast, 
  cancelToast, 
  declineToast 
} from '../utils/toastStyles';

// Import our new component sections
import FollowingSection from '../components/FollowingSection';
import CurrentShillSection from '../components/CurrentShillSection';
import TopShillersSection from '../components/TopShillersSection';
import FollowRequestsSection from '../components/FollowRequestsSection';
import NewUsersSection from '../components/NewUsersSection';
import NewShillsSection from '../components/NewShillsSection';

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

// No more mock data

// No more mock data generation for top shillers

const HomePage = () => {
  // Get current user from auth context
  const { state: authState } = useAuth();
  const currentUserId = authState.user?._id;
  
  // Initialize with empty arrays that will be populated from API
  const [topShillers, setTopShillers] = useState<User[]>([]);
  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FollowRequest[]>([]);
  const [userStats, setUserStats] = useState({
    totalShills: 0,
    currentStreak: 0,
    points: 0
  });
  
  // Selected user for viewing stats and shills
  const [selectedFollowingUser, setSelectedFollowingUser] = useState<User | null>(null);
  const [currentShill, setCurrentShill] = useState<{
    id: string;
    user: string;
    content: string;
    timestamp: string;
    status?: 'pending' | 'accepted' | 'declined';
    profitCount?: number;
    lossCount?: number;
  }>({
    id: '',
    user: '',
    content: '',
    timestamp: new Date().toISOString()
  });
  
  // Get user role from auth context
  const [userRole, setUserRole] = useState<'user' | 'shiller'>(authState.user?.role || 'user');
  
  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Separate loading states for different sections
  const [loadingShillers, setLoadingShillers] = useState(true);
  const [loadingNewUsers, setLoadingNewUsers] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  
  // Open user profile modal
  const openUserProfile = (user: User) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };
  
  // Close user profile modal
  const closeUserProfile = () => {
    setIsProfileModalOpen(false);
  };

  // Fetch top shillers
  const fetchTopShillers = useCallback(async () => {
    try {
      const response = await axios.get(getApiUrl('/users/top-shillers'));
      if (response.data && response.data.length > 0) {
        setTopShillers(response.data);
      } else {
        // No shillers found
        setTopShillers([]);
      }
    } catch (error) {
      console.error('Error fetching top shillers:', error);
      // Set empty array if API fails
      setTopShillers([]);
      errorToast('Failed to load top shillers');
    } finally {
      setLoadingShillers(false);
    }
  }, []);

  // Fetch new users
  const fetchNewUsers = useCallback(async () => {
    try {
      const response = await axios.get(getApiUrl('/users/new'));
      if (response.data && response.data.length > 0) {
        setNewUsers(response.data);
      } else {
        // No users found
        setNewUsers([]);
      }
    } catch (error) {
      console.error('Error fetching new users:', error);
      // Set empty array if API fails
      setNewUsers([]);
      errorToast('Failed to load new users');
    } finally {
      setLoadingNewUsers(false);
    }
  }, []);

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    try {
      // Initialize with zeros
      setUserStats({
        totalShills: 0,
        currentStreak: 0,
        points: 0
      });
      setLoadingStats(false);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      errorToast('Failed to load user stats');
      setLoadingStats(false);
    }
  }, []);
  
  // Fetch stats for a selected user
  const fetchSelectedUserStats = useCallback(async (userId: string) => {
    try {
      setLoadingStats(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        warningToast('Please login to view user stats');
        return;
      }
      
      // In a real app, this would fetch the user's stats from the API
      // For now, we'll use the user's data from the followingUsers array
      const selectedUser = followingUsers.find(user => user._id === userId);
      
      if (selectedUser) {
        setUserStats({
          totalShills: selectedUser.shills || 0,
          currentStreak: selectedUser.currentStreak || 0,
          points: selectedUser.points || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      errorToast('Failed to load user stats');
    } finally {
      setLoadingStats(false);
    }
  }, [followingUsers]);

  // Fetch following/followers based on role
  const fetchFollowingOrFollowers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFollowingUsers([]);
        return;
      }
      
      // Get the endpoint based on user role
      const endpoint = userRole === 'shiller' ? 'followers' : 'following';
      
      const response = await axios.get(getApiUrl(`/users/${endpoint}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.length > 0) {
        setFollowingUsers(response.data);
      } else {
        // Empty array if no following/followers
        setFollowingUsers([]);
      }
    } catch (error) {
      console.error('Error fetching following/followers:', error);
      errorToast('Failed to load following/followers');
      setFollowingUsers([]);
    }
  }, [userRole]);

  // Fetch pending follow requests
  const fetchPendingRequests = useCallback(async () => {
    try {
      setLoadingRequests(true);
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(getApiUrl('/users/follow-requests'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setPendingRequests(response.data || []);
      } else {
        // Not logged in, set empty array
        setPendingRequests([]);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setPendingRequests([]);
      errorToast('Failed to load follow requests');
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  // Function to refresh all data
  const refreshAllData = useCallback(() => {
    fetchTopShillers();
    fetchNewUsers();
    fetchUserStats();
    if (authState.user) {
      fetchFollowingOrFollowers();
      fetchPendingRequests();
    }
  }, [authState.user, fetchTopShillers, fetchNewUsers, fetchUserStats, fetchFollowingOrFollowers, fetchPendingRequests]);

  // Update userRole and refresh data when auth state changes
  useEffect(() => {
    if (authState.user) {
      setUserRole(authState.user.role);
      
      // Refresh data when user logs in
      fetchPendingRequests();
      fetchFollowingOrFollowers();
    } else {
      // Clear data when user logs out
      setUserRole('user');
      setPendingRequests([]);
      setFollowingUsers([]);
    }
  }, [authState.user, fetchPendingRequests, fetchFollowingOrFollowers]);

  // Handle follow user
  const handleFollowUser = async (userId: string, handle: string) => {
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
        getApiUrl(`/users/${userId}/follow`),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh pending requests
      fetchPendingRequests();
      
      successToast(`Follow request sent to @${handle}`);
    } catch (error: any) {
      console.error('Error sending follow request:', error);
      
      // Check if the error is because a follow request already exists
      if (error.response && 
          error.response.data && 
          error.response.data.message === 'Follow request already sent') {
        pendingToast(`You already have a pending request for @${handle}`);
      } else if (error.response && 
                error.response.data && 
                error.response.data.message === 'Already following this user') {
        alreadyFollowingToast(`You are already following @${handle}`);
      } else {
        errorToast(`Couldn't send follow request to @${handle}`);
      }
    }
  };

  // Handle follow request actions
  const handleCancelRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        warningToast('Please login to cancel follow requests');
        return;
      }
      
      // Delete the follow request
      await axios.delete(getApiUrl(`/users/follow-requests/${requestId}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Remove from UI
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
      
      // Refresh following/followers list
      fetchFollowingOrFollowers();
      
      cancelToast('Follow request cancelled');
    } catch (error) {
      console.error('Error cancelling follow request:', error);
      errorToast('Failed to cancel follow request');
    }
  };
  
  const handleAcceptRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        warningToast('Please login to accept follow requests');
        return;
      }
      
      // Accept the follow request
      await axios.put(
        getApiUrl(`/users/follow-requests/${requestId}`),
        { status: 'accepted' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Remove from UI
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
      
      // Refresh following/followers list
      fetchFollowingOrFollowers();
      
      acceptToast('Follow request accepted');
    } catch (error) {
      console.error('Error accepting follow request:', error);
      errorToast('Failed to accept follow request');
    }
  };
  
  const handleDeclineRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        warningToast('Please login to decline follow requests');
        return;
      }
      
      // Decline the follow request
      await axios.put(
        getApiUrl(`/users/follow-requests/${requestId}`),
        { status: 'declined' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Remove from UI
      setPendingRequests(prev => prev.filter(req => req._id !== requestId));
      
      // Refresh following/followers list
      fetchFollowingOrFollowers();
      
      declineToast('Follow request declined');
    } catch (error) {
      console.error('Error declining follow request:', error);
      errorToast('Failed to decline follow request');
    }
  };

  // Fetch current shill
  const fetchCurrentShill = useCallback(async () => {
    try {
      if (!authState.user) return;
      
      const token = localStorage.getItem('token');
      if (!token) return;
      
      // Different endpoint based on user role
      const endpoint = userRole === 'shiller' 
        ? getApiUrl('/shills/me') 
        : getApiUrl('/shills/followed');
      
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        // For shillers, we get a single shill
        if (userRole === 'shiller') {
          const shill = response.data;
          setCurrentShill({
            id: shill._id,
            user: typeof shill.creator === 'string' 
              ? shill.creator 
              : shill.creator.handle,
            content: `${shill.tokenAddress} - ${shill.reason}`,
            timestamp: shill.createdAt,
            status: shill.status,
            profitCount: shill.profitCount,
            lossCount: shill.lossCount
          });
        } 
        // For users, we get an array of shills from followed users
        // For now, just show the first one if available
        else if (response.data.length > 0) {
          const shill = response.data[0];
          setCurrentShill({
            id: shill._id,
            user: typeof shill.creator === 'string' 
              ? shill.creator 
              : shill.creator.handle,
            content: `${shill.tokenAddress} - ${shill.reason}`,
            timestamp: shill.createdAt,
            status: shill.status,
            profitCount: shill.profitCount,
            lossCount: shill.lossCount
          });
        }
      }
    } catch (error) {
      // If 404, it means no active shill found, which is fine
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Reset to empty shill
        setCurrentShill({
          id: '',
          user: '',
          content: '',
          timestamp: new Date().toISOString(),
          status: undefined,
          profitCount: 0,
          lossCount: 0
        });
      } else {
        console.error('Error fetching current shill:', error);
        errorToast('Failed to load current shill');
      }
    }
  }, [userRole, authState.user, API_URL]);

  // Create a new shill
  const handleCreateShill = async (tokenAddress: string, reason: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        warningToast('Please login to create a shill');
        return;
      }
      
      await axios.post(
        getApiUrl('/shills'),
        { tokenAddress, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh current shill
      fetchCurrentShill();
      
      successToast('Shill created successfully');
    } catch (error: any) {
      console.error('Error creating shill:', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        errorToast(error.response.data.message);
      } else {
        errorToast('Failed to create shill');
      }
    }
  };

  // Cancel a shill
  const handleCancelShill = async (shillId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        warningToast('Please login to cancel a shill');
        return;
      }
      
      await axios.put(
        getApiUrl(`/shills/${shillId}/cancel`),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Reset current shill
      setCurrentShill({
        id: '',
        user: '',
        content: '',
        timestamp: new Date().toISOString(),
        status: undefined,
        profitCount: 0,
        lossCount: 0
      });
      
      successToast('Shill cancelled successfully');
    } catch (error) {
      console.error('Error cancelling shill:', error);
      errorToast('Failed to cancel shill');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTopShillers();
    fetchNewUsers();
    fetchUserStats();
    if (authState.user) {
      fetchFollowingOrFollowers();
      fetchPendingRequests();
      fetchCurrentShill();
    }
  }, [userRole, fetchTopShillers, fetchNewUsers, fetchUserStats, fetchFollowingOrFollowers, fetchPendingRequests, fetchCurrentShill, authState.user]);

  // Handle selecting a user from the following list
  const handleSelectUser = useCallback((user: User) => {
    setSelectedFollowingUser(user);
    
    // Fetch the selected user's stats
    fetchSelectedUserStats(user._id);
    
    // Reset current shill - don't show any shill until user accepts
    setCurrentShill({
      id: '',
      user: '',
      content: '',
      timestamp: new Date().toISOString(),
      status: undefined,
      profitCount: 0,
      lossCount: 0
    });
    
    // In a real implementation, we would fetch the user's shills from the database
    // and only show them after the user has accepted or declined
    // For now, we'll just reset the current shill
  }, [fetchSelectedUserStats]);

  return (
    <div className="container mx-auto px-4 py-8 font-mono">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Following */}
        <FollowingSection 
          followingUsers={followingUsers} 
          userRole={userRole} 
          onSelectUser={handleSelectUser} 
          selectedUserId={selectedFollowingUser?._id || null}
          API_URL={API_URL}
        />
        
        {/* Middle Column - Current Shill */}
        <CurrentShillSection 
          userRole={userRole} 
          currentShill={currentShill} 
          userStats={userStats}
          API_URL={API_URL}
          onShillCreated={fetchCurrentShill}
          onCreateShill={handleCreateShill}
          onCancelShill={handleCancelShill}
        />
        
        {/* Right Column - Approved Shillers */}
        <TopShillersSection 
          topShillers={topShillers} 
          loadingShillers={loadingShillers} 
          currentUserId={currentUserId} 
          handleFollowUser={handleFollowUser}
          API_URL={API_URL}
        />
      </div>
      
      {/* Pending Follow Requests Section */}
      <FollowRequestsSection 
        pendingRequests={pendingRequests}
        loadingRequests={loadingRequests}
        userRole={userRole}
        handleAcceptRequest={handleAcceptRequest}
        handleDeclineRequest={handleDeclineRequest}
        handleCancelRequest={handleCancelRequest}
        API_URL={API_URL}
      />
      
      {/* New Users Section */}
      <NewUsersSection 
        newUsers={newUsers}
        loadingNewUsers={loadingNewUsers}
        currentUserId={currentUserId}
        handleFollowUser={handleFollowUser}
        API_URL={API_URL}
        userRole={userRole}
      />
      
      {/* User Profile Modal */}
      <UserProfileModal 
        user={selectedUser}
        isOpen={isProfileModalOpen}
        onClose={closeUserProfile}
      />
    </div>
  );
};

export default HomePage;
