import { useState } from 'react';
import JournalInput from './components/JournalInput';

function App() {
  // Placeholder state - will integrate with zkLogin later
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    // Placeholder - will implement zkLogin integration later
    console.log('Sign in clicked - zkLogin integration coming soon');
    // Temporary: simulate sign-in for UI testing
    setIsSignedIn(true);
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
              {!isSignedIn ? (
                <button
                  onClick={handleSignIn}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign in
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">Connected</span>
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        {!isSignedIn ? (
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
                  onClick={handleSignIn}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        ) : (
          <JournalInput />
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

