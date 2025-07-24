# Login Page Specification

This document specifies the design and functionality of the backend-independent login page that dynamically adapts to any Chomp backend's authentication methods while intelligently handling OAuth2 limitations on cho.mp.

## 1. Overview

The login page provides a **dynamic authentication interface** that fetches available authentication methods from the selected Chomp backend and presents only compatible authentication options. The page intelligently handles OAuth2 limitations when running on https://cho.mp, embodying Chomp's universal frontend architecture.

## 2. Associated Route

- `/login` (requires backend selection)
- `/login?backend={backend-url}` (with backend context)

## 3. Purpose

- **Backend-Independent Authentication**: Support any Chomp backend's authentication configuration
- **Dynamic Method Discovery**: Fetch available auth methods from backend's ServerConfig
- **OAuth2 Compatibility Detection**: Intelligently handle OAuth2 limitations on cho.mp
- **Secure Token Management**: Handle JWT tokens per backend instance with proper isolation
- **Seamless Integration**: Redirect to protected admin routes after successful authentication
- **Universal Access**: Enable authentication with any Chomp deployment

## 4. Prerequisites

**Backend Selection Required**: Users must have selected a backend instance from `/directory` before accessing this page. If no backend is selected, users are automatically redirected to the backend selection page with login intent.

## 5. Data Sources (API Endpoints)

### Authentication Discovery & Flow

Based on the unified authentication system documented in auth.mdx and api.mdx:

- **Method Discovery**: `GET ${selectedBackendUrl}/auth/methods` - Get available authentication methods
- **Challenge Creation**: `POST ${selectedBackendUrl}/auth/challenge` - Create Web3 signing challenges
- **Direct Authentication**: `POST ${selectedBackendUrl}/auth/direct` - Submit static tokens or OAuth2 codes
- **Challenge Verification**: `POST ${selectedBackendUrl}/auth/verify` - Verify Web3 signatures
- **Session Status**: `GET ${selectedBackendUrl}/auth/status` - Check existing authentication
- **OAuth2 Flows**: `GET ${selectedBackendUrl}/auth/{provider}/login` - OAuth2 authorization URLs (hosted deployments only)

## 6. OAuth2 Compatibility Limitation

### The OAuth2 Problem on cho.mp

**OAuth2 CANNOT work on https://cho.mp** due to fundamental callback URL requirements:

#### Why OAuth2 Fails on cho.mp
1. **OAuth2 providers** (GitHub, Twitter/X) require **deterministic callback URLs** to be pre-registered
2. **cho.mp connects to arbitrary backends** - users can choose any backend URL dynamically
3. **OAuth2 flow requires**:
   - Provider redirects user to: `${BACKEND_URL}/auth/{provider}/callback`
   - Provider must know this exact URL in advance during app registration
   - cho.mp cannot predict which backend the user will choose
4. **Security constraint**: OAuth2 providers validate callback URLs for security

#### OAuth2 Requirements
- **Frontend URL**: Must be known by OAuth2 provider (for CORS)
- **Backend URL**: Must be registered as callback URL with provider
- **Domain Relationship**: Frontend and backend often need same/related domains
- **Pre-registration**: All callback URLs must be pre-configured with providers

#### When OAuth2 Works
- **Hosted Deployments**: When frontend and backend have predictable, fixed URLs
- **Same Domain**: When frontend and backend are on related domains
- **Pre-configured**: When OAuth2 callback URLs are pre-registered with providers
- **Enterprise**: When organization controls both frontend and backend URLs

### OAuth2 Method Detection & Handling

When the frontend detects OAuth2 methods from backend:

#### On cho.mp (https://cho.mp)
- **Grey out OAuth2 buttons**: Visual indication they're unavailable with disabled state
- **Show explanation tooltip**: "OAuth2 not available on cho.mp - use hosted deployment"
- **Alternative methods**: Prominently display available methods (static, Web3)
- **Educational modal**: Detailed explanation of OAuth2 limitations and alternatives

#### On Hosted Deployments
- **Full OAuth2 support**: Normal OAuth2 flows work as expected
- **Provider buttons**: Active GitHub, Twitter/X authentication
- **Callback handling**: Standard OAuth2 authorization code flow
- **Seamless experience**: No limitations or special handling needed

## 7. Dynamic Authentication Methods

The page adapts to support authentication methods based on backend configuration and frontend compatibility:

### 7.1. Static Token Authentication
**Availability**: ✅ Universal (all backends, including cho.mp)
**Backend Config**: `auth_methods: ["static"]`

#### UI Components
- **Token Input**: Secure password field with show/hide toggle
- **Placeholder**: Shows masked example for development backends
- **Validation**: Real-time validation feedback with strength indicators
- **Remember Option**: Optional secure storage per backend with encryption
- **Help Text**: Clear instructions for obtaining tokens

#### Implementation Flow
```javascript
const authenticateStatic = async (token) => {
  try {
const response = await fetch(`${backendUrl}/auth/direct`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    auth_method: 'static',
        credentials: { token }
  })
});

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Authentication failed');
    }

    const authData = await response.json();

    // Store JWT token securely per backend
    await storeAuthToken(backendUrl, authData.access_token);

    return {
      success: true,
      token: authData.access_token,
      userId: authData.user_id,
      provider: authData.provider,
      expiresHours: authData.expires_hours || 24
    };
  } catch (error) {
    // Handle rate limiting with exponential backoff
    if (error.message.includes('Too many failed attempts')) {
      const retrySeconds = extractRetryDelay(error.message);
      handleRateLimit(retrySeconds);
    }
    throw error;
  }
};
```

