'use client';

import React, { memo, useState, useEffect } from 'react';
import { Alert, CircularProgress, Stack, Typography, Box, Chip, Grid } from '@mui/material';
import { StyledButton } from '@components/StyledButton';
import { Web3AuthBase } from '@components/Web3AuthBase';
import { Web3AuthProps } from '../../types/auth';

// Lazy loaded Solana components
let ConnectionProvider: any = null;
let WalletProvider: any = null;
let WalletModalProvider: any = null;
// let _useConnection: any = null; // Unused
let useWallet: any = null;
let clusterApiUrl: any = null;
// Individual wallet adapters no longer needed - using wallet-adapter-wallets package

interface WalletInfo {
  adapter: any;
  name: string;
  icon?: string;
  isAvailable: boolean;
  readyState: string;
  installUrl?: string;
}

const SUPPORTED_SVM_WALLETS = [
  { name: 'Phantom', icon: '👻', installUrl: 'https://phantom.app/' },
  { name: 'Solflare', icon: '☀️', installUrl: 'https://solflare.com/' },
  { name: 'Coinbase Wallet', icon: '🔵', installUrl: 'https://wallet.coinbase.com/' },
  { name: 'Backpack', icon: '🎒', installUrl: 'https://backpack.app/' },
  { name: 'Trust Wallet', icon: '🛡️', installUrl: 'https://trustwallet.com/' },
  { name: 'Ledger', icon: '🔐', installUrl: 'https://www.ledger.com/' },
  { name: 'Trezor', icon: '🏦', installUrl: 'https://trezor.io/' }
];

