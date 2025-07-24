'use client';

import React, { memo, useMemo } from 'react';
import { Grid, Stack, Typography, useTheme } from '@mui/material';
import { DashboardLayout } from '@components/DashboardLayout';
import { PageHeader, StatsCard, StyledCard } from '@components';
import { useIngesters, useSystemPing } from '@/hooks/useSystemQueries';

export const DashboardPage = memo(() => {
  const theme = useTheme();
  const { data: pingData, isLoading: pingLoading } = useSystemPing();
  const { data: ingesters, isLoading: ingestersLoading } = useIngesters();

  // Memoized system stats to prevent unnecessary re-renders
  const systemStats = useMemo(() => {
    return {
      totalIngesters: ingesters?.total_count || 0,
      activeIngesters: ingesters?.running_count || 0,
      totalRecords: 0, // Would come from API
      avgLatency: pingData?.ping_ms || 0
    };
  }, [ingesters, pingData]);

  const isLoading = pingLoading || ingestersLoading;

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        {/* Page Header */}
        <PageHeader title="Dashboard" subtitle="System overview and performance metrics" />

        {/* System Stats */}
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard
              title="Total Ingesters"
              value={systemStats.totalIngesters}
              subtitle="Configured"
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
              title="Active Ingesters"
              value={systemStats.activeIngesters}
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
              title="Total Records"
              value={systemStats.totalRecords}
              subtitle="Processed"
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
              title="Avg Latency"
              value={`${systemStats.avgLatency}ms`}
              subtitle="Response time"
            />
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <StyledCard>
          <Stack spacing={2} sx={{ p: 3 }}>
            <Typography variant="h6">Recent Activity</Typography>
            <Stack spacing={1}>
              <Typography
                variant="body2"
                color={theme.palette.gray?.[400] || theme.palette.text.secondary}
              >
                • System ping: {pingData?.ping_ms}ms
              </Typography>
              <Typography
                variant="body2"
                color={theme.palette.gray?.[400] || theme.palette.text.secondary}
              >
                • {systemStats.totalIngesters} ingesters configured
              </Typography>
              <Typography
                variant="body2"
                color={theme.palette.gray?.[400] || theme.palette.text.secondary}
              >
                • {systemStats.activeIngesters} ingesters currently active
              </Typography>
              <Typography
                variant="body2"
                color={theme.palette.gray?.[400] || theme.palette.text.secondary}
              >
                • System status: {isLoading ? 'Loading...' : 'Online'}
              </Typography>
            </Stack>
          </Stack>
        </StyledCard>
      </Stack>
    </DashboardLayout>
  );
});

DashboardPage.displayName = 'DashboardPage';