### 7.2. EVM Wallet Authentication
**Availability**: ✅ Full support (all backends, including cho.mp)
**Backend Config**: `auth_methods: ["evm"]`

#### UI Components
- **Wallet Connect Button**: Primary CTA for EVM wallet connection
- **Supported Wallets**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow
- **Network Display**: Show connected network with chain ID
- **Address Display**: Show connected wallet address with ENS resolution
- **Connection Status**: Real-time wallet connection indicator
- **Challenge Timer**: Countdown showing challenge expiration (5 minutes default)
- **Message Preview**: Show signing message before wallet prompt

#### Implementation Flow
```javascript
const authenticateEVM = async () => {
  let challengeId = null;

  try {
    // Step 1: Connect to wallet
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    const walletAddress = accounts[0];

    // Update UI with connected address
    updateWalletDisplay(walletAddress);

    // Step 2: Create authentication challenge
const challengeResponse = await fetch(`${backendUrl}/auth/challenge`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    auth_method: 'evm',
    identifier: walletAddress
  })
});

    if (!challengeResponse.ok) {
      const errorData = await challengeResponse.json();
      throw new Error(errorData.detail || 'Failed to create challenge');
    }

    const challengeData = await challengeResponse.json();
    challengeId = challengeData.challenge_id;

    // Start challenge timer
    startChallengeTimer(challengeData.expires_at);

    // Show message preview to user
    showSigningMessage(challengeData.message);

    // Step 3: Sign message with wallet
const signature = await window.ethereum.request({
  method: 'personal_sign',
      params: [challengeData.message, walletAddress]
});

    // Step 4: Verify signature
const authResponse = await fetch(`${backendUrl}/auth/verify`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
        challenge_id: challengeId,
        credentials: {
          address: walletAddress,
          signature
        }
  })
});

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      throw new Error(errorData.detail || 'Signature verification failed');
    }

    const authData = await authResponse.json();

    // Store JWT token securely per backend
    await storeAuthToken(backendUrl, authData.access_token);

    return {
      success: true,
      token: authData.access_token,
      userId: authData.user_id,
      provider: authData.provider,
      expiresHours: authData.expires_hours || 24
    };

  } catch (error) {
    // Cancel challenge if it was created
    if (challengeId) {
      await cancelChallenge(challengeId);
    }

    // Handle specific error cases
    if (error.code === 4001) {
      throw new Error('User rejected the signing request');
    } else if (error.message.includes('expired')) {
      throw new Error('Authentication challenge expired. Please try again.');
    } else if (error.message.includes('Too many failed attempts')) {
      const retrySeconds = extractRetryDelay(error.message);
      handleRateLimit(retrySeconds);
    }

    throw error;
  }
};

// Challenge management utilities
const cancelChallenge = async (challengeId) => {
  await fetch(`${backendUrl}/auth/challenge/${challengeId}`, {
    method: 'DELETE'
  });
};

const checkChallengeStatus = async (challengeId) => {
  const response = await fetch(`${backendUrl}/auth/challenge/${challengeId}`);
  return response.ok ? await response.json() : null;
};

const startChallengeTimer = (expiresAt) => {
  const expirationTime = new Date(expiresAt);
  const timer = setInterval(() => {
    const now = new Date();
    const timeRemaining = Math.max(0, expirationTime - now);

    if (timeRemaining === 0) {
      clearInterval(timer);
      showChallengeExpired();
    } else {
      updateChallengeTimer(Math.floor(timeRemaining / 1000));
    }
  }, 1000);

  return timer;
};
```

### 7.3. SVM Wallet Authentication (Solana)
**Availability**: ✅ Full support (all backends, including cho.mp)
**Backend Config**: `auth_methods: ["svm"]`

#### UI Components
- **Phantom Wallet Button**: Primary Solana wallet option
- **Solflare Support**: Alternative Solana wallet
- **Connection Status**: Clear connected/disconnected states
- **Address Display**: Solana address with truncation and copy functionality
- **Challenge Timer**: Countdown showing challenge expiration
- **Message Preview**: Show signing message before wallet prompt

