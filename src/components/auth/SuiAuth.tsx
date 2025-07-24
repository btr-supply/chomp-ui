'use client';

import React, { memo, useState, useEffect } from 'react';
import { Alert, CircularProgress, Stack, Typography, Box, Chip, Grid } from '@mui/material';
import { StyledButton } from '@components/StyledButton';
import { Web3AuthBase } from '@components/Web3AuthBase';
import { Web3AuthProps } from '../../types/auth';

// Lazy loaded Sui components
let SuiClientProvider: any = null;
let WalletProvider: any = null;
let useCurrentAccount: any = null;
let useSignPersonalMessage: any = null;
let useConnectWallet: any = null;
let useWallets: any = null;
let getFullnodeUrl: any = null;

interface SuiWalletInfo {
  name: string;
  icon?: string;
  isAvailable: boolean;
  wallet?: any;
  installUrl?: string;
}

const SUPPORTED_SUI_WALLETS = [
  {
    name: 'Slush',
    icon: '🧊',
    installUrl: 'https://slush.so/'
  },
  {
    name: 'Phantom',
    icon: '👻',
    installUrl: 'https://phantom.app/'
  },
  {
    name: 'Suiet',
    icon: '🟣',
    installUrl: 'https://suiet.app/'
  },
  {
    name: 'Backpack',
    icon: '🎒',
    installUrl: 'https://backpack.app/'
  },
  {
    name: 'Nightly',
    icon: '🌙',
    installUrl: 'https://nightly.app/'
  },
  {
    name: 'Surf',
    icon: '🏄',
    installUrl: 'https://surf.tech/'
  }
];

