# Task 6: Create Confirmation Modal Component

## 🎯 Objective
Create a reusable confirmation modal component for actions that require user confirmation (like deleting posts, leaving groups, etc.).

## 📋 Requirements
- Create a new `ConfirmationModal.js` component in `frontend/src/components/`
- Display a modal overlay with a confirmation message
- Include "Confirm" and "Cancel" buttons with customizable text
- Support different types of confirmations (delete, warning, info)
- Make the modal accessible and keyboard-friendly
- Add smooth open/close animations

## 🛠️ Implementation Steps

### Step 1: Create the Modal Structure
1. Navigate to `frontend/src/components/`
2. Create `ConfirmationModal.js` and `ConfirmationModal.css`
3. Create a modal with overlay, content area, and button section

### Step 2: Implement Modal Functionality
1. Accept props for `isOpen`, `onConfirm`, `onCancel`
2. Add props for customizable title, message, and button text
3. Implement click-outside-to-close functionality
4. Add escape key to close functionality

### Step 3: Add Different Modal Types
1. Support types: 'delete' (red), 'warning' (yellow), 'info' (blue)
2. Apply different colors and icons based on type
3. Set appropriate default messages for each type

### Step 4: Style the Modal
1. Create a semi-transparent overlay
2. Center the modal content
3. Add smooth fade-in/fade-out animations
4. Make it responsive for mobile devices
5. Ensure good contrast and readability

### Step 5: Add Accessibility Features
1. Trap focus within the modal when open
2. Add proper ARIA attributes
3. Ensure keyboard navigation works
4. Return focus to trigger element when closed

## 💡 Hints
- Use `position: fixed` for the overlay to cover the entire screen
- Use `z-index` to ensure the modal appears above other content
- Look at existing button styles in the app for consistency
- Consider using `useEffect` to handle escape key events
- Test the modal with different message lengths

## ✅ Acceptance Criteria
- [ ] Modal displays with proper overlay and centering
- [ ] Modal can be closed by clicking outside, escape key, or cancel button
- [ ] Different types show appropriate colors and styling
- [ ] Modal is accessible with proper ARIA attributes
- [ ] Smooth animations for opening and closing
- [ ] Component is responsive on mobile devices
- [ ] Focus management works correctly

## 🔗 Resources
- [Modal Accessibility Guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)

## ⏱️ Estimated Time
3-4 hours

## 🏷️ Difficulty Level
Beginner ⭐⭐

## 🎨 Example Usage
```javascript
<ConfirmationModal
  isOpen={showDeleteModal}
  type="delete"
  title="Delete Post"
  message="Are you sure you want to delete this post? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={handleDeletePost}
  onCancel={() => setShowDeleteModal(false)}
/>
```

## 🧪 Testing Ideas
- Test opening and closing with different methods
- Test with long and short messages
- Test keyboard navigation
- Test on mobile devices
- Test different modal types
- Test rapid opening/closing 