#### Implementation Flow
```javascript
const authenticateSVM = async () => {
  let challengeId = null;

  try {
    // Step 1: Connect to Solana wallet
    await window.solana.connect();
    const walletAddress = window.solana.publicKey.toString();

    // Update UI with connected address
    updateWalletDisplay(walletAddress);

    // Step 2: Create authentication challenge
    const challengeResponse = await fetch(`${backendUrl}/auth/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_method: 'svm',
        identifier: walletAddress
      })
    });

    if (!challengeResponse.ok) {
      const errorData = await challengeResponse.json();
      throw new Error(errorData.detail || 'Failed to create challenge');
    }

    const challengeData = await challengeResponse.json();
    challengeId = challengeData.challenge_id;

    // Start challenge timer
    startChallengeTimer(challengeData.expires_at);

    // Show message preview to user
    showSigningMessage(challengeData.message);

    // Step 3: Sign message with Solana wallet
    const encodedMessage = new TextEncoder().encode(challengeData.message);
    const signatureResult = await window.solana.signMessage(encodedMessage);

    // Convert signature to hex format expected by backend
    const signature = Array.from(signatureResult.signature)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Step 4: Verify signature
    const authResponse = await fetch(`${backendUrl}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: challengeId,
        credentials: {
          address: walletAddress,
          signature: `0x${signature}`
        }
      })
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      throw new Error(errorData.detail || 'Signature verification failed');
    }

    const authData = await authResponse.json();

    // Store JWT token securely per backend
    await storeAuthToken(backendUrl, authData.access_token);

    return {
      success: true,
      token: authData.access_token,
      userId: authData.user_id,
      provider: authData.provider,
      expiresHours: authData.expires_hours || 24
    };

  } catch (error) {
    // Cancel challenge if it was created
    if (challengeId) {
      await cancelChallenge(challengeId);
    }

    // Handle Solana-specific errors
    if (error.code === 4001) {
      throw new Error('User rejected the signing request');
    } else if (error.message.includes('wallet not connected')) {
      throw new Error('Please connect your Solana wallet first');
    }

    throw error;
  }
};
```

### 7.4. Sui Wallet Authentication
**Availability**: ✅ Full support (all backends, including cho.mp)
**Backend Config**: `auth_methods: ["sui"]`

#### UI Components
- **Sui Wallet Button**: Connect to Sui wallet
- **Address Validation**: Sui-specific address format validation
- **Network Status**: Sui network connection indicator
- **Challenge Timer**: Countdown showing challenge expiration
- **Message Preview**: Show signing message before wallet prompt

#### Implementation Flow
```javascript
const authenticateSui = async () => {
  let challengeId = null;

  try {
    // Step 1: Connect to Sui wallet
    await window.suiWallet.requestPermissions();
    const accounts = await window.suiWallet.getAccounts();
    const walletAddress = accounts[0].address;

    // Update UI with connected address
    updateWalletDisplay(walletAddress);

    // Step 2: Create authentication challenge
    const challengeResponse = await fetch(`${backendUrl}/auth/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_method: 'sui',
        identifier: walletAddress
      })
    });

    if (!challengeResponse.ok) {
      const errorData = await challengeResponse.json();
      throw new Error(errorData.detail || 'Failed to create challenge');
    }

    const challengeData = await challengeResponse.json();
    challengeId = challengeData.challenge_id;

    // Start challenge timer
    startChallengeTimer(challengeData.expires_at);

    // Show message preview to user
    showSigningMessage(challengeData.message);

    // Step 3: Sign message with Sui wallet
    const signatureResult = await window.suiWallet.signPersonalMessage({
      message: new TextEncoder().encode(challengeData.message),
      account: accounts[0]
    });

    // Step 4: Verify signature
    const authResponse = await fetch(`${backendUrl}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challenge_id: challengeId,
        credentials: {
          address: walletAddress,
          signature: signatureResult.signature
        }
      })
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      throw new Error(errorData.detail || 'Signature verification failed');
    }

    const authData = await authResponse.json();

    // Store JWT token securely per backend
    await storeAuthToken(backendUrl, authData.access_token);

    return {
      success: true,
      token: authData.access_token,
      userId: authData.user_id,
      provider: authData.provider,
      expiresHours: authData.expires_hours || 24
    };

  } catch (error) {
    // Cancel challenge if it was created
    if (challengeId) {
      await cancelChallenge(challengeId);
    }

    // Handle Sui-specific errors
    if (error.code === 4001) {
      throw new Error('User rejected the signing request');
    } else if (error.message.includes('wallet not connected')) {
      throw new Error('Please connect your Sui wallet first');
    }

    throw error;
  }
};
```

### 7.5. OAuth2 Authentication
**Availability**: ❌ **NOT compatible with cho.mp** / ✅ Compatible with hosted deployments
**Backend Config**: `auth_methods: ["oauth2_github", "oauth2_x"]`

**⚠️ CRITICAL LIMITATION**: OAuth2 cannot work on https://cho.mp due to callback URL requirements. OAuth2 providers require deterministic backend callback URLs that must be pre-registered, but cho.mp connects to arbitrary user-selected backends.

#### cho.mp Behavior (OAuth2 Detected but Unavailable)
```javascript
// OAuth2 compatibility detection and handling
const detectOAuth2Compatibility = () => {
const isChoMp = window.location.hostname === 'cho.mp';
const oauth2Methods = availableMethods.filter(m => m.startsWith('oauth2_'));

  return {
    isChoMp,
    hasOAuth2Methods: oauth2Methods.length > 0,
    oauth2Methods,
    compatible: !isChoMp && oauth2Methods.length > 0
  };
};

const handleOAuth2Limitations = () => {
  const compatibility = detectOAuth2Compatibility();

  if (compatibility.isChoMp && compatibility.hasOAuth2Methods) {
    // Render disabled OAuth2 buttons with explanatory UI
    compatibility.oauth2Methods.forEach(method => {
      renderDisabledOAuth2Button(method, {
        tooltip: "OAuth2 not available on cho.mp - requires hosted deployment",
        onClick: () => showOAuth2LimitationModal()
      });
    });

    // Show educational banner
    showOAuth2Banner({
      title: "OAuth2 Authentication Unavailable",
      message: "OAuth2 requires hosted deployment. Use Web3 wallets or static tokens instead.",
      actions: [
        { text: "Learn More", onClick: showOAuth2LimitationModal },
        { text: "Try Web3 Wallet", onClick: focusWeb3Options }
      ]
    });
  }
};

const showOAuth2LimitationModal = () => {
  showModal({
    title: "OAuth2 Not Compatible with cho.mp",
    content: `
      <div class="oauth2-limitation-explanation">
        <h4>Why OAuth2 doesn't work on cho.mp:</h4>
        <ul>
          <li>OAuth2 providers require <strong>pre-registered callback URLs</strong></li>
          <li>cho.mp connects to <strong>arbitrary user-selected backends</strong></li>
          <li>Providers cannot know your backend URL in advance</li>
          <li>Security constraint: callback URLs must be validated</li>
        </ul>

        <h4>Alternative authentication methods:</h4>
        <ul>
          <li><strong>Web3 Wallets</strong>: EVM, Solana, Sui - fully supported</li>
          <li><strong>Static Tokens</strong>: Direct token authentication</li>
        </ul>

        <h4>To use OAuth2:</h4>
        <ul>
          <li>Deploy your own frontend with predictable URLs</li>
          <li>Use same-domain or related-domain setup</li>
          <li>Register OAuth2 callback URLs with providers</li>
        </ul>
      </div>
    `,
    actions: [
      { text: "Try Web3 Wallet", primary: true, onClick: focusWeb3Options },
      { text: "Use Static Token", onClick: focusStaticToken },
      { text: "Close", onClick: closeModal }
    ]
  });
};
```

#### Hosted Deployment OAuth2 Implementation
```javascript
// OAuth2 authentication for hosted deployments
const authenticateOAuth2 = async (provider) => {
  try {
// Step 1: Initiate OAuth2 flow
    const authUrl = await getOAuth2AuthUrl(provider);

    // Step 2: Handle OAuth2 flow with popup or redirect
    const authResult = await handleOAuth2Flow(authUrl, provider);

    // Step 3: Exchange code for JWT token
    const authData = await exchangeOAuth2Code(authResult.code, provider);

    // Store JWT token securely per backend
    await storeAuthToken(backendUrl, authData.access_token);

    return {
      success: true,
      token: authData.access_token,
      userId: authData.user_id,
      provider: authData.provider,
      expiresHours: authData.expires_hours || 24
    };

  } catch (error) {
    // Handle OAuth2-specific errors
    if (error.message.includes('user_denied')) {
      throw new Error('User cancelled OAuth2 authorization');
    } else if (error.message.includes('invalid_grant')) {
      throw new Error('OAuth2 authorization expired. Please try again.');
    }

    throw error;
  }
};

// GitHub OAuth2 Flow
const authenticateGitHub = async () => {
  return authenticateOAuth2('github');
};

// Twitter/X OAuth2 Flow
const authenticateTwitter = async () => {
  return authenticateOAuth2('x');
};

// OAuth2 utility functions
const getOAuth2AuthUrl = async (provider) => {
  const response = await fetch(`${backendUrl}/auth/${provider}/login`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to initiate ${provider} OAuth2`);
  }

  const data = await response.json();
  return data.auth_url;
};

