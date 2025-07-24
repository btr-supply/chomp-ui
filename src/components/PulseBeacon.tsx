'use client';

import { Box, keyframes, useTheme } from '@mui/material';
import { memo, useMemo } from 'react';

// Create the pulsing keyframes animation
const createPulseAnimation = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color}CC;
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 0 ${color}CC;
  }
  85% {
    box-shadow: 0 0 0 0.6rem ${color}00;
    transform: scale(1);
  }
  100% {
    box-shadow: 0 0 0 0 ${color}00;
    transform: scale(1);
  }
`;

// Define size variants following the project's size conventions
const sizeVariants = {
  sm: { width: 6, height: 6 }, // Small variant
  md: { width: 8, height: 8 }, // Medium (default)
  lg: { width: 12, height: 12 }, // Large variant
  xl: { width: 16, height: 16 } // Extra large variant
} as const;

// Define status-based color mapping using theme colors
type PulseStatus =
  | 'good'
  | 'medium'
  | 'slow'
  | 'offline'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';
type PulseSize = keyof typeof sizeVariants;

interface PulseBeaconProps {
  status?: PulseStatus;
  color?: string; // Override color
  size?: PulseSize;
  disabled?: boolean; // Disable animation
  duration?: number; // Animation duration in seconds
}

export const PulseBeacon = memo<PulseBeaconProps>(
  ({ status = 'good', color, size = 'md', disabled = false, duration = 3 }) => {
    const theme = useTheme();

    // Memoize color resolution based on status or custom color
    const resolvedColor = useMemo(() => {
      if (color) return color;

      // Map status to theme colors
      switch (status) {
        case 'good':
          return theme.palette.status.ping.good;
        case 'medium':
          return theme.palette.status.ping.medium;
        case 'slow':
          return theme.palette.status.ping.slow;
        case 'offline':
          return theme.palette.status.offline;
        case 'primary':
          return theme.palette.brand[500];
        case 'secondary':
          return theme.palette.gray[500];
        case 'success':
          return theme.palette.success.main;
        case 'error':
          return theme.palette.error.main;
        case 'warning':
          return theme.palette.warning.main;
        case 'info':
          return theme.palette.info.main;
        default:
          return theme.palette.status.ping.good;
      }
    }, [status, color, theme]);

    // Memoize the pulse animation
    const pulseAnimation = useMemo(() => createPulseAnimation(resolvedColor), [resolvedColor]);

    // Get size configuration
    const sizeConfig = sizeVariants[size];

    return (
      <Box
        sx={{
          width: sizeConfig.width,
          height: sizeConfig.height,
          borderRadius: '50%',
          backgroundColor: resolvedColor,
          flexShrink: 0, // Prevent shrinking in flex containers
          ...(disabled
            ? {}
            : {
                animation: `${pulseAnimation} ${duration}s infinite`
              })
        }}
      />
    );
  }
);

PulseBeacon.displayName = 'PulseBeacon';
