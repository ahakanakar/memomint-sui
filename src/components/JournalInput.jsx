import React, { useState } from 'react';

/**
 * JournalInput Component
 * Placeholder component for journal entry input area
 * Will be visible after user signs in with zkLogin
 */
function JournalInput() {
  const [entry, setEntry] = useState('');

  const handleAnalyze = () => {
    // Placeholder - will integrate with AI analysis and NFT minting later
    console.log('Journal entry:', entry);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Write Your Journal Entry
        </h2>
        <p className="text-gray-600 mb-6">
          Share your thoughts, achievements, or reflections. Our AI will analyze your entry and mint a unique NFT on Sui.
        </p>
        
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Start writing your journal entry here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!entry.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Analyze & Mint NFT
          </button>
        </div>
      </div>
    </div>
  );
}

export default JournalInput;

