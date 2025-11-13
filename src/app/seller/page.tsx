/* eslint-disable react-hooks/exhaustive-deps */
'use client';

//-----Seller Login Page-----//

import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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

const SellerLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();



  const handleLogin = async () => {
    console.log('Seller Login:', { email, password });

    try {
      const response = await fetch(`${baseUrl}/seller_login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        showSuccessMessage(data.message || 'Login successful!');
        const sellerId = data.store.seller_id;
        console.log('Seller ID:', sellerId);
        console.log('Seller Store Slug:', data.storeData.slug);
       
        localStorage.setItem('seller_id', sellerId.toString());
        sessionStorage.setItem('userRole', 'seller');

        // Navigate after a short delay to show success message
        setTimeout(() => {
          //router.push('/seller/shops');
          router.push(`/sellerdashboard?shopId=${data.storeData.slug}`);
        }, 1500);
      } else {
        showErrorMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      showErrorMessage('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleLogin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [email, password]);

  const showSuccessMessage = (msg: string) => {
    setSuccess(msg);
    setError('');
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  const showErrorMessage = (msg: string) => {
    setError(msg);
    setSuccess('');
    setTimeout(() => {
      setError('');
      setEmail('');
      setPassword('');
    }, 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative overflow-hidden font-poppins">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-yellow-300 opacity-50"
        animate={{
          background: [
            'linear-gradient(90deg, #fefce8, #fef9c3)',
            'linear-gradient(90deg, personally identifiable information #fef9c3, #fefce8)',
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
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Get Started</h2>
          <p className="text-gray-500 mb-8">Welcome to Storevia – Access your seller dashboard</p>

          <div className="space-y-6">
            {/* Success messages */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-600 px-3 py-2 rounded relative mb-4">
                <p className="text-center">{success}</p>
              </div>
            )}
            
            {/* Error messages */}
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
                placeholder="seller@storevia.com"
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
            <motion.button
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold shadow-lg relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">LOGIN</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-transparent opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <p className="text-sm text-gray-600 text-center">
              New to Storevia?{' '}
              <Link href="/seller/sellerregister" className="text-yellow-400 hover:underline">
                Register as a Seller
              </Link>
              {' '}or{' '}
              <Link href="/seller/learnmore" className="text-yellow-400 hover:underline">
                Learn More
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
            {['Grow', 'Your', 'Business', 'with', 'Storevia'].map((word, index) => (
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
            Join thousands of sellers and manage your shop seamlessly, today!
          </motion.p>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SellerLogin;
