'use client';

import { Button, ButtonProps, useTheme, SxProps, Theme } from '@mui/material';
import { forwardRef, ReactNode } from 'react';

interface StyledButtonProps {
  children: ReactNode;
  variant?: 'contained' | 'outlined' | 'text' | 'brand' | 'success' | 'danger';
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: ButtonProps['onClick'];
  href?: string;
  component?: React.ElementType;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  type?: 'button' | 'submit' | 'reset';
}

export const StyledButton = forwardRef<HTMLButtonElement, StyledButtonProps>(
  ({ children, variant = 'contained', loading = false, sx, disabled, ...props }, ref) => {
    const theme = useTheme();

    const getVariantStyles = () => {
      const baseStyles = {
        fontFamily: theme.typography.button.fontFamily,
        textTransform: 'lowercase' as const,
        fontWeight: 500
        // borderRadius now inherited from MUI Button theme overrides
      };

      switch (variant) {
        case 'brand':
          return {
            ...baseStyles,
            bgcolor: theme.palette.brand[500],
            color: theme.palette.dark.bg,
            '&:hover': {
              bgcolor: theme.palette.brand[400]
            },
            '&:active': {
              bgcolor: theme.palette.brand[600]
            }
          };
        case 'success':
          return {
            ...baseStyles,
            bgcolor: theme.palette.status.online,
            color: theme.palette.dark.bg,
            '&:hover': {
              bgcolor: theme.palette.success.dark
            }
          };
        case 'danger':
          return {
            ...baseStyles,
            bgcolor: theme.palette.status.error,
            color: theme.palette.dark.bg,
            '&:hover': {
              bgcolor: theme.palette.error.dark
            }
          };
        case 'outlined':
          return {
            ...baseStyles,
            borderColor: theme.palette.gray[400],
            color: theme.palette.gray[400],
            '&:hover': {
              backgroundColor: theme.palette.brand[500],
              color: theme.palette.dark.bg,
              borderColor: theme.palette.brand[500]
            }
          };
        case 'text':
          return {
            ...baseStyles,
            color: theme.palette.gray[400],
            '&:hover': {
              backgroundColor: theme.palette.brand[500],
              color: theme.palette.dark.bg
            }
          };
        default: // 'contained'
          return baseStyles;
      }
    };

    return (
      <Button
        ref={ref}
        variant={
          variant === 'brand' || variant === 'success' || variant === 'danger'
            ? 'contained'
            : variant
        }
        disabled={disabled || loading}
        sx={{
          ...getVariantStyles(),
          opacity: loading ? 0.7 : undefined,
          ...sx
        }}
        {...props}
      >
        {loading ? 'Loading...' : children}
      </Button>
    );
  }
);

StyledButton.displayName = 'StyledButton';