const WalletGrid = memo<{
  wallets: WalletInfo[];
  onWalletSelect: (wallet: WalletInfo) => void;
  onInstallWallet: (wallet: WalletInfo) => void;
}>(({ wallets, onWalletSelect, onInstallWallet }) => (
  <Grid container spacing={2}>
    {wallets.map((wallet, index) => (
      <Grid key={index} size={{ xs: 6, sm: 4 }}>
        <Box
          onClick={() => (wallet.isAvailable ? onWalletSelect(wallet) : onInstallWallet(wallet))}
          sx={{
            p: 2,
            border: 1,
            borderColor: wallet.isAvailable ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            cursor: 'pointer',
            opacity: wallet.isAvailable ? 1 : 0.6,
            textAlign: 'center',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: wallet.isAvailable ? 'primary.dark' : 'grey.400',
              transform: 'translateY(-2px)',
              boxShadow: 2
            }
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

WalletGrid.displayName = 'WalletGrid';

const SvmAuthContent = memo<Web3AuthProps>(({ onSuccess, onBack }) => {
  const { publicKey, connected, connect, select, signMessage } = useWallet?.() || {};

  const handleWalletSelect = async (wallet: WalletInfo) => {
    try {
      select?.(wallet.adapter.name);
      await connect?.();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleInstallWallet = (wallet: WalletInfo) => {
    if (wallet.installUrl) {
      window.open(wallet.installUrl, '_blank');
    }
  };

  return (
    <Web3AuthBase
      title="solana wallet authentication"
      subtitle={
        connected && publicKey
          ? `connected: ${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`
          : 'select your solana wallet to continue'
      }
      signText="please sign the authentication message in your wallet"
      supportText="click to connect available wallets or install new ones"
      authMethod="svm"
      onSign={async challenge => {
        if (!signMessage) throw new Error('Wallet not connected');
        try {
          const encodedMessage = new TextEncoder().encode(challenge.message);
          const signature = await signMessage(encodedMessage);
          return Array.from(signature as Uint8Array)
            .map((b: number) => b.toString(16).padStart(2, '0'))
            .join('');
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
          <WalletGrid
            wallets={[]}
            onWalletSelect={handleWalletSelect}
            onInstallWallet={handleInstallWallet}
          />
          {connected && (
            <StyledButton
              variant="brand"
              onClick={async () => {
                if (publicKey) {
                  await onConnect(publicKey.toString());
                }
              }}
              fullWidth
            >
              sign authentication message
            </StyledButton>
          )}
        </Stack>
      )}
    </Web3AuthBase>
  );
});

SvmAuthContent.displayName = 'SvmAuthContent';

export const SvmAuth = memo<Web3AuthProps>(props => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo[]>([]);

  useEffect(() => {
    const loadSolana = async () => {
      try {
        const [
          { ConnectionProvider: _ConnectionProvider, WalletProvider: _WalletProvider },
          { WalletModalProvider: _WalletModalProvider },
          { useWallet: _useWallet },
          { clusterApiUrl: _clusterApiUrl },
          walletAdapters,
          { BackpackWalletAdapter }
        ] = await Promise.all([
          import('@solana/wallet-adapter-react'),
          import('@solana/wallet-adapter-react-ui'),
          import('@solana/wallet-adapter-react'),
          import('@solana/web3.js'),
          import('@solana/wallet-adapter-wallets'),
          import('@solana/wallet-adapter-backpack')
        ]);

        ConnectionProvider = _ConnectionProvider;
        WalletProvider = _WalletProvider;
        WalletModalProvider = _WalletModalProvider;
        useWallet = _useWallet;
        clusterApiUrl = _clusterApiUrl;

        // Create all wallet adapter instances
        const walletAdapterInstances = [
          new walletAdapters.PhantomWalletAdapter(),
          new walletAdapters.SolflareWalletAdapter(),
          new walletAdapters.CoinbaseWalletAdapter(),
          new BackpackWalletAdapter(),
          new walletAdapters.TrustWalletAdapter(),
          new walletAdapters.NightlyWalletAdapter(),
          new walletAdapters.LedgerWalletAdapter(),
          new walletAdapters.TrezorWalletAdapter()
        ].filter(Boolean);

        // Create wallet info with availability status and install URLs
        const walletInfoArray: WalletInfo[] = SUPPORTED_SVM_WALLETS.map(supportedWallet => {
          const adapter = walletAdapterInstances.find(adapter => {
            const adapterName = adapter.name.toLowerCase();
            const supportedName = supportedWallet.name.toLowerCase();
            return adapterName.includes(supportedName) || supportedName.includes(adapterName);
          });

          return {
            adapter: adapter || null,
            name: supportedWallet.name,
            icon: supportedWallet.icon,
            isAvailable: adapter
              ? adapter.readyState === 'Installed' || adapter.readyState === 'Loadable'
              : false,
            readyState: adapter?.readyState || 'NotDetected',
            installUrl: supportedWallet.installUrl
          };
        });

        setWallets(walletAdapterInstances);
        setWalletInfo(walletInfoArray);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load Solana:', err);
        setLoadError('Failed to load Solana wallet support');
        setIsLoading(false);
      }
    };

    loadSolana();
  }, []);

  if (isLoading) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          loading solana wallet support...
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

  const endpoint = clusterApiUrl('mainnet-beta');

  // Create a modified SvmAuthContent that receives wallet info
  const SvmAuthContentWithWallets = memo<Web3AuthProps>(contentProps => {
    const { publicKey, connected, connect, select, signMessage } = useWallet?.() || {};

    const handleWalletSelect = async (wallet: WalletInfo) => {
      if (wallet.adapter) {
        try {
          select?.(wallet.adapter.name);
          await connect?.();
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      }
    };

    const handleInstallWallet = (wallet: WalletInfo) => {
      if (wallet.installUrl) {
        window.open(wallet.installUrl, '_blank');
      }
    };

    return (
      <Web3AuthBase
        title="solana wallet authentication"
        subtitle={
          connected && publicKey
            ? `connected: ${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`
            : 'select your solana wallet to continue'
        }
        signText="please sign the authentication message in your wallet"
        supportText="click to connect available wallets or install new ones"
        authMethod="svm"
        onSign={async challenge => {
          if (!signMessage) throw new Error('Wallet not connected');
          try {
            const encodedMessage = new TextEncoder().encode(challenge.message);
            const signature = await signMessage(encodedMessage);
            return Array.from(signature as Uint8Array)
              .map((b: number) => b.toString(16).padStart(2, '0'))
              .join('');
          } catch (err: any) {
            if (err?.code === 4001) {
              throw new Error('Signature request was rejected by user');
            }
            throw err;
          }
        }}
        onSuccess={contentProps.onSuccess}
        onBack={contentProps.onBack}
      >
        {({ onConnect }) => (
          <Stack spacing={3}>
            <WalletGrid
              wallets={walletInfo}
              onWalletSelect={handleWalletSelect}
              onInstallWallet={handleInstallWallet}
            />
            {connected && (
              <StyledButton
                variant="brand"
                onClick={async () => {
                  if (publicKey) {
                    await onConnect(publicKey.toString());
                  }
                }}
                fullWidth
              >
                sign authentication message
              </StyledButton>
            )}
          </Stack>
        )}
      </Web3AuthBase>
    );
  });

  SvmAuthContentWithWallets.displayName = 'SvmAuthContentWithWallets';

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SvmAuthContentWithWallets {...props} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
});

SvmAuth.displayName = 'SvmAuth';
