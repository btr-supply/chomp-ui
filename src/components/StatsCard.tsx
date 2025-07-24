'use client';

import { Typography, Stack } from '@mui/material';
import { ReactNode } from 'react';
import { StyledCard } from './StyledCard';
import { useTheme } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'center';
  trend?: {
    value: string;
    direction: 'up' | 'down';
    icon?: ReactNode;
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  trend
}: StatsCardProps) {
  const theme = useTheme();

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  if (variant === 'center') {
    return (
      <StyledCard sx={{ textAlign: 'center', p: 3 }}>
        <Stack spacing={1}>
          <Typography
            variant="body2"
            color={theme.palette.gray[400]}
            textTransform="uppercase"
            letterSpacing={1}
          >
            {title}
          </Typography>
          <Typography variant="h4" color={theme.palette.gray[400]} fontWeight="bold">
            {formatValue(value)}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color={theme.palette.gray[700]}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </StyledCard>
    );
  }

  // Default variant
  return (
    <StyledCard>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography color={theme.palette.text.secondary} gutterBottom>
            {title}
          </Typography>
          {icon}
        </Stack>

        <Typography variant="h5" component="div" sx={{ mb: 1 }}>
          {formatValue(value)}
        </Typography>

        {trend && (
          <Stack direction="row" alignItems="center" spacing={1}>
            {trend.icon}
            <Typography
              variant="body2"
              color={trend.direction === 'up' ? 'success.main' : 'error.main'}
            >
              {trend.value}
            </Typography>
          </Stack>
        )}

        {subtitle && !trend && (
          <Typography variant="body2" color={theme.palette.gray[400]}>
            {subtitle}
          </Typography>
        )}
      </Stack>
    </StyledCard>
  );
}
