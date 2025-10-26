import { useEnokiAuth } from './hooks/useEnokiAuth';
import { analyzeJournal } from './utils/aiAnalysis';
import JournalInput from './components/JournalInput';
import { getStreakStats, BADGES } from './utils/streakSystem';
import { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

function App() {
  // Real Sui Wallet
  const currentAccount = useCurrentAccount();
  
  // Demo authentication
  const { 
    suiAddress, 
    isAuthenticated, 
    isLoading, 
    error,
    showGoogleModal,
    signInWithGoogle,
    completeGoogleSignIn,
    setShowGoogleModal,
    signOut 
  } = useEnokiAuth();

  // Mode selection - FORCE DEMO MODE for hackathon
  const [mode, setMode] = useState('demo');
  
  // Disable wallet mode temporarily
  useEffect(() => {
    if (mode === 'wallet') {
      setMode('demo');
    }
  }, [mode]);
  
  // Active state based on mode
  const activeAddress = mode === 'wallet' ? currentAccount?.address : suiAddress;
  const isActive = mode === 'wallet' ? (currentAccount !== null && currentAccount !== undefined) : isAuthenticated;

  // Streak state
  const [streakStats, setStreakStats] = useState(null);

  useEffect(() => {
    if (isActive) {
      const stats = getStreakStats();
      setStreakStats(stats);
    }
  }, [isActive]);

  // Mock Google accounts
  const mockGoogleAccounts = [
    { email: 'demo@gmail.com', name: 'Demo User', avatar: '👤' },
    { email: 'hackathon@sui.io', name: 'Hackathon Team', avatar: '🎯' },
    { email: 'blockchain@web3.dev', name: 'Blockchain Dev', avatar: '⛓️' },
  ];

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-pink-50 to-rose-100">
      {/* Google Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">G</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Choose an account</h2>
                  <p className="text-sm text-gray-500">to continue to MemoMint</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {mockGoogleAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => completeGoogleSignIn(account.email)}
                  className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gradient-to-r hover:from-cyan-50 hover:to-pink-50 border-2 border-transparent hover:border-cyan-200"
                >
                  <div className="text-4xl">{account.avatar}</div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.email}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-center text-gray-500">🎭 Demo Mode</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <h1 className="text-2xl font-bold">MemoMint</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Mode Toggle - Demo Only for Hackathon */}
              {!isActive && (
                <div className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold">🎭 Demo Mode Active</span>
                </div>
              )}
              
              {/* Mode Indicator */}
              {isActive && (
                <div className="bg-gray-100 px-3 py-1 rounded-lg">
                  <span className="text-xs font-semibold text-gray-600">
                    {mode === 'demo' ? '🎭 Demo Mode' : '👛 Wallet Mode'}
                  </span>
                </div>
              )}
              
              {/* Auth Buttons */}
              {isLoading && mode === 'demo' ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              ) : mode === 'wallet' && !currentAccount ? (
                <ConnectButton />
              ) : !isAuthenticated ? (
                <button
                  onClick={signInWithGoogle}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              ) : isActive ? (
                <div className="flex items-center space-x-4">
                  {streakStats?.currentBadge && (
                    <div className={`flex items-center space-x-2 bg-gradient-to-r ${streakStats.currentBadge.color} px-4 py-2 rounded-lg`}>
                      <span className="text-2xl">{streakStats.currentBadge.emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-xs">{streakStats.currentBadge.name}</span>
                        <span className="text-white text-xs">🔥 {streakStats.currentStreak} days</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-cyan-50 to-pink-50 px-4 py-2 rounded-lg border border-cyan-200">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 font-mono text-sm">{formatAddress(activeAddress)}</span>
                  </div>
                  {mode === 'wallet' ? (
                    <ConnectButton />
                  ) : (
                    <button onClick={signOut} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      Sign out
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        {error && (
          <div className="max-w-4xl mx-auto mb-6 px-6">
            <div className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {isActive ? (
          <JournalInput 
            userAddress={activeAddress}
            analyzeJournal={analyzeJournal}
            mode={mode}
          />
        ) : (
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              ✨ Journal Your Journey,<br/>
              <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-pink-500 bg-clip-text text-transparent">
                Mint Your Memories
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              🎨 Write daily reflections • 🤖 AI sentiment analysis • 💎 Mint NFTs on Sui
            </p>

            {/* Quick Start */}
            <div className="bg-gradient-to-r from-cyan-100 to-pink-100 rounded-lg shadow-lg p-6 mb-6 border-2 border-cyan-200">
              <div className="flex items-start space-x-3">
                <span className="text-3xl">💡</span>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Hızlı Başlangıç Rehberi</h3>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li>1. Google ile giriş yap (Demo mode)</li>
                    <li>2. Günlüğünü yaz</li>
                    <li>3. AI sentiment analizi yap</li>
                    <li>4. NFT mint et!</li>
                    <li>5. Galeriden görüntüle</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-6 border-2 border-cyan-300">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-4xl">🎯</span>
                  <h3 className="text-2xl font-bold">Misyonumuz</h3>
                </div>
                <p className="text-gray-700">
                  Günlük düşüncelerinizi dijital varlıklara dönüştürerek, kişisel gelişim yolculuğunuzu blockchain üzerinde ölümsüzleştiriyoruz.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg p-6 border-2 border-pink-300">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-4xl">🌟</span>
                  <h3 className="text-2xl font-bold">Vizyonumuz</h3>
                </div>
                <p className="text-gray-700">
                  Web3'te kişisel gelişimi ve mental sağlığı birleştiren ilk platform olmak. Sui blockchain gücüyle herkesin hikayesinin değerli olduğu bir ekosistem.
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-bold text-center mb-6">🎖️ Earn Sui Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.values(BADGES).map((badge) => (
                  <div key={badge.id} className={`p-4 bg-gradient-to-br ${badge.color} rounded-lg text-center`}>
                    <span className="text-5xl block mb-2">{badge.emoji}</span>
                    <p className="text-white font-bold text-sm">{badge.name}</p>
                    <p className="text-white text-xs">{badge.minStreak} days</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={signInWithGoogle}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-pink-600 shadow-xl text-lg"
            >
              Get Started with Google
            </button>
          </div>
        )}
      </main>

      {/* Footer with Mission & Vision */}
      <footer className="mt-16 py-8 bg-white border-t-2 border-cyan-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-6 border-2 border-cyan-300">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">🎯</span>
                <h3 className="text-xl font-bold">Misyonumuz</h3>
              </div>
              <p className="text-sm text-gray-700">
                Günlük düşüncelerinizi dijital varlıklara dönüştürerek, kişisel gelişim yolculuğunuzu blockchain üzerinde ölümsüzleştiriyoruz.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg p-6 border-2 border-pink-300">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">🌟</span>
                <h3 className="text-xl font-bold">Vizyonumuz</h3>
              </div>
              <p className="text-sm text-gray-700">
                Web3'te kişisel gelişimi ve mental sağlığı birleştiren ilk platform olmak. Sui blockchain gücüyle herkesin hikayesinin değerli olduğu bir ekosistem.
              </p>
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="font-semibold">Built with ❤️ on Sui Blockchain</p>
            <p className="text-xs mt-2 text-gray-500">
              🌊 Sui • 📝 AI • 🎨 Walrus • 🎖️ Badges
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

