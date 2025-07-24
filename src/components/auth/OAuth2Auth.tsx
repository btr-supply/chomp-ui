'use client';

import React, { memo, useState, useEffect } from 'react';
import { Box, Stack, Typography, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import { StyledButton } from '@components/StyledButton';
import { useAuth } from '@hooks/useAuth';
import { apiClient } from '@services/api';
import { LoginRequest } from '../../types/api';

interface OAuth2AuthProps {
  provider: 'github' | 'x';
  onSuccess: () => void;
  onBack: () => void;
}

type AuthState = 'ready' | 'redirecting' | 'processing' | 'error';

export const OAuth2Auth = memo<OAuth2AuthProps>(({ provider, onSuccess, onBack }) => {
  const { login } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('ready');
  const [error, setError] = useState<string | null>(null);

  // Check for OAuth2 callback on component mount
  useEffect(() => {
    const handleOAuth2Callback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        setError(`OAuth2 error: ${error}`);
        setAuthState('error');
        return;
      }

      if (code && state) {
        setAuthState('processing');
        try {
          await handleOAuth2Code(code);
        } catch (err: any) {
          setError(err?.message || 'OAuth2 authentication failed');
          setAuthState('error');
        }
      }
    };

    handleOAuth2Callback();
  }, []);

  const handleOAuth2Code = async (code: string) => {
    try {
      const loginRequest: LoginRequest = {
        auth_method: `oauth2_${provider}`,
        token: code
      };

      const success = await login(loginRequest);
      if (success) {
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        onSuccess();
      } else {
        setError('Authentication successful but login failed');
        setAuthState('error');
      }
    } catch (err: any) {
      setError(err?.message || 'OAuth2 authentication failed');
      setAuthState('error');
    }
  };

  const handleOAuth2Login = async () => {
    setAuthState('redirecting');
    setError(null);

    try {
      // Get OAuth2 authorization URL from backend
      const response = await fetch(`${apiClient.getBaseUrl()}/auth/${provider}/login`);

      if (!response.ok) {
        throw new Error(`Failed to get ${provider.toUpperCase()} authorization URL`);
      }

      const data = await response.json();

      if (data.auth_url) {
        // Redirect to OAuth2 provider
        window.location.href = data.auth_url;
      } else {
        throw new Error(`Invalid response from ${provider.toUpperCase()} login endpoint`);
      }
    } catch (err: any) {
      setError(err?.message || `${provider.toUpperCase()} authentication is not available`);
      setAuthState('error');
    }
  };

  const handleRetry = () => {
    setError(null);
    setAuthState('ready');
  };

  const providerConfig = {
    github: {
      name: 'GitHub',
      description: 'sign in with your github account',
      color: '#333'
    },
    x: {
      name: 'X (Twitter)',
      description: 'sign in with your x account',
      color: '#1DA1F2'
    }
  };

  const config = providerConfig[provider];

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h5" sx={{ flex: 1 }}>
          {config.name} authentication
        </Typography>
        <Box
          onClick={onBack}
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <Typography variant="body2">back</Typography>
        </Box>
      </Stack>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          action={
            authState === 'error' && (
              <StyledButton size="small" onClick={handleRetry}>
                retry
              </StyledButton>
            )
          }
        >
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3} alignItems="center">
            {authState === 'ready' && (
              <>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  {config.description}
                </Typography>
                <StyledButton
                  variant="brand"
                  onClick={handleOAuth2Login}
                  fullWidth
                  sx={{
                    borderColor: config.color,
                    color: config.color,
                    '&:hover': {
                      borderColor: config.color,
                      backgroundColor: `${config.color}08`
                    }
                  }}
                >
                  continue with {config.name}
                </StyledButton>
              </>
            )}

            {authState === 'redirecting' && (
              <>
                <CircularProgress />
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  redirecting to {config.name}...
                </Typography>
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  you will be redirected back here after authorization
                </Typography>
              </>
            )}

            {authState === 'processing' && (
              <>
                <CircularProgress />
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  processing {config.name} authorization...
                </Typography>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Typography variant="caption" color="text.secondary" textAlign="center">
        you will be redirected to {config.name} to authorize this application
      </Typography>
    </Stack>
  );
});

OAuth2Auth.displayName = 'OAuth2Auth';
