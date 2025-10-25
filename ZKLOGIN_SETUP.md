# zkLogin Setup Guide for MemoMint

This guide explains how to set up zkLogin authentication using Enoki for the MemoMint application.

## Overview

MemoMint uses **zkLogin** via **Enoki SDK** to provide secure, privacy-preserving authentication on the Sui blockchain. Users can sign in with their Google accounts without needing a traditional wallet extension.

## Architecture

### Files Created

1. **`src/config/enoki.js`** - Enoki client configuration
2. **`src/hooks/useEnokiAuth.js`** - Custom React hook for authentication
3. **`.env.example`** - Environment variable template

### Authentication Flow

```
┌─────────────────┐
│  User clicks    │
│  "Sign in"      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ signInWithGoogle() called   │
│ - Create Enoki auth URL     │
│ - Redirect to Google OAuth  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ User authenticates          │
│ on Google's page            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Google redirects back       │
│ with id_token/code          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ handleRedirect() processes  │
│ - Enoki handles callback    │
│ - Derives Sui address       │
│ - Creates zkLogin session   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ User authenticated!         │
│ - suiAddress available      │
│ - Session persisted         │
└─────────────────────────────┘
```

## Setup Instructions

### 1. Get Your Enoki API Key

1. Visit: https://enoki.mystenlabs.com/
2. Sign up or log in
3. Create a new project
4. Copy your **API Key**

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env
```

Edit `.env` and add your Enoki API key:

```env
VITE_ENOKI_API_KEY=enk_your_actual_api_key_here
```

### 3. Configure Redirect URL in Enoki Dashboard

In the Enoki dashboard:
1. Go to your project settings
2. Add the redirect URL: `http://localhost:3000`
3. For production, add your production domain

### 4. Install Dependencies

Dependencies should already be installed from the project setup:

```bash
npm install
```

Key dependencies:
- `@mysten/enoki` - Enoki SDK for zkLogin
- `@mysten/dapp-kit` - Sui dApp utilities
- `@mysten/sui` - Sui blockchain SDK

## Implementation Details

### Enoki Configuration (`src/config/enoki.js`)

```javascript
import { EnokiClient } from '@mysten/enoki';

// Read environment variable
const ENOKI_API_KEY = import.meta.env.VITE_ENOKI_API_KEY;

export const enokiConfig = {
  apiKey: ENOKI_API_KEY || '',
  redirectUrl: 'http://localhost:3000',
};

// Create Enoki client instance
export function createEnokiClient() {
  if (!enokiConfig.apiKey) {
    console.error('Cannot create Enoki client: API key is missing');
    return null;
  }
  
  return new EnokiClient({
    apiKey: enokiConfig.apiKey,
  });
}
```

### Authentication Hook (`src/hooks/useEnokiAuth.js`)

The `useEnokiAuth` hook provides:

#### State

- **`suiAddress`**: The user's derived Sui address (string | null)
- **`isAuthenticated`**: Boolean flag (true if user is signed in)
- **`isLoading`**: Loading state during auth operations
- **`error`**: Error message if authentication fails
- **`zkLoginSession`**: The complete zkLogin session object

#### Actions

- **`signInWithGoogle()`**: Initiates Google OAuth flow
- **`signOut()`**: Signs out and clears session
- **`handleRedirect()`**: Processes OAuth callback (called automatically)

#### Usage Example

```jsx
import { useEnokiAuth } from './hooks/useEnokiAuth';

function MyComponent() {
  const { 
    suiAddress, 
    isAuthenticated, 
    isLoading, 
    error,
    signInWithGoogle, 
    signOut 
  } = useEnokiAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated) {
    return (
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    );
  }

  return (
    <div>
      <p>Connected: {suiAddress}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
```

## Key Features

### 1. Automatic Session Persistence

The hook automatically:
- Stores the session in `localStorage`
- Restores the session on page reload
- Validates stored sessions

### 2. OAuth Callback Handling

The `useEffect` automatically detects and processes OAuth callbacks:
```javascript
useEffect(() => {
  // Detects URL parameters from OAuth redirect
  // Calls handleRedirect() automatically
  // Cleans up URL after processing
}, [enokiClient, handleRedirect]);
```

### 3. Error Handling

Comprehensive error handling for:
- Missing API key
- Failed OAuth redirect
- Invalid callback parameters
- Network errors

### 4. Enoki Client Initialization

The Enoki client is initialized once on mount:
```javascript
useEffect(() => {
  const client = createEnokiClient();
  if (client) {
    setEnokiClient(client);
  } else {
    setError('Failed to initialize Enoki client...');
  }
}, []);
```

## Security Features

✅ **Environment Variables**: API keys stored securely in `.env`  
✅ **OAuth Flow**: Industry-standard OAuth 2.0 with Google  
✅ **zkLogin Proofs**: Cryptographic proofs verify identity  
✅ **No Private Keys**: Users don't manage blockchain keys  
✅ **Session Validation**: Sessions validated before restoration  

## Testing

### Without API Key

If you run the app without setting `VITE_ENOKI_API_KEY`:
- Console warning will appear
- Sign in button will show error message
- No redirect will occur

### With API Key

1. Start dev server: `npm run dev`
2. Click "Sign in" button
3. Redirected to Google OAuth
4. After auth, redirected back to app
5. `suiAddress` will be displayed
6. Session persists on refresh

## Troubleshooting

### "Failed to initialize Enoki client"

**Cause**: Missing or invalid `VITE_ENOKI_API_KEY`

**Solution**: 
1. Check `.env` file exists
2. Verify API key is correct
3. Restart dev server after changing `.env`

### "Failed to get zkLogin proof from callback"

**Cause**: OAuth callback failed or was interrupted

**Solution**:
1. Check redirect URL in Enoki dashboard matches exactly
2. Verify Enoki API key is valid
3. Check browser console for detailed errors

### Session not persisting

**Cause**: localStorage might be disabled or cleared

**Solution**:
1. Check browser localStorage is enabled
2. Verify you're on the same domain
3. Check for browser privacy settings blocking localStorage

## Network Configuration

Currently configured for **Sui Devnet**:
- Network: `devnet`
- URL: Auto-configured via `@mysten/sui`

To change networks, update the `network` parameter in `createAuthorizationURL()`:

```javascript
const authUrl = await enokiClient.createAuthorizationURL({
  provider: 'google',
  clientId: enokiConfig.apiKey,
  redirectUrl: enokiConfig.redirectUrl,
  network: 'testnet', // or 'mainnet'
});
```

## Next Steps

Now that zkLogin is set up, you can:
1. **Integrate with App.jsx** - Connect the hook to your UI
2. **Add NFT Minting** - Use the `suiAddress` for transactions
3. **Store Journal Entries** - Associate entries with user address
4. **Build User Dashboard** - Show user's NFTs and entries

## Resources

- [Enoki Documentation](https://docs.sui.io/build/enoki)
- [zkLogin Overview](https://docs.sui.io/build/zk-login)
- [Sui Developer Docs](https://docs.sui.io/)
- [Mysten Labs GitHub](https://github.com/MystenLabs)

---

**Status**: ✅ zkLogin setup complete and ready for integration!

