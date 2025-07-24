import { useEffect } from 'react';
import { useDirectory } from '../hooks/useDirectory';
import { useConfigStore } from '../stores/config';

/**
 * DirectoryInitializer component that loads the directory configuration
 * when the app starts and ensures proper initialization of the config store
 */
export function DirectoryInitializer() {
  const { initializeDeploymentConfig } = useConfigStore();
  const { directory, isLoading, isError } = useDirectory();

  useEffect(() => {
    // Initialize deployment configuration on mount
    initializeDeploymentConfig();
  }, [initializeDeploymentConfig]);

  // Log directory loading status for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Directory Status:', {
        isLoading,
        isError,
        hasDirectory: !!directory,
        backendCount: directory?.list?.length || 0
      });
    }
  }, [directory, isLoading, isError]);

  // This component doesn't render anything visible
  return null;
}
