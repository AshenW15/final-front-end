'use client';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  logout: () => Promise<void>;
  // New session-related methods similar to your past route.js
  getSessionData: () => SessionData | null;
  updateSessionData: (data: Partial<SessionData>) => void;
}

interface SessionData {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      // Update session data when auth state changes (similar to your past session callback)
      if (user) {
        const sessionData: SessionData = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || user.email || '',
          role: sessionStorage.getItem('userRole') || 'user',
          provider: sessionStorage.getItem('authProvider') || 'firebase',
        };
        updateSessionData(sessionData);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Session management methods (similar to your past route.js pattern)
  const getSessionData = (): SessionData | null => {
    if (typeof window === 'undefined') return null;

    const userRole = sessionStorage.getItem('userRole');
    const userEmail = sessionStorage.getItem('userEmail');
    const userName = sessionStorage.getItem('userName');
    const authProvider = sessionStorage.getItem('authProvider');

    if (!userEmail) return null;

    return {
      id: user?.uid || userEmail,
      email: userEmail,
      name: userName || userEmail,
      role: userRole || 'user',
      provider: authProvider || 'credentials',
    };
  };

  const updateSessionData = (data: Partial<SessionData>) => {
    if (typeof window === 'undefined') return;

    if (data.role) sessionStorage.setItem('userRole', data.role);
    // if (data.email) sessionStorage.setItem('userEmail', data.email);

    if (data.email) {
      sessionStorage.setItem('userEmail', data.email);
      // ✅ also set cookie for server-side access
      document.cookie = `userEmail=${data.email}; path=/; SameSite=Lax`;
    }
    if (data.name) sessionStorage.setItem('userName', data.name);
    if (data.provider) sessionStorage.setItem('authProvider', data.provider);
    if (data.accessToken) sessionStorage.setItem('accessToken', data.accessToken);
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Set session data similar to your past credentials provider
      const sessionData: SessionData = {
        id: result.user.uid,
        email: result.user.email || '',
        name: result.user.displayName || result.user.email || '',
        role: 'user',
        provider: 'credentials',
      };
      updateSessionData(sessionData);

      return { success: true, user: result.user };
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';

      if (error instanceof Error) {
        // Handle specific Firebase auth errors
        if (error.message.includes('auth/operation-not-allowed')) {
          errorMessage = 'Email/Password authentication is not enabled in Firebase Console.';
        } else if (error.message.includes('auth/user-not-found')) {
          errorMessage = 'No account found with this email address.';
        } else if (error.message.includes('auth/wrong-password')) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.message.includes('auth/invalid-email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('auth/user-disabled')) {
          errorMessage = 'This account has been disabled.';
        } else {
          errorMessage = error.message;
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResult> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's display name
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Set session data similar to your past pattern
      const sessionData: SessionData = {
        id: result.user.uid,
        email: result.user.email || '',
        name: `${firstName} ${lastName}`,
        role: 'user',
        provider: 'credentials',
      };
      updateSessionData(sessionData);

      return { success: true, user: result.user };
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';

      if (error instanceof Error) {
        // Handle specific Firebase auth errors
        if (error.message.includes('auth/operation-not-allowed')) {
          errorMessage =
            'Email/Password authentication is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method > Email/Password.';
        } else if (error.message.includes('auth/email-already-in-use')) {
          errorMessage = 'An account with this email address already exists.';
        } else if (error.message.includes('auth/weak-password')) {
          errorMessage = 'Password should be at least 6 characters long.';
        } else if (error.message.includes('auth/invalid-email')) {
          errorMessage = 'Please enter a valid email address.';
        } else {
          errorMessage = error.message;
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    // Extract the necessary user details from the Google sign-in result
    const user = result.user;
    const firstName = user.displayName?.split(' ')[0] || '';  // Extract first name
    const lastName = user.displayName?.split(' ')[1] || '';   // Extract last name
    const email = user.email || '';
    const profileImage = user.photoURL || '';

    // Session data (optional)
    const sessionData: SessionData = {
      id: user.uid,
      email,
      name: user.displayName || user.email || '',
      role: 'user', // You can change this to customer or whatever role you want
      provider: 'google',
    };
    
    // Update session data
    updateSessionData(sessionData);

    // Send the user data to the backend (user_auth.php)
    const response = await fetch(`${baseUrl}/user_auth.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: '', // Password is empty because it's from Google sign-in
        profile_picture: profileImage,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('User saved to the database');
    } else {
      console.error('Failed to save user:', data.message);
    }

    return { success: true, user };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
};



  const logout = async () => {
    try {
      await signOut(auth);

      // Clear all session storage (similar to your past NextAuth pattern)
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('authProvider');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');

      document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

      console.log('Session cleared successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    getSessionData,
    updateSessionData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
