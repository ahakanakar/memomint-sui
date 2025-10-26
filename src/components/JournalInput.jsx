import React, { useState, useEffect } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { mintNFT, getExplorerUrl } from '../utils/suiTransactions';
import { getStreakStats } from '../utils/streakSystem';

/**
 * JournalInput Component
 * Main journal entry interface with AI analysis and NFT minting
 * Visible after user signs in with zkLogin
 */
function JournalInput({ userAddress, analyzeJournal, mode = 'demo' }) {
  const [entry, setEntry] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(null);
  const [mintError, setMintError] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [streakStats, setStreakStats] = useState(null);
  const [newBadgeEarned, setNewBadgeEarned] = useState(null);

  // Hook for signing and executing transactions
  const { mutate: signAndExecuteTransaction, isError: txError } = useSignAndExecuteTransaction();
  
  // Check if we're in demo mode or real wallet mode
  const isDemoMode = mode === 'demo';

  // Load minted NFTs and streak stats from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('minted_nfts') || '[]');
    setMintedNFTs(saved);
    
    // Update streak stats
    const stats = getStreakStats();
    setStreakStats(stats);
  }, [mintSuccess]); // Reload when new NFT is minted

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
      
      // If in demo mode, simulate minting
      if (isDemoMode || !signAndExecuteTransaction) {
        console.log('🎭 Demo Mode: Simulating NFT mint...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockDigest = 'DEMO_' + Math.random().toString(36).substring(2, 15);
        const mockNftId = 'DEMO_NFT_' + Math.random().toString(36).substring(2, 15);
        
        setMintSuccess({
          digest: mockDigest,
          nftObjectId: mockNftId,
          explorerUrl: '#demo-mode',
        });
        
        setIsMinting(false);
        
        // Save to localStorage for gallery
        const mintedNFTs = JSON.parse(localStorage.getItem('minted_nfts') || '[]');
        
        // Check for badge upgrade BEFORE adding new NFT
        const oldStats = getStreakStats();
        const oldBadge = oldStats.currentBadge;
        
        mintedNFTs.unshift({
          id: mockNftId,
          digest: mockDigest,
          sentiment: sentiment,
          preview: entry.substring(0, 100),
          timestamp: Date.now(),
        });
        localStorage.setItem('minted_nfts', JSON.stringify(mintedNFTs.slice(0, 10))); // Keep last 10
        
        // Check for new badge AFTER adding
        const newStats = getStreakStats();
        const newBadge = newStats.currentBadge;
        
        if (newBadge && (!oldBadge || newBadge.id !== oldBadge.id)) {
          // New badge earned!
          setNewBadgeEarned(newBadge);
          setTimeout(() => setNewBadgeEarned(null), 8000);
        }
        
        // Auto-open gallery after first NFT
        if (mintedNFTs.length === 0) {
          setTimeout(() => setShowGallery(true), 2000);
        }
        
        // Don't auto-hide - let user manually close
        // setTimeout(() => {
        //   setMintSuccess(null);
        // }, 10000);
        
        return;
      }

      const result = await mintNFT({
        journalEntry: entry,
        sentiment: sentiment,
        signAndExecuteTransaction,
        userAddress,
      });

      console.log('✅ Minting successful:', result);

      // Validate result
      if (!result || !result.success) {
        throw new Error('Transaction failed - no result returned');
      }

      const digest = result.digest || 'unknown';
      const explorerUrl = digest !== 'unknown' ? getExplorerUrl(digest, 'devnet') : '#';

      // Show success message
      setMintSuccess({
        digest: digest,
        nftObjectId: result.nftObjectId || null,
        explorerUrl: explorerUrl,
      });

      // Save to localStorage for gallery
      const mintedNFTs = JSON.parse(localStorage.getItem('minted_nfts') || '[]');
      
      // Check for badge upgrade BEFORE adding new NFT
      const oldStats = getStreakStats();
      const oldBadge = oldStats.currentBadge;
      
      mintedNFTs.unshift({
        id: result.nftObjectId || 'unknown',
        digest: digest,
        sentiment: sentiment,
        preview: entry.substring(0, 100),
        timestamp: Date.now(),
        isReal: true,
      });
      localStorage.setItem('minted_nfts', JSON.stringify(mintedNFTs.slice(0, 10))); // Keep last 10
      
      // Check for new badge AFTER adding
      const newStats = getStreakStats();
      const newBadge = newStats.currentBadge;
      
        if (newBadge && (!oldBadge || newBadge.id !== oldBadge.id)) {
          // New badge earned!
          setNewBadgeEarned(newBadge);
          setTimeout(() => setNewBadgeEarned(null), 8000);
        }
        
        // Auto-open gallery after first NFT (for real minting)
        if (mintedNFTs.length === 0) {
          setTimeout(() => setShowGallery(true), 2000);
        }

        // Don't auto-hide - let user manually close
        // setTimeout(() => {
        //   setMintSuccess(null);
        // }, 10000);

    } catch (error) {
      console.error('❌ Minting error:', error);
      
      // Better error messages
      let errorMessage = 'Failed to mint NFT';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.toString && error.toString() !== '[object Object]') {
        errorMessage = error.toString();
      }
      
      setMintError(errorMessage);

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setMintError(null);
      }, 5000);
    } finally {
      setIsMinting(false);
    }
  };

  // Sentiment color mapping - Turkuaz ve Pembe tonları!
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Victorious':
        return 'bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-800 border-cyan-300';
      case 'Diligent':
        return 'bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 border-teal-300';
      case 'Reflective':
        return 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border-pink-300';
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

  // Example journal entries for quick testing
  const exampleEntries = [
    {
      emoji: '🏆',
      label: 'Victorious',
      text: "Today I won the hackathon! All my hard work paid off and I feel like a champion! The judges loved my project and I can't stop smiling. This is exactly what success feels like!"
    },
    {
      emoji: '💪',
      label: 'Diligent',
      text: "Spent 8 hours coding today. Made great progress on my project and learned new concepts. I'm building something amazing and each line of code brings me closer to my goal. Hard work pays off!"
    },
    {
      emoji: '🤔',
      label: 'Reflective',
      text: "Thinking about my goals and what I want to achieve. Life is full of possibilities. Sometimes I wonder where this journey will take me. Every day is a chance to grow and discover something new about myself."
    }
  ];

  const fillExample = (text) => {
    setEntry(text);
    setSentiment(null);
    setMintSuccess(null);
    setMintError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* New Badge Earned Celebration */}
      {newBadgeEarned && (
        <div className="mb-6 animate-bounce-in">
          <div className={`bg-gradient-to-r ${newBadgeEarned.color} rounded-lg shadow-2xl p-6 border-4 border-white`}>
            <div className="flex items-center space-x-4">
              <span className="text-6xl animate-pulse">{newBadgeEarned.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">🎉 New Badge Earned!</h2>
                <p className="text-xl text-white font-semibold">{newBadgeEarned.name}</p>
                <p className="text-sm text-white opacity-90">{newBadgeEarned.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Progress Bar */}
      {streakStats && streakStats.nextBadge && (
        <div className="mb-6 bg-white rounded-lg shadow-lg p-4 border-2 border-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="font-bold text-gray-800">{streakStats.currentStreak} Day Streak!</p>
                <p className="text-xs text-gray-600">
                  {streakStats.daysUntilNext} more day{streakStats.daysUntilNext > 1 ? 's' : ''} until {streakStats.nextBadge.emoji} {streakStats.nextBadge.name}
                </p>
              </div>
            </div>
            {streakStats.currentBadge && (
              <div className={`bg-gradient-to-r ${streakStats.currentBadge.color} px-3 py-1 rounded-lg shadow`}>
                <span className="text-xl">{streakStats.currentBadge.emoji}</span>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 bg-gradient-to-r ${streakStats.nextBadge.color} transition-all duration-500 rounded-full`}
              style={{
                width: `${(streakStats.currentStreak / streakStats.nextBadge.minStreak) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {streakStats.currentStreak} / {streakStats.nextBadge.minStreak} days
          </p>
        </div>
      )}

      {/* NFT Gallery Button */}
      {mintedNFTs.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowGallery(!showGallery)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 animate-pulse"
          >
            <span>🖼️</span>
            <span>{showGallery ? 'Hide Gallery' : 'View My NFTs'} ({mintedNFTs.length})</span>
          </button>
        </div>
      )}

      {/* NFT Gallery */}
      {showGallery && mintedNFTs.length > 0 && (
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border-2 border-cyan-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🖼️</span> My Minted NFTs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mintedNFTs.map((nft, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-cyan-50 to-pink-50 rounded-lg border-2 border-cyan-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {nft.sentiment === 'Victorious' ? '🏆' : nft.sentiment === 'Diligent' ? '💪' : '🤔'}
                    </span>
                    <span className="font-bold text-gray-800">{nft.sentiment}</span>
                  </div>
                  {nft.isReal && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Real</span>}
                  {!nft.isReal && <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">Demo</span>}
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{nft.preview}...</p>
                <div className="text-xs text-gray-500">
                  <p className="font-mono truncate">ID: {nft.id.slice(0, 20)}...</p>
                  <p>{new Date(nft.timestamp).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl p-8 border-t-4 border-gradient-to-r from-cyan-400 to-pink-400" style={{borderImage: "linear-gradient(to right, #22d3ee, #f472b6) 1"}}>
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
              className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-pink-100 text-gray-700 hover:from-cyan-200 hover:to-pink-200 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow"
            >
              ✨ New Entry
            </button>
          )}
        </div>

        {!sentiment ? (
          <>
            {/* Quick Fill Buttons */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">✨ Try an example:</p>
              <div className="flex gap-3 flex-wrap">
                {exampleEntries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => fillExample(example.text)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-pink-100 hover:from-cyan-200 hover:to-pink-200 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow hover:shadow-md border border-cyan-200 hover:border-pink-300"
                  >
                    {example.emoji} {example.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Start writing your journal entry here...&#10;&#10;💡 Try these examples:&#10;&#10;🏆 Victorious: 'Today I won the hackathon! All my hard work paid off and I feel like a champion!'&#10;&#10;💪 Diligent: 'Spent 8 hours coding today. Made great progress on my project and learned new concepts.'&#10;&#10;🤔 Reflective: 'Thinking about my goals and what I want to achieve. Life is full of possibilities.'"
              className="w-full h-64 p-4 border-2 border-cyan-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none transition-all duration-200 hover:border-cyan-300"
            />
            
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {entry.length} characters • Connected: {userAddress?.slice(0, 8)}...
              </p>
              <button
                onClick={handleAnalyze}
                disabled={!entry.trim() || isAnalyzing}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
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
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-400 rounded-lg p-6 mb-6 shadow-lg relative">
                <button
                  onClick={() => setMintSuccess(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{isDemoMode || mintSuccess.digest.startsWith('DEMO') ? '🎭' : '🎉'}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-cyan-800 mb-2">
                      {isDemoMode ? '🎭 Demo Mode - NFT Simulated!' : '🎉 NFT Minted on Sui Blockchain!'}
                    </h3>
                    <p className="text-sm text-teal-700 mb-3">
                      {isDemoMode 
                        ? 'This is a demo simulation. Switch to Wallet mode in the header to mint real NFTs!'
                        : 'Your memory has been permanently stored on Sui blockchain using Walrus decentralized storage.'}
                    </p>
                    <div className="space-y-2 text-sm">
                      {mintSuccess.nftObjectId && (
                        <p className="text-cyan-800">
                          <span className="font-semibold">NFT ID:</span>{' '}
                          <code className="bg-cyan-100 px-2 py-1 rounded">
                            {mintSuccess.nftObjectId.slice(0, 20)}...
                          </code>
                        </p>
                      )}
                      {mintSuccess.explorerUrl && mintSuccess.explorerUrl !== '#demo-mode' && (
                        <p className="text-cyan-800">
                        <span className="font-semibold">Transaction:</span>{' '}
                        <a
                          href={mintSuccess.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                            className="text-pink-600 hover:underline font-medium"
                        >
                          View on Explorer →
                        </a>
                      </p>
                      )}
                      {isDemoMode && (
                        <div className="space-y-2">
                          <p className="text-cyan-800 text-xs italic">
                            💡 Switch to Wallet mode and connect your Sui wallet to mint real NFTs on-chain!
                          </p>
                          <div className="mt-3 p-3 bg-teal-100 rounded-lg">
                            <p className="text-xs font-semibold text-teal-800 mb-1">
                              📋 NFT Kaydedildi!
                            </p>
                            <p className="text-xs text-teal-700 mb-2">
                              Bu NFT demo listesine eklendi. Yeni bir günlük yazmak için "Create Another Memory" butonuna basın.
                            </p>
                            <div className="flex items-center justify-center space-x-2 mt-2 pt-2 border-t border-teal-300">
                              <span className="text-xl">🖼️</span>
                              <p className="text-xs font-semibold text-teal-800">
                                Tüm NFT'lerinizi görüntülemek için yukarıdaki <span className="text-purple-700">"My NFTs"</span> butonuna basın!
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {!isDemoMode && mintSuccess.explorerUrl && mintSuccess.explorerUrl !== '#demo-mode' && (
                        <div className="mt-3 p-3 bg-green-100 rounded-lg">
                          <p className="text-xs font-semibold text-green-800 mb-1">
                            ✅ Real Blockchain Transaction!
                          </p>
                          <p className="text-xs text-green-700">
                            Your NFT is now permanently stored on Sui Devnet. View it on Sui Explorer or check "My NFTs" gallery!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {mintError && (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-400 rounded-lg p-4 mb-6 shadow-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h3 className="text-lg font-bold text-rose-800 mb-1">
                      Minting Failed
                    </h3>
                    <p className="text-sm text-pink-700">{mintError}</p>
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
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:via-teal-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 animate-gradient"
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
                  <p className="text-cyan-600 font-semibold mb-3">
                    ✅ Your memory is now immortalized on Sui!
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
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

