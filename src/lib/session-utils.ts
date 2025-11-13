/**
 * Session utilities similar to your past NextAuth route.js pattern
 * These help manage session data consistently across your app
 */

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: string;
  image?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

/**
 * Get current session data from storage
 * Similar to your past getSession() function
 */
export const getCurrentSession = (): { user: SessionUser } | null => {
  if (typeof window === 'undefined') return null;

  const userEmail = sessionStorage.getItem('userEmail');
  const userName = sessionStorage.getItem('userName');
  const userRole = sessionStorage.getItem('userRole');
  const authProvider = sessionStorage.getItem('authProvider');
  const accessToken = sessionStorage.getItem('accessToken');

  if (!userEmail) return null;

  return {
    user: {
      id: userEmail, // Using email as ID for compatibility
      email: userEmail,
      name: userName || userEmail,
      role: userRole || 'user',
      provider: authProvider || 'credentials',
      accessToken: accessToken || undefined,
    },
  };
};

/**
 * Check if user has specific role
 * Similar to your past role checking logic
 */
export const hasRole = (requiredRole: string): boolean => {
  const session = getCurrentSession();
  return session?.user?.role === requiredRole;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getCurrentSession() !== null;
};

/**
 * Get user role from session
 */
export const getUserRole = (): string | null => {
  const session = getCurrentSession();
  return session?.user?.role || null;
};

/**
 * Clear all session data
 * Similar to your logout process
 */
export const clearSession = (): void => {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('authProvider');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};

/**
 * Update session data
 * Similar to your session callback updates
 */
export const updateSession = (data: Partial<SessionUser>): void => {
  if (typeof window === 'undefined') return;

  if (data.role) sessionStorage.setItem('userRole', data.role);
  if (data.email) sessionStorage.setItem('userEmail', data.email);
  if (data.name) sessionStorage.setItem('userName', data.name);
  if (data.provider) sessionStorage.setItem('authProvider', data.provider);
  if (data.accessToken) sessionStorage.setItem('accessToken', data.accessToken);
  if (data.refreshToken) sessionStorage.setItem('refreshToken', data.refreshToken);
};