const handleOAuth2Flow = async (authUrl, provider) => {
  // Option 1: Popup-based OAuth2 (recommended for SPA)
  return new Promise((resolve, reject) => {
    const popup = window.open(
      authUrl,
      `oauth2_${provider}`,
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error('OAuth2 popup closed by user'));
      }
    }, 1000);

    // Listen for OAuth2 completion message
    const messageHandler = (event) => {
      if (event.origin !== new URL(backendUrl).origin) return;

      if (event.data.type === 'oauth2_success') {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', messageHandler);
        resolve(event.data);
      } else if (event.data.type === 'oauth2_error') {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', messageHandler);
        reject(new Error(event.data.error));
      }
    };

    window.addEventListener('message', messageHandler);
  });

  // Option 2: Redirect-based OAuth2 (fallback)
  // window.location.href = authUrl;
};

const exchangeOAuth2Code = async (code, provider) => {
  const response = await fetch(`${backendUrl}/auth/direct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_method: `oauth2_${provider}`,
      credentials: { code }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'OAuth2 token exchange failed');
  }

  return response.json();
};
```

#### Challenge Status Management
For enhanced user experience, the frontend can leverage challenge management endpoints:

```javascript
// Check challenge status (useful for showing expiration countdown)
const statusResponse = await fetch(`${backendUrl}/auth/challenge/${challengeId}`);
const challengeStatus = await statusResponse.json();

if (challengeStatus.expired) {
  // Challenge expired, create new one
  createNewChallenge();
} else {
  // Show remaining time: challengeStatus.time_remaining seconds
  updateExpirationTimer(challengeStatus.time_remaining);
}

// Cancel challenge (useful when user disconnects wallet)
await fetch(`${backendUrl}/auth/challenge/${challengeId}`, {
  method: 'DELETE'
});
```

#### Authentication Status Check
The login page should check for existing authentication on load:

```javascript
// Check if user is already authenticated
const statusResponse = await fetch(`${backendUrl}/auth/status`, {
  headers: {
    'Authorization': `Bearer ${storedToken}`
  }
});

const authStatus = await statusResponse.json();
if (authStatus.authenticated) {
  // Redirect to admin dashboard
  redirectToAdmin();
}
```

## 8. Enhanced Component Breakdown & Implementation

### 8.1. Backend Context Header

#### Backend Information Display
- **Selected Backend**: Prominent display of current backend with logo/icon
- **Backend URL**: Show endpoint with copy functionality and validation indicator
- **Auth Methods Available**: Quick overview of supported authentication methods
- **Switch Backend**: Easy navigation back to directory with login intent preserved
- **Backend Status**: Real-time health and connectivity indicator

### 8.2. Dynamic Authentication Form

#### Method Discovery & Display
- **Loading State**: Show loading indicator while fetching auth methods
- **Error Handling**: Clear error messages if method discovery fails
- **Method Prioritization**: Display methods in order of security/convenience
- **Visual Hierarchy**: Clear distinction between available and unavailable methods
- **Progressive Enhancement**: Advanced features for supported browsers

#### Authentication Method Cards
Each available method displays as a comprehensive card:

##### Static Token Card
- **Clear Instructions**: How to obtain and use static tokens
- **Security Notice**: Warnings about token storage and sharing
- **Input Validation**: Real-time validation with helpful error messages
- **Development Mode**: Special handling for development backends with examples

##### Web3 Wallet Cards
- **Wallet Detection**: Automatic detection of installed wallets
- **Installation Guidance**: Links to install missing wallets
- **Network Compatibility**: Show supported networks for each wallet
- **Signing Preview**: Show what message will be signed for transparency

##### OAuth2 Cards (when applicable)
- **Provider Branding**: Proper branding for GitHub, Twitter/X, etc.
- **Scope Information**: Clear explanation of requested permissions
- **cho.mp Limitation**: Clear explanation when unavailable
- **Alternative Options**: Suggest other authentication methods

### 8.3. cho.mp OAuth2 Limitation Handling

#### Visual Indicators
- **Disabled State**: Greyed-out OAuth2 buttons with disabled cursor
- **Tooltip Explanations**: Hover tooltips explaining unavailability
- **Info Icon**: Clickable info icons that open detailed explanations
- **Banner Message**: Optional banner explaining OAuth2 limitations

#### Educational Modal
- **Problem Explanation**: Clear, non-technical explanation of OAuth2 limitations
- **Why This Happens**: Technical details for interested users
- **Alternative Solutions**:
  - Use Web3 wallet authentication
  - Use static token authentication
  - Deploy own hosted frontend
- **Hosted Deployment Guide**: Link to documentation for self-hosting

### 8.4. Enhanced User Experience Flow

#### Authentication Process
1. **Page Load**: Check for existing authentication status
2. **Method Discovery**: Fetch available authentication methods from backend
3. **Compatibility Check**: Determine which methods work on current domain
4. **Method Display**: Show available methods with clear visual hierarchy
5. **User Selection**: User chooses authentication method
6. **Authentication Flow**: Execute selected authentication method
7. **Success Handling**: Store JWT token securely and redirect to admin
8. **Error Handling**: Clear error messages with retry options

#### Post-Authentication Redirect
- **Default Redirect**: `/admin/{cluster-slug}` (admin dashboard)
- **Intended Destination**: Redirect to originally requested protected page
- **Context Preservation**: Maintain backend selection and user context
- **State Management**: Proper session state initialization

### 8.5. Advanced Security Features

#### Token Management
- **Secure Storage**: JWT tokens stored securely per backend
- **Token Isolation**: Separate token storage for different backends
- **Automatic Expiration**: Handle token expiration gracefully
- **Refresh Logic**: Automatic token refresh when supported

#### Session Security
- **CSRF Protection**: Implement CSRF tokens for form submissions
- **XSS Prevention**: Sanitize all user inputs and backend responses
- **Secure Headers**: Implement security headers for authentication
- **Rate Limiting**: Client-side rate limiting for authentication attempts

## 9. Advanced Visual Design

### 9.1. Responsive Layout
- **Mobile-First**: Optimized for mobile authentication workflows
- **Touch-Friendly**: Large touch targets for wallet connection buttons
- **Progressive Enhancement**: Advanced features for desktop users
- **Accessibility**: Full WCAG 2.1 AA compliance with screen reader support

### 9.2. Error Handling & Feedback
- **Real-time Validation**: Immediate feedback on form inputs
- **Clear Error Messages**: Non-technical error explanations
- **Recovery Guidance**: Clear steps to resolve authentication issues
- **Success Confirmation**: Clear indication of successful authentication

### 9.3. Loading States
- **Method Discovery**: Skeleton UI while loading authentication methods
- **Authentication Progress**: Progress indicators for multi-step flows
- **Wallet Connection**: Loading states for wallet connection processes
- **Background Operations**: Non-blocking updates and status checks

## 10. Performance & Optimization

### 10.1. Efficient Loading
- **Lazy Loading**: Load wallet libraries only when needed
- **Code Splitting**: Separate bundles for different authentication methods
- **Caching**: Cache authentication method discovery results
- **Preloading**: Preload likely authentication flows

### 10.2. Network Optimization
- **Request Batching**: Combine authentication-related API calls
- **Connection Pooling**: Efficient management of backend connections
- **Timeout Handling**: Proper timeout handling for all network requests
- **Retry Logic**: Intelligent retry mechanisms for failed requests

## 11. Session Management & Security

### 11.1. JWT Token Management

The login page implements comprehensive session management aligned with the backend's JWT-based authentication system:

#### Token Storage & Security
```javascript
// Secure token storage per backend
const storeAuthToken = async (backendUrl, token) => {
  const storageKey = `chomp_auth_${hashBackendUrl(backendUrl)}`;

  // Store in secure storage with expiration
  const tokenData = {
    token,
    backendUrl,
    storedAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };

  // Use secure storage method based on environment
  if (window.isSecureContext) {
    await storeInIndexedDB(storageKey, tokenData);
  } else {
    // Fallback to sessionStorage for non-HTTPS
    sessionStorage.setItem(storageKey, JSON.stringify(tokenData));
  }
};

const getAuthToken = async (backendUrl) => {
  const storageKey = `chomp_auth_${hashBackendUrl(backendUrl)}`;

  try {
    let tokenData;

    if (window.isSecureContext) {
      tokenData = await getFromIndexedDB(storageKey);
    } else {
      const stored = sessionStorage.getItem(storageKey);
      tokenData = stored ? JSON.parse(stored) : null;
    }

    if (!tokenData) return null;

    // Check token expiration
    if (Date.now() > tokenData.expiresAt) {
      await removeAuthToken(backendUrl);
      return null;
    }

    return tokenData.token;
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null;
  }
};

const removeAuthToken = async (backendUrl) => {
  const storageKey = `chomp_auth_${hashBackendUrl(backendUrl)}`;

  if (window.isSecureContext) {
    await removeFromIndexedDB(storageKey);
  } else {
    sessionStorage.removeItem(storageKey);
  }
};
```

#### Authentication Status Checking
```javascript
const checkAuthStatus = async (backendUrl) => {
  const token = await getAuthToken(backendUrl);

  if (!token) {
    return { authenticated: false, reason: 'no_token' };
  }

  try {
    const response = await fetch(`${backendUrl}/auth/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const statusData = await response.json();
      return {
        authenticated: true,
        userId: statusData.user_id,
        message: statusData.message
      };
    } else if (response.status === 401) {
      // Token expired or invalid
      await removeAuthToken(backendUrl);
      return { authenticated: false, reason: 'invalid_token' };
    }

    return { authenticated: false, reason: 'unknown_error' };

  } catch (error) {
    console.error('Auth status check failed:', error);
    return { authenticated: false, reason: 'network_error' };
  }
};
```

### 11.2. Automatic Session Renewal

Implementation of automatic session renewal as described in the backend documentation:

```javascript
// Session renewal is handled automatically by the backend
// Frontend just needs to check auth status on page load
const initializeAuthState = async (backendUrl) => {
  const authStatus = await checkAuthStatus(backendUrl);

  if (authStatus.authenticated) {
    // User is already authenticated - redirect to admin
    redirectToAdmin();
  } else {
    // Show login form
    showLoginForm();
  }
};

