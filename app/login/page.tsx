'use client';

import {
  Box,
  Button,
  Container,
  TextField,
  Stack,
  Typography,
  Alert,
  AlertTitle,
  IconButton,
  InputAdornment,
  Paper,
  Link,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@hooks/useAuth';
import { ROUTES, LAYOUT } from '@constants/theme';
import { logError } from '@store/logs';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
// Removed unused StyledButton import

export default function LoginPage() {
  const [token, setToken] = useState('');
  const [authMethod] = useState('static'); // For now, only static auth
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  const { login, isAuthenticated, error, clearError } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      // Simple alert for now - you might want to implement a toast system for MUI
      alert('Please enter your authentication token');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('loading');
    clearError();

    try {
      const success = await login({ token: token.trim(), auth_method: authMethod });

      if (success) {
        setSubmitStatus('success');
        // Small delay to show success state
        setTimeout(() => {
          router.push(ROUTES.DASHBOARD);
        }, 1000);
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      logError(err as Error, { context: 'login' });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset status after animation
      setTimeout(() => setSubmitStatus('idle'), 2000);
    }
  };

  const getSubmitIcon = () => {
    switch (submitStatus) {
      case 'loading':
        return <CircularProgress size={16} />;
      case 'success':
        return <CheckIcon fontSize="small" />;
      case 'error':
        return <CloseIcon fontSize="small" />;
      default:
        return <ArrowForwardIcon fontSize="small" />;
    }
  };

  const getSubmitColor = () => {
    switch (submitStatus) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.dark.bg, minHeight: '100vh', pt: LAYOUT.headerHeight }}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: `calc(100vh - ${LAYOUT.headerHeight} - ${LAYOUT.footerMinHeight} - 32px)` // 32px for additional padding
        }}
      >
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <Paper
            elevation={3}
            sx={{
              bgcolor: theme.palette.dark.surface,
              p: 4,
              borderRadius: 2,
              border: `1px solid ${theme.palette.gray[400]}`
            }}
          >
            <Stack spacing={4}>
              {/* Logo and Title */}
              <Stack spacing={2} alignItems="center" textAlign="center">
                {/* Logo placeholder */}
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: theme.palette.brand[500],
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" color={theme.palette.dark.bg}>
                    C
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: 'Modak, cursive',
                    color: theme.palette.brand[500],
                    textTransform: 'uppercase'
                  }}
                >
                  CHOMP
                </Typography>
                <Typography variant="body2" color={theme.palette.gray[400]}>
                  Sign in to access the admin dashboard
                </Typography>
              </Stack>

              {/* Error Alert */}
              {error && submitStatus !== 'loading' && (
                <Alert
                  severity="error"
                  sx={{
                    bgcolor: '#7f1d1d',
                    border: `1px solid #dc2626`,
                    '& .MuiAlert-icon': {
                      color: '#fca5a5'
                    }
                  }}
                >
                  <AlertTitle sx={{ color: '#fca5a5' }}>Error</AlertTitle>
                  <Typography sx={{ color: '#fca5a5' }}>{error}</Typography>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    type="password"
                    label="Authentication Token"
                    placeholder="Enter your authentication token"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    disabled={isSubmitting}
                    required
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Submit login"
                            size="small"
                            color={
                              getSubmitColor() as
                                | 'primary'
                                | 'secondary'
                                | 'success'
                                | 'error'
                                | 'info'
                                | 'warning'
                            }
                            disabled={!token.trim() || isSubmitting}
                            type="submit"
                            sx={{
                              color: submitStatus === 'idle' ? theme.palette.gray[400] : undefined
                            }}
                          >
                            {getSubmitIcon()}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: theme.palette.dark.surface,
                        '& input': {
                          color: theme.palette.gray[400]
                        },
                        '& input::placeholder': {
                          color: theme.palette.gray[700]
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: theme.palette.gray[400],
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!token.trim() || isSubmitting}
                    color={
                      getSubmitColor() as
                        | 'primary'
                        | 'secondary'
                        | 'success'
                        | 'error'
                        | 'info'
                        | 'warning'
                    }
                    sx={{
                      fontFamily: theme.typography.button.fontFamily,
                      textTransform: 'lowercase',
                      bgcolor: submitStatus === 'idle' ? theme.palette.brand[500] : undefined,
                      '&:hover': {
                        bgcolor: submitStatus === 'idle' ? theme.palette.brand[400] : undefined
                      }
                    }}
                  >
                    {submitStatus === 'loading' ? 'Authenticating...' : 'sign in'}
                  </Button>
                </Stack>
              </form>

              {/* Auth Method Info */}
              <Box sx={{ textAlign: 'center', pt: 2 }}>
                <Typography variant="caption" color={theme.palette.gray[700]}>
                  Using static token authentication
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Footer Links */}
          <Stack spacing={1} sx={{ mt: 4, textAlign: 'center' }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ fontSize: '0.875rem', color: theme.palette.gray[400] }}
            >
              <Link
                href="https://github.com/btr-supply/chomp"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{
                  color: theme.palette.gray[400],
                  '&:hover': { color: theme.palette.brand[500] }
                }}
              >
                GitHub
              </Link>
              <Typography>•</Typography>
              <Link
                href="/docs"
                underline="none"
                sx={{
                  color: theme.palette.gray[400],
                  '&:hover': { color: theme.palette.brand[500] }
                }}
              >
                API Docs
              </Link>
            </Stack>
            <Typography variant="caption" color={theme.palette.gray[700]}>
              © 2024 BTR Supply
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
