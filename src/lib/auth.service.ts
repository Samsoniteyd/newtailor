import api from './axios';
import Cookies from 'js-cookie';
import { RegisterData, LoginData, AuthResponse, User, ApiResponse } from '../types';

class AuthService {
  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Attempting to register with:', { ...data, password: '[HIDDEN]' });
      const response = await api.post<AuthResponse>('/auth/register', data);
      
      if (response.data.data?.token) {
        Cookies.set('token', response.data.data.token, { expires: 7 });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.type === 'NETWORK_ERROR') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
        throw new Error(errorMessages);
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('Attempting to login with:', { ...data, password: '[HIDDEN]' });
      const response = await api.post<AuthResponse>('/auth/login', data);
      
      if (response.data.data?.token) {
        Cookies.set('token', response.data.data.token, { expires: 7 });
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.type === 'NETWORK_ERROR') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  // Logout user
  logout(): void {
    Cookies.remove('token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
      return response.data.data!.user;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<{ user: User }>>('/auth/profile', data);
    return response.data.data!.user;
  }

  // Delete user profile
  async deleteProfile(): Promise<void> {
    await api.delete('/auth/profile');
    this.logout();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!Cookies.get('token');
  }

  // Get token
  getToken(): string | null {
    return Cookies.get('token') || null;
  }
}

export default new AuthService(); 