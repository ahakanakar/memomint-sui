import React, { useState } from 'react';

/**
 * JournalInput Component
 * Main journal entry interface with AI analysis
 * Visible after user signs in with zkLogin
 */
function JournalInput({ userAddress, analyzeJournal }) {
  const [entry, setEntry] = useState('');
  const [sentiment, setSentiment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

            {/* NFT Preview (Placeholder) */}
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Ready to Mint NFT</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
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
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold text-green-600">Ready</p>
                </div>
              </div>
              
              <button
                disabled
                className="w-full mt-6 px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed"
                title="NFT minting coming soon"
              >
                Mint NFT (Coming Soon)
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                NFT minting functionality will be implemented in the next phase
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JournalInput;

