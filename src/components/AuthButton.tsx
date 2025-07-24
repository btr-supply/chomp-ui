import React, { memo } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';

interface AuthButtonProps {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export const AuthButton = memo<AuthButtonProps>(
  ({ id: _id, title, subtitle, icon, color, disabled = false, loading = false, onClick }) => {
    const theme = useTheme();
    const buttonColor = color || theme.palette.primary.main;

    return (
      <Button
        fullWidth
        size="large"
        variant="outlined"
        disabled={disabled || loading}
        onClick={onClick}
        startIcon={icon}
        sx={{
          py: 2,
          px: 3,
          borderColor: disabled ? theme.palette.grey[300] : buttonColor,
          color: disabled ? theme.palette.grey[400] : buttonColor,
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: disabled ? theme.palette.grey[300] : buttonColor,
            backgroundColor: disabled ? theme.palette.grey[50] : `${buttonColor}08`
          },
          '&.Mui-disabled': {
            opacity: 0.5,
            cursor: 'not-allowed'
          },
          transition: 'all 0.2s ease-in-out',
          textTransform: 'none',
          justifyContent: 'flex-start'
        }}
      >
        <Box sx={{ textAlign: 'left', flex: 1 }}>
          <Typography variant="body1" fontWeight="medium">
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {subtitle}
          </Typography>
        </Box>
      </Button>
    );
  }
);

AuthButton.displayName = 'AuthButton';
