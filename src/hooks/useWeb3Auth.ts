import { useState } from 'react';
import { useAuth } from './useAuth';
import { apiClient } from '@services/api';
import { LoginRequest } from '../types/api';
import { Web3Challenge, Web3AuthState, Web3AuthHookResult } from '../types/auth';

export const useWeb3Auth = (): Web3AuthHookResult => {
  const { login } = useAuth();
  const [authState, setAuthState] = useState<Web3AuthState>('connect');
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState<Web3Challenge | null>(null);

  const handleAuth = async (identifier: string, authMethod: string) => {
    setAuthState('signing');
    setError(null);

    try {
      const response = await fetch(`${apiClient.getBaseUrl()}/auth/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_method: authMethod,
          identifier
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to create authentication challenge');
      }

      const challengeData = await response.json();
      setChallenge(challengeData);
      return challengeData;
    } catch (err: any) {
      setError(err?.message || 'Failed to create challenge');
      setAuthState('error');
      throw err;
    }
  };

  const handleSign = async (
    signature: string,
    challengeId: string,
    identifier: string,
    authMethod: string
  ) => {
    setAuthState('verifying');

    try {
      const response = await fetch(`${apiClient.getBaseUrl()}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: challengeId,
          credentials: { address: identifier, signature }
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Signature verification failed');
      }

      const authData = await response.json();

      // Create login request compatible with existing auth store
      const loginRequest: LoginRequest = {
        auth_method: authMethod,
        token: authData.access_token
      };

      const success = await login(loginRequest);
      if (!success) {
        throw new Error('Authentication successful but login failed');
      }

      return true;
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
      setAuthState('error');
      throw err;
    }
  };

  const handleRetry = () => {
    setError(null);
    setAuthState('connect');
    setChallenge(null);
  };

  return {
    authState,
    error,
    challenge,
    handleAuth,
    handleSign,
    handleRetry,
    setError
  };
};
