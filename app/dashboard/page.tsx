'use client';

import { Box, Grid, Typography, Stack, LinearProgress, useTheme, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, CheckCircle, Warning, Error, Info } from '@mui/icons-material';
import { DashboardLayout } from '@components/DashboardLayout';
import { StyledCard, StatsCard, PageHeader } from '@components';

export default function DashboardPage() {
  const theme = useTheme();

  // Mock data - in real app this would come from API
  const systemStats = {
    totalRequests: 1234567,
    activeInstances: 12,
    errorRate: 0.02,
    uptime: 99.9,
    responseTime: 45,
    throughput: 1250
  };

  const recentActivity = [
    { id: 1, type: 'info', message: 'New instance started: ingester-3', time: '2 minutes ago' },
    { id: 2, type: 'warning', message: 'High memory usage on ingester-1', time: '5 minutes ago' },
    { id: 3, type: 'success', message: 'Cache cleared successfully', time: '10 minutes ago' },
    { id: 4, type: 'info', message: 'Scheduled backup completed', time: '15 minutes ago' }
  ];

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      default:
        return <Info />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        {/* Page Header */}
        <PageHeader title="Dashboard" subtitle="System overview and monitoring" />

        {/* Stats Grid */}
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard
              title="Total Requests"
              value={systemStats.totalRequests.toLocaleString()}
              trend={{
                value: '23.36%',
                direction: 'up',
                icon: <TrendingUp color="success" fontSize="small" />
              }}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard
              title="Active Instances"
              value={systemStats.activeInstances}
              subtitle="Online"
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard
              title="Error Rate"
              value={`${(systemStats.errorRate * 100).toFixed(2)}%`}
              trend={{
                value: 'Low',
                direction: 'down',
                icon: <TrendingDown color="success" fontSize="small" />
              }}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard title="Uptime" value={`${systemStats.uptime}%`} subtitle="Excellent" />
          </Grid>
        </Grid>

        {/* Performance Metrics */}
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
          >
            <StyledCard>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Typography variant="h6">Performance Metrics</Typography>
                <Stack spacing={3}>
                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">Response Time</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {systemStats.responseTime}ms
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.success.main
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">Throughput</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {systemStats.throughput} req/s
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.info.main
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">CPU Usage</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        42%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={42}
                      sx={{
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.warning.main
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">Memory Usage</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        68%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={68}
                      sx={{
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: theme.palette.warning.main
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </Stack>
            </StyledCard>
          </Grid>

          <Grid
            size={{
              xs: 12,
              lg: 6
            }}
          >
            <StyledCard>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Typography variant="h6">Recent Activity</Typography>
                <Stack spacing={2}>
                  {recentActivity.map(activity => (
                    <Box
                      key={activity.id}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: theme.palette.grey[50],
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Chip
                          icon={getStatusIcon(activity.type)}
                          label={activity.type}
                          color={
                            getStatusColor(activity.type) as
                              | 'default'
                              | 'primary'
                              | 'secondary'
                              | 'error'
                              | 'info'
                              | 'success'
                              | 'warning'
                          }
                          size="small"
                        />
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {activity.message}
                          </Typography>
                          <Typography variant="caption" color={theme.palette.text.secondary}>
                            {activity.time}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </StyledCard>
          </Grid>
        </Grid>
      </Stack>
    </DashboardLayout>
  );
}
