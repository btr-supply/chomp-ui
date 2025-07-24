import React, { memo } from 'react';
import { Box, Stack, Button, Typography, Tooltip, Divider, Alert, useTheme } from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  GitHub as GitHubIcon,
  X as TwitterIcon,
  Key as StaticTokenIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useDeploymentConfig } from '../hooks/useDirectory';

interface AuthMethodsProps {
  onAuthMethodSelect: (method: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

interface AuthMethodConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requiresOAuth2: boolean;
  enabled: boolean;
}

export const AuthMethods = memo<AuthMethodsProps>(
  ({ onAuthMethodSelect, disabled = false, compact = false }) => {
    const theme = useTheme();
    const { isGeneric, supportsOAuth2, deploymentType } = useDeploymentConfig();

    // Define authentication methods with their configurations
    const authMethods: AuthMethodConfig[] = [
      {
        id: 'evm',
        name: 'Ethereum Wallet',
        description: 'Connect with MetaMask, WalletConnect, or any EVM wallet',
        icon: <WalletIcon />,
        color: theme.palette.primary.main,
        requiresOAuth2: false,
        enabled: true
      },
      {
        id: 'svm',
        name: 'Solana Wallet',
        description: 'Connect with Phantom, Solflare, or any Solana wallet',
        icon: <WalletIcon />,
        color: '#9945FF',
        requiresOAuth2: false,
        enabled: true
      },
      {
        id: 'sui',
        name: 'Sui Wallet',
        description: 'Connect with Sui Wallet or any Sui-compatible wallet',
        icon: <WalletIcon />,
        color: '#4DA2FF',
        requiresOAuth2: false,
        enabled: true
      },
      {
        id: 'oauth2_github',
        name: 'GitHub',
        description: 'Sign in with your GitHub account',
        icon: <GitHubIcon />,
        color: '#333',
        requiresOAuth2: true,
        enabled: supportsOAuth2
      },
      {
        id: 'oauth2_x',
        name: 'X (Twitter)',
        description: 'Sign in with your X account',
        icon: <TwitterIcon />,
        color: '#1DA1F2',
        requiresOAuth2: true,
        enabled: supportsOAuth2
      },
      {
        id: 'static',
        name: 'Static Token',
        description: 'Use a pre-configured authentication token',
        icon: <StaticTokenIcon />,
        color: theme.palette.grey[600],
        requiresOAuth2: false,
        enabled: true
      }
    ];

    const enabledMethods = authMethods.filter(method => method.enabled);
    const disabledMethods = authMethods.filter(method => !method.enabled);

    const handleMethodClick = (methodId: string, isEnabled: boolean) => {
      if (!disabled && isEnabled) {
        onAuthMethodSelect(methodId);
      }
    };

    const renderAuthButton = (method: AuthMethodConfig, isDisabled: boolean = false) => {
      const buttonDisabled = disabled || isDisabled;

      const button = (
        <Button
          key={method.id}
          variant="outlined"
          fullWidth
          size={compact ? 'medium' : 'large'}
          disabled={buttonDisabled}
          onClick={() => handleMethodClick(method.id, !isDisabled)}
          startIcon={method.icon}
          sx={{
            py: compact ? 1 : 1.5,
            px: 2,
            borderColor: isDisabled ? theme.palette.grey[300] : method.color,
            color: isDisabled ? theme.palette.grey[400] : method.color,
            backgroundColor: isDisabled ? theme.palette.grey[50] : 'transparent',
            '&:hover': {
              borderColor: isDisabled ? theme.palette.grey[300] : method.color,
              backgroundColor: isDisabled ? theme.palette.grey[50] : `${method.color}08`
            },
            '&.Mui-disabled': {
              opacity: 0.5,
              cursor: 'not-allowed'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Box sx={{ textAlign: 'left', flex: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {method.name}
            </Typography>
            {!compact && (
              <Typography variant="caption" color="text.secondary" display="block">
                {method.description}
              </Typography>
            )}
          </Box>
        </Button>
      );

      // Wrap disabled OAuth2 methods with tooltip
      if (isDisabled && method.requiresOAuth2) {
        return (
          <Tooltip
            key={method.id}
            title={`OAuth2 authentication is not available on generic deployments (${deploymentType}). Use hosted deployments for OAuth2 support.`}
            arrow
          >
            <span>{button}</span>
          </Tooltip>
        );
      }

      return button;
    };

    return (
      <Box>
        {/* Generic deployment notice */}
        {isGeneric && (
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
            <Typography variant="body2">
              You&apos;re using the generic Chomp frontend. OAuth2 authentication methods are
              disabled. Use Web3 wallets or static tokens for authentication.
            </Typography>
          </Alert>
        )}

        {/* Available authentication methods */}
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom>
            Choose Authentication Method
          </Typography>

          {enabledMethods.map(method => renderAuthButton(method, false))}

          {/* Show disabled methods if any */}
          {disabledMethods.length > 0 && (
            <>
              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Unavailable Methods
                </Typography>
              </Divider>

              {disabledMethods.map(method => renderAuthButton(method, true))}
            </>
          )}
        </Stack>

        {/* Deployment info */}
        {!compact && (
          <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Deployment Type: <strong>{deploymentType}</strong> | OAuth2 Support:{' '}
              <strong>{supportsOAuth2 ? 'Enabled' : 'Disabled'}</strong>
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
);

AuthMethods.displayName = 'AuthMethods';