// Periodic auth check for active sessions
let authCheckInterval;

const startAuthMonitoring = (backendUrl) => {
  // Check auth status every 5 minutes
  authCheckInterval = setInterval(async () => {
    const authStatus = await checkAuthStatus(backendUrl);

    if (!authStatus.authenticated) {
      stopAuthMonitoring();
      showSessionExpiredNotification();
      showLoginForm();
    }
  }, 5 * 60 * 1000); // 5 minutes
};

const stopAuthMonitoring = () => {
  if (authCheckInterval) {
    clearInterval(authCheckInterval);
    authCheckInterval = null;
  }
};
```

### 11.3. Logout Implementation

```javascript
const logout = async (backendUrl) => {
  const token = await getAuthToken(backendUrl);

  if (token) {
    try {
      // Call backend logout endpoint
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with local cleanup even if backend call fails
    }
  }

  // Remove token from storage
  await removeAuthToken(backendUrl);

  // Stop auth monitoring
  stopAuthMonitoring();

  // Clear any cached user data
  clearUserData();

  // Redirect to login
  showLoginForm();

  // Show success message
  showNotification('Logged out successfully', 'success');
};
```

### 11.4. Rate Limiting & Error Handling

Implementation of exponential backoff for authentication failures:

```javascript
let authFailureCount = 0;
let nextAuthAttemptAt = 0;

