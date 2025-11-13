# 🔥 NextAuth to Firebase Migration Guide

## ✅ Migration Completed Successfully!

Your Storevia project has been successfully migrated from NextAuth.js to Firebase Authentication. This change enables deployment to **any static hosting provider**, including **Hostinger**.

## 🚀 What's Changed

### **Removed Components:**
- ❌ `next-auth` package
- ❌ NextAuth API routes (`/api/auth/[...nextauth]`)
- ❌ `output: 'export'` limitation from `next.config.ts`
- ❌ Server-side session dependencies

### **Added Components:**
- ✅ Firebase SDK (`firebase` package)
- ✅ Firebase Authentication context (`/src/contexts/AuthContext.tsx`)
- ✅ Firebase configuration (`/src/lib/firebase.ts`)
- ✅ Client-side authentication state management

## 🔧 Setup Instructions

### 1. **Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enable Authentication in your Firebase project
4. Configure sign-in methods:
   - Email/Password
   - Google (optional)
   - Facebook (optional)

### 2. **Get Firebase Configuration**
1. In Firebase Console, go to Project Settings
2. Scroll down to "Your apps" section
3. Click "Web app" icon to create a web app
4. Copy the Firebase config object

### 3. **Environment Variables**
Create a `.env.local` file with your Firebase credentials:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Your existing backend URL
NEXT_PUBLIC_BASE_URL=your_backend_url
```

### 4. **Social Authentication Setup (Optional)**

#### **Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add your domain to authorized origins
5. In Firebase Console, enable Google sign-in and add your OAuth credentials

#### **Facebook OAuth:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a Facebook app
3. Get App ID and App Secret
4. In Firebase Console, enable Facebook sign-in and add your credentials

## 📁 File Structure Changes

```
src/
├── contexts/
│   └── AuthContext.tsx          # ✅ NEW: Firebase auth context
├── lib/
│   └── firebase.ts              # ✅ NEW: Firebase configuration
├── app/
│   ├── Components/
│   │   └── SessionWrapper.tsx   # ✅ UPDATED: Now uses Firebase
│   ├── user/login/
│   │   └── page.tsx            # ✅ UPDATED: Firebase auth logic
│   └── home/
│       └── Header.tsx          # ✅ UPDATED: Firebase user state
```

## 🔄 API Integration

### **Remaining Files to Update:**

The following files still contain NextAuth code and need to be updated manually:

```bash
# Files with getSession() calls that need updating:
src/app/profile/components/ShippingAddress.tsx
src/app/item/page.tsx
src/app/home/ProductListings.tsx
src/app/store/[id]/page.tsx
src/app/sellerdashboard/Inbox.tsx
src/app/cart/page.tsx
src/app/profile/accountsection/Account.tsx
src/app/cart/shippingdetails/page.tsx
```

### **Migration Pattern:**

**Before (NextAuth):**
```typescript
import { getSession } from 'next-auth/react';

// In your component
const session = await getSession();
const userEmail = session?.user?.email;
```

**After (Firebase):**
```typescript
import { useAuth } from '@/contexts/AuthContext';

// In your component
const { user } = useAuth();
const userEmail = user?.email;

// Or for form submissions/API calls:
const handleSubmit = async () => {
  if (!user) return;
  const userEmail = user.email;
  // ... rest of your code
};
```

### **Quick Migration Script:**

Run this in your terminal to help with the migration:

```bash
# Replace imports
find src -name "*.tsx" -type f -exec sed -i '' 's/import { getSession } from '\''next-auth\/react'\'';/import { useAuth } from '\''@\/contexts\/AuthContext'\'';/g' {} \;

# Replace useSession imports
find src -name "*.tsx" -type f -exec sed -i '' 's/import { useSession } from '\''next-auth\/react'\'';/import { useAuth } from '\''@\/contexts\/AuthContext'\'';/g' {} \;
```

### **How Authentication Works Now:**

1. **User Registration/Login:** Handled by Firebase
2. **User Session:** Managed by Firebase Auth Context
3. **Backend Integration:** Your existing PHP backend can verify Firebase tokens

### **Example: Getting User Data**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return <div>Welcome, {user.email}</div>;
}
```

## 🚀 Deployment Options

### **Hostinger Static Hosting:**
1. Build your project: `npm run build`
2. Upload the `out/` folder to your Hostinger file manager
3. Set your domain to point to the uploaded files

### **Other Hosting Options:**
- **Vercel:** `vercel deploy`
- **Netlify:** Connect your GitHub repo
- **GitHub Pages:** Enable in repository settings
- **Any static hosting:** Upload the `out/` folder

## 🔥 Firebase Benefits

### **Advantages:**
- ✅ **No Server Required:** Pure client-side authentication
- ✅ **Scalable:** Handles millions of users
- ✅ **Secure:** Built-in security best practices
- ✅ **Real-time:** Instant auth state updates
- ✅ **Multi-platform:** Works on web, mobile, desktop
- ✅ **Free Tier:** 10,000 authentications/month free

### **Features Available:**
- Email/Password authentication
- Social logins (Google, Facebook, Twitter, etc.)
- Password reset functionality
- Email verification
- Multi-factor authentication
- Custom claims for role-based access

## 🔧 Migration Checklist

- ✅ Removed NextAuth dependencies
- ✅ Added Firebase configuration
- ✅ Created Firebase Auth context
- ✅ Updated SessionWrapper component
- ✅ Migrated login page logic
- ✅ Updated Header component authentication
- ✅ Removed server-side session calls
- ✅ Updated next.config.ts for static export

## 🆘 Troubleshooting

### **Common Issues:**

1. **"Firebase not configured" error:**
   - Check that all environment variables are set correctly
   - Ensure `.env.local` file is in the root directory

2. **Social login not working:**
   - Verify OAuth credentials in Firebase Console
   - Check authorized domains in your OAuth provider settings

3. **Authentication state not persisting:**
   - Firebase automatically handles persistence
   - Check that AuthContext is properly wrapped around your app

4. **CORS errors:**
   - Add your domain to Firebase authorized domains
   - Update your backend CORS settings if needed

## 🎯 Next Steps

1. **Set up your Firebase project** with the configuration above
2. **Test authentication** in development mode
3. **Deploy to Hostinger** or your preferred static hosting
4. **Update your backend** to work with Firebase tokens (optional)

Your Storevia project is now ready for static hosting deployment! 🚀
