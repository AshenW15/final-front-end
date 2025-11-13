'use client';

//-----User Register Page-----//

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useAlerts from '@/hooks/useAlerts';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
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

const UserRegister: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();

  const { error, success, AlertModalComponent } = useAlerts();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      error('Password Mismatch', 'Passwords do not match');
      return;
    }
    console.log('User Register:', { firstName, lastName, email, password, phone });

    // try {
    //   const result = await signUp(email, password, firstName, lastName);
    //   console.log('Firebase registration result:', result);

    //   if (result.success) {
    //     console.log('Firebase registration successful:', result.user);
    //     success('Registration Successful', 'Your account has been created successfully!');

    //     // Get the Firebase ID token (access token)
    //     if (!result.user) {
    //       error('Registration Failed', 'User information is missing after registration.');
    //       return;
    //     }
    //     const accessToken = await result.user.getIdToken();
    //     console.log('Firebase Access Token:', accessToken);

    //     // Send data to Laravel backend with access token in headers
    //     axios
    //       .post(
    //         '/api/register',
    //         {
    //           email,
    //           password,
    //           password_confirmation: confirmPassword,
    //           firstName,
    //           lastName,
    //           phone,
    //         },
    //         {
    //           headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //             'Content-Type': 'application/json',
    //           },
    //         }
    //       )
    //       .then((response) => {
    //         console.log('User registered successfully on backend:', response.data);
    //         // Optional redirect
    //         // setTimeout(() => router.push('/user/login'), 2000);
    //       })
    //       .catch((error) => {
    //         console.error('Error registering user on backend:', error.response?.data || error);
    //         error('Registration Failed', 'Failed to register user on backend');
    //       });
    //   }
    // } catch (err) {
    //   console.error('Firebase registration error:', err);
    //   error('Registration Failed', 'Failed to create Firebase account');
    // }

    try {
      const result = await signUp(email, password, firstName, lastName);
      console.log('Firebase registration result:', result);

      if (result.success && result.user) {
        console.log('Firebase registration successful:', result.user);
        success('Registration Successful', 'Your account has been created successfully!');

        // Get the Firebase ID token
        const accessToken = await result.user.getIdToken();
        console.log('Firebase Access Token:', accessToken);

        // Send data to Laravel backend
        const response = await axios.post(
          'http://127.0.0.1:8000/api/register',
          {
            email,
            password,
            password_confirmation: confirmPassword,
            firstName,
            lastName,
            phone,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Backend registration successful:', response.data);
      } else {
        error('Registration Failed', 'Firebase registration failed or user is missing.');
      }
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        // @ts-ignore
        console.error('Registration error:', err.response?.data || err);
      } else {
        console.error('Registration error:', err);
      }
      error('Registration Failed', 'Failed to register user');
    }
  };

  const handleGoogleAuth = async () => {
    console.log('Initiating Google Authentication');
    try {
      const result = await signInWithGoogle();
      if (result.success) {
        success('Success', 'Successfully signed in with Google!');
        router.push('/');
      } else {
        error('Authentication Failed', result.error || 'Google Authentication failed');
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
      error('Authentication Failed', 'Google Authentication failed');
    }
  };

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

      {/* Right Side - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-yellow-200"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Join Storevia</h2>
          <p className="text-gray-500 mb-8">Create your account to start shopping</p>

          <div className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <motion.input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full p-4 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-800 shadow-sm transition-all duration-300"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <motion.input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
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
                placeholder="user@storevia.com"
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
                placeholder="+1234567890"
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
            Stampa
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
            <motion.button
              onClick={handleRegister}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold shadow-lg relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">SIGN UP</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-transparent opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={handleGoogleAuth}
                className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg relative overflow-hidden flex items-center justify-center"
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.7)',
                }}
                whileTap={{ scale: 0.9 }}
                title="Sign Up with Google"
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
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-transparent opacity-0"
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <Link href="/user/login" className="text-yellow-400 hover:underline">
                Log In
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
            {['Start', 'Your', 'Shopping', 'Journey'].map((word, index) => (
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
            Sign up to explore a world of products with Storevia!
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

export default UserRegister;
