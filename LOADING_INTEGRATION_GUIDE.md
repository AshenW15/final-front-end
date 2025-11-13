# Loading Components Integration Guide

This guide shows how to integrate the loading components throughout your Storevia application.

## Files Updated with Loading Components

### 1. Button Component (`/src/components/ui/button.tsx`)
**Enhanced** with built-in loading support:
```tsx
// Usage
<Button loading={isLoading} loadingText="Saving...">
  Save Changes
</Button>
```

### 2. Admin Panel - Users (`/src/app/admin/adminpanel/Users.tsx`)
**Updated** with LoadingOverlay:
- Shows loading overlay during data fetch
- Better user experience

### 3. Admin Panel - Products (`/src/app/admin/adminpanel/Products.tsx`)
**Enhanced** with:
- LoadingOverlay for initial page load
- Loading buttons for delete actions
- useLoading hook integration

## Integration in Other Files

### For Data Fetching Components:

```tsx
// In any component that fetches data
import { useLoading } from '@/hooks/useLoading';
import LoadingOverlay from '@/components/ui/loading-overlay';

const MyComponent = () => {
  const { isLoading, withLoading } = useLoading();
  const [data, setData] = useState([]);

  useEffect(() => {
    withLoading(async () => {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    });
  }, [withLoading]);

  return (
    <LoadingOverlay isLoading={isLoading}>
      {/* Your content */}
    </LoadingOverlay>
  );
};
```

### For Forms:

```tsx
// For form submissions
import { Button } from '@/components/ui/button';
import { LoadingInput } from '@/components/ui/loading-input';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LoadingInput 
        loading={isSubmitting}
        placeholder="Enter your message"
      />
      <Button 
        loading={isSubmitting} 
        loadingText="Sending..."
        type="submit"
      >
        Send Message
      </Button>
    </form>
  );
};
```

### For Card Components:

```tsx
// Product cards, user cards, etc.
import Spinner from '@/components/ui/spinner';

const ProductCard = ({ product, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="product-card">
      {/* Product content */}
    </div>
  );
};
```

## Recommended Integration Points

### 1. Cart Operations (`/src/app/cart/page.tsx`)
```tsx
// Add to cart, remove from cart, update quantity
<Button 
  loading={addingToCart} 
  onClick={handleAddToCart}
  loadingText="Adding..."
>
  Add to Cart
</Button>
```

### 2. Authentication (`/src/app/user/login/` & `/src/app/user/register/`)
```tsx
// Login and registration forms
<Button 
  loading={isLoggingIn} 
  loadingText="Signing in..."
  type="submit"
>
  Sign In
</Button>
```

### 3. Search Results (`/src/app/search/page.tsx`)
```tsx
// Search loading states
<LoadingOverlay isLoading={searching} text="Searching products...">
  <SearchResults results={results} />
</LoadingOverlay>
```

### 4. Profile Updates (`/src/app/profile/`)
```tsx
// Profile form submissions
<Button 
  loading={updating} 
  loadingText="Updating profile..."
>
  Save Changes
</Button>
```

### 5. Seller Dashboard (`/src/app/sellerdashboard/`)
```tsx
// Similar to admin panel
<LoadingOverlay isLoading={loadingDashboard}>
  <SellerDashboardContent />
</LoadingOverlay>
```

### 6. Product Views (`/src/app/item/page.tsx`)
```tsx
// Product details loading
const { isLoading, withLoading } = useLoading();

useEffect(() => {
  withLoading(async () => {
    await fetchProductDetails();
  });
}, [productId, withLoading]);
```

## Quick Integration Checklist

### For Each Component:
- [ ] Import required loading components
- [ ] Add loading state management
- [ ] Replace basic buttons with Button component
- [ ] Add LoadingOverlay for page-level loading
- [ ] Use LoadingInput for forms with async validation
- [ ] Add Spinner for individual loading items

### Common Patterns:

1. **Data Fetching**: UseLoading hook + LoadingOverlay
2. **Form Submission**: Button with loading prop
3. **Individual Actions**: Button with loading state
4. **Search/Filter**: LoadingOverlay or Spinner
5. **File Upload**: LoadingInput + Button

## Performance Considerations

1. **Debounce**: Use debouncing for search inputs
2. **Optimistic Updates**: Show immediate feedback, handle errors
3. **Progressive Loading**: Load critical content first
4. **Error States**: Always handle loading errors gracefully

## Accessibility

All loading components include:
- Screen reader announcements
- Proper ARIA labels
- Keyboard navigation support
- Focus management during loading states

This ensures your application is accessible to all users while providing excellent loading feedback.
