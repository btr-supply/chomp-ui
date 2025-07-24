import React, { memo } from 'react';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
  Alert,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useDirectory, useSelectedBackend } from '../hooks/useDirectory';
import type { DirectoryEntry } from '../types/api';

interface BackendSelectorProps {
  onBackendSelect?: (backend: DirectoryEntry) => void;
  compact?: boolean;
  showSelected?: boolean;
}

export const BackendSelector = memo<BackendSelectorProps>(
  ({ onBackendSelect, compact = false, showSelected = true }) => {
    const theme = useTheme();
    const { backends, isLoading, isError, error, refetch, isLocalDirectory, directoryUrl } =
      useDirectory();

    const { selectedBackend, setSelectedBackend } = useSelectedBackend();

    const handleBackendSelect = (backend: DirectoryEntry) => {
      setSelectedBackend(backend);
      onBackendSelect?.(backend);
    };

    // Loading state
    if (isLoading) {
      return (
        <Box>
          <Typography variant="h6" gutterBottom>
            Loading Backends...
          </Typography>
          <Stack spacing={2}>
            {[1, 2, 3].map(i => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={compact ? 60 : 80}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Stack>
        </Box>
      );
    }

    // Error state
    if (isError) {
      return (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          action={<RefreshIcon sx={{ cursor: 'pointer' }} onClick={() => refetch()} />}
        >
          <Typography variant="body2">Failed to load backends: {error}</Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Directory URL: {directoryUrl}
          </Typography>
        </Alert>
      );
    }

    // No backends available
    if (!backends || backends.length === 0) {
      return (
        <Alert severity="warning">
          <Typography variant="body2">No backends available in directory</Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Directory URL: {directoryUrl}
          </Typography>
        </Alert>
      );
    }

    return (
      <Box>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">Select Backend</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              label={isLocalDirectory ? 'Local' : 'Remote'}
              color={isLocalDirectory ? 'success' : 'primary'}
              variant="outlined"
            />
            <Chip size="small" label={`${backends.length} available`} variant="outlined" />
          </Stack>
        </Stack>

        {/* Backend List */}
        <Stack spacing={compact ? 1 : 2}>
          {backends.map((backend, index) => {
            const isSelected = selectedBackend?.url === backend.url;

            return (
              <Card
                key={backend.url || index}
                variant="outlined"
                sx={{
                  border: isSelected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: theme.shadows[2]
                  }
                }}
              >
                <CardActionArea onClick={() => handleBackendSelect(backend)} sx={{ p: 0 }}>
                  <CardContent sx={{ p: compact ? 1.5 : 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {/* Logo */}
                      <Avatar
                        src={backend.logo}
                        alt={backend.name}
                        sx={{
                          width: compact ? 32 : 40,
                          height: compact ? 32 : 40,
                          bgcolor: theme.palette.primary.main
                        }}
                      >
                        {backend.name.charAt(0)}
                      </Avatar>

                      {/* Backend Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant={compact ? 'body1' : 'h6'} noWrap sx={{ flex: 1 }}>
                            {backend.name}
                          </Typography>
                          {isSelected && (
                            <CheckIcon color="primary" sx={{ fontSize: compact ? 16 : 20 }} />
                          )}
                        </Stack>

                        {!compact && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {backend.description}
                          </Typography>
                        )}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem'
                          }}
                        >
                          {backend.url}
                        </Typography>
                      </Box>

                      {/* Badges */}
                      <Stack spacing={0.5} alignItems="flex-end">
                        {backend.contributor === 'true' && (
                          <Chip
                            size="small"
                            label="Contributor"
                            color="success"
                            variant="outlined"
                            sx={{ fontSize: '0.6rem', height: 20 }}
                          />
                        )}
                        {backend.sponsor_tiers && backend.sponsor_tiers !== '0' && (
                          <Chip
                            size="small"
                            label={`Tier ${backend.sponsor_tiers}`}
                            color="warning"
                            variant="outlined"
                            sx={{ fontSize: '0.6rem', height: 20 }}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>

        {/* Selected Backend Summary */}
        {showSelected && selectedBackend && (
          <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Selected Backend: <strong>{selectedBackend.name}</strong> ({selectedBackend.url})
            </Typography>
          </Box>
        )}

        {/* Directory Info */}
        {!compact && (
          <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Directory: {isLocalDirectory ? 'Local' : 'Remote'} | Source:{' '}
              <code style={{ fontSize: '0.7rem' }}>{directoryUrl}</code>
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
);

BackendSelector.displayName = 'BackendSelector';
