import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '../lib/auth.service';
import { RegisterData, LoginData, User } from '../types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: authService.getProfile,
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.data.user);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.data.user);
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
    },
  });

  // Logout
  const logout = () => {
    authService.logout();
    queryClient.clear();
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated: authService.isAuthenticated(),
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout,
    updateProfile: updateProfileMutation.mutate,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    registerError: registerMutation.error,
    loginError: loginMutation.error,
    updateProfileError: updateProfileMutation.error,
  };
}; 