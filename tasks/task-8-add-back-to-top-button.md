# Task 8: Add Back-to-Top Button Component

## 🎯 Objective
Create a "Back to Top" button that appears when users scroll down and smoothly scrolls back to the top of the page when clicked.

## 📋 Requirements
- Create a new `BackToTopButton.js` component in `frontend/src/components/`
- Button should only appear after scrolling down a certain distance (e.g., 300px)
- Implement smooth scrolling animation when clicked
- Position the button in the bottom-right corner of the screen
- Add hover effects and smooth fade-in/fade-out animations
- Make the button accessible and mobile-friendly

## 🛠️ Implementation Steps

### Step 1: Create the Component Structure
1. Navigate to `frontend/src/components/`
2. Create `BackToTopButton.js` and `BackToTopButton.css`
3. Create a functional component with a button element

### Step 2: Implement Scroll Detection
1. Use `useState` to track whether the button should be visible
2. Add a scroll event listener using `useEffect`
3. Show button when `window.scrollY > 300` (or similar threshold)
4. Clean up event listener when component unmounts

### Step 3: Add Smooth Scroll Functionality
1. Implement a click handler that scrolls to the top
2. Use `window.scrollTo({ top: 0, behavior: 'smooth' })`
3. Alternatively, implement custom smooth scrolling for better browser support

### Step 4: Style the Button
1. Position the button fixed in the bottom-right corner
2. Create a circular button with an upward arrow icon
3. Add smooth fade-in/fade-out transitions
4. Include hover effects (scale, color change, etc.)
5. Ensure good contrast and visibility

### Step 5: Add Accessibility Features
1. Include proper ARIA labels for screen readers
2. Ensure keyboard accessibility (focus states)
3. Add a tooltip or title attribute
4. Test with keyboard navigation

### Step 6: Optimize Performance
1. Throttle the scroll event listener to improve performance
2. Use `requestAnimationFrame` or debouncing for smooth performance
3. Ensure the component doesn't cause layout shifts

## 💡 Hints
- Use `window.addEventListener('scroll', handleScroll)` for scroll detection
- Consider using `transform: translateY()` for smooth show/hide animations
- Look at existing button styles in the app for consistency
- Test on mobile devices to ensure proper touch targets
- Use `z-index` to ensure the button appears above other content

## ✅ Acceptance Criteria
- [ ] Button appears only after scrolling down a certain distance
- [ ] Button smoothly scrolls to the top when clicked
- [ ] Button has smooth fade-in/fade-out animations
- [ ] Button is positioned correctly and doesn't interfere with content
- [ ] Button is accessible with proper ARIA attributes
- [ ] Button works well on mobile devices
- [ ] Scroll event listener is properly cleaned up
- [ ] Performance is optimized (no excessive re-renders)

## 🔗 Resources
- [Window scroll event](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event)
- [Window.scrollTo()](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo)
- [CSS position: fixed](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [Throttling and Debouncing](https://css-tricks.com/debouncing-throttling-explained-examples/)

## ⏱️ Estimated Time
2-3 hours

## 🏷️ Difficulty Level
Beginner ⭐⭐

## 🎨 Example Usage
```javascript
// In App.js or any page component
import BackToTopButton from './components/BackToTopButton';

function App() {
  return (
    <div>
      {/* Your page content */}
      <BackToTopButton />
    </div>
  );
}
```

## 🧪 Testing Ideas
- Test scrolling behavior on different page lengths
- Test smooth scrolling animation
- Test button visibility threshold
- Test on mobile devices with touch scrolling
- Test keyboard accessibility
- Test performance with rapid scrolling
- Test in different browsers

## 🎨 Design Suggestions
- Use an upward arrow icon (↑ or ⬆️)
- Consider a subtle shadow for depth
- Use the app's primary color scheme
- Make the button size appropriate for touch (minimum 44px)
- Add a subtle pulse animation to draw attention 