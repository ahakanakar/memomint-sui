import { useState, useEffect, useCallback } from 'react';
import { enokiConfig } from '../config/enoki';

/**
 * Custom hook for zkLogin authentication
 * 
 * This hook manages the complete zkLogin flow using manual implementation:
 * 1. Initiating Google OAuth redirect
 * 2. Handling the redirect callback
 * 3. Creating zkLogin session and deriving Sui address
 * 4. Managing authentication state with persistence
 * 
 * Note: Using manual implementation instead of Enoki SDK helper methods
 * due to SDK API compatibility issues.
 * 
 * @returns {Object} Authentication state and methods
 */
export function useEnokiAuth() {
  // Authentication state
  const [suiAddress, setSuiAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zkLoginSession, setZkLoginSession] = useState(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  /**
   * Sign in with Google using zkLogin
   * Creates an auth URL and redirects user to Google OAuth
   * 
   * Note: This uses a manual implementation. For production, you would:
   * 1. Use a proper Google Client ID
   * 2. Have the Enoki API process the callback
   * 3. Derive the actual zkLogin address
   */
  const signInWithGoogle = useCallback(() => {
    // Show Google account selection modal first
    setShowGoogleModal(true);
  }, []);

  const completeGoogleSignIn = useCallback((selectedAccount) => {
    // Demo mode: API key check removed - using mock authentication
    if (!enokiConfig.apiKey) {
      console.log('🎭 Demo Mode: Using mock authentication (no Enoki API key needed)');
    }

    try {
      setIsLoading(true);
      setError(null);
      setShowGoogleModal(false);

      // Generate a nonce for security
      const nonce = generateRandomNonce();
      
      // Store nonce for verification
      sessionStorage.setItem('zklogin_nonce', nonce);
      sessionStorage.setItem('zklogin_redirect_url', enokiConfig.redirectUrl);
      sessionStorage.setItem('selected_account', selectedAccount);

      console.log('Sign in with:', selectedAccount);
      console.log('🎭 Demo Mode: Simulating authentication...');

      // Simulate successful authentication after a delay
      setTimeout(() => {
        // Simulate callback with mock data
        const mockAddress = generateMockSuiAddress(nonce + selectedAccount);
        const mockSession = {
          address: mockAddress,
          provider: 'google',
          email: selectedAccount,
          nonce: nonce,
          timestamp: Date.now(),
        };

        setSuiAddress(mockAddress);
        setZkLoginSession(mockSession);
        
        // Persist to localStorage
        localStorage.setItem('zklogin_address', mockAddress);
        localStorage.setItem('zklogin_session', JSON.stringify(mockSession));
        
        console.log('✅ Demo authentication successful!');
        console.log('Account:', selectedAccount);
        console.log('Mock Sui address:', mockAddress);
        
        setIsLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to initiate sign in');
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle redirect from Google OAuth
   * Not needed in demo mode, but kept for API compatibility
   */
  const handleRedirect = useCallback(async () => {
    // Demo mode doesn't use OAuth redirects
    console.log('handleRedirect called (demo mode - no action needed)');
  }, []);

  /**
   * Sign out the current user
   * Clears all stored authentication data and resets state
   */
  const signOut = useCallback(() => {
    setSuiAddress(null);
    setZkLoginSession(null);
    setError(null);
    
    // Clear all stored data
    localStorage.removeItem('zklogin_address');
    localStorage.removeItem('zklogin_session');
    
    console.log('User signed out successfully');
  }, []);

  /**
   * Check for existing session on mount
   */
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // Check for existing stored session
        const storedAddress = localStorage.getItem('zklogin_address');
        const storedSession = localStorage.getItem('zklogin_session');
        
        if (storedAddress && storedSession) {
          try {
            const session = JSON.parse(storedSession);
            
            // Restore session
            setSuiAddress(storedAddress);
            setZkLoginSession(session);
            
            console.log('Restored existing session:', storedAddress);
          } catch (parseErr) {
            console.error('Failed to parse stored session:', parseErr);
            // Clear invalid stored data
            localStorage.removeItem('zklogin_address');
            localStorage.removeItem('zklogin_session');
          }
        }
        
        setIsLoading(false);
        
      } catch (err) {
        console.error('Session check error:', err);
        setError(err.message || 'Failed to check session');
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  return {
    // State
    suiAddress,
    isAuthenticated: !!suiAddress,
    isLoading,
    error,
    zkLoginSession,
    showGoogleModal,
    
    // Actions
    signInWithGoogle,
    completeGoogleSignIn,
    setShowGoogleModal,
    signOut,
    handleRedirect,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a random nonce for zkLogin
 * @returns {string} Random nonce
 */
function generateRandomNonce() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a mock Sui address for demo purposes
 * In production, this would be derived from the actual zkLogin proof
 * 
 * @param {string} nonce - The nonce used for authentication
 * @returns {string} Mock Sui address
 */
function generateMockSuiAddress(nonce) {
  // Generate a deterministic address from the nonce
  let hash = 0;
  for (let i = 0; i < nonce.length; i++) {
    const char = nonce.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Create a 64-character hex string (Sui address format)
  const addressHash = Math.abs(hash).toString(16).padStart(16, '0');
  const mockAddress = '0x' + addressHash.repeat(4).substring(0, 64);
  
  return mockAddress;
}

