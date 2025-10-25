import React, { useState } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { mintNFT, getExplorerUrl } from '../utils/suiTransactions';

/**
 * JournalInput Component
 * Main journal entry interface with AI analysis and NFT minting
 * Visible after user signs in with zkLogin
 */
function JournalInput({ userAddress, analyzeJournal }) {
  const [entry, setEntry] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(null);
  const [mintError, setMintError] = useState(null);

  // Hook for signing and executing transactions
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleAnalyze = () => {
    if (!entry.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const result = analyzeJournal(entry);
      setSentiment(result);
      setIsAnalyzing(false);
      console.log('Journal analyzed:', result);
    }, 800);
  };

  const handleReset = () => {
    setEntry('');
    setSentiment(null);
    setMintSuccess(null);
    setMintError(null);
  };

  const handleMintNFT = async () => {
    setIsMinting(true);
    setMintError(null);
    setMintSuccess(null);

    try {
      console.log('🎨 Starting NFT minting process...');

      const result = await mintNFT({
        journalEntry: entry,
        sentiment: sentiment,
        signAndExecuteTransaction,
        userAddress,
      });

      console.log('✅ Minting successful:', result);

      // Show success message
      setMintSuccess({
        digest: result.digest,
        nftObjectId: result.nftObjectId,
        explorerUrl: getExplorerUrl(result.digest, 'devnet'),
      });

      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setMintSuccess(null);
      }, 10000);

    } catch (error) {
      console.error('❌ Minting error:', error);
      setMintError(error.message || 'Failed to mint NFT');

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setMintError(null);
      }, 5000);
    } finally {
      setIsMinting(false);
    }
  };

  // Sentiment color mapping
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Victorious':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Diligent':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Reflective':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Sentiment icon
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Victorious':
        return '🏆';
      case 'Diligent':
        return '💪';
      case 'Reflective':
        return '🤔';
      default:
        return '✨';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Write Your Journal Entry
            </h2>
            <p className="text-gray-600">
              Share your thoughts, achievements, or reflections. Our AI will analyze your entry and prepare it for NFT minting.
            </p>
          </div>
          {sentiment && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
            >
              New Entry
            </button>
          )}
        </div>

        {!sentiment ? (
          <>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Start writing your journal entry here...&#10;&#10;Example: 'Today I completed my first blockchain project! I worked hard on implementing zkLogin and learned so much about decentralized authentication. It feels amazing to see everything working.'"
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {entry.length} characters • Connected: {userAddress?.slice(0, 8)}...
              </p>
              <button
                onClick={handleAnalyze}
                disabled={!entry.trim() || isAnalyzing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Entry</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* Analysis Result */}
            <div className={`border-2 rounded-lg p-6 ${getSentimentColor(sentiment)}`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-4xl">{getSentimentIcon(sentiment)}</span>
                <div>
                  <h3 className="text-xl font-bold">Sentiment: {sentiment}</h3>
                  <p className="text-sm opacity-80">AI Analysis Complete</p>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium mb-2">Your Journal Entry:</p>
                <p className="text-sm italic">"{entry.substring(0, 200)}{entry.length > 200 ? '...' : ''}"</p>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Analysis:</span> Your entry reflects a{' '}
                  <span className="font-bold">{sentiment.toLowerCase()}</span> mindset.
                </p>
                {sentiment === 'Victorious' && (
                  <p>Your words convey achievement, success, and celebration. This entry captures a moment of triumph!</p>
                )}
                {sentiment === 'Diligent' && (
                  <p>Your words show dedication, effort, and progress. This entry reflects your commitment to growth!</p>
                )}
                {sentiment === 'Reflective' && (
                  <p>Your words demonstrate thoughtfulness and introspection. This entry captures a moment of contemplation!</p>
                )}
              </div>
            </div>

            {/* Success Notification */}
            {mintSuccess && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">🎉</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-800 mb-2">
                      NFT Minted Successfully!
                    </h3>
                    <p className="text-sm text-green-700 mb-3">
                      Your memory has been permanently stored on Sui blockchain using Walrus decentralized storage.
                    </p>
                    <div className="space-y-2 text-sm">
                      {mintSuccess.nftObjectId && (
                        <p className="text-green-800">
                          <span className="font-semibold">NFT ID:</span>{' '}
                          <code className="bg-green-100 px-2 py-1 rounded">
                            {mintSuccess.nftObjectId.slice(0, 20)}...
                          </code>
                        </p>
                      )}
                      <p className="text-green-800">
                        <span className="font-semibold">Transaction:</span>{' '}
                        <a
                          href={mintSuccess.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View on Explorer →
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {mintError && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="text-lg font-bold text-red-800 mb-1">
                      Minting Failed
                    </h3>
                    <p className="text-sm text-red-700">{mintError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* NFT Minting Panel */}
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {mintSuccess ? 'NFT Minted! 🎊' : 'Ready to Mint NFT'}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <p className="text-gray-600">Sentiment</p>
                  <p className="font-semibold">{sentiment}</p>
                </div>
                <div>
                  <p className="text-gray-600">Owner Address</p>
                  <p className="font-semibold font-mono">{userAddress?.slice(0, 10)}...</p>
                </div>
                <div>
                  <p className="text-gray-600">Network</p>
                  <p className="font-semibold">Sui Devnet</p>
                </div>
                <div>
                  <p className="text-gray-600">Storage</p>
                  <p className="font-semibold">Walrus</p>
                </div>
              </div>
              
              {!mintSuccess ? (
                <button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {isMinting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Minting NFT...</span>
                    </>
                  ) : (
                    <>
                      <span>🎨</span>
                      <span>Mint NFT</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-green-600 font-semibold mb-3">
                    ✅ Your memory is now immortalized on Sui!
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Create Another Memory
                  </button>
                </div>
              )}
              
              <p className="text-xs text-gray-500 text-center mt-3">
                {mintSuccess 
                  ? 'Your journal entry is stored using Walrus decentralized storage'
                  : 'Gas fees will be paid from your Sui wallet balance'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalInput;

