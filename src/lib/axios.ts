import axios from 'axios';
import Cookies from 'js-cookie';

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-domain.com';
  }
  
  // Base URL without /api since we're adding /api to each route
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // Increased to 15 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Create separate instance for auth requests with shorter timeout
export const authApi = axios.create({
  baseURL: getBaseURL(),
  timeout: 8000, // Shorter timeout for auth requests - they should be fast
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor to add auth token
const addAuthInterceptor = (instance: typeof api) => {
  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request details for debugging
      console.log(`🌐 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );
};

// Response interceptor to handle errors
const addResponseInterceptor = (instance: typeof api) => {
  instance.interceptors.response.use(
    (response) => {
      console.log(`✅ Response: ${response.status} ${response.statusText}`);
      return response;
    },
    (error) => {
      console.error('Axios interceptor - Response error:', error);
      
      // Handle timeout errors specifically
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.error('⏱️ Request timeout - backend might be slow or unresponsive');
        // Don't transform the error here, let auth service handle it
        return Promise.reject(error);
      }
      
      // Handle network errors (no response received)
      if (!error.response) {
        console.error('🌐 Network error - backend might be down');
        // Don't transform the error here, let auth service handle it
        return Promise.reject(error);
      }

      // Log response error details
      console.error(`❌ HTTP ${error.response.status}: ${error.response.statusText}`);
      console.error('Error data:', error.response.data);
      
      // Handle authentication errors for non-auth endpoints
      if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
        console.log('🔒 Unauthorized access to protected resource, removing token');
        Cookies.remove('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      
      // Don't transform errors here - let individual services handle their own error formatting
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both instances
addAuthInterceptor(api);
addAuthInterceptor(authApi);
addResponseInterceptor(api);
addResponseInterceptor(authApi);

export default api; 