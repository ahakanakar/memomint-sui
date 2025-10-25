/**
 * Analyzes journal entry text and returns sentiment classification
 * Based on keyword detection for hackathon demo purposes
 * 
 * @param {string} entryText - The journal entry text to analyze
 * @returns {string} - One of: 'Victorious', 'Diligent', or 'Reflective'
 */
export function analyzeJournal(entryText) {
  if (!entryText || typeof entryText !== 'string') {
    return 'Reflective'; // Default sentiment
  }

  // Normalize text for keyword matching
  const text = entryText.toLowerCase();

  // Keyword sets for each sentiment category
  const victoriousKeywords = [
    'win', 'won', 'success', 'achieve', 'accomplished', 'victory',
    'breakthrough', 'triumph', 'excellent', 'amazing', 'proud',
    'celebrate', 'milestone', 'goal', 'completed', 'finished'
  ];

  const diligentKeywords = [
    'work', 'working', 'effort', 'trying', 'practice', 'study',
    'learning', 'progress', 'improve', 'building', 'developing',
    'focus', 'dedicated', 'commit', 'consistent', 'productive'
  ];

  const reflectiveKeywords = [
    'think', 'thought', 'consider', 'wonder', 'realize', 'understand',
    'feel', 'feeling', 'emotion', 'reflect', 'contemplate', 'ponder',
    'question', 'introspect', 'meditate', 'remember'
  ];

  // Count keyword matches for each category
  let victoriousCount = 0;
  let diligentCount = 0;
  let reflectiveCount = 0;

  victoriousKeywords.forEach(keyword => {
    if (text.includes(keyword)) victoriousCount++;
  });

  diligentKeywords.forEach(keyword => {
    if (text.includes(keyword)) diligentCount++;
  });

  reflectiveKeywords.forEach(keyword => {
    if (text.includes(keyword)) reflectiveCount++;
  });

  // Determine dominant sentiment
  const maxCount = Math.max(victoriousCount, diligentCount, reflectiveCount);

  // If no keywords matched, default to Reflective
  if (maxCount === 0) {
    return 'Reflective';
  }

  // Return the category with the most matches
  // In case of tie, priority: Victorious > Diligent > Reflective
  if (victoriousCount === maxCount) {
    return 'Victorious';
  } else if (diligentCount === maxCount) {
    return 'Diligent';
  } else {
    return 'Reflective';
  }
}

