'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Grid,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import {
  Api as ApiIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Dashboard as DashboardIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import NextLink from 'next/link';
import { StyledCard, StyledButton, Logo } from '@components';
import { useSystemPing } from '../src/hooks/useSystemQueries';
import { LAYOUT } from '../src/constants';
import { useMemo } from 'react';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';

export default function HomePage() {
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

  // Memoize stats data to prevent unnecessary re-renders
  const stats = useMemo(
    () => [
      {
        label: 'Uptime',
        value: '99.9%',
        helper: 'system availability'
      },
      {
        label: 'Latency',
        value: `${pingData?.ping_ms || '<1'}ms`,
        helper: 'average response time'
      },
      {
        label: 'Data Sources',
        value: '500+',
        helper: 'supported integrations'
      }
    ],
    [pingData?.ping_ms]
  );

  return (
    <Box sx={{ bgcolor: theme.palette.dark.bg, minHeight: '100vh', pt: LAYOUT.headerHeight }}>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          pt: { xs: 6, md: 8 },
          pb: 6,
          minHeight: `calc(100vh - ${LAYOUT.headerHeight})`
        }}
      >
        <Stack spacing={6} alignItems="center" textAlign="center">
          {/* Hero Content */}
          <Stack spacing={3} alignItems="center" sx={{ maxWidth: '800px' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                label="BETA"
                size="small"
                sx={{
                  bgcolor: theme.palette.brand[500],
                  color: theme.palette.dark.bg,
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              />
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: theme.palette.gray[100]
                }}
              >
                Real-time data
              </Typography>
              <Logo variant="compact" size="lg" />
            </Stack>

            <Typography
              variant="h5"
              color={theme.palette.gray[400]}
              sx={{ maxWidth: '600px', lineHeight: 1.6 }}
            >
              Aggregate, analyze, and serve data from hundreds of sources with our low-code
              ingestion platform.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ pt: 2, width: '100%', maxWidth: '400px' }}
            >
              <StyledButton
                component={NextLink}
                href="/resources"
                variant="brand"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                schema
              </StyledButton>
              <StyledButton
                component={NextLink}
                href="/docs"
                variant="outlined"
                size="large"
                fullWidth
                sx={{ py: 1.5 }}
              >
                docs
              </StyledButton>
            </Stack>
          </Stack>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ maxWidth: '900px', width: '100%' }}>
            {stats.map((stat, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  md: 4
                }}
              >
                <Card
                  sx={{
                    textAlign: 'center',
                    bgcolor: theme.palette.dark.surface,
                    border: `1px solid ${theme.palette.gray[400]}`,
                    borderRadius: 2,
                    p: 3
                  }}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography
                        variant="body2"
                        color={theme.palette.gray[400]}
                        textTransform="uppercase"
                        letterSpacing={1}
                      >
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" color={theme.palette.gray[400]} fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color={theme.palette.gray[700]}>
                        {stat.helper}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Features Section */}
          <Stack spacing={4} alignItems="center" sx={{ maxWidth: '1000px', width: '100%' }}>
            <Typography variant="h3" textAlign="center" color={theme.palette.gray[100]}>
              Built for Scale & Performance
            </Typography>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid
                  key={index}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4
                  }}
                >
                  <StyledCard sx={{ height: '100%', p: 3 }}>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      <feature.icon sx={{ fontSize: '3rem', color: theme.palette.brand[500] }} />
                      <Typography variant="h6" color={theme.palette.gray[100]}>
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
        </Stack>
      </Container>
      {/* Footer */}
      <Footer />
    </Box>
  );
}
