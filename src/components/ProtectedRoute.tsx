'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@constants/theme';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: theme.palette.background.default
          }}
        >
          <Stack spacing={2} alignItems="center">
            <CircularProgress
              size={48}
              sx={{
                color: theme.palette.brand[500]
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary
              }}
            >
              Loading...
            </Typography>
          </Stack>
        </Box>
      )
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