const handleAuthFailure = (error) => {
  authFailureCount++;

  // Extract retry delay from error message if provided
  let retrySeconds = extractRetryDelay(error.message);

  if (!retrySeconds) {
    // Calculate exponential backoff: 50s, 300s, 1800s, etc.
    // Formula from backend: start * (factor ^ (attempt - 1))
    const start = 50; // seconds
    const factor = 6.0;
    const maxDelay = 345600; // 4 days

    retrySeconds = Math.min(
      start * Math.pow(factor, authFailureCount - 1),
      maxDelay
    );
  }

  nextAuthAttemptAt = Date.now() + (retrySeconds * 1000);

  // Update UI to show rate limit
  showRateLimitNotification(retrySeconds);
  disableAuthButtons(retrySeconds);
};

const handleAuthSuccess = () => {
  // Reset failure count on successful authentication
  authFailureCount = 0;
  nextAuthAttemptAt = 0;

  // Re-enable auth buttons
  enableAuthButtons();
};

const canAttemptAuth = () => {
  return Date.now() >= nextAuthAttemptAt;
};

const extractRetryDelay = (errorMessage) => {
  const match = errorMessage.match(/try again in (\d+) seconds/i);
  return match ? parseInt(match[1], 10) : null;
};

const showRateLimitNotification = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  let message;
  if (minutes > 0) {
    message = `Too many failed attempts. Please wait ${minutes}m ${remainingSeconds}s before trying again.`;
  } else {
    message = `Too many failed attempts. Please wait ${seconds}s before trying again.`;
  }

  showNotification(message, 'warning', { duration: 10000 });
};

