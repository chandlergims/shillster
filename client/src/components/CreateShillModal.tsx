import { useState, FormEvent } from 'react';
import { successToast, errorToast } from '../utils/toastStyles';
import axios from 'axios';

interface CreateShillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShillCreated: () => void;
  API_URL: string;
  onCreateShill?: (tokenAddress: string, reason: string) => void;
}

const CreateShillModal = ({ isOpen, onClose, onShillCreated, API_URL, onCreateShill }: CreateShillModalProps) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressError, setAddressError] = useState('');

  const validateSolanaAddress = (address: string) => {
    // Basic validation - Solana addresses are 32-44 characters long
    // In a real app, you'd use a proper Solana library for validation
    return address.length >= 32 && address.length <= 44;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setError('');
    setAddressError('');
    
    // Validate token address
    if (!tokenAddress.trim()) {
      setAddressError('Token address is required');
      return;
    }
    
    if (!validateSolanaAddress(tokenAddress.trim())) {
      setAddressError('Invalid Solana token address');
      return;
    }
    
    // Validate reason
    if (!reason.trim()) {
      setError('Please provide a reason why this token is a good investment');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a shill');
        setLoading(false);
        return;
      }
      
      // Use the onCreateShill prop if provided, otherwise simulate API call
      if (onCreateShill) {
        await onCreateShill(tokenAddress.trim(), reason.trim());
      } else {
        // Simulate API call for backwards compatibility
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Reset form
      setTokenAddress('');
      setReason('');
      
      // Close modal and notify parent
      onShillCreated();
      onClose();
      
      // Show success toast
      successToast('Shill created successfully!');
    } catch (err) {
      console.error('Error creating shill:', err);
      setError('Failed to create shill. Please try again.');
      errorToast('Failed to create shill');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border-2 border-green-500/30 rounded-sm shadow-lg shadow-green-500/10 p-8 w-full max-w-md relative animate-slideIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-green-500"></div>
        <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-green-500"></div>
        <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-green-500"></div>
        <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-green-500"></div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-green-500 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center justify-center mb-6">
          <div className="h-px bg-green-500/30 flex-grow"></div>
          <h2 className="text-2xl font-bold text-green-500 px-4 text-center font-mono tracking-wider">create_shill</h2>
          <div className="h-px bg-green-500/30 flex-grow"></div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-white p-4 mb-6 rounded-sm animate-pulse">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token-address" className="block text-green-500 mb-2 font-mono">
              SPL_Token_Address
            </label>
            <input
              type="text"
              id="token-address"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              className={`w-full p-3 bg-gray-800 border ${addressError ? 'border-red-500' : 'border-gray-700'} focus:border-green-500 text-white focus:outline-none transition-colors rounded-sm`}
              placeholder="Enter Solana token address"
              required
            />
            {addressError && (
              <p className="text-red-500 text-xs mt-1 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {addressError}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Example: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
            </p>
          </div>

          <div>
            <label htmlFor="reason" className="block text-green-500 mb-2 font-mono">
              Why_Is_This_Token_Good
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 focus:border-green-500 text-white focus:outline-none transition-colors rounded-sm h-24 resize-none"
              placeholder="Explain why this token is a good investment..."
              required
            />
            <p className="text-gray-500 text-xs mt-1">
              Keep it short and convincing. Max 140 characters.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 border border-green-600 font-mono transition-colors rounded-sm flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                creating...
              </>
            ) : (
              'post_shill'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShillModal;
