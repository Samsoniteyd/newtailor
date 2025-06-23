import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/lib/api';
import { User } from '@/types';

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Handle error in component if needed
  if (isError) {
    console.error('Failed to fetch users:', error);
  }

  const addUser = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const editUser = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const removeUser = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: users || [],
    isLoading,
    isError,
    error,
    addUser: addUser.mutate,
    editUser: editUser.mutate,
    removeUser: removeUser.mutate,
    isAddingUser: addUser.isPending,
    isEditingUser: editUser.isPending,
    isRemovingUser: removeUser.isPending,
  };
}; 