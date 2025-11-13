/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

//-----User Login Page-----//

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAlerts } from '@/hooks/useAlerts';
import { useLoading } from '@/hooks/useLoading';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { Button } from '@/components/ui/button';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Animated background circles for the left panel
const BackgroundCircles = () => {
  return (
    <>
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-yellow-200 rounded-full opacity-40"
        animate={{
          scale: [1, 1.2, 1],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-60 h-60 bg-yellow-300 rounded-full opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-400 rounded-full opacity-35"
        animate={{
          scale: [1, 1.1, 1],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </>
  );
};

// Animated sparkles for the left panel
const Sparkles = () => {
  return (
    <>
      <motion.div
        className="absolute top-20 left-20 w-4 h-4 bg-yellow-100 rounded-full opacity-70"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute bottom-30 right-30 w-3 h-3 bg-yellow-200 rounded-full opacity-70"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-5 h-5 bg-yellow-300 rounded-full opacity-70"
        animate={{
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1.5,
        }}
      />
    </>
  );
};

const UserLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [error, setError] = useState('');

  // Initialize loading hook
  const { isLoading, withLoading } = useLoading();

  // Alert and confirmation modals
  const { error: showError, AlertModalComponent, ConfirmationModalComponent } = useAlerts();

    const { user, signIn, signInWithGoogle } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Check for existing session
  useEffect(() => {
    const checkSession = () => {
      const userRole = sessionStorage.getItem('userRole');
      const userEmail = sessionStorage.getItem('userEmail');
      
      // If user has valid session data but no Firebase user, they might be a returning user
      if (userRole && userEmail && userRole !== 'guest') {
        console.log('Found existing session data:', { userRole, userEmail });
      }
    };

    checkSession();
  }, []);

  const message = (msg: string) => {
    setError(msg);
    setTimeout(() => {
      setError('');
      setEmail('');
      setPassword('');
    }, 3000);
  };

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      message('Please fill all fields');
      return;
    }

    await withLoading(async () => {
      const result = await signIn(email, password);
      if (result.success) {
        // Session data is now automatically managed by AuthContext
        router.push('/');
      } else {
        message(result.error || 'Invalid email or password');
      }
    });
  }, [email, password, signIn, withLoading, router]);

  const handleGoogleAuth = async () => {
    console.log('Initiating Google Authentication');
    await withLoading(async () => {
      try {
        const result = await signInWithGoogle();
        if (result.success) {
          // Session data is now automatically managed by AuthContext
          router.push('/');
        } else {
          showError('Authentication Failed', result.error || 'Google Authentication failed');
        }
      } catch (err) {
        console.error('Google Auth Error:', err);
        showError('Authentication Failed', 'Google Authentication failed');
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (email && password) {
          handleLogin();
        } else {
          message('Please fill all fields');
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, password, handleLogin]);
  return (
    <LoadingOverlay isLoading={isLoading}>
      <div className="flex min-h-screen bg-gray-100 relative overflow-hidden font-poppins">{/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-300 opacity-50"
          animate={{
            background: [
              'linear-gradient(90deg, #fefce8, #fef9c3)',
              'linear-gradient(90deg, #fef9c3, #fefce8)',
            ],
          }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-yellow-200"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Log in to your Storevia account</p>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-500 px-3 py-2 rounded relative mb-4">
                <p className="text-center">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <motion.input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@storevia.com"
                className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-800 shadow-sm transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-yellow-400 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-800 shadow-sm transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <Button
              onClick={() => withLoading(handleLogin)}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold shadow-lg"
              loading={isLoading}
            >
              LOGIN
            </Button>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => withLoading(handleGoogleAuth)}
                className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center p-0"
                title="Login with Google"
                loading={isLoading}
                size="sm"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.83 15.67 17.66V20.62H19.26C21.41 18.62 22.56 15.97 22.56 12.25Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23C15.14 23 17.76 21.99 19.26 20.62L15.67 17.66C14.68 18.31 13.44 18.71 12 18.71C9 18.71 6.44 16.69 5.36 13.94H1.66V16.97C3.15 20.31 6.94 23 12 23Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.36 13.94C5.12 13.29 5 12.59 5 11.87C5 11.15 5.12 10.45 5.36 9.8V6.77H1.66C0.83 8.24 0.36 9.99 0.36 11.87C0.36 13.75 0.83 15.5 1.66 16.97L5.36 13.94Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.29C13.56 5.29 14.96 5.85 16.09 6.92L19.26 3.75C17.76 2.45 15.14 1.36 12 1.36C6.94 1.36 3.15 4.05 1.66 6.77L5.36 9.8C6.44 7.05 9 5.29 12 5.29Z"
                    fill="#EA4335"
                  />
                </svg>
              </Button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Don’t have an account?{' '}
              <Link href="/user/register" className=" biblioteca text-yellow-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Left Side - Promotional Section with Motion Background */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 text-white p-12 rounded-r-3xl relative overflow-hidden">
        <BackgroundCircles />
        <Sparkles />
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 to-transparent" />
        <motion.div
          className="text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {['Explore', 'Shop', 'with', 'Storevia'].map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="text-lg md:text-xl text-yellow-50 drop-shadow-md"
          >
            Discover amazing products and shop with ease, today!
          </motion.p>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Alert and Confirmation Modals */}
      {AlertModalComponent}
      {ConfirmationModalComponent}
      </div>
    </LoadingOverlay>
  );
};

export default UserLogin;