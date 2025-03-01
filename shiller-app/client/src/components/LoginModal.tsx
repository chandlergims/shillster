import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const { login, state, clearError } = useAuth();

  // Effect to close modal when authentication is successful
  useEffect(() => {
    if (state.isAuthenticated && !state.loading) {
      onClose();
    }
  }, [state.isAuthenticated, state.loading, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    await login(handle, password);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#1b1d22] border border-[#282b33] rounded-xl shadow-lg p-8 w-full max-w-md relative animate-slideIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        
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
          <h2 className="text-2xl font-bold text-green-500 px-4 text-center font-mono tracking-wider">Login_to_Shillers</h2>
          <div className="h-px bg-green-500/30 flex-grow"></div>
        </div>

        {state.error && (
          <div className="bg-red-900/50 border border-red-700 text-white p-4 mb-6 rounded-sm animate-pulse">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{state.error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="login-handle" className="block text-green-500 mb-2 font-mono">
              Handle (@)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
              <input
                type="text"
                id="login-handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full p-3 pl-8 bg-gray-800 border border-gray-700 focus:border-green-500 text-white focus:outline-none transition-colors rounded-sm"
                placeholder="your_handle"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-green-500 mb-2 font-mono">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-8 bg-gray-800 border border-gray-700 focus:border-green-500 text-white focus:outline-none transition-colors rounded-sm"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 border border-green-600 font-mono transition-colors rounded-sm flex items-center justify-center"
            disabled={state.loading}
          >
            {state.loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                authenticating...
              </>
            ) : (
              'login_account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
