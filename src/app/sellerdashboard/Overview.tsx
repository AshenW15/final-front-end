/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { DollarSign, Package, ShoppingCart, TrendingUp, Users, Eye, Share2 } from 'lucide-react';
import { Copy, Check } from 'react-feather';
import { useLoading } from '@/hooks/useLoading';
import { formatPriceLKR } from '@/lib/utils';
import LoadingOverlay from '@/components/ui/loading-overlay';

// Color palette matching Analytics page
const COLORS = {
  primary: '#FFC107', // Yellow
  secondary: '#FFD54F', // Light yellow
  accent1: '#FF9800', // Orange-yellow
  accent2: '#FF5722', // Coral
  accent3: '#8C52FF', // Purple
  accent4: '#5CE1E6', // Teal
  grey1: '#F9FAFB',
  grey2: '#F3F4F6',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
};

// Background gradient
const BG_GRADIENT = 'linear-gradient(to right bottom, #F9FAFB, #FFF9C4, #FFFFFF)';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const Overview = () => {
  const { isLoading } = useLoading();

  type BestSellingProduct = {
    product_id?: number;
    name: string;
    imageUrl?: string;
    sold: number;
    sales_value?: number;
  };
  type RecentOrder = {
    order_id: number;
    order_number: string;
    order_status: string;
    order_date: string;
    customer_name: string;
    total_items: number;
    total_price: number;
  };
  type SummaryStatsData = {
    total_orders_value?: number;
    total_products?: number;
    total_orders?: number;
    order_status_counts?: {
      processing: number;
      out_for_delivery: number;
      completed: number;
      cancelled: number;
    };
    best_selling_products?: BestSellingProduct[];
    recent_orders?: RecentOrder[];
  };

  const [summaryStatsData, setSummaryStatsData] = useState<SummaryStatsData>({});
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [sellerId, setSellerId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const storeId = searchParams.get('shopId');
  const topProducts = summaryStatsData.best_selling_products ?? [];
  const bestProduct = summaryStatsData.best_selling_products?.[0];
  const recentOrders = summaryStatsData.recent_orders ?? [];
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [shopName, setShopName] = useState('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [shopUrl, setShopUrl] = useState('');

  const getImageSrc = (img?: string) => {
    if (typeof img !== 'string' || img.trim() === '') {
      return '/images/placeholder.png';
    }
    if (img.startsWith('http')) return img;
    return `${baseUrl?.replace(/\/$/, '')}/${img.replace(/^\/+/, '')}`;
  };

  const formatCurrency = (value?: number) =>
    typeof value === 'number' ? formatPriceLKR(value) : '';
  useEffect(() => {
    const storedSellerId = localStorage.getItem('seller_id');
    setSellerId(storedSellerId);
  }, []);

  const fetchSummaryStats = useCallback(async () => {
    if (!storeId || !sellerId) return;
    try {
      const response = await fetch(`${baseUrl}/get_dashboard_stats.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: sellerId, store_id: storeId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log(data);
      setSummaryStatsData(data);
    } catch (error) {
      console.error('Error fetching summary stats:', error);
    }
  }, [storeId, sellerId, baseUrl]);

  useEffect(() => {
    if (storeId && sellerId) {
      fetchSummaryStats();
    }
  }, [storeId, sellerId, fetchSummaryStats]);

  const fetchReferralInfo = useCallback(async () => {
    if (!sellerId) return; // Exit if seller ID is not available

    try {
      const response = await fetch(`${baseUrl}/get_referral_info.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: sellerId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReferralCode(data.referralCode);
      setReferralLink(data.referralLink);
    } catch (error) {
      console.error('Error fetching referral info:', error);
    }
  }, [sellerId]); // Re-run when sellerId changes

  useEffect(() => {
    if (sellerId) {
      fetchReferralInfo();
    }
  }, [sellerId, fetchReferralInfo]);

  // Function to fetch shop information
  const fetchShopInfo = useCallback(async () => {
    if (!storeId) return;

    try {
      const response = await fetch(`${baseUrl}/fetch_store_details.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setShopName(data.store_name || 'My Store');
      }
    } catch (error) {
      console.error('Error fetching shop info:', error);
      setShopName('My Store'); // Fallback name
    }
  }, [storeId, baseUrl]);

  useEffect(() => {
    if (storeId) {
      fetchShopInfo();
    }
  }, [storeId, fetchShopInfo]);

  // Set shop URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && storeId) {
      setShopUrl(`${window.location.origin}/store/${storeId}`);
    }
  }, [storeId]);

  // Function to copy text to clipboard
  interface CopyToClipboardFn {
    (text: string, itemType: string): void;
  }

  const copyToClipboard: CopyToClipboardFn = (text, itemType) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedItem(itemType);
        setTimeout(() => setCopiedItem(null), 2000); // Clear after 2 seconds
      })
      .catch((err: unknown) => {
        console.error('Error copying text: ', err);
        alert('Failed to copy to clipboard');
      });
  };

  // Share functions
  const shareShopLink = () => {
    if (storeId) {
      const storeUrl = referralLink;
      copyToClipboard(storeUrl, 'shopLink');
    }
  };

  const viewShop = () => {
    if (storeId) {
      // Use the new client-side routing approach
      const storeUrl = `www.storevia.lk/store?id=${storeId}`;
      copyToClipboard(storeUrl, 'shopLink');
    }
  };

  const summaryStats = [
    {
      title: 'Total Sales Value',
      value: summaryStatsData.total_orders_value?.toLocaleString() || '0',
      icon: DollarSign,
      color: COLORS.primary,
      positive: true,
    },
    {
      title: 'Total Products',
      value: summaryStatsData.total_products?.toLocaleString() || '0',
      icon: Package,
      color: COLORS.secondary,
      positive: true,
    },
    {
      title: 'Total Orders',
      value: summaryStatsData.total_orders?.toLocaleString() || '0',
      icon: ShoppingCart,
      color: COLORS.accent1,
      positive: true,
    },
  ];

  return (
    <LoadingOverlay isLoading={isLoading} text="Loading overview...">
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex relative overflow-hidden font-poppins"
        style={{ background: BG_GRADIENT }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Decorative Background Elements */}
        <motion.div
          className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-20 blur-xl"
          style={{ backgroundColor: COLORS.primary }}
          animate={{
            x: ['-5%', '5%', '-5%'],
            y: ['-5%', '5%', '-5%'],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-52 h-52 rounded-full opacity-20 blur-xl"
          style={{ backgroundColor: COLORS.secondary }}
          animate={{
            x: ['5%', '-5%', '5%'],
            y: ['5%', '-5%', '5%'],
          }}
          transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-20 blur-xl"
          style={{ backgroundColor: COLORS.accent1 }}
          animate={{
            x: ['10%', '-10%', '10%'],
            y: ['10%', '-10%', '10%'],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
        />

        {/* Main Content */}
        <motion.div variants={fadeIn} className="flex-1 p-6 lg:p-8 z-10 w-full">
          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center mb-8"
            variants={itemVariants}
          >
            <motion.div className="flex items-center">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-primary to-accent1 flex items-center justify-center rounded-xl mr-4 shadow-lg"
                whileHover={{ scale: 1.05 }}
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                }}
              >
                <Eye className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  <span className="text-yellow-500">Overview</span>
                </h1>
                <p className="text-gray-500">Dashboard summary and key metrics</p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center space-x-4 mt-4 md:mt-0"
              variants={itemVariants}
            >
              {/* Modern Share & Earn Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-4 w-full max-w-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-yellow-500 p-1.5 rounded-lg mr-2">
                      <Share2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Quick Actions</span>
                  </div>
                  <div className="text-xs text-gray-500">Share Your Store</div>
                </div>

                {/* Horizontal Action Buttons */}
                <div className="flex space-x-2">
                  {/* Copy Referral Code */}
                  {/* <div className="flex-1 group">
                    <button
                      onClick={() => copyToClipboard(referralCode, 'referralCode')}
                      className="w-full bg-white hover:bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 transition-all duration-200 hover:shadow-md group-hover:scale-105"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        {copiedItem === 'referralCode' ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-yellow-600" />
                        )}
                        <span className="text-xs font-medium text-gray-700">
                          {copiedItem === 'referralCode' ? 'Copied!' : 'Code'}
                        </span>
                      </div>
                    </button>
                  </div> */}

                  {/* Copy Shop Link */}
                  {/* <div className="flex-1 group">
                    <button
                      onClick={shareShopLink}
                      className="w-full bg-white hover:bg-blue-50 border border-blue-200 rounded-lg p-2.5 transition-all duration-200 hover:shadow-md group-hover:scale-105"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        {copiedItem === 'shopLink' ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-blue-600" />
                        )}
                        <span className="text-xs font-medium text-gray-700">
                          {copiedItem === 'shopLink' ? 'Copied!' : 'Link'}
                        </span>
                      </div>
                    </button>
                  </div> */}

                  {/* View Shop */}
                  <div className="flex-1 group flex flex-col items-center">
                    <button
                      onClick={viewShop}
                      className="w-full bg-white hover:bg-green-50 border border-green-200 rounded-lg p-2.5 transition-all duration-200 hover:shadow-md group-hover:scale-105"
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <Eye className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-xs font-medium text-gray-700">Copy Link</span>
                      </div>
                    </button>
                    {copiedItem === 'shopLink' && (
                      <div className="mt-2 flex items-center text-green-600 text-xs font-semibold bg-green-50 border border-green-200 rounded px-2 py-1 animate-fade-in-out shadow">
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Shop link copied!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="grid gap-6">
            {/* Overview Cards */}
            <motion.div className="grid gap-6 md:grid-cols-3" variants={itemVariants}>
              {summaryStats.map((card, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
                    style={{ backgroundColor: card.color }}
                  />
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}20`, color: card.color }}
                    >
                      <card.icon className="h-5 w-5" />
                    </motion.div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Orders Bar Graph Section */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
              variants={itemVariants}
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" style={{ color: COLORS.primary }} />
                    Orders Overview
                  </h3>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-around gap-8 sm:gap-6">
                {[
                  {
                    title: 'Processing Orders',
                    value: summaryStatsData.order_status_counts?.processing || 0,
                    color: 'bg-blue-500',
                    label: 'Processing',
                    maxValue: summaryStatsData.total_orders || 1,
                  },
                  {
                    title: 'Out for Delivery',
                    value: summaryStatsData.order_status_counts?.out_for_delivery || 0,
                    color: 'bg-yellow-500',
                    label: 'Out for Delivery',
                    maxValue: summaryStatsData.total_orders || 1,
                  },
                  {
                    title: 'Completed Orders',
                    value: summaryStatsData.order_status_counts?.completed || 0,
                    color: 'bg-green-500',
                    label: 'Completed',
                    maxValue: summaryStatsData.total_orders || 1,
                  },
                  {
                    title: 'Cancelled Orders',
                    value: summaryStatsData.order_status_counts?.cancelled || 0,
                    color: 'bg-red-500',
                    label: 'Cancelled',
                    maxValue: summaryStatsData.total_orders || 1,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center group w-20 sm:w-24"
                  >
                    {/* Bar */}
                    <motion.div
                      className="relative w-full h-52 sm:h-64 bg-gray-100 rounded-xl overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`${item.color} absolute bottom-0 left-0 w-full rounded-b-xl transition-all duration-500`}
                        style={{
                          height: `${(item.value / item.maxValue) * 100}%`,
                        }}
                      ></div>
                    </motion.div>

                    {/* Tooltip (on Hover) */}
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 mt-2 text-xs text-gray-500 transition-all"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {((item.value / item.maxValue) * 100).toFixed(1)}% Filled
                    </motion.div>

                    {/* Label */}
                    <span className="text-sm font-semibold text-gray-600 mt-2">{item.label}</span>

                    {/* Value */}
                    <p className="text-lg font-bold text-gray-900">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Best Selling Products and Product Highlights */}
            <motion.div className="grid gap-6 md:grid-cols-2" variants={itemVariants}>
              {/* Product List (Left Side) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <Package className="h-5 w-5" style={{ color: COLORS.primary }} />
                  Top Products
                </h3>

                {topProducts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No top products yet.</div>
                ) : (
                  <ul className="space-y-4">
                    {topProducts.map((product, idx) => {
                      const imageSrc = getImageSrc(product.imageUrl);
                      const key = product.product_id ?? `${product.name}-${idx}`;
                      const highlight = idx === 0; // highlight top product

                      return (
                        <motion.li
                          key={key}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg hover:shadow-md transition-all ease-in-out text-gray-800 font-semibold ${
                            highlight
                              ? 'border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100'
                              : ''
                          }`}
                        >
                          {/* Product Image */}
                          <motion.img
                            src={imageSrc}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-full mr-6 shadow-lg transform"
                            initial={{ scale: 1 }}
                          />

                          {/* Product Name + Sold + Sales value */}
                          <div className="flex-1 flex flex-col space-y-1">
                            <span className="flex items-center gap-2 font-medium text-lg text-gray-800">
                              {product.name}
                            </span>
                            <div className="flex items-baseline gap-4">
                              <span className="text-green-600 text-xl font-bold">
                                {product.sold} sold
                              </span>
                              {product.sales_value !== undefined && (
                                <span className="text-sm text-gray-500">
                                  {formatCurrency(product.sales_value)}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                )}
              </motion.div>

              {/* Best Product Details (Right Side) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5" style={{ color: COLORS.primary }} />
                  Best Selling Product
                </h3>

                {bestProduct ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <motion.img
                        src={getImageSrc(bestProduct.imageUrl)}
                        alt={bestProduct.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="flex flex-col space-y-2">
                        <span className="text-xl font-semibold text-gray-800">
                          {bestProduct.name}
                        </span>
                        <span className="text-lg font-semibold text-green-600">
                          {bestProduct.sold} units sold
                        </span>
                        {bestProduct.sales_value !== undefined && (
                          <span className="text-sm text-gray-500 font-semibold">
                            {formatCurrency(bestProduct.sales_value)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 font-medium">
                      This is your top-performing product with excellent customer feedback and high
                      demand.
                    </p>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    No best selling product found.
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <Users className="h-5 w-5" style={{ color: COLORS.primary }} />
                Recent Orders
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700 font-semibold">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="px-6 py-3 text-left text-gray-900 font-bold">Order ID</th>
                      <th className="px-6 py-3 text-left text-gray-900 font-bold">Customer</th>
                      <th className="px-6 py-3 text-left text-gray-900 font-bold">Items</th>
                      <th className="px-6 py-3 text-left text-gray-900 font-bold">Order Date</th>
                      <th className="px-6 py-3 text-center text-gray-900 font-bold">Status</th>
                      <th className="px-6 py-3 text-center text-gray-900 font-bold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No recent orders found.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <motion.tr
                          key={order.order_id}
                          whileHover={{ scale: 1.01, backgroundColor: '#F9FAFB' }}
                          className="border-b transition duration-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-gray-800 font-medium">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 font-medium">{order.customer_name}</td>
                          <td className="px-6 py-4 font-medium">{order.total_items}</td>
                          <td className="px-6 py-4 font-medium">{order.order_date}</td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1 text-white text-xs rounded-full font-bold ${
                                order.order_status.toLowerCase().includes('cancel')
                                  ? 'bg-red-500'
                                  : order.order_status.toLowerCase().includes('process')
                                  ? 'bg-blue-500'
                                  : order.order_status.toLowerCase().includes('delivery')
                                  ? 'bg-yellow-400'
                                  : order.order_status.toLowerCase().includes('deliver')
                                  ? 'bg-green-500'
                                  : 'bg-gray-400'
                              }`}
                            >
                              {order.order_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-gray-900">
                            {formatPriceLKR(order.total_price)}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </LoadingOverlay>
  );
};

export default Overview;
