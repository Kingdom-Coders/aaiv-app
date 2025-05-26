# Task 2: Improve Loading Component

## 🎯 Objective
Enhance the existing `Loading.js` component to make it more visually appealing and user-friendly.

## 📋 Requirements
- Improve the current loading component located at `frontend/src/components/Loading.js`
- Add a spinning animation or loading spinner
- Include customizable loading text (with a default message)
- Make the component more visually appealing with better styling
- Ensure the component is responsive and works on mobile devices

## 🛠️ Implementation Steps

### Step 1: Examine the Current Component
1. Open `frontend/src/components/Loading.js` to see the current implementation
2. Understand how it's currently being used in the application

### Step 2: Add Animation
1. Create a CSS animation for a spinning loader or pulsing effect
2. You can use CSS keyframes or a simple rotating icon
3. Consider using a spinner icon from a library or create one with CSS

### Step 3: Make it Customizable
1. Add props to allow custom loading messages
2. Add props for different sizes (small, medium, large)
3. Provide sensible defaults so existing usage doesn't break

### Step 4: Improve Styling
1. Center the loading component properly
2. Add a semi-transparent overlay option for full-screen loading
3. Ensure good contrast and visibility

## 💡 Hints
- Look at existing CSS files to match the app's color scheme
- Use `transform: rotate()` with CSS animations for spinning effects
- Consider using Font Awesome icons or Unicode symbols for spinners
- Test the component by temporarily adding it to different pages

## ✅ Acceptance Criteria
- [ ] Loading component has smooth animation
- [ ] Component accepts custom loading text via props
- [ ] Component has improved visual design
- [ ] Component is responsive and mobile-friendly
- [ ] Existing usage of the component still works
- [ ] Animation doesn't cause performance issues

## 🔗 Resources
- [CSS Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [React Props Documentation](https://react.dev/learn/passing-props-to-a-component)
- [CSS Transform Property](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

## ⏱️ Estimated Time
2-3 hours

## 🏷️ Difficulty Level
Beginner ⭐ 