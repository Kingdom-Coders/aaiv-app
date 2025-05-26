# Task 5: Create Timestamp Utility Functions

## 🎯 Objective
Create utility functions to format timestamps in a user-friendly way throughout the application (e.g., "2 hours ago", "Yesterday", "March 15, 2024").

## 📋 Requirements
- Create a new file `timeUtils.js` in `frontend/src/utils/`
- Implement functions to format dates relative to the current time
- Support different formats: relative time, short date, and full date
- Handle edge cases like future dates and invalid dates
- Make functions reusable across the entire application

## 🛠️ Implementation Steps

### Step 1: Create the Utility File
1. Navigate to `frontend/src/utils/`
2. Create `timeUtils.js`
3. Set up the basic file structure with exports

### Step 2: Implement Relative Time Function
1. Create `getRelativeTime(date)` function
2. Calculate the difference between the given date and now
3. Return appropriate strings like:
   - "Just now" (< 1 minute)
   - "5 minutes ago"
   - "2 hours ago"
   - "Yesterday"
   - "3 days ago"
   - "March 15" (for dates older than a week)

### Step 3: Implement Date Formatting Functions
1. Create `formatShortDate(date)` for "Mar 15, 2024"
2. Create `formatFullDate(date)` for "March 15, 2024 at 3:30 PM"
3. Create `formatTimeOnly(date)` for "3:30 PM"

### Step 4: Add Input Validation
1. Handle invalid date inputs gracefully
2. Handle future dates appropriately
3. Ensure functions work with both Date objects and ISO strings

### Step 5: Add Helper Functions
1. Create `isToday(date)` helper
2. Create `isYesterday(date)` helper
3. Create `isThisWeek(date)` helper

## 💡 Hints
- Use JavaScript's built-in `Date` object and methods
- Consider using `Date.now()` for current timestamp
- Look at existing date usage in the app (check models and components)
- Test with various dates including edge cases
- Use `toLocaleDateString()` and `toLocaleTimeString()` for formatting

## ✅ Acceptance Criteria
- [ ] `getRelativeTime()` returns appropriate relative time strings
- [ ] Date formatting functions return consistent, readable formats
- [ ] Functions handle invalid inputs gracefully
- [ ] Functions work with both Date objects and ISO strings
- [ ] Helper functions correctly identify time periods
- [ ] All functions are well-documented with JSDoc comments
- [ ] Functions are exported and ready for use in components

## 🔗 Resources
- [JavaScript Date Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Date.prototype.toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString)
- [JSDoc Documentation](https://jsdoc.app/about-getting-started.html)

## ⏱️ Estimated Time
2-3 hours

## 🏷️ Difficulty Level
Beginner ⭐⭐

## 🎨 Example Usage
```javascript
import { getRelativeTime, formatShortDate, formatFullDate } from '../utils/timeUtils';

// In a component:
const postDate = new Date('2024-03-15T10:30:00Z');
console.log(getRelativeTime(postDate)); // "2 hours ago"
console.log(formatShortDate(postDate)); // "Mar 15, 2024"
console.log(formatFullDate(postDate)); // "March 15, 2024 at 10:30 AM"
```

## 🧪 Testing Ideas
- Test with dates from different time periods (minutes, hours, days, weeks ago)
- Test with future dates
- Test with invalid date inputs
- Test with different timezones
- Test edge cases like exactly 1 hour ago, exactly 1 day ago 