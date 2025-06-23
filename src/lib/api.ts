import api from './axios';
import { User, ApiResponse } from '../types';

// Since your backend doesn't have a users endpoint yet, 
// we'll use the auth endpoints for user management

export const fetchUsers = async (): Promise<User[]> => {
  // This would need to be implemented in your backend
  // For now, return empty array or current user
  try {
    const response = await api.get<ApiResponse<{ users: User[] }>>('/users');
    return response.data.data?.users || [];
  } catch (error) {
    // If endpoint doesn't exist, return empty array
    console.warn('Users endpoint not available, returning empty array');
    return [];
  }
};

export const createUser = async (userData: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}): Promise<User> => {
  // Use the register endpoint for creating users
  const response = await api.post<ApiResponse<{ user: User }>>('/auth/register', userData);
  return response.data.data!.user;
};

export const updateUser = async (userData: {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}): Promise<User> => {
  // Use the profile update endpoint
  const { id, ...updateData } = userData;
  const response = await api.put<ApiResponse<{ user: User }>>('/auth/profile', updateData);
  return response.data.data!.user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  // Use the profile delete endpoint
  await api.delete('/auth/profile');
};

// Additional utility functions
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
  return response.data.data!.user;
};

// Additional user API functions you might need
export const getUserById = async (userId: string): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>(`/users/${userId}`);
  return response.data.data!.user;
};

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.put('/auth/change-password', passwordData);
};

export const resetPassword = async (email: string): Promise<void> => {
  await api.post('/auth/forgot-password', { email });
}; 