 'use client';

import React, { FC, useEffect, useState, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ShopLogin: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('shopId');
  const shopName = searchParams.get('shopName') || 'Your Shop';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Debugging log to verify query parameters
  console.log('ShopLogin Query Parameters:', { shopId, shopName });

  const message = (msg: string) => {
    setError(msg);
    setTimeout(() => {
      setError('');
      setUsername('');
      setPassword('');
    }, 3000);
  };
  
  const handleLogin = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!username || !password) {
      message('Please fill all fields');
      return;
    }
    if (!shopId) {
      message('Shop ID is missing');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/storeLogin.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shopId, username, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/sellerdashboard?shopId=${shopId}`);
      } else {
        message(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      message('Something went wrong');
    }
  }, [username, password, shopId, router]);

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    console.log('Role:', userRole);

    if (userRole === 'seller' || userRole === 'admin') {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          if (username && password) {
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
    } else {
      router.push('/unauthorizePage');
    }
  }, [username, password, handleLogin, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-black">
            Login to <span className="text-yellow-400">{decodeURIComponent(shopName)}</span>
          </h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-500 px-3 py-2 rounded relative mb-4">
              <p className="text-center">{error}</p>
            </div>
          )}
          <div className="space-y-6">
            <div className="form-control">
              <label htmlFor="username" className="block text-sm font-medium text-black mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-black"
              />
            </div>
            <div className="form-control">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
                onClick={handleLogin}
              >
                Login
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex min-h-screen bg-gray-50 items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Shop Login...</p>
    </div>
  </div>
);

// Main page component wrapped with Suspense
const ShopLoginPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopLogin />
    </Suspense>
  );
};

export default ShopLoginPage;
