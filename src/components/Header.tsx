'use client';

import { Toolbar, Box, Button, Container, Card, useTheme, Chip } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { useAuth } from '@hooks/useAuth';
import { ROUTES } from '@constants/theme';

interface HeaderProps {
  variant?: 'public' | 'admin';
}

export function Header({ variant = 'public' }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  const handleLogin = () => {
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      {/* Header with Card styling to match risk-ui structure */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme => theme.zIndex.appBar,
          py: 0.75 // Reduced from 1 (8px) to 0.75 (6px)
        }}
      >
        <Container maxWidth="lg">
          <Card
            elevation={0}
            sx={{
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6) !important',
              backdropFilter: 'blur(8px)',
              // Override theme Card padding to exactly 6px
              padding: '6px 18px !important'
            }}
          >
            <Toolbar
              sx={{
                minHeight: '56px !important',
                padding: '0 !important', // Remove Toolbar padding, Card handles it
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Logo and Brand */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Link
                  href={variant === 'admin' ? ROUTES.DASHBOARD : '/'}
                  style={{ textDecoration: 'none' }}
                >
                  <Logo variant="compact" size="lg" clickable />
                </Link>
                <Chip
                  label="beta"
                  size="small"
                  variant="outlined"
                  sx={{
                    height: '20px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    borderColor: theme.palette.brand[500],
                    color: theme.palette.brand[500],
                    '& .MuiChip-label': {
                      px: 0.75
                    }
                  }}
                />
              </Box>

              {/* Desktop Navigation */}
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center'
                }}
              >
                <Navigation variant={variant} />
              </Box>

              {/* Right Side Actions */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                {/* Login/Logout Button */}
                {user ? (
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    size="medium"
                    sx={{
                      bgcolor: theme.palette.brand[500],
                      color: theme.palette.dark.bg,
                      '&:hover': {
                        bgcolor: theme.palette.brand[400]
                      }
                    }}
                  >
                    logout
                  </Button>
                ) : (
                  <Button
                    onClick={handleLogin}
                    variant="contained"
                    size="medium"
                    sx={{
                      bgcolor: theme.palette.brand[500],
                      color: theme.palette.dark.bg,
                      '&:hover': {
                        bgcolor: theme.palette.brand[400]
                      }
                    }}
                  >
                    login
                  </Button>
                )}

                {/* Mobile Navigation */}
                <Box
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    alignItems: 'center'
                  }}
                >
                  <Navigation variant={variant} />
                </Box>
              </Box>
            </Toolbar>
          </Card>
        </Container>
      </Box>
    </>
  );
}
