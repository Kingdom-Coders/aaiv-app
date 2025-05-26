# Task 3: Add User Profile Avatar Component

## 🎯 Objective
Create a reusable avatar component that displays user initials or profile pictures throughout the app.

## 📋 Requirements
- Create a new `Avatar.js` component in `frontend/src/components/`
- Display user initials in a circular background when no profile picture is available
- Support different sizes (small, medium, large)
- Use consistent colors based on the user's name for the background
- Make the component reusable across different parts of the app

## 🛠️ Implementation Steps

### Step 1: Create the Avatar Component
1. Navigate to `frontend/src/components/`
2. Create `Avatar.js` and `Avatar.css`
3. Create a functional component that accepts props for user data

### Step 2: Implement Initials Logic
1. Extract the first letter of first name and last name
2. Handle cases where only one name is provided
3. Convert initials to uppercase

### Step 3: Add Color Generation
1. Create a function that generates consistent colors based on the user's name
2. Use a simple hash function to pick from a predefined color palette
3. Ensure good contrast between text and background

### Step 4: Support Different Sizes
1. Add size prop with options: 'small', 'medium', 'large'
2. Define appropriate dimensions and font sizes for each
3. Set 'medium' as the default size

### Step 5: Style the Component
1. Make the avatar circular using CSS
2. Center the initials both horizontally and vertically
3. Add subtle styling like borders or shadows

## 💡 Hints
- Look at the `userModel.js` to understand the user data structure
- Use `charAt(0)` to get the first character of a string
- Consider using a simple hash function like: `name.charCodeAt(0) % colors.length`
- Test with different user names to ensure colors look good

## ✅ Acceptance Criteria
- [ ] Avatar component displays user initials correctly
- [ ] Component supports small, medium, and large sizes
- [ ] Colors are consistent for the same user name
- [ ] Component is circular and well-styled
- [ ] Component handles edge cases (empty names, single names)
- [ ] Component is reusable and well-documented

## 🔗 Resources
- [CSS Border Radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius)
- [JavaScript String Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [CSS Flexbox for Centering](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## ⏱️ Estimated Time
2-3 hours

## 🏷️ Difficulty Level
Beginner ⭐

## 🎨 Example Usage
```javascript
<Avatar user={{firstName: "John", lastName: "Doe"}} size="medium" />
<Avatar user={{firstName: "Jane"}} size="small" />
<Avatar user={{firstName: "Kingdom", lastName: "Coders"}} size="large" />
``` 