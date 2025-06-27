import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '../lib/auth.service';
import { RegisterData, LoginData, User } from '../types';
import { useToast } from './useToast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      toast({
        variant: "success",
        title: "Welcome!",
        description: "Account created successfully.",
      });
    },
  });

  // Login mutation - Let form handle errors, don't clear anything
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.data.user);
      toast({
        variant: "success",
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    // No onError here - let the form component handle error display
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      toast({
        variant: "success",
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
      });
    },
  });

  // Logout with toast
  const logout = () => {
    authService.logout();
    queryClient.clear();
    
    // Show success toast
    toast({
      variant: "success",
      title: "Logout Successful",
      description: "You have been logged out successfully.",
    });

    // Delay redirect slightly to show toast
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }, 1000);
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