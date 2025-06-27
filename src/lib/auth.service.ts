import api, { authApi } from './axios';
import Cookies from 'js-cookie';
import { RegisterData, LoginData, AuthResponse, User, ApiResponse } from '../types';

class AuthService {
  // Register user
  register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('🔐 Starting registration...');
      console.log('📤 Sending to:', `${authApi.defaults.baseURL}/api/auth/register`);
      
      const response = await authApi.post<AuthResponse>('/api/auth/register', data);
      
      if (response.data.data?.token) {
        Cookies.set('token', response.data.data.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        console.log('✅ Registration successful');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      const handledError = this.handleAuthError(error, 'Registration');
      throw handledError;
    }
  }

  // Login user with improved error handling
  login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('🔐 Starting login...');
      console.log('📤 Sending login request...');
      console.log('📧 Email:', data.email);
      
      // Use authApi for shorter timeout on auth requests
      const response = await authApi.post<AuthResponse>('/api/auth/login', {
        email: data.email?.trim(),
        password: data.password
      });
      
      if (response.data.data?.token) {
        Cookies.set('token', response.data.data.token, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        console.log('✅ Login successful');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Login error (raw):', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      const handledError = this.handleAuthError(error, 'Login');
      console.error('❌ Handled error:', handledError.message);
      throw handledError;
    }
  }

  // Centralized error handling for auth operations
  private handleAuthError = (error: any, operation: string): Error => {
    console.log('🔍 Handling auth error for:', operation);
    console.log('🔍 Error object:', error);
    console.log('🔍 Error.response:', error.response);
    console.log('🔍 Error.code:', error.code);
    console.log('🔍 Error.message:', error.message);

    // Handle axios timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return new Error('Request timed out. Your backend might be slow or unresponsive. Please try again.');
    }

    // Handle custom timeout errors from our interceptor
    if (error.type === 'TIMEOUT_ERROR' || error.status === 'timeout') {
      return new Error('Request timed out. Your backend might be slow or unresponsive. Please try again.');
    }

    // Handle network errors (no response received)
    if (!error.response || error.type === 'NETWORK_ERROR' || error.status === 'no_response') {
      return new Error('Cannot connect to server. Please check if your backend is running on the correct port.');
    }

    // Handle HTTP errors from server response
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      const message = responseData?.message || responseData?.error || responseData?.details;

      console.log('🔍 HTTP Error - Status:', status);
      console.log('🔍 HTTP Error - Message:', message);

      switch (status) {
        case 400:
          return new Error(message || 'Invalid request. Please check your input.');
        
        case 401:
          if (operation === 'Login') {
            return new Error('Invalid email or password. Please check your credentials.');
          }
          return new Error(message || 'Authentication failed.');
        
        case 403:
          return new Error('Access denied. You do not have permission to perform this action.');
        
        case 404:
          return new Error(`${operation} endpoint not found. Please check your backend configuration.`);
        
        case 422:
          return new Error(message || 'Validation failed. Please check your input.');
        
        case 429:
          return new Error('Too many requests. Please wait a moment and try again.');
        
        case 500:
          return new Error('Internal server error. Please try again later.');
        
        case 502:
          return new Error('Bad gateway. The server is temporarily unavailable.');
        
        case 503:
          return new Error('Service unavailable. Please try again later.');
        
        default:
          return new Error(message || `${operation} failed. Please try again.`);
      }
    }

    // Handle any other error types
    if (error.message) {
      return new Error(error.message);
    }

    // Final fallback
    return new Error(`${operation} failed. Please check your connection and try again.`);
  }

  // Logout user
  logout = (): void => {
    console.log('🚪 Logging out...');
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Get current user profile
  getProfile = async (): Promise<User> => {
    try {
      console.log('👤 Fetching user profile...');
      const response = await api.get<ApiResponse<{ user: User }>>('/api/auth/profile');
      console.log('✅ Profile fetched successfully');
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Get profile error:', error);
      
      if (error.response?.status === 401) {
        this.logout();
      }
      
      throw this.handleAuthError(error, 'Profile fetch');
    }
  }

  // Update user profile
  updateProfile = async (data: Partial<User>): Promise<User> => {
    try {
      console.log('📝 Updating profile...');
      const response = await api.put<ApiResponse<{ user: User }>>('/api/auth/profile', data);
      console.log('✅ Profile updated successfully');
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      throw this.handleAuthError(error, 'Profile update');
    }
  }

  // Delete user profile
  deleteProfile = async (): Promise<void> => {
    try {
      console.log('🗑️ Deleting profile...');
      await api.delete('/api/auth/profile');
      console.log('✅ Profile deleted successfully');
      this.logout();
    } catch (error: any) {
      console.error('❌ Delete profile error:', error);
      throw this.handleAuthError(error, 'Profile deletion');
    }
  }

  // Check if user is authenticated
  isAuthenticated = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  }

  // Get token
  getToken = (): string | null => {
    return Cookies.get('token') || null;
  }
}

export default new AuthService();