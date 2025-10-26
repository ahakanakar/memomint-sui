/**
 * Streak System & Badge Management for MemoMint
 * Tracks user consistency and awards Sui-themed badges
 */

// Badge definitions with Sui ecosystem themes
export const BADGES = {
  BEGINNER: {
    id: 'beginner',
    name: 'Fresh Start',
    emoji: '🌱',
    minStreak: 3,
    description: 'Minted 3 memories in 3 days',
    color: 'from-green-400 to-emerald-500',
  },
  WARRIOR: {
    id: 'warrior',
    name: 'Sui Warrior',
    emoji: '⚔️',
    minStreak: 7,
    description: 'One week streak - You are committed!',
    color: 'from-blue-400 to-cyan-500',
  },
  CAPY: {
    id: 'capy',
    name: 'Sui Capy Friend',
    emoji: '🦦',
    minStreak: 14,
    description: 'Two week streak - Sui Capy is proud!',
    color: 'from-cyan-400 to-teal-500',
  },
  LEGEND: {
    id: 'legend',
    name: 'Sui Legend',
    emoji: '👑',
    minStreak: 30,
    description: 'One month streak - You are a legend!',
    color: 'from-yellow-400 to-orange-500',
  },
};

/**
 * Calculate current streak from minted NFTs
 */
export function calculateStreak() {
  const nfts = JSON.parse(localStorage.getItem('minted_nfts') || '[]');
  
  if (nfts.length === 0) return { currentStreak: 0, lastMintDate: null };

  // Sort by timestamp descending
  const sorted = [...nfts].sort((a, b) => b.timestamp - a.timestamp);
  
  let streak = 0;
  let lastDate = null;
  
  for (const nft of sorted) {
    const nftDate = new Date(nft.timestamp);
    const nftDay = new Date(nftDate.getFullYear(), nftDate.getMonth(), nftDate.getDate());
    
    if (!lastDate) {
      // First NFT
      const today = new Date();
      const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterday = new Date(todayDay);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if it's today or yesterday
      if (nftDay.getTime() === todayDay.getTime() || nftDay.getTime() === yesterday.getTime()) {
        streak = 1;
        lastDate = nftDay;
      } else {
        // Too old, no streak
        break;
      }
    } else {
      // Check if it's consecutive
      const expectedDay = new Date(lastDate);
      expectedDay.setDate(expectedDay.getDate() - 1);
      
      if (nftDay.getTime() === expectedDay.getTime()) {
        streak++;
        lastDate = nftDay;
      } else if (nftDay.getTime() === lastDate.getTime()) {
        // Same day, don't count
        continue;
      } else {
        // Gap in streak, stop
        break;
      }
    }
  }
  
  return {
    currentStreak: streak,
    lastMintDate: sorted[0].timestamp,
  };
}

/**
 * Get all earned badges based on streak
 */
export function getEarnedBadges(streak) {
  return Object.values(BADGES).filter(badge => streak >= badge.minStreak);
}

/**
 * Get current badge (highest earned)
 */
export function getCurrentBadge(streak) {
  const earned = getEarnedBadges(streak);
  return earned.length > 0 ? earned[earned.length - 1] : null;
}

/**
 * Get next badge to earn
 */
export function getNextBadge(streak) {
  const allBadges = Object.values(BADGES).sort((a, b) => a.minStreak - b.minStreak);
  return allBadges.find(badge => streak < badge.minStreak) || null;
}

/**
 * Get streak statistics
 */
export function getStreakStats() {
  const { currentStreak } = calculateStreak();
  const currentBadge = getCurrentBadge(currentStreak);
  const nextBadge = getNextBadge(currentStreak);
  const earnedBadges = getEarnedBadges(currentStreak);
  
  return {
    currentStreak,
    currentBadge,
    nextBadge,
    earnedBadges,
    daysUntilNext: nextBadge ? nextBadge.minStreak - currentStreak : 0,
  };
}

