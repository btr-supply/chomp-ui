'use client';

import {
  Typography,
  Stack,
  Grid,
  LinearProgress,
  useTheme,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { DashboardLayout } from '@components/DashboardLayout';
import { StyledCard, StyledButton, StatusChip, PageHeader, DataGrid, StatsCard } from '@components';
import { useMemo, useCallback } from 'react';
import type { StatusType } from '@components/StatusChip';

// Mock data interface for display purposes
interface MockInstanceData {
  id: string;
  name: string;
  status: StatusType;
  uptime: string;
  cpu: number;
  memory: number;
  requests: number;
  errors: number;
  lastSeen: string;
  version: string;
}

export default function InstancesPage() {
  const theme = useTheme();

  // Mock data - in real app this would come from API
  const instances: MockInstanceData[] = [
    {
      id: 'ingester-1',
      name: 'Primary Ingester',
      status: 'success',
      uptime: '15d 4h 23m',
      cpu: 45,
      memory: 68,
      requests: 12450,
      errors: 2,
      lastSeen: '2 minutes ago',
      version: '1.2.3'
    },
    {
      id: 'ingester-2',
      name: 'Secondary Ingester',
      status: 'success',
      uptime: '12d 8h 15m',
      cpu: 32,
      memory: 54,
      requests: 8920,
      errors: 0,
      lastSeen: '1 minute ago',
      version: '1.2.3'
    },
    {
      id: 'ingester-3',
      name: 'Backup Ingester',
      status: 'warning',
      uptime: '2d 1h 45m',
      cpu: 78,
      memory: 89,
      requests: 3240,
      errors: 15,
      lastSeen: '5 minutes ago',
      version: '1.2.2'
    },
    {
      id: 'ingester-4',
      name: 'Development Ingester',
      status: 'error',
      uptime: '0d 0h 0m',
      cpu: 0,
      memory: 0,
      requests: 0,
      errors: 0,
      lastSeen: '2 hours ago',
      version: '1.2.1'
    }
  ];

  const getProgressColor = useCallback(
    (value: number) => {
      if (value > 80) return theme.palette.error.main;
      if (value > 60) return theme.palette.warning.main;
      return theme.palette.success.main;
    },
    [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main]
  );

  const getErrorColor = useCallback(
    (errors: number) => {
      if (errors > 10) return theme.palette.error.main;
      if (errors > 0) return theme.palette.warning.main;
      return theme.palette.success.main;
    },
    [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main]
  );

  const totalInstances = instances.length;
  const onlineInstances = instances.filter(i => i.status === 'success').length;
  const warningInstances = instances.filter(i => i.status === 'warning').length;
  const offlineInstances = instances.filter(i => i.status === 'error').length;

  // Memoized columns configuration for DataGrid
  const columns = useMemo(
    () => [
      {
        id: 'name',
        label: 'Instance',
        format: (value: unknown, row: MockInstanceData) => (
          <Stack spacing={0.5}>
            <Typography variant="body2" fontWeight="medium">
              {row.name}
            </Typography>
            <Typography variant="caption" color={theme.palette.text.secondary}>
              {row.id}
            </Typography>
          </Stack>
        )
      },
      {
        id: 'status',
        label: 'Status',
        format: (value: unknown) => <StatusChip status={value as StatusType} />
      },
      {
        id: 'uptime',
        label: 'Uptime'
      },
      {
        id: 'cpu',
        label: 'CPU',
        format: (value: unknown) => {
          const cpuValue = typeof value === 'number' ? value : 0;
          return (
            <Stack spacing={0.5} sx={{ minWidth: 80 }}>
              <Typography variant="body2">{cpuValue}%</Typography>
              <LinearProgress
                variant="determinate"
                value={cpuValue}
                sx={{
                  height: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getProgressColor(cpuValue)
                  }
                }}
              />
            </Stack>
          );
        }
      },
      {
        id: 'memory',
        label: 'Memory',
        format: (value: unknown) => {
          const memoryValue = typeof value === 'number' ? value : 0;
          return (
            <Stack spacing={0.5} sx={{ minWidth: 80 }}>
              <Typography variant="body2">{memoryValue}%</Typography>
              <LinearProgress
                variant="determinate"
                value={memoryValue}
                sx={{
                  height: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getProgressColor(memoryValue)
                  }
                }}
              />
            </Stack>
          );
        }
      },
      {
        id: 'requests',
        label: 'Requests',
        format: (value: unknown) => {
          const requestValue = typeof value === 'number' ? value : 0;
          return <Typography variant="body2">{requestValue.toLocaleString()}</Typography>;
        }
      },
      {
        id: 'errors',
        label: 'Errors',
        format: (value: unknown) => {
          const errorValue = typeof value === 'number' ? value : 0;
          return (
            <Typography variant="body2" sx={{ color: getErrorColor(errorValue) }}>
              {errorValue}
            </Typography>
          );
        }
      },
      {
        id: 'version',
        label: 'Version',
        format: (value: unknown) => (
          <Typography variant="body2" fontFamily="monospace">
            {String(value)}
          </Typography>
        )
      },
      {
        id: 'actions',
        label: 'Actions',
        format: () => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View Details">
              <IconButton size="small">
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Restart">
              <IconButton size="small">
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )
      }
    ],
    [theme, getProgressColor, getErrorColor]
  );

  return (
    <DashboardLayout>
      <Stack spacing={3}>
        {/* Page Header */}
        <PageHeader
          title="Instances"
          subtitle="Manage and monitor your ingester instances"
          actions={
            <Stack direction="row" spacing={1}>
              <StyledButton variant="outlined" startIcon={<RefreshIcon />} size="small">
                Refresh
              </StyledButton>
              <StyledButton variant="contained" startIcon={<SettingsIcon />} size="small">
                Global Settings
              </StyledButton>
            </Stack>
          }
        />

        {/* Summary Stats */}
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard
              title="Total Instances"
              value={totalInstances}
              subtitle="Configured ingesters"
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard title="Online" value={onlineInstances} subtitle="Healthy" />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard title="Warnings" value={warningInstances} subtitle="Attention needed" />
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}
          >
            <StatsCard title="Offline" value={offlineInstances} subtitle="Down" />
          </Grid>
        </Grid>

        {/* Instances Table */}
        <StyledCard>
          <Stack spacing={2} sx={{ p: 3 }}>
            <Typography variant="h6">Instance Details</Typography>
            <DataGrid columns={columns} rows={instances} emptyMessage="No instances configured" />
          </Stack>
        </StyledCard>
      </Stack>
    </DashboardLayout>
  );
}
