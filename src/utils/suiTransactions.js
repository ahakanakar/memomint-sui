/**
 * Sui Blockchain Transaction Utilities
 * 
 * This file contains all transaction-related functions for interacting
 * with the MemoMint Move contract on Sui blockchain.
 */

import { Transaction } from '@mysten/sui/transactions';

/**
 * Package ID for the deployed MemoMint Move contract
 * Replace this with the actual package ID after publishing the contract
 */
export const PACKAGE_ID = '0xPLACEHOLDER_PACKAGE_ID';

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
      'Package ID not configured. Using placeholder for demo. ' +
      'To enable real minting, publish the Move contract and update PACKAGE_ID.'
    );
  }

  try {
    console.log('🎨 Creating NFT mint transaction...');
    console.log('Journal Entry:', journalEntry.substring(0, 50) + '...');
    console.log('Sentiment:', sentiment);
    console.log('User Address:', userAddress);

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
    const result = await signAndExecuteTransaction(
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
          console.log('Digest:', result.digest);
        },
      }
    );

    console.log('🎉 NFT minted successfully!');
    console.log('Transaction digest:', result.digest);

    // Extract created objects (the NFT)
    const createdObjects = result.effects?.created || [];
    const nftObject = createdObjects.find(obj => 
      obj.owner && typeof obj.owner === 'object' && obj.owner.AddressOwner
    );

    if (nftObject) {
      console.log('🖼️  NFT Object ID:', nftObject.reference.objectId);
    }

    return {
      success: true,
      digest: result.digest,
      nftObjectId: nftObject?.reference?.objectId,
      effects: result.effects,
    };

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

