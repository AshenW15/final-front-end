/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  User,
  ShoppingCart,
  ChevronDown,
  Smartphone,
  LogOut,
  Store,
  BarChart3,
  Settings
} from 'lucide-react';

interface SellerHeaderProps {
  onLogout?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  showRegisterStore?: boolean;
  showLogout?: boolean;
  additionalNavItems?: Array<{
    label: string;
    href: string;
  }>;
}

const SellerHeader: FC<SellerHeaderProps> = ({ 
  onLogout, 
  showRegisterStore = true, 
  showLogout = true,
  additionalNavItems = []
}) => {
  const router = useRouter();

  const handleDefaultLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      localStorage.removeItem('seller_id');
      sessionStorage.setItem('userRole', 'guest');
      router.push('/seller');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const logoutHandler = onLogout || handleDefaultLogout;

  // Animation variants
  const iconButtonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const navItemVariants = {
    hover: { y: -2, transition: { duration: 0.2 } }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group">
            <motion.div
              variants={logoVariants}
              initial="initial"
              animate="animate"
              className="flex items-center cursor-pointer"
            >
              <Image
                src="/web.png"
                alt="Storevia Logo"
                width={100}
                height={32}
                className="object-contain mr-2"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-yellow-600 text-xs font-medium leading-tight">Premium Store Network</span>
                <span className="text-gray-600 text-xs leading-tight">Seller Portal</span>
              </div>
            </motion.div>
          </Link>

          {/* Navigation Section */}
          <nav className="flex items-center space-x-2 lg:space-x-4">
            {/* Home Link */}
            <motion.div
              variants={navItemVariants}
              whileHover="hover"
            >
              <Link
                href="/"
                className="flex items-center text-gray-700 hover:text-yellow-600 text-sm lg:text-base font-medium relative group transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <span>Home</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>

           

            {/* Additional Navigation Items */}
            {additionalNavItems.map((item, index) => (
              <motion.div
                key={index}
                variants={navItemVariants}
                whileHover="hover"
              >
                <Link
                  href={item.href}
                  className="flex items-center text-gray-700 hover:text-yellow-600 text-sm lg:text-base font-medium relative group transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}

            {/* Logout Button */}
            {showLogout && (
              <motion.button
                variants={iconButtonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={logoutHandler}
                className="flex items-center text-gray-700 hover:text-red-500 text-sm lg:text-base font-medium transition-colors px-3 py-2 rounded-lg hover:bg-red-50 border border-red-200 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:block">Logout</span>
              </motion.button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
