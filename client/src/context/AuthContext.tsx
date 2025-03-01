import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { User, AuthState } from '../types';

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
    // With the proxy setup, we can use the path directly
    return path;
  }
  
  // For API endpoints, use the API URL
  return path.startsWith('/') ? `/api${path}` : `/api/${path}`;
};

// Define action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOADING' };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (handle: string, password: string) => Promise<void>;
  register: (formData: FormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token || '');
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(getApiUrl('/users/profile'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { ...res.data, token },
        });
      } catch (error) {
        dispatch({
          type: 'LOGIN_FAIL',
          payload: 'Session expired. Please login again.',
        });
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (handle: string, password: string) => {
    try {
      dispatch({ type: 'LOADING' });
      const res = await axios.post(getApiUrl('/users/login'), {
        handle,
        password,
      });

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
    } catch (error: any) {
      // Handle specific error cases
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const status = error.response.status;
        const responseData = error.response.data;
        
        if (status === 401) {
          errorMessage = 'Invalid handle or password';
        } else if (status === 404) {
          errorMessage = 'User not found';
        } else if (responseData && responseData.message) {
          // Use the server's error message if available
          errorMessage = responseData.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please try again later.';
      }
      
      dispatch({
        type: 'LOGIN_FAIL',
        payload: errorMessage,
      });
    }
  };

  // Register user
  const register = async (formData: FormData) => {
    try {
      dispatch({ type: 'LOADING' });
      const res = await axios.post(getApiUrl('/users'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
