import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { errorToast } from '../utils/toastStyles';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Validation functions
const isValidSolanaAddress = (address: string): boolean => {
  // Solana addresses are base58 encoded and typically 32-44 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
};

const isValidHandle = (handle: string): boolean => {
  // Handle should be alphanumeric with underscores, no spaces, 3-20 chars
  const handleRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return handleRegex.test(handle);
};

const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, with at least one uppercase, one lowercase, and one number
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { register, state, clearError } = useAuth();
  
  // Validation states
  const [handleError, setHandleError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [walletError, setWalletError] = useState('');
  const [pictureError, setPictureError] = useState('');
  const [formValid, setFormValid] = useState(false);
  
  // Validate form on input changes
  useEffect(() => {
    let isValid = true;
    
    // Validate handle
    if (handle && !isValidHandle(handle)) {
      setHandleError('Handle must be 3-20 characters, alphanumeric with underscores only');
      isValid = false;
    } else {
      setHandleError('');
    }
    
    // Validate password
    if (password && !isStrongPassword(password)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Validate wallet address
    if (walletAddress && !isValidSolanaAddress(walletAddress)) {
      setWalletError('Please enter a valid Solana wallet address');
      isValid = false;
    } else {
      setWalletError('');
    }
    
    // Validate profile picture
    if (!profilePicture) {
      setPictureError('Profile picture is required');
      isValid = false;
    } else {
      setPictureError('');
    }
    
    // Check if all fields are filled
    if (!handle || !password || !walletAddress || !profilePicture) {
      isValid = false;
    }
    
    setFormValid(isValid);
  }, [handle, password, walletAddress, profilePicture]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setPictureError('File size must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setPictureError('File must be an image');
        return;
      }
      
      setProfilePicture(file);
      setPictureError('');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Effect to close modal when authentication is successful
  useEffect(() => {
    if (state.isAuthenticated && !state.loading) {
      onClose();
    }
  }, [state.isAuthenticated, state.loading, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Final validation check
    if (!formValid) {
      errorToast('Please fix all errors before submitting');
      return;
    }
    
    const formData = new FormData();
    formData.append('handle', handle);
    formData.append('password', password);
    formData.append('walletAddress', walletAddress);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    
    await register(formData);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#1b1d22] border border-[#282b33] rounded-xl shadow-lg p-8 w-full max-w-md relative overflow-y-auto max-h-[90vh] animate-slideIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#97ef83] transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center justify-center mb-6">
          <div className="h-px bg-[#97ef83]/30 flex-grow"></div>
          <h2 className="text-2xl font-bold text-[#97ef83] px-4 text-center font-mono tracking-wider">Register_for_Shillers</h2>
          <div className="h-px bg-[#97ef83]/30 flex-grow"></div>
        </div>

        {state.error && (
          <div className="bg-red-900 border border-red-700 text-white p-4 mb-6 animate-pulse">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">!</span>
              <span>{state.error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="handle" className="block text-green-500 mb-2 font-mono">
              Handle (@)
            </label>
            <input
              type="text"
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className={`w-full p-3 bg-gray-800 border ${handleError ? 'border-red-500' : 'border-gray-700'} focus:border-green-500 text-white focus:outline-none transition-colors`}
              placeholder="your_handle"
              required
              autoComplete="username"
            />
            {handleError && (
              <p className="text-red-500 text-sm mt-1">{handleError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-green-500 mb-2 font-mono">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 bg-gray-800 border ${passwordError ? 'border-red-500' : 'border-gray-700'} focus:border-green-500 text-white focus:outline-none transition-colors`}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <label htmlFor="walletAddress" className="block text-green-500 mb-2 font-mono">
              Solana_Wallet_Address
            </label>
            <input
              type="text"
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className={`w-full p-3 bg-gray-800 border ${walletError ? 'border-red-500' : 'border-gray-700'} focus:border-green-500 text-white focus:outline-none transition-colors`}
              placeholder="Enter your Solana payout address"
              required
            />
            {walletError && (
              <p className="text-red-500 text-sm mt-1">{walletError}</p>
            )}
          </div>

          <div>
            <label htmlFor="profilePicture" className="block text-green-500 mb-2 font-mono">
              Profile_Picture
            </label>
            <div className={`border ${pictureError ? 'border-red-500' : 'border-gray-700'} bg-gray-800 p-3`}>
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600 file:cursor-pointer"
                required
              />
            </div>
            {pictureError && (
              <p className="text-red-500 text-sm mt-1">{pictureError}</p>
            )}
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <div className="w-24 h-24 border-2 border-green-500 overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 border border-green-600 font-mono transition-colors"
            disabled={state.loading}
          >
            {state.loading ? 'processing...' : 'register_account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
