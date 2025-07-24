import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Directory, DirectoryEntry, DeploymentType, DeploymentConfig } from '../types/api';
import { ENV } from '../constants';

interface ConfigState {
  // Directory configuration
  directory: Directory | null;
  selectedBackend: DirectoryEntry | null;
  directoryUrl: string;

  // Deployment configuration
  deploymentConfig: DeploymentConfig;

  // Loading states
  isLoadingDirectory: boolean;
  directoryError: string | null;
}

interface ConfigActions {
  // Directory actions
  setDirectory: (directory: Directory) => void;
  setSelectedBackend: (backend: DirectoryEntry | null) => void;
  setDirectoryUrl: (url: string) => void;
  setDirectoryLoading: (loading: boolean) => void;
  setDirectoryError: (error: string | null) => void;

  // Deployment actions
  updateDeploymentConfig: (config: Partial<DeploymentConfig>) => void;
  initializeDeploymentConfig: () => void;

  // Helper methods
  getDeploymentType: () => DeploymentType;
  isLocalDirectory: () => boolean;
  getCacheTTL: () => number;
}

type ConfigStore = ConfigState & ConfigActions;

// Utility functions for deployment detection
const getDeploymentType = (hostname: string): DeploymentType => {
  if (hostname === 'cho.mp') return 'generic';
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) return 'local';
  return 'hosted';
};

const isLocalDirectory = (url: string): boolean => {
  return (
    url.startsWith('./') ||
    url.startsWith('/') ||
    url.includes('localhost') ||
    url.includes('127.0.0.1')
  );
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      // Initial state
      directory: null,
      selectedBackend: null,
      directoryUrl: ENV.DIRECTORY_URL,
      deploymentConfig: {
        type: getDeploymentType(ENV.HOSTNAME),
        isGeneric: ENV.IS_GENERIC_DEPLOYMENT,
        directoryUrl: ENV.DIRECTORY_URL,
        supportsOAuth2: !ENV.IS_GENERIC_DEPLOYMENT
      },
      isLoadingDirectory: false,
      directoryError: null,

      // Directory actions
      setDirectory: (directory: Directory) => {
        set({ directory, directoryError: null });
      },

      setSelectedBackend: (backend: DirectoryEntry | null) => {
        set({ selectedBackend: backend });
      },

      setDirectoryUrl: (url: string) => {
        set({
          directoryUrl: url,
          deploymentConfig: {
            ...get().deploymentConfig,
            directoryUrl: url
          }
        });
      },

      setDirectoryLoading: (loading: boolean) => {
        set({ isLoadingDirectory: loading });
      },

      setDirectoryError: (error: string | null) => {
        set({ directoryError: error });
      },

      // Deployment actions
      updateDeploymentConfig: (config: Partial<DeploymentConfig>) => {
        set({
          deploymentConfig: {
            ...get().deploymentConfig,
            ...config
          }
        });
      },

      initializeDeploymentConfig: () => {
        const currentConfig = get().deploymentConfig;
        const detectedType = getDeploymentType(ENV.HOSTNAME);

        set({
          deploymentConfig: {
            ...currentConfig,
            type: detectedType,
            isGeneric: ENV.IS_GENERIC_DEPLOYMENT,
            supportsOAuth2: !ENV.IS_GENERIC_DEPLOYMENT
          }
        });
      },

      // Helper methods
      getDeploymentType: () => {
        return get().deploymentConfig.type;
      },

      isLocalDirectory: () => {
        return isLocalDirectory(get().directoryUrl);
      },

      getCacheTTL: () => {
        const { directoryUrl } = get();
        return isLocalDirectory(directoryUrl) ? Infinity : 60 * 60 * 1000; // 1 hour in milliseconds
      }
    }),
    {
      name: 'chomp-config',
      partialize: state => ({
        selectedBackend: state.selectedBackend,
        directoryUrl: state.directoryUrl,
        deploymentConfig: state.deploymentConfig
      })
    }
  )
);
