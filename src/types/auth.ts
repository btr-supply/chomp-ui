export interface Web3Challenge {
  challenge_id: string;
  message: string;
  expires_at: string;
}

export type Web3AuthState = 'connect' | 'signing' | 'verifying' | 'error';

export interface Web3AuthProps {
  onSuccess: () => void;
  onBack: () => void;
}

export interface Web3AuthHookResult {
  authState: Web3AuthState;
  error: string | null;
  challenge: Web3Challenge | null;
  handleAuth: (identifier: string, authMethod: string) => Promise<Web3Challenge>;
  handleSign: (
    signature: string,
    challengeId: string,
    identifier: string,
    authMethod: string
  ) => Promise<boolean>;
  handleRetry: () => void;
  setError: (error: string | null) => void;
}