const disableAuthButtons = (seconds) => {
  const buttons = document.querySelectorAll('.auth-button');
  buttons.forEach(button => {
    button.disabled = true;
    button.classList.add('rate-limited');
  });

  // Start countdown timer
  startRateLimitCountdown(seconds);
};

const startRateLimitCountdown = (seconds) => {
  let remaining = seconds;

  const updateCountdown = () => {
    if (remaining <= 0) {
      enableAuthButtons();
      return;
    }

    // Update button text with countdown
    document.querySelectorAll('.auth-button').forEach(button => {
      const originalText = button.dataset.originalText || button.textContent;
      button.dataset.originalText = originalText;

      const minutes = Math.floor(remaining / 60);
      const secs = remaining % 60;
      button.textContent = `Wait ${minutes}:${secs.toString().padStart(2, '0')}`;
    });

    remaining--;
    setTimeout(updateCountdown, 1000);
  };

  updateCountdown();
};

const enableAuthButtons = () => {
  const buttons = document.querySelectorAll('.auth-button');
  buttons.forEach(button => {
    button.disabled = false;
    button.classList.remove('rate-limited');

    // Restore original text
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  });
};
```

## Authentication Flows

### Static Token Authentication

// ... existing code ..."

## 12. Comprehensive Error Handling

### 12.1. Authentication Error Types

Based on the backend authentication system, the frontend handles all error scenarios from auth.mdx:

```javascript
const AuthErrorTypes = {
  // Challenge-related errors
  CHALLENGE_EXPIRED: 'Invalid or expired authentication challenge',
  CHALLENGE_NOT_FOUND: 'Authentication challenge not found',

  // Signature verification errors
  SIGNATURE_INVALID: 'Signature does not match address',
  SIGNATURE_REJECTED: 'User rejected the signing request',

  // Token-related errors
  TOKEN_INVALID: 'Invalid token',
  TOKEN_EXPIRED: 'Token has expired',

  // Rate limiting errors
  RATE_LIMITED: 'Too many failed attempts',

  // Method availability errors
  METHOD_DISABLED: 'Authentication method not enabled',

  // OAuth2 errors
  OAUTH2_UNAVAILABLE: 'OAuth2 not available on cho.mp',
  OAUTH2_CANCELLED: 'User cancelled OAuth2 authorization',
  OAUTH2_EXPIRED: 'OAuth2 authorization expired',

  // Network errors
  NETWORK_ERROR: 'Network connection failed',
  BACKEND_UNREACHABLE: 'Backend server unreachable'
};

const handleAuthError = (error, authMethod) => {
  console.error(`Authentication error (${authMethod}):`, error);

  // Determine error type and appropriate response
  const errorMessage = error.message || error.detail || 'Authentication failed';

  if (errorMessage.includes('expired authentication challenge')) {
    showErrorNotification(
      'Authentication challenge expired. Please try again.',
      'warning',
      { retry: true, method: authMethod }
    );
  } else if (errorMessage.includes('Signature does not match')) {
    showErrorNotification(
      'Signature verification failed. Please ensure you\'re using the correct wallet.',
      'error',
      { retry: true, method: authMethod }
    );
  } else if (errorMessage.includes('User rejected')) {
    showErrorNotification(
      'You cancelled the signing request. Click to try again.',
      'info',
      { retry: true, method: authMethod }
    );
  } else if (errorMessage.includes('Too many failed attempts')) {
    const retrySeconds = extractRetryDelay(errorMessage);
    handleRateLimit(retrySeconds);
  } else if (errorMessage.includes('not enabled')) {
    showErrorNotification(
      `${authMethod.toUpperCase()} authentication is not enabled on this backend.`,
      'error',
      { showAlternatives: true }
    );
  } else if (errorMessage.includes('OAuth2 not available')) {
    showOAuth2LimitationModal();
  } else {
    // Generic error handling
    showErrorNotification(
      `Authentication failed: ${errorMessage}`,
      'error',
      { retry: true, method: authMethod }
    );
  }
};

const showErrorNotification = (message, type = 'error', options = {}) => {
  const notification = {
    message,
    type,
    duration: type === 'error' ? 10000 : 5000,
    actions: []
  };

  if (options.retry) {
    notification.actions.push({
      text: 'Try Again',
      onClick: () => retryAuthentication(options.method)
    });
  }

  if (options.showAlternatives) {
    notification.actions.push({
      text: 'Other Methods',
      onClick: () => showAlternativeAuthMethods()
    });
  }

  showNotification(notification);
};
```

### 12.2. Network Error Handling

```javascript
const handleNetworkError = async (error, backendUrl) => {
  console.error('Network error:', error);

  // Check if backend is reachable
  const isBackendReachable = await testBackendConnection(backendUrl);

  if (!isBackendReachable) {
    showErrorNotification(
      'Cannot connect to the selected backend. Please check the URL and try again.',
      'error',
      {
        actions: [
          { text: 'Change Backend', onClick: () => redirectToDirectory() },
          { text: 'Retry', onClick: () => location.reload() }
        ]
      }
    );
  } else {
    showErrorNotification(
      'Network connection failed. Please check your internet connection.',
      'warning',
      { retry: true }
    );
  }
};

