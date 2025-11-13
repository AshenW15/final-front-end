/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import useAlerts from '@/hooks/useAlerts';

// Animated background circles for the right panel
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

// Animated sparkles for the right panel
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

const SellerRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReferralField, setShowReferralField] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  const { error, success, warning, AlertModalComponent } = useAlerts();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      warning('Missing Information', 'Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      error('Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/seller_register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirmPassword,
          referredBy: referenceNumber ? referenceNumber : null,
        }),
      });

      const data = await response.json();
      console.log('Seller Registration data ', data);
      if (data.success) {
        console.log(data);
        success('Registration Successful', 'Your seller account has been created successfully!');
        localStorage.setItem('seller_id', data.seller_id);
        sessionStorage.setItem('userRole', 'seller');
        setTimeout(() => router.push('/seller/categories'), 2000);
      } else {
        error('Registration Failed', data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      error('Error', 'An error occurred during registration.');
    }
  };

  const [referenceNumber, setReferenceNumber] = useState('');

  useEffect(() => {
    
      const ref = searchParams.get('ref');
      if (ref) {
        setReferenceNumber(ref);
        setShowReferralField(true); // Show referral field if there's a ref parameter
        console.log('Referral Code:', ref);
      }
     
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 relative overflow-hidden font-poppins">
      {/* Alert Modal Component */}
      {AlertModalComponent}
      
      {/* Animated Gradient Background */}
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

      {/* Left Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-yellow-200"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Join Storevia</h2>
          <p className="text-gray-500 mb-8">Create your seller account today</p>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <motion.input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-800 shadow-sm transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <motion.input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (123) 456-7890"
                className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-800 shadow-sm transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <motion.input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-800 shadow-sm transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Referral Code Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Do you have a referral code?
              </label>
              <motion.button
                type="button"
                onClick={() => {
                  setShowReferralField(!showReferralField);
                  if (!showReferralField) {
                    setReferenceNumber(''); // Clear referral code when hiding
                  }
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                  showReferralField ? 'bg-yellow-400' : 'bg-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                    showReferralField ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  layout
                />
              </motion.button>
            </div>

            {/* Referral Code Field - Conditionally Rendered */}
            <AnimatePresence>
              {showReferralField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label
                    htmlFor="referral_code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Referral Code
                  </label>
                  <motion.input
                    type="text"
                    id="referral_code"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="REF_JAN_1721834859123"
                    className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-800 shadow-sm transition-all duration-300"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    readOnly={!!searchParams.get('ref')}
                  />
                  {searchParams.get('ref') && (
                    <p className="text-xs text-gray-500 mt-1">
                      This referral code was provided automatically
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleRegister}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold shadow-lg relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">REGISTER</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-transparent opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <p className="text-sm text-gray-600 text-center">
              Already a seller?{' '}
              <Link href="/seller" className="text-yellow-400 hover:underline">
                Login to your account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Promotional Section with Motion Background */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 text-white p-12 rounded-l-3xl relative overflow-hidden">
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
            {['Start', 'Selling', 'with', 'Storevia'].map((word, index) => (
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
            Create your shop and reach customers worldwide, today!
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

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex min-h-screen bg-gray-100 items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Main page component wrapped with Suspense
const SellerRegisterPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SellerRegister />
    </Suspense>
  );
};

export default SellerRegisterPage;
