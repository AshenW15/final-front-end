# Loading Components for Storevia

This directory contains reusable loading components that provide visual feedback for user interactions throughout the Storevia application.

## Components Overview

### 1. Spinner (`/src/components/ui/spinner.tsx`)
A basic animated loading spinner with customizable size and color.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `color`: 'primary' | 'secondary' | 'white' | 'gray' (default: 'primary')
- `className`: Additional CSS classes

**Usage:**
```tsx
import Spinner from '@/components/ui/spinner';

// Basic usage
<Spinner />

// With custom size and color
<Spinner size="lg" color="white" />
```

### 2. LoadingButton (`/src/components/ui/loading-button.tsx`)
A button component that shows a loading state with spinner when an action is in progress.

**Props:**
- `loading`: boolean - Shows loading state when true
- `loadingText`: string - Text to display when loading (optional)
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon'
- All standard button props (onClick, disabled, etc.)

**Usage:**
```tsx
import LoadingButton from '@/components/ui/loading-button';
import { useState } from 'react';

const MyComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await submitForm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton 
      loading={isLoading} 
      onClick={handleSubmit}
      loadingText="Saving..."
    >
      Save Changes
    </LoadingButton>
  );
};
```

### 3. LoadingOverlay (`/src/components/ui/loading-overlay.tsx`)
A full overlay component that covers content with a loading spinner and backdrop.

**Props:**
- `isLoading`: boolean - Shows overlay when true
- `text`: string - Loading text to display (default: 'Loading...')
- `backdrop`: boolean - Shows backdrop blur effect (default: true)
- `className`: Additional CSS classes
- `children`: Content to overlay

**Usage:**
```tsx
import LoadingOverlay from '@/components/ui/loading-overlay';

<LoadingOverlay isLoading={isProcessing} text="Processing your order...">
  <div className="content-area">
    {/* Your content here */}
  </div>
</LoadingOverlay>
```

### 4. useLoading Hook (`/src/hooks/useLoading.tsx`)
A custom hook for managing loading states with utility functions.

**Returns:**
- `isLoading`: boolean - Current loading state
- `startLoading`: () => void - Function to start loading
- `stopLoading`: () => void - Function to stop loading
- `withLoading`: (asyncFn) => Promise - Wraps async function with loading state

**Usage:**
```tsx
import { useLoading } from '@/hooks/useLoading';

const MyComponent = () => {
  const { isLoading, withLoading } = useLoading();

  const handleAsyncAction = async () => {
    await withLoading(async () => {
      // Your async operation
      await api.submitData();
    });
  };

  return (
    <div>
      {isLoading ? <Spinner /> : 'Ready'}
      <button onClick={handleAsyncAction}>Submit</button>
    </div>
  );
};
```

## Common Use Cases

### 1. Form Submission
```tsx
const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await submitContactForm(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <LoadingButton 
        loading={isSubmitting} 
        loadingText="Sending message..."
        type="submit"
      >
        Send Message
      </LoadingButton>
    </form>
  );
};
```

### 2. Data Fetching
```tsx
const ProductList = () => {
  const { isLoading, withLoading } = useLoading();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    withLoading(async () => {
      const data = await fetchProducts();
      setProducts(data);
    });
  }, [withLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### 3. Page-level Loading
```tsx
const AdminDashboard = () => {
  const { isLoading, withLoading } = useLoading();
  const [data, setData] = useState(null);

  useEffect(() => {
    withLoading(async () => {
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
    });
  }, [withLoading]);

  return (
    <LoadingOverlay isLoading={isLoading} text="Loading dashboard...">
      <div className="dashboard">
        {data && <DashboardContent data={data} />}
      </div>
    </LoadingOverlay>
  );
};
```

### 4. Delete Confirmation with Loading
```tsx
const DeleteButton = ({ onDelete, itemName }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${itemName}?`)) {
      setIsDeleting(true);
      try {
        await onDelete();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <LoadingButton
      loading={isDeleting}
      loadingText="Deleting..."
      variant="destructive"
      onClick={handleDelete}
    >
      Delete
    </LoadingButton>
  );
};
```

## Styling Customization

All components use Tailwind CSS classes and can be customized using the `className` prop. The components are designed to work with your existing design system.

### Custom Spinner Colors
```tsx
// Custom color using className
<Spinner className="text-green-500" />

// For dark backgrounds
<Spinner color="white" />
```

### Custom Button Styles
```tsx
<LoadingButton 
  loading={isLoading}
  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
>
  Gradient Button
</LoadingButton>
```

## Accessibility

All components include proper accessibility features:
- Spinner includes `role="status"` and screen reader text
- LoadingButton properly disables interaction when loading
- LoadingOverlay prevents interaction with underlying content

## Integration with Admin Panel

These components can be easily integrated into your existing admin panel. For example, in your admin panel navigation:

```tsx
// In your admin panel component
const AdminPanel = () => {
  const { isLoading, withLoading } = useLoading();

  const handleTabChange = async (tab) => {
    await withLoading(async () => {
      // Load tab data
      await loadTabData(tab);
      setActiveTab(tab);
    });
  };

  return (
    <LoadingOverlay isLoading={isLoading}>
      {/* Your existing admin panel JSX */}
    </LoadingOverlay>
  );
};
```

This provides a consistent loading experience across your entire application.
