import { useEnokiAuth } from './hooks/useEnokiAuth';
import { analyzeJournal } from './utils/aiAnalysis';
import JournalInput from './components/JournalInput';

function App() {
  // Use zkLogin authentication hook
  const { 
    suiAddress, 
    isAuthenticated, 
    isLoading, 
    error,
    signInWithGoogle, 
    signOut 
  } = useEnokiAuth();

  // Format address for display (show first 6 and last 4 characters)
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MemoMint</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              ) : !isAuthenticated ? (
                <button
                  onClick={signInWithGoogle}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 font-mono text-sm">{formatAddress(suiAddress)}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        {error && (
          <div className="max-w-4xl mx-auto mb-6 px-6">
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">Authentication Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Journal Your Journey, Mint Your Memories
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Write your daily reflections, get AI-powered sentiment analysis, and mint unique NFTs on the Sui blockchain.
            </p>
            <div className="bg-white rounded-lg shadow-lg p-8 text-left">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                How it works:
              </h3>
              <ol className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                    1
                  </span>
                  <span>Sign in securely using zkLogin on Sui</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                    2
                  </span>
                  <span>Write your journal entry and share your thoughts</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                    3
                  </span>
                  <span>Our AI analyzes the sentiment: Victorious, Diligent, or Reflective</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                    4
                  </span>
                  <span>Mint a unique NFT on Sui that captures your moment</span>
                </li>
              </ol>
              <div className="mt-8 text-center">
                <button
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-lg inline-flex items-center space-x-2"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Get Started with Google</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <JournalInput 
            userAddress={suiAddress}
            analyzeJournal={analyzeJournal}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>Built with ❤️ on Sui Blockchain</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

