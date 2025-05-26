import { bibleVerses } from '../data/bibleVerses';

/**
 * Gets the daily Bible verse based on the current date
 * This function ensures the same verse is shown for the entire day
 * and changes at 12am (midnight) each day
 * @returns {Object} - The verse object with text and reference
 */
export const getDailyVerse = () => {
  // Get the current date
  const now = new Date();
  
  // Create a date string in format YYYY-MM-DD to ensure consistency throughout the day
  const dateString = now.toISOString().split('T')[0];
  
  // Convert the date string to a number for indexing
  // This ensures the same verse for the entire day regardless of time
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Get a positive index within the range of available verses
  const verseIndex = Math.abs(hash) % bibleVerses.length;
  
  return bibleVerses[verseIndex];
};

/**
 * Alternative method using day of year for simpler calculation
 * This ensures a predictable cycle through all verses
 * @returns {Object} - The verse object with text and reference
 */
export const getDailyVerseByDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Cycle through all verses based on day of year
  const verseIndex = dayOfYear % bibleVerses.length;
  
  return bibleVerses[verseIndex];
}; 