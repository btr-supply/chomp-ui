'use client';

import { Chip, ChipProps, useTheme } from '@mui/material';
import { forwardRef, ReactNode } from 'react';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

export type StatusType =
  | 'online'
  | 'offline'
  | 'warning'
  | 'error'
  | 'info'
  | 'success'
  | 'pending';

interface StatusChipProps extends Omit<ChipProps, 'label' | 'color' | 'icon'> {
  status: StatusType;
  label?: ReactNode;
  showIcon?: boolean;
  variant?: 'filled' | 'outlined';
}

export const StatusChip = forwardRef<HTMLDivElement, StatusChipProps>(
  ({ status, label, showIcon = true, variant = 'filled', sx, ...props }, ref) => {
    const theme = useTheme();

    const getStatusConfig = () => {
      switch (status) {
        case 'online':
        case 'success':
          return {
            color: 'success' as const,
            icon: showIcon ? <CheckCircleIcon /> : undefined,
            displayLabel: label || status
          };
        case 'offline':
        case 'error':
          return {
            color: 'error' as const,
            icon: showIcon ? <ErrorIcon /> : undefined,
            displayLabel: label || status
          };
        case 'warning':
          return {
            color: 'warning' as const,
            icon: showIcon ? <WarningIcon /> : undefined,
            displayLabel: label || status
          };
        case 'info':
          return {
            color: 'info' as const,
            icon: showIcon ? <InfoIcon /> : undefined,
            displayLabel: label || status
          };
        case 'pending':
          return {
            color: 'default' as const,
            icon: showIcon ? <CircleIcon /> : undefined,
            displayLabel: label || status
          };
        default:
          return {
            color: 'default' as const,
            icon: showIcon ? <CircleIcon /> : undefined,
            displayLabel: label || status
          };
      }
    };

    const config = getStatusConfig();

    return (
      <Chip
        ref={ref}
        label={config.displayLabel}
        color={config.color}
        icon={config.icon}
        variant={variant}
        size="small"
        sx={{
          textTransform: 'lowercase',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          fontFamily: theme.typography.fontFamily,
          borderRadius: '12px',
          ...sx
        }}
        {...props}
      />
    );
  }
);

StatusChip.displayName = 'StatusChip';
