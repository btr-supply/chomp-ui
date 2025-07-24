import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@services/api';
import { QUERY_KEYS } from '@constants/theme';

// Simplified query hooks that work with existing setup
export const useSystemPing = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PING,
    queryFn: () => apiClient.ping(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60 // 1 minute
  });
};

// Simple query hooks with basic caching for common API calls
export const useSchema = () => {
  return useQuery({
    queryKey: ['schema'],
    queryFn: () => apiClient.getSchema(),
    staleTime: 1000 * 60 * 10 // 10 minutes
  });
};

export const useIngesters = () => {
  return useQuery({
    queryKey: ['ingesters'],
    queryFn: () => apiClient.getIngesters(),
    staleTime: 1000 * 30 // 30 seconds
  });
};

// Simple invalidation helper
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries(),
    invalidateSystemQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['ingesters'] });
      queryClient.invalidateQueries({ queryKey: ['schema'] });
    }
  };
};
