'use client';

import { useAuth } from '@/contexts/AuthContext';

/**
 * Compatibility hook to replace NextAuth's useSession
 * This provides a similar API to make migration easier
 */
export const useSession = () => {
  const { user, loading } = useAuth();
  
  return {
    data: user ? {
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email,
        image: user.photoURL,
        role: sessionStorage.getItem('userRole') || 'user',
        provider: sessionStorage.getItem('authProvider') || 'firebase',
        // Add any other properties your app expects
      }
    } : null,
    status: loading ? 'loading' : (user ? 'authenticated' : 'unauthenticated')
  };
};

/**
 * Compatibility function to replace NextAuth's getSession
 * Returns user data in NextAuth format, similar to your past route.js
 */
export const getSession = async () => {
  // Check if we're in client-side context
  if (typeof window === 'undefined') {
    return null;
  }

  // Get session data from sessionStorage (similar to your past NextAuth pattern)
  const userEmail = sessionStorage.getItem('userEmail');
  const userName = sessionStorage.getItem('userName');
  const userRole = sessionStorage.getItem('userRole');
  const authProvider = sessionStorage.getItem('authProvider');

  // If no session data exists, return null
  if (!userEmail) {
    return null;
  }

  // Return session in NextAuth format (similar to your past session callback)
  return {
    user: {
      id: userEmail, // Using email as ID for compatibility
      email: userEmail,
      name: userName || userEmail,
      role: userRole || 'user',
      provider: authProvider || 'credentials',
      image: null, // Can be enhanced later
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  };
};
