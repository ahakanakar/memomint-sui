/**
 * Enoki Configuration for zkLogin Integration
 * 
 * Note: Currently using demo mode, Enoki SDK not required
 * For production, configure VITE_ENOKI_API_KEY
 */

// Read environment variables
const ENOKI_API_KEY = import.meta.env.VITE_ENOKI_API_KEY;

// Configuration object
export const enokiConfig = {
  // Enoki API Key (optional in demo mode)
  apiKey: ENOKI_API_KEY || '',
  
  // Redirect URL after authentication
  redirectUrl: 'http://localhost:3000',
};

/**
 * Validates the Enoki configuration
 * In demo mode, this just logs a warning
 */
export function validateEnokiConfig() {
  if (!enokiConfig.apiKey) {
    console.log(
      '📝 Running in DEMO MODE - No Enoki API key configured. ' +
      'Authentication will use mock addresses. ' +
      'For production, add VITE_ENOKI_API_KEY to your .env file.'
    );
    return false;
  }
  return true;
}

// Validate config on import
validateEnokiConfig();

