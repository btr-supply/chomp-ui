'use client';

import React, { memo } from 'react';
import { Box, Stack, Typography, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import { StyledButton } from '@components/StyledButton';
import { useWeb3Auth } from '@hooks/useWeb3Auth';
import { Web3AuthProps } from '../types/auth';

interface Web3AuthBaseProps extends Web3AuthProps {
  title: string;
  subtitle: string;
  signText: string;
  supportText: string;
  authMethod: string;
  onSign?: (challenge: any) => Promise<string>;
  children: (params: {
    authState: any;
    error: string | null;
    challenge: any;
    onConnect: (identifier: string) => Promise<void>;
    onRetry: () => void;
  }) => React.ReactNode;
}

export const Web3AuthBase = memo<Web3AuthBaseProps>(
  ({ title, subtitle, signText, supportText, authMethod, onSign, onSuccess, onBack, children }) => {
    const { authState, error, challenge, handleAuth, handleSign, handleRetry, setError } =
      useWeb3Auth();

    const handleConnect = async (identifier: string) => {
      try {
        const challengeData = await handleAuth(identifier, authMethod);

        // If we have a signing function, use it
        if (onSign && challengeData) {
          try {
            const signature = await onSign(challengeData);
            await handleSign(signature, challengeData.challenge_id, identifier, authMethod);
            onSuccess();
          } catch (err: any) {
            setError(err?.message || 'Failed to sign message');
          }
        }
      } catch {
        // Error already handled in hook
      }
    };

    return (
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h5" sx={{ flex: 1 }}>
            {title}
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
              {authState === 'connect' && (
                <>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    {subtitle}
                  </Typography>
                  {children({
                    authState,
                    error,
                    challenge,
                    onConnect: handleConnect,
                    onRetry: handleRetry
                  })}
                </>
              )}

              {authState === 'signing' && (
                <>
                  <CircularProgress />
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    {signText}
                  </Typography>
                  {challenge && (
                    <Typography variant="caption" color="text.secondary">
                      challenge expires at: {new Date(challenge.expires_at).toLocaleTimeString()}
                    </Typography>
                  )}
                </>
              )}

              {authState === 'verifying' && (
                <>
                  <CircularProgress />
                  <Typography variant="body1" color="text.secondary">
                    verifying signature with backend...
                  </Typography>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" textAlign="center">
          {supportText}
        </Typography>
      </Stack>
    );
  }
);

Web3AuthBase.displayName = 'Web3AuthBase';
