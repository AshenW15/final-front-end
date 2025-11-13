# 🎨 Storevia Alert System

A comprehensive, beautiful, and animated alert system for your Storevia application with yellow theme integration.

## 🚀 Features

- **Alert Modals**: Full-screen modal alerts with animations and auto-close
- **Confirmation Modals**: Yes/No confirmations with password protection options
- **Toast Notifications**: Lightweight, non-intrusive notifications
- **Consistent Yellow Theme**: Matches your Storevia branding
- **Rich Animations**: Smooth transitions and micro-interactions
- **TypeScript Support**: Fully typed for better development experience

## 📦 Components

### 1. Alert Modal (`AlertModal`)
Beautiful full-screen modal alerts with floating particles and progress bars.

**Types**: `success`, `error`, `warning`, `info`, `loading`

**Features**:
- Auto-close with progress bar
- Floating particle animations
- Custom icons and actions
- Backdrop blur effects

### 2. Confirmation Modal (`ConfirmationModal`)
Yes/No confirmation dialogs with optional password protection.

**Types**: `delete`, `save`, `warning`, `info`, `custom`

**Features**:
- Password requirement option
- Destructive action styling
- Loading states
- Custom buttons

### 3. Toast Notifications (`ToastProvider`)
Lightweight notifications that appear in the top-right corner.

**Features**:
- Auto-dismiss with countdown
- Action buttons
- Stack management
- Smooth enter/exit animations

## 🛠️ Installation & Setup

### Step 1: Install Dependencies
Make sure you have these packages installed:
```bash
npm install framer-motion lucide-react
```

### Step 2: Add Provider to Your App
Wrap your application with the ToastProvider:

```tsx
// src/app/layout.tsx or your root component
import { ToastProvider } from '@/hooks/useAlerts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Step 3: Use in Components
```tsx
import useAlerts from '@/hooks/useAlerts';

const MyComponent = () => {
  const {
    success, error, warning, info, loading,
    confirm, confirmDelete, confirmSave,
    toast,
    AlertModalComponent,
    ConfirmationModalComponent
  } = useAlerts();

  // Your component logic...

  return (
    <div>
      {/* Your component JSX */}
      
      {/* Required: Render the modal components */}
      {AlertModalComponent}
      {ConfirmationModalComponent}
    </div>
  );
};
```

## 📖 Usage Examples

### Alert Modals

```tsx
// Success alert
success('Success!', 'Your action was completed successfully.');

// Error alert
error('Error Occurred', 'Something went wrong. Please try again.');

// Warning alert
warning('Warning', 'Please review your input before proceeding.');

// Info alert
info('Information', 'Here is some important information.');

// Loading alert (no auto-close)
loading('Processing...', 'Please wait while we process your request.');

// Custom options
success('Custom Success', 'With custom duration', {
  duration: 10000, // 10 seconds
  actionText: 'View Details',
  onAction: () => console.log('Action clicked'),
});
```

### Confirmation Modals

```tsx
// Basic confirmation
confirm(
  'Confirm Action',
  'Are you sure you want to proceed?',
  () => {
    console.log('User confirmed');
  }
);

// Delete confirmation (red styling)
confirmDelete(
  'Delete Item',
  'This action cannot be undone.',
  () => {
    console.log('Item deleted');
  }
);

// Save confirmation
confirmSave(
  'Save Changes',
  'Do you want to save your changes?',
  () => {
    console.log('Changes saved');
  }
);

// Password-protected confirmation
confirmWithPassword(
  'Sensitive Action',
  'Enter your password to continue.',
  (password: string) => {
    console.log('Password confirmed:', password);
  }
);
```

### Toast Notifications

```tsx
// Simple toasts
toast.success('Success!', 'Operation completed.');
toast.error('Error!', 'Something went wrong.');
toast.warning('Warning!', 'Please be careful.');
toast.info('Info!', 'Just so you know.');

// Toast with action
toast.success('File Uploaded', 'Your file was uploaded successfully.', {
  action: {
    label: 'View File',
    onClick: () => console.log('View file clicked'),
  },
  duration: 0, // No auto-dismiss
});
```

## 🎨 Customization

### Colors
The system uses your yellow theme colors defined in the components:

```tsx
const COLORS = {
  primary: "#FFC107",    // Main yellow
  secondary: "#FFD54F",  // Light yellow
  accent1: "#FF9800",    // Orange-yellow
  success: "#4CAF50",    // Green
  error: "#F44336",      // Red
  warning: "#FF9800",    // Orange
  info: "#2196F3",       // Blue
};
```

### Custom Styling
You can override styles by modifying the component classes or creating custom variants.

## 🔄 Replacing Existing Alerts

### Replace `alert()` calls:
```tsx
// Before
alert('Success message');

// After
success('Success!', 'Success message');
```

### Replace `confirm()` calls:
```tsx
// Before
if (confirm('Are you sure?')) {
  deleteItem();
}

// After
confirm('Confirm Delete', 'Are you sure?', () => {
  deleteItem();
});
```

### Replace `window.confirm()` with password:
```tsx
// Before
const password = prompt('Enter password:');
if (password) {
  performAction(password);
}

// After
confirmWithPassword(
  'Enter Password',
  'Please enter your password to continue.',
  (password: string) => {
    performAction(password);
  }
);
```

## 🎭 Animation Details

- **Entry**: Spring animations with stagger effects
- **Exit**: Smooth fade-out with scale transform
- **Particles**: Floating elements for success/loading states
- **Progress**: Animated countdown bars
- **Interactions**: Hover and tap feedback

## 🛡️ TypeScript Support

All components are fully typed with proper interfaces:

```tsx
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  message: string;
  duration?: number;
  showIcon?: boolean;
  showCloseButton?: boolean;
  customIcon?: React.ReactNode;
  onAction?: () => void;
  actionText?: string;
}
```

## 🎯 Best Practices

1. **Always render modal components**: Include `AlertModalComponent` and `ConfirmationModalComponent` in your JSX
2. **Use appropriate alert types**: Match the alert type to the action (error for failures, success for completions)
3. **Provide clear messages**: Write descriptive titles and helpful messages
4. **Handle loading states**: Use loading alerts for async operations
5. **Use toasts for quick feedback**: Save modals for important confirmations

## 🚨 Migration Guide

### From Basic Alerts
```tsx
// Old way
alert('Product deleted successfully!');

// New way
success('Product Deleted', 'The product has been removed from your store.');
```

### From Confirms
```tsx
// Old way
if (confirm('Delete this product?')) {
  deleteProduct();
}

// New way
confirmDelete(
  'Delete Product',
  'This action cannot be undone. Are you sure?',
  () => deleteProduct()
);
```

### From Manual Modals
Replace your existing modal states with the alert system for consistency.

## 🎪 Demo Component

Check out `src/components/examples/AlertDemo.tsx` for a complete working example with all alert types and interactions.

---

This alert system provides a consistent, beautiful, and user-friendly way to handle all notifications in your Storevia application while maintaining the yellow theme and smooth animations throughout.
