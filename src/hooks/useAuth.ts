import { useAuthStore } from '../stores/auth';
import { LoginRequest } from '../types/api';

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    clearError,
    setLoading
  } = useAuthStore();

  const handleLogin = async (credentials: LoginRequest): Promise<boolean> => {
    return await login(credentials);
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  const initializeAuth = async (): Promise<void> => {
    await checkAuth();
  };

  return {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    checkAuth: initializeAuth,
    clearError,
    setLoading,

    // Computed values
    isLoggedIn: isAuthenticated && !!user,
    userId: user?.id || null,
    token: user?.token || null
  };
};
