'use client';

import { Box, Stack, Typography, Link, Container, Card, Toolbar, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { pingService, PingStatus } from '@services/ping';
import { Logo } from './Logo';
import { PulseBeacon } from './PulseBeacon';

export function Footer() {
  const [pingStatus, setPingStatus] = useState<PingStatus | null>(null);
  const theme = useTheme();

  useEffect(() => {
    // Start monitoring ping status
    pingService.startMonitoring(10000); // Every 10 seconds

    // Subscribe to ping updates
    const unsubscribe = pingService.subscribe((status: PingStatus) => {
      setPingStatus(status);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      pingService.stopMonitoring();
    };
  }, []);

  const formatPingTime = (responseTime: number): string => {
    if (responseTime === -1) {
      return 'offline';
    }
    return `${responseTime}ms`;
  };

  const getPingStatus = (status: PingStatus | null): 'good' | 'medium' | 'slow' | 'offline' => {
    if (!status || status.responseTime === -1) {
      return 'offline';
    }
    return status.status;
  };

  const getPingColor = (status: PingStatus | null): string => {
    if (!status || status.responseTime === -1) {
      return '#E53E3E'; // Red for offline
    }
    return status.color;
  };

  const currentYear = new Date().getFullYear();

  return (
    <Container maxWidth="lg" sx={{ mt: 'auto', py: 0.75 }}>
      {' '}
      {/* Reduced from 1 (8px) to 0.75 (6px) */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          // Override theme Card padding to exactly 6px
          padding: '6px 18px !important'
        }}
      >
        <Toolbar
          sx={{
            minHeight: '56px !important',
            padding: '0 !important', // Remove Toolbar padding, Card handles it
            display: 'flex',
            alignItems: 'center', // Vertical alignment for all content
            justifyContent: 'space-between'
          }}
        >
          {/* Left side - API Status with pulsing beacon (moved from right) */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Pulsing beacon using the new PulseBeacon component */}
            <PulseBeacon
              status={pingStatus ? getPingStatus(pingStatus) : undefined}
              color={getPingColor(pingStatus)}
              size="md"
              duration={3}
            />
            <Typography
              variant="body2"
              sx={{
                color: getPingColor(pingStatus),
                fontFamily: `var(--font-ibm-plex-mono), SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              {pingStatus ? formatPingTime(pingStatus.responseTime) : 'connecting...'}
            </Typography>
          </Stack>

          {/* Center - Source code link with matching nav link style */}
          <Link
            href="https://github.com/btr-supply/chomp"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
              color: theme.palette.gray[600], // Darker grey than before
              fontSize: '1.4rem' // Match header nav links size
            }}
          >
            see source code
          </Link>

          {/* Right side - Copyright and Logo (inverted order: copyright first, then logo) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              © {currentYear}
            </Typography>
            <Logo variant="compact" size="md" />
          </Box>
        </Toolbar>
      </Card>
    </Container>
  );
}
