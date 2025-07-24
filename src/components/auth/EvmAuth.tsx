'use client';

import React, { memo, useState, useEffect } from 'react';
import { Alert, CircularProgress, Stack, Typography, Box, Chip, Grid } from '@mui/material';
import { StyledButton } from '@components/StyledButton';
import { Web3AuthBase } from '@components/Web3AuthBase';
import { Web3AuthProps } from '../../types/auth';

// Lazy loaded wagmi components
let WagmiProvider: any = null;
let createConfig: any = null;
let http: any = null;
let mainnet: any = null;
let useAccount: any = null;
let useConnect: any = null;
let useSignMessage: any = null;
let useConnectors: any = null;
let injected: any = null;

interface EVMWalletInfo {
  name: string;
  icon?: string;
  isAvailable: boolean;
  connector?: any;
  installUrl?: string;
}

const SUPPORTED_EVM_WALLETS = [
  { name: 'Safe', icon: '🔒', installUrl: 'https://safe.global/' },
  { name: 'MetaMask', icon: '🦊', installUrl: 'https://metamask.io/' },
  { name: 'Rabby Wallet', icon: '🐰', installUrl: 'https://rabby.io/' },
  { name: 'Phantom', icon: '👻', installUrl: 'https://phantom.app/' },
  { name: 'Coinbase Wallet', icon: '🔵', installUrl: 'https://wallet.coinbase.com/' },
  { name: 'Trust Wallet', icon: '🛡️', installUrl: 'https://trustwallet.com/' },
  { name: 'Argent', icon: '🔷', installUrl: 'https://argent.xyz/' },
  { name: 'Rainbow', icon: '🌈', installUrl: 'https://rainbow.me/' }
];

const EVMWalletGrid = memo<{
  wallets: EVMWalletInfo[];
  onWalletSelect: (wallet: EVMWalletInfo) => void;
  onInstallWallet: (wallet: EVMWalletInfo) => void;
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

EVMWalletGrid.displayName = 'EVMWalletGrid';

const EvmAuthContent = memo<Web3AuthProps>(({ onSuccess, onBack }) => {
  const { address, isConnected } = useAccount?.() || {};
  const { connect } = useConnect?.() || {};
  const { signMessage } = useSignMessage?.() || {};
  const connectors = useConnectors?.() || [];
  const [walletInfo, setWalletInfo] = useState<EVMWalletInfo[]>([]);

  useEffect(() => {
    // Map available connectors to wallet info
    const walletInfoArray: EVMWalletInfo[] = SUPPORTED_EVM_WALLETS.map(wallet => {
      const connector = connectors.find((c: any) => {
        const connectorName = c.name.toLowerCase();
        const walletName = wallet.name.toLowerCase();
        return (
          connectorName.includes(walletName) ||
          walletName.includes(connectorName) ||
          (walletName.includes('wallet') &&
            connectorName.includes(walletName.replace(' wallet', ''))) ||
          (connectorName.includes('wallet') &&
            walletName.includes(connectorName.replace(' wallet', '')))
        );
      });

      return {
        ...wallet,
        isAvailable: !!connector,
        connector
      };
    });

    setWalletInfo(walletInfoArray);
  }, [connectors]);

  const handleWalletSelect = async (wallet: EVMWalletInfo) => {
    if (wallet.connector) {
      try {
        await connect?.({ connector: wallet.connector });
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const handleInstallWallet = (wallet: EVMWalletInfo) => {
    if (wallet.installUrl) {
      window.open(wallet.installUrl, '_blank');
    }
  };

  return (
    <Web3AuthBase
      title="ethereum wallet authentication"
      subtitle={
        isConnected && address
          ? `connected: ${address.slice(0, 6)}...${address.slice(-4)}`
          : 'select your ethereum wallet to continue'
      }
      signText="please sign the authentication message in your wallet"
      supportText="click to connect available wallets or install new ones"
      authMethod="evm"
      onSign={async challenge => {
        if (!signMessage) throw new Error('Wallet not connected');
        try {
          return await signMessage({ message: challenge.message });
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
          <EVMWalletGrid
            wallets={walletInfo}
            onWalletSelect={handleWalletSelect}
            onInstallWallet={handleInstallWallet}
          />
          {isConnected && (
            <StyledButton
              variant="brand"
              onClick={async () => {
                if (address) {
                  await onConnect(address);
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

EvmAuthContent.displayName = 'EvmAuthContent';

export const EvmAuth = memo<Web3AuthProps>(props => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const loadWagmi = async () => {
      try {
        // Single wagmi import with all needed exports
        const [wagmi, { mainnet: _mainnet }, { injected: _injected }] = await Promise.all([
          import('wagmi'),
          import('wagmi/chains'),
          import('wagmi/connectors')
        ]);

        // Assign to module variables
        const {
          createConfig: _createConfig,
          http: _http,
          WagmiProvider: _WagmiProvider,
          useAccount: _useAccount,
          useConnect: _useConnect,
          useSignMessage: _useSignMessage,
          useConnectors: _useConnectors
        } = wagmi;

        createConfig = _createConfig;
        http = _http;
        mainnet = _mainnet;
        WagmiProvider = _WagmiProvider;
        useAccount = _useAccount;
        useConnect = _useConnect;
        useSignMessage = _useSignMessage;
        useConnectors = _useConnectors;
        injected = _injected;

        // Create wagmi config with EIP-6963 support
        const wagmiConfig = createConfig({
          chains: [mainnet],
          connectors: [
            injected() // This automatically discovers EIP-6963 wallets
          ],
          transports: {
            [mainnet.id]: http()
          }
        });

        setConfig(wagmiConfig);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load wagmi:', err);
        setLoadError('Failed to load Ethereum wallet support');
        setIsLoading(false);
      }
    };

    loadWagmi();
  }, []);

  if (isLoading) {
    return (
      <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          loading ethereum wallet support...
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
    <WagmiProvider config={config}>
      <EvmAuthContent {...props} />
    </WagmiProvider>
  );
});

EvmAuth.displayName = 'EvmAuth';
