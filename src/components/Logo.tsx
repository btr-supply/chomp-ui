'use client';

import { Box, Typography, Stack } from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material';
import { fonts } from '@constants/theme';
import { memo } from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
  clickable?: boolean;
  showIcon?: boolean;
}

export const Logo = memo<LogoProps>(function Logo({
  variant = 'full',
  size = 'md',
  showSubtitle = false,
  subtitle,
  clickable = false,
  showIcon = false
}) {
  const theme = useTheme();

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { logoSize: 32, fontSize: '1.5rem', spacing: 1 };
      case 'lg':
        return { logoSize: 60, fontSize: '3rem', spacing: 2 };
      default: // 'md'
        return { logoSize: 40, fontSize: '2rem', spacing: 1.5 };
    }
  };

  const { logoSize, fontSize, spacing } = getSizes();

  if (variant === 'icon-only') {
    return (
      <Box
        sx={{
          width: logoSize,
          height: logoSize,
          cursor: clickable ? 'pointer' : 'default'
        }}
      >
        <Image
          src="/images/logo.png"
          alt="Chomp Logo"
          width={logoSize}
          height={logoSize}
          style={{ objectFit: 'contain' }}
        />
      </Box>
    );
  }

  if (variant === 'compact') {
    return (
      <Typography
        variant="h4"
        sx={{
          fontFamily: fonts.logo,
          fontSize,
          color: theme.palette.brand[500],
          textTransform: 'lowercase',
          fontWeight: 'normal',
          cursor: clickable ? 'pointer' : 'default',
          margin: 0,
          marginBottom: '0 !important',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        chomp
      </Typography>
    );
  }

  // Full variant - wordmark by default, with optional icon
  return (
    <Stack spacing={showSubtitle ? 2 : 1.5} alignItems="center" textAlign="center">
      <Stack
        direction="row"
        spacing={spacing}
        alignItems="center"
        sx={{ cursor: clickable ? 'pointer' : 'default' }}
      >
        {showIcon && (
          <Box
            sx={{
              width: logoSize,
              height: logoSize,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Chomp Logo"
              fill
              sizes={`${logoSize}px`}
              style={{ objectFit: 'contain' }}
            />
          </Box>
        )}
        <Typography
          variant="h4"
          sx={{
            fontFamily: fonts.logo,
            fontSize,
            color: theme.palette.brand[500],
            textTransform: 'lowercase',
            fontWeight: 'normal',
            lineHeight: 1,
            margin: 0, // Remove default margins
            marginBottom: '0 !important', // Override theme's marginBottom !important
            display: 'flex',
            alignItems: 'center'
          }}
        >
          chomp
        </Typography>
      </Stack>
      {showSubtitle && subtitle && (
        <Typography variant="caption" color={theme.palette.gray[700]}>
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
});
