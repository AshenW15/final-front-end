/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  Clock,
  Gift,
  ShoppingBag,
  User,
  MessageSquare,
  Users,
  HelpCircle,
  BarChart2,
  Lightbulb,
  FileText,
  AlertTriangle,
  Menu as MenuIcon,
  X as CloseIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../home/Header';
import { useLoading } from '@/hooks/useLoading';
import LoadingOverlay from '@/components/ui/loading-overlay';
import Account from './accountsection/Account';
import Wishlist from './components/Wishlist';
import Purchased from './components/MyOrders';
import Settings from './components/Settings';
import ShippingAddress from './components/ShippingAddress';
import MessageCenter from './components/MessageCenter';
import HelpCenter from './components/HelpCenter';
import Feedback from './components/Feedback';
import Following from './components/Following';
import RefundAndReturn from './components/RefundAndReturn';
import { JSX } from 'react/jsx-runtime';

const ProfilePage: FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileComponent, setShowMobileComponent] = useState(false);

  const handleBecomeSellerClick = () => {
    // Handle seller registration navigation
    window.open('/seller/sellerregistration', '_blank');
  };

  const handleMobileComponentSelect = (componentId: string) => {
    setActiveComponent(componentId);
    setShowMobileComponent(true);
  };

  const handleBackToMenu = () => {
    setShowMobileComponent(false);
  };

  // Map menu item IDs to components - using all available working components
  const componentMap: Record<string, JSX.Element> = {
    overview: <Account setActiveComponent={setActiveComponent} />,
    purchased: <Purchased />,
    wishlist: <Wishlist defaultTab="wishlist" />,
    following: <Following defaultTab="following" />,
    settings: <Settings />,
    'shipping-address': <ShippingAddress />,
    'refund-and-return': <RefundAndReturn />,
    feedback: <Feedback />,
    coupons: <Account setActiveComponent={setActiveComponent} />,
    'help-center': <HelpCenter />,
    'message-center': <MessageCenter />,
  };

  // Menu items organized 
  const menuItems = [
    // My Account section
    {
      section: 'My Account',
      items: [
        { id: 'overview', label: 'My Profile', icon: User },
        { id: 'shipping-address', label: 'Address Book', icon: Users },
        // { id: 'settings', label: 'My Payment Options', icon: CreditCard },
        // { id: 'coupons', label: 'Points', icon: Gift },
      ]
    },
    // My Orders section  
    {
      section: 'My Orders',
      items: [
        { id: 'purchased', label: 'My Orders', icon: ShoppingBag },
        // { id: 'unpaid', label: 'My Returns', icon: Clock },
        // { id: 'shipped', label: 'My Cancellations', icon: X },
      ]
    },
    // My Reviews section
    {
      section: 'My Reviews',
      items: [
        // { id: 'feedback', label: 'My Reviews', icon: MessageSquare },
      ]
    },
    // My Wishlist & Followed Stores section
    {
      section: 'My Wishlist & Followed Stores',
      items: [
        { id: 'wishlist', label: 'My Wishlist', icon: Heart },
        { id: 'following', label: 'Followed Stores', icon: Users },
      ]
    },
    // Other sections
    {
      section: '',
      items: [
        { id: 'refund-and-return', label: 'Refund and return', icon: Clock },
        { id: 'settings', label: 'Settings', icon: BarChart2 },
        { id: 'help-center', label: 'Help center', icon: HelpCircle },
      ]
    }
  ];

  // Animation variants for menu items
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    hover: { x: 5, color: '#FFC107', transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View - Full Screen List */}
      <div className="block md:hidden">
        {!showMobileComponent ? (
          <>
            {/* Mobile Header */}
            <div className="bg-yellow-500 text-black p-4 flex items-center">
              <button className="mr-3" onClick={() => window.location.href = '/'}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-medium">My Account</h1>
            </div>

            {/* User Info Section */}
            <div className="bg-white px-4 py-3 border-b border-gray-200">
              <p className="text-sm text-gray-600">Hello, Guest User</p>
            </div>

            {/* Mobile Menu List - Only working pages */}
            <div className="bg-white">
              {[
                { id: 'message-center', label: 'Message', icon: '💬' },
                { id: 'purchased', label: 'My Orders', icon: '📦' },
                { id: 'refund-and-return', label: 'My Returns', icon: '↩️' },
                { id: 'wishlist', label: 'My Wishlist', icon: '❤️' },
                { id: 'following', label: 'Followed Stores', icon: '👥' },
                { id: 'coupons', label: 'Vouchers', icon: '🎟️' },
                { id: 'feedback', label: 'My Reviews', icon: '⭐' },
                { id: 'shipping-address', label: 'Address Book', icon: '📍' },
                { id: 'settings', label: 'My Payment Options', icon: '💳' },
                { id: 'overview', label: 'Account Information', icon: 'ℹ️' },
                { id: 'help-center', label: 'Help Center', icon: '🆘' },
              ].map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleMobileComponentSelect(item.id)}
                  className="w-full flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="flex-1 text-left text-gray-800">{item.label}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Mobile Component View */}
            <div className="bg-yellow-500 text-black p-4 flex items-center">
              <button className="mr-3" onClick={handleBackToMenu}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-medium">
                {[
                  { id: 'message-center', label: 'Message' },
                  { id: 'purchased', label: 'My Orders' },
                  { id: 'refund-and-return', label: 'My Returns' },
                  { id: 'wishlist', label: 'My Wishlist' },
                  { id: 'following', label: 'Followed Stores' },
                  { id: 'coupons', label: 'Vouchers' },
                  { id: 'feedback', label: 'My Reviews' },
                  { id: 'shipping-address', label: 'Address Book' },
                  { id: 'settings', label: 'Payment Options' },
                  { id: 'overview', label: 'Account Information' },
                  { id: 'help-center', label: 'Help Center' },
                ].find(item => item.id === activeComponent)?.label || 'My Account'}
              </h1>
            </div>
            
            {/* Component Content */}
            <div className="bg-white min-h-screen">
              {componentMap[activeComponent] || <Account setActiveComponent={setActiveComponent} />}
            </div>
          </>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        {/* Header */}
        <Header
          onBecomeSellerClick={handleBecomeSellerClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Mobile Menu Button - Remove since we have full mobile view now */}

        {/* Floating SideMenu Button for Mobile - Remove since we have full mobile view now */}

        {/* Responsive SideMenu */}
        {/* Desktop Sidebar */}
        <div className="fixed w-64 h-full">
          <div className="w-64 bg-[#FFFFFF] shadow-md p-4 h-full overflow-y-auto">
            {/* Menu Items */}
            <div className="space-y-4">
              {menuItems.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-1">
                  {section.section && (
                    <h3 className="text-sm font-semibold mb-2 text-blue-600">
                      {section.section}
                    </h3>
                  )}
                  {section.items.map((item, itemIndex) => (
                    <motion.button
                      key={item.id}
                      custom={itemIndex}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                      whileHover="hover"
                      onClick={() => setActiveComponent(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                        activeComponent === item.id
                          ? 'bg-[#FFC107] text-[#000000]'
                          : 'text-[#666666] hover:bg-gray-50 hover:text-[#000000]'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-64 flex-1 bg-gray-50 min-h-screen p-6">
          {componentMap[activeComponent] || <Account setActiveComponent={setActiveComponent} />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;