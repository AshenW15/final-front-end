'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import useAlerts from '@/hooks/useAlerts';

import Dashboard from '../adminpanel/Dashboard';
import Users from '../adminpanel/Users';
import Categories from '../adminpanel/Categories';
import Products from '../adminpanel/Products';
import Orders from '../adminpanel/Orders';
import Reports from '../adminpanel/Reports';
import SellersChecking from '../adminpanel/SellersChecking';

const AdminPanel = () => {
  const [adminname, setAdminName] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const { confirm, AlertModalComponent, ConfirmationModalComponent } = useAlerts();

  useEffect(() => {
    const username = searchParams.get('username');
    setAdminName(username);
  }, [searchParams]);

  const router = useRouter();
  const [orderCount, setOrderCount] = useState();
  const [sellerCount, setSellerCount] = useState();

useEffect(() => {
  const role = sessionStorage.getItem('userRole');

  // Redirect if not admin
  if (role !== 'admin') {
    router.push('/unauthorizePage');
    return; // Prevent fetch calls if unauthorized
  }

  // Get Order Count
  fetch(`${baseUrl}/getAllOrders.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Orders:", res);
      if (res?.order_count !== undefined) {
        setOrderCount(res.order_count);
      }
    })
    .catch((err) => console.error("Order fetch error:", err));

  // Get Seller Count
  fetch(`${baseUrl}/sellers_info.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Sellers:", res);
      if (res?.total_sellers !== undefined) {
        setSellerCount(res.total_sellers);
      }
    })
    .catch((err) => console.error("Seller fetch error:", err));
    
}, [router, baseUrl]);

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
    {
      name: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      tab: 'overview',
    },
    {
      name: 'Users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      tab: 'users',
    },
    {
      name: 'Sellers',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      tab: 'sellers-checking',
      badge: sellerCount,
    },
    { name: 'Categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', tab: 'categories' },
    { name: 'Products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', tab: 'products' },
    {
      name: 'Orders',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      tab: 'orders',
      badge: orderCount,
    },
    {
      name: 'Reports',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      tab: 'reports',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard />;
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

  // const logout = () => {
  //   try {
  //     confirm('Logout Confirmation', 'Do you want to logout?', () => {
  //       sessionStorage.setItem('userRole', 'guest');
  //       console.log('Admin logged out successfully.');
  //       router.push('/admin');
  //     });
  //   } catch (e) {
  //     console.error('Admin logout error', e);
  //   }
  // };

  const logout = () => {
  try {
    confirm('Logout Confirmation', 'Do you want to logout?', () => {
      sessionStorage.setItem('userRole', 'guest');
      console.log('Admin logged out successfully.');
      router.replace('/admin'); // <-- replace instead of push
    });
  } catch (e) {
    console.error('Admin logout error', e);
  }
};


  const renderMenuItem = (item: MenuItem) => (
    <motion.button
      key={item.tab}
      onClick={() => setActiveTab(item.tab)}
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
      {isSidebarOpen && item.badge && (
        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </motion.button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-poppins">
      {/* Alert and Confirmation Modals */}
      {AlertModalComponent}
      {ConfirmationModalComponent}

      {/* Sidebar */}
      <motion.div
        className="bg-white text-gray-800 flex flex-col shadow-md z-10 h-screen overflow-hidden"
        variants={sidebarVariants}
        initial="open"
        animate={isSidebarOpen ? 'open' : 'closed'}
      >
        {/* Header Section - Fixed */}
        <div className="p-4 flex items-center justify-between border-b flex-shrink-0">
          {isSidebarOpen && (
            <Link href="/">
              <div className="flex items-center m-2 cursor-pointer">
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

        {/* Navigation Section - Scrollable */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <nav
            className="h-full px-2 py-4 overflow-y-auto overflow-x-hidden"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e0 transparent',
            }}
          >
            <style jsx>{`
              nav::-webkit-scrollbar {
                width: 4px;
              }
              nav::-webkit-scrollbar-track {
                background: transparent;
              }
              nav::-webkit-scrollbar-thumb {
                background-color: #cbd5e0;
                border-radius: 2px;
              }
              nav::-webkit-scrollbar-thumb:hover {
                background-color: #a0aec0;
              }
            `}</style>
            <div className="space-y-4">
              {/* Dashboard Section */}
              {isSidebarOpen && (
                <div className="text-xs uppercase font-semibold text-gray-500 ml-4 mb-2">
                  MAIN HOME
                </div>
              )}
              <div className="space-y-1 mb-6">
                {generalMenuItems.slice(0, 1).map(renderMenuItem)}
              </div>

              {/* All Pages Section */}
              {isSidebarOpen && (
                <div className="text-xs uppercase font-semibold text-gray-500 ml-4 mb-2">
                  ALL PAGES
                </div>
              )}
              <div className="space-y-1 mb-6">{generalMenuItems.slice(1).map(renderMenuItem)}</div>

              {/* Bottom padding for better scroll experience */}
              <div className="h-8"></div>
            </div>
          </nav>
        </div>

        {/* Logout Section - Fixed at Bottom */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
          {isSidebarOpen ? (
            <motion.button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 font-medium text-sm rounded-lg transition-all duration-200 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                className="h-5 w-5 mr-3 group-hover:animate-pulse"
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
              Logout
            </motion.button>
          ) : (
            <motion.button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Logout"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 text-gray-600 hover:text-gray-800 focus:outline-none md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Admin Panel Title */}
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Profile */}
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mr-2">
                {adminname?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{adminname?.toUpperCase()}</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex min-h-screen bg-gray-50 items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Admin Panel...</p>
    </div>
  </div>
);

// Main page component wrapped with Suspense
const AdminPanelPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminPanel />
    </Suspense>
  );
};

export default AdminPanelPage;
