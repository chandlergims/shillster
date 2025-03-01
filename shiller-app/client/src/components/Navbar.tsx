import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { toast } from 'react-toastify';

// API URL configuration - can be changed for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Navbar = () => {
  const { state, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-[#1b1d22] text-[#fbfcff] py-3 border-b border-[#282b33] shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="text-xl font-bold text-[#fbfcff] flex items-center font-mono">
            <img src="/logo.png" alt="Shillster Logo" className="h-8" />
          </Link>

          <div className="flex items-center space-x-4">
            <Link 
              to="/docs" 
              className="text-[#fbfcff] hover:text-[#97ef83] transition-colors duration-200 text-sm font-medium px-3 py-1.5 rounded-lg border border-[#282b33] hover:border-[#97ef83]/50 hover:bg-[#97ef83]/5"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Docs
              </span>
            </Link>
            <a 
              href="https://x.com/shillsterdotapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#97ef83] hover:text-[#97ef83]/80 transition-colors duration-200"
              aria-label="Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            {state.isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                  aria-label="Open user menu"
                >
                  {state.user?.profilePicture ? (
                    <img 
                      src={'https://via.placeholder.com/50'}
                      alt={state.user.handle}
                      className="w-8 h-8 rounded-full object-cover border border-[#97ef83]"
                      onError={(e) => {
                        // Fallback to letter if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = "w-8 h-8 bg-[#97ef83] rounded-full flex items-center justify-center text-[#1b1d22] font-bold border border-[#97ef83]";
                          fallback.textContent = state.user?.handle.charAt(0).toUpperCase() || 'U';
                          parent.insertBefore(fallback, target);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#97ef83] rounded-full flex items-center justify-center text-[#1b1d22] font-bold border border-[#97ef83]">
                      {state.user?.handle ? state.user.handle.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1b1d22] border border-[#282b33] rounded-xl shadow-xl z-10 overflow-hidden">
                    <div className="py-2 px-3 bg-[#24272e] border-b border-[#282b33] flex items-center">
                      {state.user?.profilePicture ? (
                        <img 
                          src={'https://via.placeholder.com/50'}
                          alt={state.user.handle}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#97ef83] rounded-full flex items-center justify-center text-[#1b1d22] font-bold mr-2">
                          {state.user?.handle ? state.user.handle.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-[#fbfcff] text-sm font-medium">@{state.user?.handle}</p>
                        <p className="text-[#69a5ff] text-xs capitalize">{state.user?.role}</p>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-3 py-1.5 text-sm text-[#fbfcff] hover:bg-[#282b33] transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2 text-[#a8aab0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="border border-[#282b33] bg-[#1b1d22] text-[#fbfcff] hover:bg-[#24272e] px-3 py-1 text-sm rounded-xl font-medium transition-all duration-200"
                >
                  Register
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-[#97ef83] hover:bg-[#97ef83]/90 px-3 py-1 text-sm rounded-xl text-[#1b1d22] font-medium transition-all duration-200 flex items-center"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
