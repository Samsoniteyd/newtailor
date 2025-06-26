import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import requisitionService from '../lib/requisition.service';
import { Requisition, CreateRequisitionData, RequisitionQuery } from '../types';

export const useRequisitions = (params?: RequisitionQuery) => {
  const queryClient = useQueryClient();

  // Get all requisitions
  const { 
    data: requisitions, 
    isLoading, 
    isError,
    error 
  } = useQuery<Requisition[]>({
    queryKey: ['requisitions', params],
    queryFn: () => requisitionService.getRequisitions(params),
    placeholderData: (previousData) => previousData, // keepPreviousData equivalent
  });

  // Create requisition mutation
  const createMutation = useMutation({
    mutationFn: requisitionService.createRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
    },
  });

  // Update requisition mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRequisitionData> }) =>
      requisitionService.updateRequisition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
    },
  });

  // Delete requisition mutation
  const deleteMutation = useMutation({
    mutationFn: requisitionService.deleteRequisition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
    },
  });

  return {
    requisitions,
    isLoading,
    isError,
    error,
    createRequisition: createMutation.mutate,
    updateRequisition: updateMutation.mutate,
    deleteRequisition: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};

// Hook for single requisition
export const useRequisition = (id: string) => {
  return useQuery<Requisition>({
    queryKey: ['requisition', id],
    queryFn: () => requisitionService.getRequisition(id),
    enabled: !!id,
    retry: 1,
  });
}; 