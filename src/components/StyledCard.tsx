'use client';

import { Card, CardProps, useTheme } from '@mui/material';
import { forwardRef, ReactNode } from 'react';

interface StyledCardProps extends Omit<CardProps, 'children' | 'variant'> {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'interactive' | 'surface';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const StyledCard = forwardRef<HTMLDivElement, StyledCardProps>(
  ({ children, variant = 'default', padding = 'md', sx, ...props }, ref) => {
    const theme = useTheme();

    const getVariantStyles = () => {
      const baseStyles = {
        bgcolor: theme.palette.dark.surface,
        border: `1px solid ${theme.palette.functional.border}`,
        boxShadow: 'none' // Clean, no shadows (risk project style)
      };

      switch (variant) {
        case 'hover':
          return {
            ...baseStyles,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: theme.palette.functional.borderLight
            }
          };
        case 'interactive':
          return {
            ...baseStyles,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: theme.palette.functional.borderLight,
              backgroundColor: 'rgba(255, 255, 255, 0.03)' // Subtle background change
            },
            '&:active': {
              borderColor: theme.palette.brand[500]
            }
          };
        case 'surface':
          return {
            ...baseStyles,
            bgcolor: theme.palette.dark.bg
          };
        default:
          return baseStyles;
      }
    };

    const getPaddingStyles = () => {
      switch (padding) {
        case 'none':
          return { p: 0 };
        case 'sm':
          return { p: 1 }; // 8px
        case 'lg':
          return { p: 3 }; // 24px
        default: // 'md'
          return { p: 2 }; // 16px - consistent with theme
      }
    };

    return (
      <Card
        ref={ref}
        sx={{
          ...getVariantStyles(),
          ...getPaddingStyles(),
          ...sx
        }}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

StyledCard.displayName = 'StyledCard';
