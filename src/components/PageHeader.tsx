'use client';

import { Box, Stack, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, actions, children }: PageHeaderProps) {
  const theme = useTheme();

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: subtitle ? 1 : 0 }}>
            {title}
          </Typography>
          {subtitle && <Typography color={theme.palette.text.secondary}>{subtitle}</Typography>}
        </Box>
        {actions && (
          <Stack direction="row" spacing={1}>
            {actions}
          </Stack>
        )}
      </Stack>
      {children}
    </Stack>
  );
}