const SuiWalletGrid = memo<{
  wallets: SuiWalletInfo[];
  onWalletSelect: (wallet: SuiWalletInfo) => void;
  onInstallWallet: (wallet: SuiWalletInfo) => void;
  isConnecting?: boolean;
}>(({ wallets, onWalletSelect, onInstallWallet, isConnecting }) => (
  <Grid container spacing={2}>
    {wallets.map((wallet, index) => (
      <Grid key={index} size={{ xs: 6, sm: 4 }}>
        <Box
          onClick={() => {
            if (isConnecting) return;
            if (wallet.isAvailable) {
              onWalletSelect(wallet);
            } else {
              onInstallWallet(wallet);
            }
          }}
          sx={{
            p: 2,
            border: 1,
            borderColor: wallet.isAvailable ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            cursor: isConnecting ? 'wait' : 'pointer',
            opacity: wallet.isAvailable ? 1 : 0.5,
            textAlign: 'center',
            transition: 'all 0.2s',
            '&:hover': !isConnecting
              ? {
                  borderColor: wallet.isAvailable ? 'primary.dark' : 'grey.400',
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              : {}
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '1.5rem', mb: 1 }}>
            {wallet.icon}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            {wallet.name}
          </Typography>
          <Chip
            label={wallet.isAvailable ? 'Available' : 'Install'}
            size="small"
            color={wallet.isAvailable ? 'primary' : 'default'}
            variant={wallet.isAvailable ? 'filled' : 'outlined'}
          />
        </Box>
      </Grid>
    ))}
  </Grid>
));

SuiWalletGrid.displayName = 'SuiWalletGrid';

const SuiAuthContent = memo<Web3AuthProps>(({ onSuccess, onBack }) => {
  const currentAccount = useCurrentAccount?.();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage?.() || {};
  const { mutateAsync: connectWallet } = useConnectWallet?.() || {};
  const wallets = useWallets?.() || [];
  const [walletInfo, setWalletInfo] = useState<SuiWalletInfo[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Map available wallets to wallet info
    const walletInfoArray: SuiWalletInfo[] = SUPPORTED_SUI_WALLETS.map(supportedWallet => {
      const availableWallet = wallets.find(
        (w: any) =>
          w.name.toLowerCase().includes(supportedWallet.name.toLowerCase()) ||
          supportedWallet.name.toLowerCase().includes(w.name.toLowerCase())
      );

      return {
        ...supportedWallet,
        isAvailable: !!availableWallet,
        wallet: availableWallet
      };
    });

    setWalletInfo(walletInfoArray);
  }, [wallets]);

  const handleWalletSelect = async (wallet: SuiWalletInfo) => {
    if (wallet.wallet && connectWallet) {
      try {
        setIsConnecting(true);
        await connectWallet({ wallet: wallet.wallet });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleInstallWallet = (wallet: SuiWalletInfo) => {
    if (wallet.installUrl) {
      window.open(wallet.installUrl, '_blank');
    }
  };

  return (
    <Web3AuthBase
      title="sui wallet authentication"
      subtitle={
        currentAccount
          ? `connected: ${currentAccount.address.slice(0, 8)}...${currentAccount.address.slice(-8)}`
          : 'select your sui wallet to continue'
      }
      signText="please sign the authentication message in your wallet"
      supportText="click to connect available wallets or install new ones"
      authMethod="sui"
      onSign={async challenge => {
        if (!signPersonalMessage) throw new Error('Wallet not connected');
        try {
          const result = await signPersonalMessage({
            message: new TextEncoder().encode(challenge.message)
          });
          return result.signature;
        } catch (err: any) {
          if (err?.code === 4001) {
            throw new Error('Signature request was rejected by user');
          }
          throw err;
        }
      }}
      onSuccess={onSuccess}
      onBack={onBack}
    >
      {({ onConnect }) => (
        <Stack spacing={3}>
          <SuiWalletGrid
            wallets={walletInfo}
            onWalletSelect={handleWalletSelect}
            onInstallWallet={handleInstallWallet}
            isConnecting={isConnecting}
          />

          {currentAccount && (
            <StyledButton
              variant="brand"
              onClick={async () => {
                await onConnect(currentAccount.address);
              }}
              fullWidth
            >
              sign authentication message
            </StyledButton>
          )}

          {!currentAccount && walletInfo.some(w => w.isAvailable) && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {isConnecting ? 'Connecting...' : 'Select a wallet above to connect'}
            </Typography>
          )}

          {!currentAccount && !walletInfo.some(w => w.isAvailable) && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              No Sui wallets detected. Please install one of the supported wallets above.
            </Typography>
          )}
        </Stack>
      )}
    </Web3AuthBase>
  );
});

SuiAuthContent.displayName = 'SuiAuthContent';

export const SuiAuth = memo<Web3AuthProps>(props => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadSui = async () => {
      try {
        // Dynamically import Sui dependencies with proper error handling
        const [dappKit, { getFullnodeUrl: _getFullnodeUrl }] = await Promise.all([
          import('@mysten/dapp-kit'),
          import('@mysten/sui/client')
        ]);

        // Extract all needed components from dapp-kit
        const {
          SuiClientProvider: _SuiClientProvider,
          WalletProvider: _WalletProvider,
          useCurrentAccount: _useCurrentAccount,
          useSignPersonalMessage: _useSignPersonalMessage,
          useConnectWallet: _useConnectWallet,
          useWallets: _useWallets
        } = dappKit;

        // Assign to module variables
        SuiClientProvider = _SuiClientProvider;
        WalletProvider = _WalletProvider;
        useCurrentAccount = _useCurrentAccount;
        useSignPersonalMessage = _useSignPersonalMessage;
        useConnectWallet = _useConnectWallet;
        useWallets = _useWallets;
        getFullnodeUrl = _getFullnodeUrl;

        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load Sui:', err);
        setLoadError(
          'Failed to load Sui wallet support. Please ensure @mysten/dapp-kit is installed.'
        );
        setIsLoading(false);
      }
    };

    loadSui();
  }, []);

  if (isLoading) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          loading sui wallet support...
        </Typography>
      </Stack>
    );
  }

  if (loadError) {
    return (
      <Stack spacing={3}>
        <Alert severity="error">{loadError}</Alert>
        <StyledButton onClick={props.onBack}>back to authentication methods</StyledButton>
      </Stack>
    );
  }

  return (
    <SuiClientProvider
      networks={{ mainnet: { url: getFullnodeUrl('mainnet') } }}
      defaultNetwork="mainnet"
    >
      <WalletProvider>
        <SuiAuthContent {...props} />
      </WalletProvider>
    </SuiClientProvider>
  );
});

SuiAuth.displayName = 'SuiAuth';
