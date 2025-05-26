# Task 4: Add Search Bar Component

## 🎯 Objective
Create a reusable search bar component that can be used to filter content throughout the application.

## 📋 Requirements
- Create a new `SearchBar.js` component in `frontend/src/components/`
- Include a text input field with a search icon
- Add a clear button (X) that appears when there's text in the search field
- Implement debounced search to avoid excessive API calls
- Make the component responsive and accessible

## 🛠️ Implementation Steps

### Step 1: Create the Basic Component
1. Navigate to `frontend/src/components/`
2. Create `SearchBar.js` and `SearchBar.css`
3. Create a functional component with a controlled input field

### Step 2: Add Search Icon and Styling
1. Add a search icon (you can use Unicode: 🔍 or create with CSS)
2. Style the input field with proper padding and borders
3. Position the search icon inside the input field

### Step 3: Implement Clear Functionality
1. Add a clear button (X) that only shows when there's text
2. Clear the input when the button is clicked
3. Style the clear button to look clickable

### Step 4: Add Debounced Search
1. Use `useState` and `useEffect` to manage the search state
2. Implement a debounce mechanism (wait 300ms after user stops typing)
3. Call the parent component's search function with the debounced value

### Step 5: Make it Accessible
1. Add proper ARIA labels for screen readers
2. Ensure keyboard navigation works properly
3. Add placeholder text to guide users

## 💡 Hints
- Use `setTimeout` and `clearTimeout` for debouncing
- Look at existing input styling in the app for consistency
- The component should accept an `onSearch` prop function from parent components
- Consider using `position: relative` on the container and `position: absolute` for icons

## ✅ Acceptance Criteria
- [ ] Search bar has a clean, professional appearance
- [ ] Search icon is visible and properly positioned
- [ ] Clear button appears/disappears based on input content
- [ ] Debouncing prevents excessive function calls
- [ ] Component is accessible with proper ARIA labels
- [ ] Component is responsive on mobile devices
- [ ] Component accepts and calls onSearch prop function

## 🔗 Resources
- [React Hooks Documentation](https://react.dev/reference/react)
- [Debouncing in JavaScript](https://davidwalsh.name/javascript-debounce-function)
- [ARIA Labels Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)

## ⏱️ Estimated Time
3-4 hours

## 🏷️ Difficulty Level
Beginner ⭐⭐

## 🎨 Example Usage
```javascript
<SearchBar 
  placeholder="Search discussions..." 
  onSearch={(searchTerm) => console.log('Searching for:', searchTerm)}
/>
```

## 🧪 Testing Ideas
- Type quickly and verify debouncing works
- Test with empty input
- Test clear button functionality
- Test on mobile devices 