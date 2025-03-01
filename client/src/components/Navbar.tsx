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
            <div className="w-7 h-7 bg-[#97ef83] rounded-md flex items-center justify-center text-[#1b1d22] font-bold mr-2">
              $
            </div>
            <span className="tracking-wider">SHILLSTER</span>
          </Link>

          <div className="flex items-center space-x-3">
            
            {state.isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center focus:outline-none"
                  aria-label="Open user menu"
                >
                  {state.user?.profilePicture ? (
                    <img 
                      src={`${API_URL}${state.user.profilePicture}`}
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
                    <div className="w-8 h-8 bg-[#4779ff] rounded-full flex items-center justify-center text-white font-bold border border-[#4779ff]">
                      {state.user?.handle ? state.user.handle.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1b1d22] border border-[#282b33] rounded-xl shadow-xl z-10 overflow-hidden">
                    <div className="py-2 px-3 bg-[#24272e] border-b border-[#282b33] flex items-center">
                      {state.user?.profilePicture ? (
                        <img 
                          src={`${API_URL}${state.user.profilePicture}`}
                          alt={state.user.handle}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-[#4779ff] rounded-full flex items-center justify-center text-white font-bold mr-2">
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
