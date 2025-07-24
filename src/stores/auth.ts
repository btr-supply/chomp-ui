import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/api';
import { LoginRequest, AuthStatus } from '../types/api';
import { logError } from './logs';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    token: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.login(credentials);

          if (response.success && response.jwt_token) {
            set({
              isAuthenticated: true,
              user: {
                id: response.user_id,
                token: response.jwt_token
              },
              isLoading: false,
              error: null
            });
            return true;
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: response.message || 'Login failed'
            });
            return false;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          logError(error as Error, { context: 'login' });
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: errorMessage
          });
          return false;
        }
      },

      logout: async (): Promise<void> => {
        set({ isLoading: true });

        try {
          await apiClient.logout();
        } catch (error) {
          logError(error as Error, { context: 'logout' });
          console.error('Logout error:', error);
        } finally {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null
          });
        }
      },

      checkAuth: async (): Promise<void> => {
        const { user } = get();

        if (!user?.token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });

        try {
          const status: AuthStatus = await apiClient.checkAuthStatus();

          if (status.authenticated) {
            set({
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          logError(error as Error, { context: 'checkAuth' });
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null
          });
        }
      },

      clearError: (): void => {
        set({ error: null });
      },

      setLoading: (loading: boolean): void => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'chomp-auth',
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
);
