import { useQuery } from '@tanstack/react-query';
import { Directory } from '../types/api';
import { useConfigStore } from '../stores/config';

// Directory fetcher function
const fetchDirectory = async (url: string): Promise<Directory> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch directory: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the directory structure
    if (!data || !Array.isArray(data.list)) {
      throw new Error('Invalid directory format: missing or invalid "list" array');
    }

    return data as Directory;
  } catch (error) {
    console.error('Directory fetch error:', error);
    throw error;
  }
};

// Helper function to determine if URL is local
const isLocalUrl = (url: string): boolean => {
  return (
    url.startsWith('./') ||
    url.startsWith('/') ||
    url.includes('localhost') ||
    url.includes('127.0.0.1')
  );
};

// TanStack Query hook for directory
export const useDirectory = () => {
  const {
    directoryUrl,
    directory,
    isLoadingDirectory,
    directoryError,
    setDirectory,
    setDirectoryLoading,
    setDirectoryError,
    getCacheTTL
  } = useConfigStore();

  const query = useQuery({
    queryKey: ['directory', directoryUrl],
    queryFn: () => fetchDirectory(directoryUrl),
    staleTime: getCacheTTL(),
    gcTime: getCacheTTL(), // Cache time (formerly cacheTime)
    refetchOnWindowFocus: !isLocalUrl(directoryUrl), // Don't refetch local files on focus
    refetchOnMount: !isLocalUrl(directoryUrl), // Don't refetch local files on mount
    retry: (failureCount, _error) => {
      // Don't retry local files
      if (isLocalUrl(directoryUrl)) return false;
      // Retry remote files up to 3 times
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!directoryUrl, // Only run query if we have a URL
    meta: {
      onSuccess: (data: Directory) => {
        setDirectory(data);
        setDirectoryError(null);
      },
      onError: (_error: Error) => {
        setDirectoryError(_error.message);
      }
    }
  });

  // Sync loading state with store
  if (query.isLoading !== isLoadingDirectory) {
    setDirectoryLoading(query.isLoading);
  }

  return {
    // Data
    directory: query.data || directory,
    backends: query.data?.list || directory?.list || [],

    // States
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error?.message || directoryError,

    // Query helpers
    refetch: query.refetch,
    isFetching: query.isFetching,
    isStale: query.isStale,

    // Cache information
    isLocalDirectory: isLocalUrl(directoryUrl),
    cacheTTL: getCacheTTL(),
    directoryUrl,

    // Query status
    queryStatus: query.status,
    fetchStatus: query.fetchStatus
  };
};

// Hook for getting selected backend
export const useSelectedBackend = () => {
  const { selectedBackend, setSelectedBackend } = useConfigStore();
  const { backends, isLoading } = useDirectory();

  // Auto-select first backend if none selected and backends are available
  if (!selectedBackend && backends.length > 0 && !isLoading) {
    setSelectedBackend(backends[0] || null);
  }

  return {
    selectedBackend,
    setSelectedBackend,
    availableBackends: backends
  };
};

// Hook for deployment configuration
export const useDeploymentConfig = () => {
  const { deploymentConfig, updateDeploymentConfig, getDeploymentType } = useConfigStore();

  return {
    deploymentConfig,
    updateDeploymentConfig,
    getDeploymentType,
    isGeneric: deploymentConfig.isGeneric,
    supportsOAuth2: deploymentConfig.supportsOAuth2,
    deploymentType: deploymentConfig.type
  };
};