const testBackendConnection = async (backendUrl) => {
  try {
    const response = await fetch(`${backendUrl}/ping`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch {
    return false;
  }
};
```

### 12.3. User Experience Enhancements

```javascript
// Progressive loading states
const showAuthProgress = (method, step) => {
  const steps = {
    evm: ['Connecting wallet...', 'Creating challenge...', 'Sign message...', 'Verifying...'],
    svm: ['Connecting wallet...', 'Creating challenge...', 'Sign message...', 'Verifying...'],
    sui: ['Connecting wallet...', 'Creating challenge...', 'Sign message...', 'Verifying...'],
    static: ['Validating token...'],
    oauth2: ['Redirecting to provider...', 'Waiting for authorization...', 'Completing login...']
  };

  const methodSteps = steps[method] || ['Authenticating...'];
  const currentStep = methodSteps[step] || methodSteps[methodSteps.length - 1];

  updateProgressIndicator(currentStep, step, methodSteps.length);
};

// Success handling with smooth transitions
const handleAuthSuccess = async (authResult, backendUrl) => {
  console.log('Authentication successful:', authResult);

  // Show success notification
  showNotification('Authentication successful!', 'success', { duration: 2000 });

  // Store authentication state
  await storeAuthToken(backendUrl, authResult.token);

  // Start auth monitoring
  startAuthMonitoring(backendUrl);

  // Reset failure count
  handleAuthSuccess();

  // Smooth transition to admin interface
  setTimeout(() => {
    redirectToAdmin();
  }, 1000);
};
```

## 13. Complete Integration Example

### 13.1. Main Authentication Controller

```javascript
class AuthenticationController {
  constructor(backendUrl) {
    this.backendUrl = backendUrl;
    this.availableMethods = [];
    this.currentChallenge = null;

    this.init();
  }

  async init() {
    try {
      // Check existing authentication
      const authStatus = await checkAuthStatus(this.backendUrl);
      if (authStatus.authenticated) {
        redirectToAdmin();
        return;
      }

      // Discover available methods
      await this.discoverAuthMethods();

      // Setup UI
      this.setupAuthUI();

      // Handle OAuth2 limitations
      handleOAuth2Limitations();

    } catch (error) {
      handleNetworkError(error, this.backendUrl);
    }
  }

  async discoverAuthMethods() {
    const response = await fetch(`${this.backendUrl}/auth/methods`);

    if (!response.ok) {
      throw new Error('Failed to discover authentication methods');
    }

    const data = await response.json();
    this.availableMethods = data.available_methods;
    this.oauth2Providers = data.oauth2_providers;
  }

  setupAuthUI() {
    // Render authentication methods based on availability
    this.availableMethods.forEach(method => {
      if (method === 'static') {
        this.renderStaticTokenAuth();
      } else if (method === 'evm') {
        this.renderEVMWalletAuth();
      } else if (method === 'svm') {
        this.renderSVMWalletAuth();
      } else if (method === 'sui') {
        this.renderSuiWalletAuth();
      } else if (method.startsWith('oauth2_')) {
        this.renderOAuth2Auth(method);
      }
    });
  }

  async authenticate(method, credentials = null) {
    if (!canAttemptAuth()) {
      showErrorNotification('Please wait before attempting authentication again.', 'warning');
      return;
    }

    try {
      showAuthProgress(method, 0);

      let result;

      switch (method) {
        case 'static':
          result = await authenticateStatic(credentials.token);
          break;
        case 'evm':
          result = await authenticateEVM();
          break;
        case 'svm':
          result = await authenticateSVM();
          break;
        case 'sui':
          result = await authenticateSui();
          break;
        case 'oauth2_github':
          result = await authenticateGitHub();
          break;
        case 'oauth2_x':
          result = await authenticateTwitter();
          break;
        default:
          throw new Error(`Unsupported authentication method: ${method}`);
      }

      await handleAuthSuccess(result, this.backendUrl);

    } catch (error) {
      handleAuthError(error, method);
      handleAuthFailure(error);
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  const backendUrl = getSelectedBackendUrl();

  if (!backendUrl) {
    redirectToDirectory();
    return;
  }

  new AuthenticationController(backendUrl);
});
```

This enhanced login page provides a comprehensive, backend-independent authentication interface that adapts to any Chomp deployment while gracefully handling the OAuth2 limitations inherent to the universal cho.mp frontend. The implementation includes:

- **Complete Web3 wallet integration** with proper challenge-response flows
- **Comprehensive OAuth2 handling** with cho.mp limitation detection
- **Robust error handling** with user-friendly messages and recovery options
- **Secure session management** with automatic renewal and proper token storage
- **Rate limiting compliance** with exponential backoff implementation
- **Progressive UI states** with loading indicators and smooth transitions
- **Network resilience** with connection testing and fallback mechanisms

The specification aligns perfectly with the backend authentication system documented in auth.mdx and api.mdx, ensuring seamless integration with any Chomp deployment.
