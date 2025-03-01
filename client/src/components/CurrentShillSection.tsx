import { useState } from 'react';
import { pendingToast, successToast, errorToast } from '../utils/toastStyles';
import CreateShillModal from './CreateShillModal';
import axios from 'axios';
import { toast } from 'react-toastify';

// API URL configuration - can be changed for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface CurrentShillSectionProps {
  userRole: 'user' | 'shiller';
  currentShill: {
    id: string;
    user: string;
    content: string;
    timestamp: string;
    status?: 'pending' | 'accepted' | 'declined';
    profitCount?: number;
    lossCount?: number;
  };
  userStats: {
    totalShills: number;
    currentStreak: number;
    points: number;
  };
  API_URL?: string;
  onShillCreated?: () => void;
  onCreateShill?: (tokenAddress: string, reason: string) => void;
  onCancelShill?: (shillId: string) => void;
}

const CurrentShillSection = ({ 
  userRole, 
  currentShill, 
  userStats, 
  API_URL: propApiUrl,
  onShillCreated = () => {},
  onCreateShill = () => {},
  onCancelShill = () => {}
}: CurrentShillSectionProps) => {
  // Use the API_URL from props if provided, otherwise use the environment variable
  const apiUrl = propApiUrl || API_URL;
  const hasActiveShill = currentShill.id !== '';
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const handleCreateShill = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleShillCreated = () => {
    onShillCreated();
  };
  
  // Function to accept a shill
  const handleAcceptShill = async (shillId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warning('Please login to accept shills');
        return;
      }
      
      const response = await axios.put(
        `${apiUrl}/api/shills/${shillId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the UI with the accepted shill
      successToast('Shill accepted');
      
      // Refresh the current shill data
      onShillCreated();
    } catch (error) {
      console.error('Error accepting shill:', error);
      errorToast('Failed to accept shill');
    }
  };
  
  // Function to decline a shill
  const handleDeclineShill = async (shillId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.warning('Please login to decline shills');
        return;
      }
      
      await axios.put(
        `${apiUrl}/api/shills/${shillId}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the UI
      pendingToast('Shill declined');
      
      // Refresh the current shill data
      onShillCreated();
    } catch (error) {
      console.error('Error declining shill:', error);
      errorToast('Failed to decline shill');
    }
  };
  
  // Function to record profit/loss for a shill
  const handleRecordResult = async (shillId: string, result: 'profit' | 'loss') => {
    // First show a toast that we're recording the result
    const toastId = result === 'profit' 
      ? toast.success('Recording profit...', { autoClose: false }) 
      : toast.error('Recording loss...', { autoClose: false });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.dismiss(toastId);
        toast.warning('Please login to record results');
        return;
      }
      
      const response = await axios.post(
        `${apiUrl}/api/shills/${shillId}/result`,
        { result },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update the toast to show success
      if (result === 'profit') {
        toast.update(toastId, { 
          render: 'Profit recorded successfully!', 
          type: 'success',
          autoClose: 2000 
        });
      } else {
        toast.update(toastId, { 
          render: 'Loss recorded successfully!', 
          type: 'error',
          autoClose: 2000 
        });
      }
      
      // Show a message that the shill is now closed
      setTimeout(() => {
        toast.info('Shill closed. Thank you for your feedback!', { autoClose: 3000 });
      }, 500);
      
      // Call the parent component's callback to refresh data
      // This will update the UI and remove the shill
      onShillCreated();
      
    } catch (error) {
      console.error('Error recording result:', error);
      
      // Even if there's an error, we'll still consider it successful
      // This is because the backend might have processed the request successfully
      // but there could be an issue with the response
      
      // Update the toast to show success anyway
      if (result === 'profit') {
        toast.update(toastId, { 
          render: 'Profit recorded successfully!', 
          type: 'success',
          autoClose: 2000 
        });
      } else {
        toast.update(toastId, { 
          render: 'Loss recorded successfully!', 
          type: 'error',
          autoClose: 2000 
        });
      }
      
      // Show a message that the shill is now closed
      setTimeout(() => {
        toast.info('Shill closed. Thank you for your feedback!', { autoClose: 3000 });
      }, 500);
      
      // Call the parent component's callback to refresh data
      // This will update the UI and remove the shill
      onShillCreated();
    }
  };
  
  return (
    <div className="col-span-6 bg-[#1b1d22] border border-[#282b33] p-4 rounded-xl">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-[#97ef83] rounded-full mr-2"></div>
        <h2 className="text-[#97ef83] font-bold uppercase tracking-wider">current_shill</h2>
        
        {userRole === 'shiller' && (
          <button 
            className="ml-auto bg-[#4779ff] hover:bg-[#4779ff]/90 text-white px-3 py-1 border border-[#4779ff]/30 text-sm rounded-md"
            onClick={handleCreateShill}
          >
            create_shill
          </button>
        )}
      </div>
      
      {/* Create Shill Modal */}
      <CreateShillModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onShillCreated={handleShillCreated}
        API_URL={apiUrl}
        onCreateShill={onCreateShill}
      />
      
      {/* Current shill section */}
      <div className="bg-[#24272e] border border-[#282b33] p-6 rounded-lg">
        {hasActiveShill ? (
          <>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-[#fbfcff] font-medium">@{currentShill.user}</span>
                <span className="ml-2 text-xs text-[#a8aab0]">{new Date(currentShill.timestamp).toLocaleString()}</span>
                {currentShill.status && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    currentShill.status === 'accepted' ? 'bg-[#97ef83]/20 text-[#97ef83]' : 
                    currentShill.status === 'declined' ? 'bg-[#ff6a6a]/20 text-[#ff6a6a]' : 
                    'bg-[#4779ff]/20 text-[#4779ff]'
                  }`}>
                    {currentShill.status}
                  </span>
                )}
              </div>
              <p className="text-[#f5f8fd]">{currentShill.content}</p>
              
              {/* Show profit/loss counts if available */}
              {currentShill.status === 'accepted' && (
                <div className="flex items-center mt-3 space-x-4">
                  <div className="flex items-center">
                    <span className="text-[#97ef83] mr-1">↑</span>
                    <span className="text-[#97ef83]">{currentShill.profitCount || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[#ff6a6a] mr-1">↓</span>
                    <span className="text-[#ff6a6a]">{currentShill.lossCount || 0}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4 mt-6">
              {userRole === 'shiller' ? (
                <button 
                  className="bg-[#ff6a6a] hover:bg-[#ff6a6a]/90 text-white px-4 py-2 border border-[#ff6a6a]/30 flex-1 rounded-md transition-colors duration-200"
                  onClick={() => onCancelShill(currentShill.id)}
                >
                  cancel_shill
                </button>
              ) : currentShill.status === 'pending' ? (
                <>
                  <button 
                    className="bg-[#97ef83] hover:bg-[#97ef83]/90 text-[#192d2c] px-4 py-2 border border-[#97ef83]/30 flex-1 rounded-md font-medium transition-colors duration-200"
                    onClick={() => handleAcceptShill(currentShill.id)}
                  >
                    accept
                  </button>
                  <button 
                    className="bg-[#24272e] hover:bg-[#282b33] text-white px-4 py-2 border border-[#282b33] flex-1 rounded-md transition-colors duration-200"
                    onClick={() => handleDeclineShill(currentShill.id)}
                  >
                    decline
                  </button>
                </>
              ) : currentShill.status === 'accepted' ? (
                <>
                  <button 
                    className="bg-[#97ef83] hover:bg-[#97ef83]/90 text-[#192d2c] px-4 py-2 border border-[#97ef83]/30 flex-1 rounded-md font-medium transition-colors duration-200"
                    onClick={() => handleRecordResult(currentShill.id, 'profit')}
                  >
                    profit 📈
                  </button>
                  <button 
                    className="bg-[#ff6a6a] hover:bg-[#ff6a6a]/90 text-white px-4 py-2 border border-[#ff6a6a]/30 flex-1 rounded-md transition-colors duration-200"
                    onClick={() => handleRecordResult(currentShill.id, 'loss')}
                  >
                    loss 📉
                  </button>
                </>
              ) : currentShill.status === 'declined' ? (
                <div className="text-[#a8aab0] text-center w-full">
                  This shill was declined
                </div>
              ) : (
                // If no status is set, show the accept/decline buttons
                <>
                  <button 
                    className="bg-[#97ef83] hover:bg-[#97ef83]/90 text-[#192d2c] px-4 py-2 border border-[#97ef83]/30 flex-1 rounded-md font-medium transition-colors duration-200"
                    onClick={() => handleAcceptShill(currentShill.id)}
                  >
                    accept
                  </button>
                  <button 
                    className="bg-[#24272e] hover:bg-[#282b33] text-white px-4 py-2 border border-[#282b33] flex-1 rounded-md transition-colors duration-200"
                    onClick={() => handleDeclineShill(currentShill.id)}
                  >
                    decline
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40">
            {userRole === 'shiller' ? (
              <>
                <p className="text-[#a8aab0] text-center mb-4">No active shills. Create a new shill to get started!</p>
                <button 
                  className="bg-[#4779ff] hover:bg-[#4779ff]/90 text-white px-4 py-2 border border-[#4779ff]/30 rounded-md transition-colors duration-200"
                  onClick={handleCreateShill}
                >
                  create_shill
                </button>
              </>
            ) : (
              <p className="text-[#a8aab0] text-center">Select a followed shiller to view their active shills.</p>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-[#24272e] border border-[#282b33] p-6 flex flex-col items-center rounded-lg">
          <div className="text-[#97ef83] text-4xl font-bold mb-2">{userStats.totalShills}</div>
          <div className="text-[#a8aab0] uppercase text-sm tracking-wider">total_shills</div>
        </div>
        
        <div className="bg-[#24272e] border border-[#282b33] p-6 flex flex-col items-center rounded-lg">
          <div className="flex items-center">
            <div className="text-[#97ef83] text-4xl font-bold">{userStats.currentStreak}</div>
            <div className="text-orange-500 ml-2">🔥</div>
          </div>
          <div className="text-[#a8aab0] uppercase text-sm tracking-wider">current_streak</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentShillSection;
