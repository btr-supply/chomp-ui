'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  useTheme,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StyledCard, Logo, AuthMethods, BackendSelector, StyledButton } from '@components';
import { useAuth } from '@hooks/useAuth';
import { useSelectedBackend } from '../../hooks/useDirectory';
import { ROUTES } from '@constants/theme';
import { apiClient } from '@services/api';
import type { LoginRequest } from '../../types/api';
import type { DirectoryEntry } from '../../types/api';

// Type definitions for Web3 providers (using type assertions instead of global extension)

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

interface AuthError {
  message: string;
  type: 'auth' | 'network' | 'wallet' | 'challenge';
}

interface Web3Challenge {
  challenge_id: string;
  message: string;
  expires_at: string;
}

export function LoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { selectedBackend } = useSelectedBackend();

  const [selectedAuthMethod, setSelectedAuthMethod] = useState<string>('');
  const [authStep, setAuthStep] = useState<'backend' | 'auth' | 'credentials'>('backend');
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [challenge, setChallenge] = useState<Web3Challenge | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update API client base URL when backend changes
  useEffect(() => {
    if (selectedBackend?.url) {
      apiClient.setBaseUrl(selectedBackend.url);
    }
  }, [selectedBackend]);

  const clearError = () => setAuthError(null);

  const showError = (message: string, type: AuthError['type'] = 'auth') => {
    setAuthError({ message, type });
  };

  const handleBackendSelect = (_backend: DirectoryEntry) => {
    clearError();
    setAuthStep('auth');
  };

  const handleAuthMethodSelect = async (method: string) => {
    clearError();
    setSelectedAuthMethod(method);
    setIsProcessing(true);

    try {
      // Handle static token authentication immediately
      if (method === 'static') {
        const loginRequest: LoginRequest = {
          auth_method: 'static',
          token: 'demo-token' // TODO: Make configurable
        };

        const success = await login(loginRequest);
        if (success) {
          router.push(ROUTES.DASHBOARD);
        } else {
          showError('Static token authentication failed. Please check your token.');
        }
        return;
      }

      // Handle OAuth2 methods
      if (method.startsWith('oauth2_')) {
        await handleOAuth2Login(method);
        return;
      }

      // Handle Web3 wallet authentication
      if (['evm', 'svm', 'sui'].includes(method)) {
        await handleWeb3Login(method);
        return;
      }

      showError(`Authentication method "${method}" is not implemented yet.`);
    } catch (error) {
      console.error('Authentication error:', error);
      showError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOAuth2Login = async (method: string) => {
    const baseUrl = selectedBackend?.url || 'http://localhost:40004';
    const provider = method.replace('oauth2_', '');

    try {
      // Get OAuth2 authorization URL
      const response = await fetch(`${baseUrl}/auth/${provider}/login`);
      const data = await response.json();

      if (data.auth_url) {
        // Redirect to OAuth2 provider
        window.location.href = data.auth_url;
      } else {
        showError(`Failed to initialize ${provider.toUpperCase()} authentication`);
      }
    } catch {
      showError(`${provider.toUpperCase()} authentication is not available`);
    }
  };

  const handleWeb3Login = async (chainType: string) => {
    try {
      // Step 1: Check wallet availability and get address
      const address = await getWalletAddress(chainType);
      if (!address) return;

      // Step 2: Create authentication challenge
      const challengeData = await createAuthChallenge(chainType, address);
      if (!challengeData) return;

      setChallenge(challengeData);
      setAuthStep('credentials');

      // Step 3: Request wallet signature
      const signature = await signChallenge(chainType, challengeData.message, address);
      if (!signature) return;

      // Step 4: Verify signature with backend
      await verifySignature(challengeData.challenge_id, address, signature);
    } catch (error) {
      console.error('Web3 authentication error:', error);
      showError(error instanceof Error ? error.message : 'Web3 authentication failed', 'wallet');
    }
  };

  const getWalletAddress = async (chainType: string): Promise<string | null> => {
    try {
      switch (chainType) {
        case 'evm':
          if (!window.ethereum) {
            showError('MetaMask or another Ethereum wallet is required', 'wallet');
            return null;
          }
          const accounts = (await (window.ethereum as EthereumProvider).request({
            method: 'eth_requestAccounts'
          })) as string[];
          return accounts?.[0] || null;

        case 'svm':
          if (!(window as any).solana) {
            showError('Phantom or another Solana wallet is required', 'wallet');
            return null;
          }
          const response = await (window as any).solana.connect();
          return response.publicKey.toString();

        case 'sui':
          if (!(window as any).suiWallet) {
            showError('Sui Wallet is required', 'wallet');
            return null;
          }
          const suiResponse = await (window as any).suiWallet.requestPermissions();
          return suiResponse.accounts?.[0] || null;

        default:
          showError(`Unsupported chain type: ${chainType}`);
          return null;
      }
    } catch {
      showError('Failed to connect wallet. Please try again.', 'wallet');
      return null;
    }
  };

  const createAuthChallenge = async (
    chainType: string,
    address: string
  ): Promise<Web3Challenge | null> => {
    try {
      const baseUrl = selectedBackend?.url || 'http://localhost:40004';
      const response = await fetch(`${baseUrl}/auth/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_method: chainType,
          identifier: address
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Failed to create authentication challenge');
      }

      return await response.json();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to create challenge', 'challenge');
      return null;
    }
  };

  const signChallenge = async (
    chainType: string,
    message: string,
    address: string
  ): Promise<string | null> => {
    try {
      switch (chainType) {
        case 'evm':
          if (!window.ethereum) return null;
          const signature = (await (window.ethereum as EthereumProvider).request({
            method: 'personal_sign',
            params: [message, address]
          })) as string;
          return signature;

        case 'svm':
          if (!(window as any).solana) return null;
          const encodedMessage = new TextEncoder().encode(message);
          const { signature: solSignature } = await (window as any).solana.signMessage(
            encodedMessage
          );
          return Array.from(solSignature as Uint8Array)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        case 'sui':
          if (!(window as any).suiWallet) return null;
          const signResult = await (window as any).suiWallet.signMessage({ message });
          return signResult.signature;

        default:
          throw new Error(`Unsupported chain type for signing: ${chainType}`);
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
        showError('Signature request was rejected by user', 'wallet');
      } else {
        showError('Failed to sign message. Please try again.', 'wallet');
      }
      return null;
    }
  };

  const verifySignature = async (challengeId: string, address: string, signature: string) => {
    try {
      const baseUrl = selectedBackend?.url || 'http://localhost:40004';
      const response = await fetch(`${baseUrl}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: challengeId,
          credentials: {
            address,
            signature
          }
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Signature verification failed');
      }

      const authData = await response.json();

      // Create login request compatible with existing auth store
      const loginRequest: LoginRequest = {
        auth_method: 'web3',
        token: authData.access_token
      };

      const success = await login(loginRequest);
      if (success) {
        router.push(ROUTES.DASHBOARD);
      } else {
        showError('Authentication successful but login failed');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Signature verification failed');
    }
  };

  const handleBackToBackendSelection = () => {
    setAuthStep('backend');
    setSelectedAuthMethod('');
    setChallenge(null);
    clearError();
  };

  const handleBackToAuthSelection = () => {
    setAuthStep('auth');
    setSelectedAuthMethod('');
    setChallenge(null);
    clearError();
  };

  const handleRetryAuth = () => {
    if (selectedAuthMethod) {
      handleAuthMethodSelect(selectedAuthMethod);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.dark?.bg || theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          {/* Logo and Title */}
          <Stack spacing={2} alignItems="center">
            <Logo size="lg" />
            <Stack spacing={1} alignItems="center">
              <Typography variant="h3" fontWeight="bold">
                Welcome to Chomp
              </Typography>
              <Typography variant="h6" color="text.secondary" textAlign="center">
                High-performance data ingestion framework
              </Typography>
            </Stack>
          </Stack>

          {/* Error Display */}
          {authError && (
            <Alert
              severity={authError.type === 'wallet' ? 'warning' : 'error'}
              onClose={clearError}
              sx={{ width: '100%', maxWidth: 600 }}
            >
              {authError.message}
              {authError.type === 'wallet' && selectedAuthMethod && (
                <Box sx={{ mt: 1 }}>
                  <StyledButton variant="outlined" size="small" onClick={handleRetryAuth}>
                    retry connection
                  </StyledButton>
                </Box>
              )}
            </Alert>
          )}

          {/* Main Content Card */}
          <StyledCard sx={{ width: '100%', maxWidth: 600 }}>
            <Box sx={{ p: 4 }}>
              {/* Step 1: Backend Selection */}
              {authStep === 'backend' && (
                <Stack spacing={3}>
                  <Typography variant="h5" textAlign="center">
                    Choose Your Backend
                  </Typography>
                  <BackendSelector onBackendSelect={handleBackendSelect} showSelected={false} />
                </Stack>
              )}

              {/* Step 2: Authentication Method Selection */}
              {authStep === 'auth' && (
                <Stack spacing={3}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5" sx={{ flex: 1 }}>
                      Authentication
                    </Typography>
                    <Box
                      onClick={handleBackToBackendSelection}
                      sx={{
                        cursor: 'pointer',
                        color: theme.palette.primary.main,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      <Typography variant="body2">Change Backend</Typography>
                    </Box>
                  </Stack>

                  {/* Selected Backend Info */}
                  {selectedBackend && (
                    <Box sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Connecting to: <strong>{selectedBackend.name}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedBackend.url}
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <AuthMethods
                    onAuthMethodSelect={handleAuthMethodSelect}
                    disabled={isLoading || isProcessing}
                  />

                  {/* Loading indicator */}
                  {(isLoading || isProcessing) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {isProcessing ? 'processing authentication...' : 'logging in...'}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}

              {/* Step 3: Web3 Wallet Interaction */}
              {authStep === 'credentials' && challenge && (
                <Stack spacing={3}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5" sx={{ flex: 1 }}>
                      {selectedAuthMethod === 'evm' && 'sign with ethereum wallet'}
                      {selectedAuthMethod === 'svm' && 'sign with solana wallet'}
                      {selectedAuthMethod === 'sui' && 'sign with sui wallet'}
                    </Typography>
                    <Box
                      onClick={handleBackToAuthSelection}
                      sx={{
                        cursor: 'pointer',
                        color: theme.palette.primary.main,
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      <Typography variant="body2">back</Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ p: 3, bgcolor: theme.palette.grey[50], borderRadius: 1 }}>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      textAlign="center"
                      gutterBottom
                    >
                      please sign the authentication message in your wallet
                    </Typography>

                    <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }}>
                      challenge expires at: {new Date(challenge.expires_at).toLocaleTimeString()}
                    </Typography>

                    {isProcessing && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress size={20} />
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          waiting for signature...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Stack>
              )}
            </Box>
          </StyledCard>

          {/* Footer Info */}
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Chomp supports multiple authentication methods and can connect to any compatible backend
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
