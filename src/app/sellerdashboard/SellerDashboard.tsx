/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Orders from './Orders';
import Products from './Products';
import Overview from './Overview';
import Inbox from './Inbox';
import StoreProfile from './StoreProfile';
import Settings from './Settings';
import HelpCenter from './HelpCenter';
import LearnAboutStorevia from './LearnAboutStorevia';
import { useRouter } from 'next/navigation';

const SellerDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newOrdersCount] = useState();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchNewOrdersCount = useCallback(async () => {
    try {
      const storeId = sessionStorage.getItem('storeId');
      const sellerId = sessionStorage.getItem('sellerId');

      if (!storeId || !sellerId) {
        return;
      }

      const response = await fetch(`${baseUrl}/getOrders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId, seller_id: sellerId }),
      });

      const data = await response.json();
      console.log(data);

      if (Array.isArray(data)) {
        // Count all orders except those with "Delivered" status
        const pendingOrders = data.filter(
          (order) => String(order.status).trim().toLowerCase() !== 'delivered'
        );
        // setNewOrdersCount(pendingOrders.length);
      } else {
        // setNewOrdersCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch new orders count:', error);
    }
  }, [baseUrl]);

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    console.log('Role:', userRole);

    if (userRole !== 'seller') {
      router.push('/unauthorizePage');
    } else {
      fetchNewOrdersCount();
      const interval = setInterval(fetchNewOrdersCount, 30000);

      return () => clearInterval(interval);
    }
  }, [fetchNewOrdersCount, router]);

  const sidebarVariants = {
    open: { width: '16rem', transition: { duration: 0.3 } },
    closed: { width: '4rem', transition: { duration: 0.3 } },
  };

  const contentVariants = {
    enter: { opacity: 0, x: 20, transition: { duration: 0.3 } },
    center: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  const generalMenuItems = [
    {
      name: 'Overview',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      tab: 'overview',
    },
    { name: 'Products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', tab: 'products' },
    {
      name: 'Orders',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      tab: 'orders',
      badge: newOrdersCount,
    },
    {
      name: 'Inbox',
      icon: 'M3 5h18a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm9 4l9 5-9 5-9-5z',
      tab: 'inbox',
    },
  ];

  const accountMenuItems = [
    {
      name: 'Store Profile',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
      tab: 'store-profile',
    },
    {
      name: 'Settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      tab: 'settings',
    },
  ];

  const supportMenuItems = [
    {
      name: 'Help Center',
      icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      tab: 'help-center',
    },
    {
      name: 'Learn About Storevia',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      tab: 'learn-about-storevia',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders onOrderUpdate={fetchNewOrdersCount} />;
      case 'inbox':
        return <Inbox />;
      case 'store-profile':
        return <StoreProfile />;
      case 'settings':
        return <Settings />;
      case 'help-center':
        return <HelpCenter />;
      case 'learn-about-storevia':
        return <LearnAboutStorevia />;
      default:
        return (
          <motion.div
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="p-6"
          >
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              {activeTab
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </h1>
            <p className="text-gray-600">Content for {activeTab} coming soon!</p>
          </motion.div>
        );
    }
  };

  interface MenuItem {
    name: string;
    icon: string;
    tab: string;
    badge?: number;
  }

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      router.replace('/seller');
      localStorage.setItem('seller_id', '0');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderMenuItem = (item: MenuItem) => (
    <motion.button
      key={item.tab}
      onClick={() => {
        setActiveTab(item.tab);
        // Refresh new orders count when Orders tab is clicked
        if (item.tab === 'orders') {
          fetchNewOrdersCount();
        }
      }}
      className={`w-full flex items-center px-4 py-3 transition-colors rounded-lg ${
        activeTab === item.tab ? 'bg-yellow-400 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
      </svg>
      {isSidebarOpen && <span className="ml-3 flex-1 text-left">{item.name}</span>}
      {isSidebarOpen && item.badge && item.badge > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </motion.button>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      <motion.div
        className="bg-white text-gray-800 shadow-md fixed top-0 left-0 h-screen flex flex-col"
        variants={sidebarVariants}
        initial="open"
        animate={isSidebarOpen ? 'open' : 'closed'}
      >
        {/* Header with Logo and Toggle Button - Fixed at top */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200 bg-white z-10">
          {isSidebarOpen && (
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <Image
                  src="/web.png"
                  alt="Storevia Logo"
                  width={100}
                  height={32}
                  className="object-contain"
                />
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {isSidebarOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Scrollable Navigation - Takes remaining space */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-6">
            {isSidebarOpen && <div className="text-sm text-gray-500 ml-4 mb-2">Menu</div>}
            <div className="space-y-1">{generalMenuItems.map(renderMenuItem)}</div>

            {isSidebarOpen && <div className="text-sm text-gray-500 ml-4 mb-2 mt-6">Account</div>}
            <div className="space-y-1">{accountMenuItems.map(renderMenuItem)}</div>

            {isSidebarOpen && <div className="text-sm text-gray-500 ml-4 mb-2 mt-6">Support</div>}
            <div className="space-y-1">{supportMenuItems.map(renderMenuItem)}</div>
          </nav>
        </div>

        {/* Fixed Logout Button at Bottom */}
        <div className="border-t border-gray-200 bg-white p-4">
          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 transition-colors rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 border border-red-200 hover:border-red-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      <div
        className="flex-1"
        style={{
          marginLeft: isSidebarOpen ? '16rem' : '4rem',
          transition: 'margin-left 0.3s',
        }}
      >
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </div>
  );
};

export default SellerDashboard;
