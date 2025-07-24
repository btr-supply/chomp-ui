'use client';

import { Box, Container, Typography, Stack, Link, Grid, useTheme } from '@mui/material';
import {
  Api as ApiIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Dashboard as DashboardIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import NextLink from 'next/link';
import { StyledCard, StyledButton } from '@components';
import { useSystemPing } from '@/hooks/useSystemQueries';
import { ROUTES, LAYOUT } from '@constants/theme';
import { useMemo } from 'react';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
import { Logo } from '@components/Logo';

export function HomePage() {
  const theme = useTheme();

  // Fetch basic system info for the hero section with optimized caching
  const { data: pingData } = useSystemPing();

  // Memoize features array to prevent unnecessary re-renders
  const features = useMemo(
    () => [
      {
        icon: ApiIcon,
        title: 'Real-time APIs',
        description: 'REST and WebSocket APIs for low-latency data access.'
      },
      {
        icon: SecurityIcon,
        title: 'Enterprise-grade Security',
        description: 'Secure authentication and data handling.'
      },
      {
        icon: SpeedIcon,
        title: 'High Performance',
        description: 'Built for speed with an optimized, asynchronous architecture.'
      },
      {
        icon: DashboardIcon,
        title: 'Admin Dashboard',
        description: 'Monitor and manage your ingester fleet with ease.'
      },
      {
        icon: CodeIcon,
        title: 'Developer Friendly',
        description: 'Easy to extend, configure, and deploy.'
      }
    ],
    []
  );

  return (
    <Box sx={{ bgcolor: theme.palette.dark.bg, minHeight: '100vh', pt: LAYOUT.headerHeight }}>
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Stack spacing={6} alignItems="center" textAlign="center">
          {/* Much bigger logo above everything */}
          <Box
            sx={{
              '& .MuiTypography-root': {
                fontSize: '12rem !important', // Make the logo wordmark much, much bigger
                fontWeight: 'bold'
              },
              mb: 4 // Add margin bottom for spacing
            }}
          >
            <Logo variant="compact" size="lg" />
          </Box>

          <Stack spacing={3}>
            <Typography variant="h2" fontWeight="bold" color={theme.palette.text.primary}>
              Data Ingestion Platform
            </Typography>
            <Typography
              variant="h5"
              color={theme.palette.gray[400]}
              sx={{ maxWidth: '2xl', mx: 'auto' }}
            >
              Real-time data feeds, historical analysis, and advanced processing capabilities. Built
              for developers and data engineers.
            </Typography>
          </Stack>

          {/* System Status - Use StyledCard with subtle variant */}
          {pingData && (
            <StyledCard
              variant="surface"
              padding="md"
              sx={{
                mt: 2
              }}
            >
              <Stack
                direction="row"
                spacing={3}
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="body2" color={theme.palette.gray[500]}>
                  API Status:{' '}
                  <span style={{ color: theme.palette.success.main }}>{pingData.status}</span>
                </Typography>
                <Typography variant="body2" color={theme.palette.gray[500]}>
                  Version:{' '}
                  <span style={{ color: theme.palette.gray[400] }}>{pingData.version}</span>
                </Typography>
                <Typography variant="body2" color={theme.palette.gray[500]}>
                  Latency:{' '}
                  <span style={{ color: theme.palette.gray[400] }}>{pingData.ping_ms}ms</span>
                </Typography>
              </Stack>
            </StyledCard>
          )}

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <StyledButton href={ROUTES.LOGIN} component={NextLink} variant="brand" size="large">
              Get Started
            </StyledButton>
            <Link
              href="https://github.com/btr-supply/chomp"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <StyledButton variant="outlined" size="large">
                View on GitHub
              </StyledButton>
            </Link>
          </Stack>
        </Stack>
      </Container>
      {/* Features Section */}
      <Box sx={{ bgcolor: theme.palette.dark.surface, py: 10 }}>
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h3" color={theme.palette.text.primary}>
                Platform Features
              </Typography>
              <Typography
                variant="h6"
                color={theme.palette.gray[400]}
                sx={{ maxWidth: '2xl', mx: 'auto' }}
              >
                Comprehensive tools for data analysis and monitoring
              </Typography>
            </Stack>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid
                  key={index}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 4
                  }}
                >
                  <StyledCard variant="surface" sx={{ height: '100%' }}>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      <feature.icon
                        sx={{
                          fontSize: 32,
                          color: theme.palette.brand[500]
                        }}
                      />
                      <Typography variant="h6" color={theme.palette.gray[400]} fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color={theme.palette.gray[400]}>
                        {feature.description}
                      </Typography>
                    </Stack>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>
      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Stack spacing={6}>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="h3" color={theme.palette.text.primary}>
              API Overview
            </Typography>
            <Typography variant="h6" color={theme.palette.gray[400]}>
              Access comprehensive data through our RESTful API
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            <Grid
              size={{
                xs: 12,
                md: 4
              }}
            >
              <StyledCard sx={{ height: '100%' }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Typography variant="h2" color={theme.palette.brand[500]}>
                    15+
                  </Typography>
                  <Typography variant="h6" color={theme.palette.gray[400]}>
                    API Endpoints
                  </Typography>
                  <Typography variant="body2" color={theme.palette.gray[500]}>
                    Comprehensive data access for ingester management
                  </Typography>
                </Stack>
              </StyledCard>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4
              }}
            >
              <StyledCard sx={{ height: '100%' }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Typography variant="h2" color={theme.palette.brand[500]}>
                    24/7
                  </Typography>
                  <Typography variant="h6" color={theme.palette.gray[400]}>
                    Monitoring
                  </Typography>
                  <Typography variant="body2" color={theme.palette.gray[500]}>
                    Continuous health checks and performance tracking
                  </Typography>
                </Stack>
              </StyledCard>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4
              }}
            >
              <StyledCard sx={{ height: '100%' }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Typography variant="h2" color={theme.palette.brand[500]}>
                    {pingData?.ping_ms || '<1'}ms
                  </Typography>
                  <Typography variant="h6" color={theme.palette.gray[400]}>
                    Latency
                  </Typography>
                  <Typography variant="body2" color={theme.palette.gray[500]}>
                    Low-latency data processing and delivery
                  </Typography>
                </Stack>
              </StyledCard>
            </Grid>
          </Grid>
        </Stack>
      </Container>
      {/* Footer */}
      <Footer />
    </Box>
  );
}
