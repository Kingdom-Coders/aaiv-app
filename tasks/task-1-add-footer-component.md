# Task 1: Add Footer Component

## 🎯 Objective
Create a simple footer component that displays at the bottom of all pages in the Kingdom Coders app.

## 📋 Requirements
- Create a new React component called `Footer.js` in the `frontend/src/components/` directory
- The footer should include:
  - Copyright text: "© 2024 Kingdom Coders. All rights reserved."
  - A link to the Kingdom Coders Slack workspace
  - Simple, clean styling that matches the app's theme
- Add the footer to the main `App.js` file so it appears on all pages

## 🛠️ Implementation Steps

### Step 1: Create the Footer Component
1. Navigate to `frontend/src/components/`
2. Create a new file called `Footer.js`
3. Create a functional React component with the required content

### Step 2: Style the Footer
1. Create a corresponding `Footer.css` file for styling
2. Use flexbox to center the content
3. Add a subtle background color and padding
4. Make sure the footer sticks to the bottom of the page

### Step 3: Import and Use in App.js
1. Import the Footer component in `frontend/src/App.js`
2. Add the Footer component at the bottom of the main app layout

## 💡 Hints
- Look at existing components like `NavBar` for styling inspiration
- Use `position: fixed` and `bottom: 0` to make the footer stick to the bottom
- Remember to add proper margins to prevent content overlap

## ✅ Acceptance Criteria
- [ ] Footer component is created and properly structured
- [ ] Footer displays on all pages of the application
- [ ] Footer includes copyright text and Slack link
- [ ] Footer has clean, professional styling
- [ ] Footer doesn't overlap with page content

## 🔗 Resources
- [React Components Documentation](https://react.dev/learn/your-first-component)
- [CSS Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## ⏱️ Estimated Time
1-2 hours

## 🏷️ Difficulty Level
Beginner ⭐ 