import api from './axios';
import Cookies from 'js-cookie';
import { RegisterData, LoginData, AuthResponse, User, ApiResponse } from '../types';

class AuthService {
  // Register user
  register = async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('🔐 Starting registration...');
      console.log('📤 Sending to:', `${api.defaults.baseURL}/api/auth/register`);
      
      const response = await api.post<AuthResponse>('/api/auth/register', data); // Add /api
      
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
      
      if (error.response?.status === 404) {
        throw new Error('Registration endpoint not found. Check your backend routes.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Login user
  login = async (data: LoginData): Promise<AuthResponse> => {
    try {
      console.log('🔐 Starting login...');
      console.log('📤 Sending to:', `${api.defaults.baseURL}/api/auth/login`);
      
      const response = await api.post<AuthResponse>('/api/auth/login', data); // Add /api
      
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
      console.error('❌ Login error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Login endpoint not found. Check your backend routes.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Login failed. Please check your credentials.');
    }
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
      const response = await api.get<ApiResponse<{ user: User }>>('/api/auth/profile'); // Add /api
      console.log('✅ Profile fetched successfully');
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Get profile error:', error);
      
      if (error.response?.status === 401) {
        this.logout();
      }
      
      throw error;
    }
  }

  // Update user profile
  updateProfile = async (data: Partial<User>): Promise<User> => {
    try {
      console.log('📝 Updating profile...');
      const response = await api.put<ApiResponse<{ user: User }>>('/api/auth/profile', data); // Add /api
      console.log('✅ Profile updated successfully');
      return response.data.data!.user;
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  }

  // Delete user profile
  deleteProfile = async (): Promise<void> => {
    try {
      console.log('🗑️ Deleting profile...');
      await api.delete('/api/auth/profile'); // Add /api
      console.log('✅ Profile deleted successfully');
      this.logout();
    } catch (error: any) {
      console.error('❌ Delete profile error:', error);
      throw error;
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