import React, { memo, useState } from 'react';
import { Box, Stack, Typography, TextField, Alert, CircularProgress } from '@mui/material';
import { StyledButton } from '@components/StyledButton';
import { useAuth } from '@hooks/useAuth';
import { LoginRequest } from '../../types/api';

interface StaticTokenAuthProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const StaticTokenAuth = memo<StaticTokenAuthProps>(({ onSuccess, onBack }) => {
  const { login, isLoading } = useAuth();
  const [token, setToken] = useState('demo-token'); // Default for demo
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('Please enter a valid token');
      return;
    }

    try {
      const loginRequest: LoginRequest = {
        auth_method: 'static',
        token: token.trim()
      };

      const success = await login(loginRequest);
      if (success) {
        onSuccess();
      } else {
        setError('Authentication failed. Please check your token.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h5" sx={{ flex: 1 }}>
          static token authentication
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
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 1 }}
      >
        <Stack spacing={3}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            enter your authentication token
          </Typography>

          <TextField
            fullWidth
            label="Authentication Token"
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Enter your static token"
            disabled={isLoading}
            autoFocus
          />

          <StyledButton
            type="submit"
            variant="brand"
            fullWidth
            disabled={isLoading || !token.trim()}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'authenticating...' : 'authenticate'}
          </StyledButton>

          <Typography variant="caption" color="text.secondary" textAlign="center">
            for demo purposes, try using &quot;demo-token&quot;
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
});

StaticTokenAuth.displayName = 'StaticTokenAuth';
