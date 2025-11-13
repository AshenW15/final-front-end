'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Overview from './Dashboard';
import Analytics from './Analytics';
import Users from './Users';
import Categories from './Categories';
import Products from './Products';
import Orders from './Orders';
import Reports from './Reports';
import SellersChecking from './SellersChecking';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    { name: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', tab: 'overview' },
    { name: 'Analytics', icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', tab: 'analytics' },
    { name: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', tab: 'users' },
    { name: 'Sellers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', tab: 'sellers-checking', badge: 3 },
    { name: 'Categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', tab: 'categories' },
    { name: 'Products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', tab: 'products' },
    { name: 'Orders', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', tab: 'orders', badge: 4 },
    { name: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', tab: 'reports' },
  ];

  const adminMenuItems = [
    { name: 'System Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', tab: 'system-settings' },
    { name: 'Audit Logs', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', tab: 'audit-logs' },
  ];

  const supportMenuItems = [
    { name: 'Help Center', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', tab: 'help-center' },
    { name: 'Learn About Storevia', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', tab: 'learn-about-storevia' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'analytics':
        return <Analytics />;
      case 'users':
        return <Users />;
      case 'sellers-checking':
        return <SellersChecking />;
      case 'categories':
        return <Categories />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'reports':
        return <Reports />;
      default:
        return (
          <motion.div
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="p-6"
          >
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
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

  const renderMenuItem = (item: MenuItem) => (
    <motion.button
      key={item.tab}
      onClick={() => setActiveTab(item.tab)}
      className={`w-full flex items-center px-4 py-3 transition-colors rounded-lg ${
        activeTab === item.tab
          ? 'bg-blue-400 text-gray-900'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
      </svg>
      {isSidebarOpen && (
        <span className="ml-3 flex-1 text-left">{item.name}</span>
      )}
      {isSidebarOpen && item.badge && (
        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </motion.button>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 font-poppins">
      <motion.div
        className="bg-white text-gray-800 flex flex-col shadow-md"
        variants={sidebarVariants}
        initial="open"
        animate={isSidebarOpen ? 'open' : 'closed'}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold flex items-center">
              <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-500">A</span>dmin Panel
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {isSidebarOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-6">
          {isSidebarOpen && (
            <div className="text-sm text-gray-500 ml-4 mb-2">Menu</div>
          )}
          <div className="space-y-1">
            {generalMenuItems.map(renderMenuItem)}
          </div>
          
          {isSidebarOpen && (
            <div className="text-sm text-gray-500 ml-4 mb-2 mt-6">Admin</div>
          )}
          <div className="space-y-1">
            {adminMenuItems.map(renderMenuItem)}
          </div>
          
          {isSidebarOpen && (
            <div className="text-sm text-gray-500 ml-4 mb-2 mt-6">Support</div>
          )}
          <div className="space-y-1">
            {supportMenuItems.map(renderMenuItem)}
          </div>
        </nav>
        
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <button className="w-full text-left text-red-500 hover:text-red-600 font-medium text-sm">
              Logout
            </button>
          </div>
        )}
      </motion.div>
      
      <div className="flex-1">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;