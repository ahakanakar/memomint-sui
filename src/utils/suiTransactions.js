/**
 * Sui Blockchain Transaction Utilities
 * 
 * This file contains all transaction-related functions for interacting
 * with the MemoMint Move contract on Sui blockchain.
 */

import { Transaction } from '@mysten/sui/transactions';

/**
 * Package ID for the deployed MemoMint Move contract
 * Deployed on Sui Devnet
 * Transaction: AiGeMFAeqfJ8EqXS4ob7cEbyW2c79JXWUND98y5jmRhj
 */
export const PACKAGE_ID = '0x1ed1e0ffe3aeb36507b17db20e4876ed093cdcbf644268de95e17697144c0510';

/**
 * Mint a Memory NFT on Sui blockchain
 * 
 * This function creates a transaction to mint an NFT that represents
 * a journal entry with its AI-analyzed sentiment. The journal entry
 * is stored using Walrus decentralized storage (via the JournalEntry object).
 * 
 * @param {Object} params - Minting parameters
 * @param {string} params.journalEntry - The text content of the journal entry
 * @param {string} params.sentiment - The AI-analyzed sentiment ('Victorious', 'Diligent', or 'Reflective')
 * @param {Object} params.signAndExecuteTransaction - Function from @mysten/dapp-kit to sign and execute transaction
 * @param {string} params.userAddress - The connected user's Sui address
 * @returns {Promise<Object>} Transaction result with digest and effects
 */
export async function mintNFT({
  journalEntry,
  sentiment,
  signAndExecuteTransaction,
  userAddress,
}) {
  // Validate inputs
  if (!journalEntry || !journalEntry.trim()) {
    throw new Error('Journal entry is required');
  }

  if (!sentiment) {
    throw new Error('Sentiment analysis is required');
  }

  if (!signAndExecuteTransaction) {
    throw new Error('Transaction signing function not available');
  }

  if (!userAddress) {
    throw new Error('User address not available');
  }

  // Check if package ID is configured
  if (PACKAGE_ID === '0xPLACEHOLDER_PACKAGE_ID') {
    console.warn(
      '⚠️ Package ID not configured - Using DEMO MODE'
    );
    
    // Return demo/mock result
    console.log('🎭 Demo Mode: Simulating NFT mint...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    
    return {
      success: true,
      digest: '0xDEMO' + Math.random().toString(36).substring(2, 15),
      nftObjectId: '0xDEMONFT' + Math.random().toString(36).substring(2, 15),
      effects: { created: [] },
    };
  }

  try {
    console.log('🎨 Creating NFT mint transaction...');
    console.log('Journal Entry:', journalEntry.substring(0, 50) + '...');
    console.log('Sentiment:', sentiment);
    console.log('User Address:', userAddress);
    
    // Check if signAndExecuteTransaction is available
    if (!signAndExecuteTransaction || typeof signAndExecuteTransaction !== 'function') {
      console.error('❌ signAndExecuteTransaction not available');
      throw new Error('Wallet not connected. Please try signing in again.');
    }

    // Create a new transaction
    const tx = new Transaction();

    // Call the Move function: memomint::mint_memory_nft
    // Arguments: journal_entry (string), sentiment (string)
    tx.moveCall({
      target: `${PACKAGE_ID}::memomint::mint_memory_nft`,
      arguments: [
        tx.pure.string(journalEntry),  // journal_entry: String
        tx.pure.string(sentiment),      // sentiment: String
      ],
    });

    console.log('📝 Transaction created, waiting for user signature...');

    // Sign and execute the transaction
    return new Promise((resolve, reject) => {
      signAndExecuteTransaction(
        {
          transaction: tx,
          options: {
            showEffects: true,
            showObjectChanges: true,
          },
        },
        {
          onSuccess: (result) => {
            console.log('✅ Transaction successful!');
            console.log('Result:', result);
            console.log('Digest:', result?.digest);

            try {
              // Extract created objects (the NFT)
              const createdObjects = result?.effects?.created || result?.objectChanges || [];
              console.log('Created objects:', createdObjects);
              
              let nftObject = null;
              
              // Try to find NFT from objectChanges first
              if (result?.objectChanges) {
                nftObject = result.objectChanges.find(obj => 
                  obj.type === 'created' && 
                  obj.objectType && 
                  obj.objectType.includes('MemoryNFT')
                );
              }
              
              // Fallback to effects.created
              if (!nftObject && result?.effects?.created) {
                nftObject = result.effects.created.find(obj => 
                  obj.owner && 
                  (typeof obj.owner === 'object' && obj.owner.AddressOwner)
                );
              }

              if (nftObject) {
                console.log('🖼️  NFT Object:', nftObject);
              }

              const nftId = nftObject?.objectId || nftObject?.reference?.objectId || null;
              
              resolve({
                success: true,
                digest: result?.digest || 'no-digest',
                nftObjectId: nftId,
                effects: result?.effects,
              });
            } catch (parseError) {
              console.error('Error parsing result:', parseError);
              resolve({
                success: true,
                digest: result?.digest || 'no-digest',
                nftObjectId: null,
                effects: result?.effects,
              });
            }
          },
          onError: (error) => {
            console.error('❌ Transaction error:', error);
            reject(error);
          },
        }
      );
    });

  } catch (error) {
    console.error('❌ Minting failed:', error);

    // Handle specific error cases
    if (error.message?.includes('User rejected')) {
      throw new Error('Transaction was rejected. Please try again.');
    } else if (error.message?.includes('Insufficient')) {
      throw new Error('Insufficient SUI balance to pay for gas fees.');
    } else if (error.message?.includes('Package')) {
      throw new Error('Smart contract not found. Please check the package ID.');
    } else {
      throw new Error(error.message || 'Failed to mint NFT. Please try again.');
    }
  }
}

/**
 * Get the explorer URL for a transaction
 * 
 * @param {string} digest - Transaction digest
 * @param {string} network - Network name ('devnet', 'testnet', 'mainnet')
 * @returns {string} Explorer URL
 */
export function getExplorerUrl(digest, network = 'devnet') {
  return `https://suiscan.xyz/${network}/tx/${digest}`;
}

/**
 * Format SUI amount from MIST
 * 
 * @param {string|number} mist - Amount in MIST (1 SUI = 1,000,000,000 MIST)
 * @returns {string} Formatted amount in SUI
 */
export function formatSuiAmount(mist) {
  const sui = Number(mist) / 1_000_000_000;
  return sui.toFixed(4);
}

