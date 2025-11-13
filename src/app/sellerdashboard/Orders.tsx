/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import useAlerts from '@/hooks/useAlerts';
import ExportModal from '@/components/ui/export-modal';
import { jsPDF } from 'jspdf';
import axios from 'axios';
// Data for Orders
// const ordersData = [
//   { id: 'ORD001', customer: 'John Doe', date: '2025-04-20', amount: 150.0, status: 'Completed' },
//   { id: 'ORD002', customer: 'Jane Smith', date: '2025-04-19', amount: 89.5, status: 'Pending' },
//   { id: 'ORD003', customer: 'Alice Brown', date: '2025-04-18', amount: 230.0, status: 'Cancelled' },
//   { id: 'ORD004', customer: 'Bob Wilson', date: '2025-04-17', amount: 45.99, status: 'Completed' },
// ];
type ShippingInfo = {
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  postal_code: string | null;
  phone: string | null;
};

type Product = {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  item_price: number;
};

type Order = {
  id: string;
  order_number: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
  store_name: string; // Store name for the seller
  shipping_info: ShippingInfo; // Shipping information for the order
  products: Product[];
};

// Color palette (same as before, adjusted for light theme)
const COLORS = {
  primary: '#FFC107', // Yellow (matching your sidebar)
  secondary: '#FFF8E1', // Very light yellow
  accent1: '#FFCA28', // Brighter orange-yellow
  accent2: '#FF8A65', // Softer coral
  accent3: '#AB47BC', // Lighter purple for contrast
  accent4: '#4DD0E1', // Lighter teal for contrast
  grey1: '#FFFFFF', // Pure white
  grey2: '#F5F5F5', // Very light gray
  textPrimary: '#212121', // Softer black for readability
  textSecondary: '#616161', // Lighter gray for secondary text
};

// Background gradient
const BG_GRADIENT = 'linear-gradient(to right bottom, #FFFFFF, #FFFDE7, #FFFFFF)';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// Pulse Animation for notification dot
const PulseNotification = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent2"></span>
  </span>
);

const Orders = ({ onOrderUpdate }: { onOrderUpdate?: () => void }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const storeId = searchParams.get('shopId');
  const [modalOpen, setModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  // Initialize alert system
  const {
    error: showError,
    success: showSuccess,
    toast,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

  useEffect(() => {
    const storedSellerId = localStorage.getItem('seller_id');
    setSellerId(storedSellerId);
  }, []);

  // const fetchOrders = useCallback(async () => {
  //   console.log('Fetching orders for store:', storeId, 'and seller:', sellerId);
  //   if (!storeId || !sellerId) {
  //     showError(
  //       'Missing Information',
  //       'Store ID or Seller ID is missing. Please try logging in again.'
  //     );
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${baseUrl}/getOrders.php`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ store_id: storeId, seller_id: sellerId }),
  //     });

  //     const data = await response.json();
  //     console.log('Fetched orders data:', data);

  //     if (Array.isArray(data)) {
  //       setOrders(data);
  //     } else {
  //       console.error('Unexpected response:', data);
  //       setOrders([]);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch orders:', error);
  //     showError(
  //       'Failed to Load Orders',
  //       'Unable to fetch orders. Please check your connection and try again.'
  //     );
  //   }
  // }, [storeId, sellerId, showError]);

  const fetchOrders = useCallback(async () => {
  console.log('Fetching orders for seller:', sellerId);

  if (!sellerId) {
    showError(
      'Missing Information',
      'Seller ID is missing. Please try logging in again.'
    );
    return;
  }

  try {
    // Fetch orders using sellerId
    const response = await axios.get(`http://127.0.0.1:8000/api/seller/${sellerId}/orders`);

    // Handle the response data
    const ordersData: any[] = response.data;
    console.log('Fetched orders data:', ordersData);

    if (Array.isArray(ordersData)) {
      setOrders(ordersData); // Update the orders state
    } else {
      console.error('Unexpected response:', ordersData);
      setOrders([]); // Clear orders in case of an unexpected response
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    showError(
      'Failed to Load Orders',
      'Unable to fetch orders. Please check your connection and try again.'
    );
    setOrders([]); // Clear orders list on error
  }
}, [sellerId, showError]);

  useEffect(() => {
    if (sellerId && storeId) {
      fetchOrders();
    }
  }, [sellerId, storeId, fetchOrders]);

  // const updateOrderStatus = async (orderId: string, newStatus: string) => {
  //   const currentOrder = orders.find((order) => order.id === orderId);

  //   console.log('Debug - Order ID:', orderId, 'Type:', typeof orderId);
  //   console.log('Debug - New Status:', newStatus);
  //   console.log('Debug - Current Order:', currentOrder);

  //   // ✅ Prevent calling backend if status is unchanged
  //   if (currentOrder && currentOrder.status === newStatus) {
  //     alert(`Order is already ${newStatus}`);
  //     return;
  //   }

  //   setLoadingOrderId(orderId);

  //   const requestBody = {
  //     order_id: parseInt(orderId), // Convert to integer
  //     status: newStatus,
  //     store_id: storeId,
  //     seller_id: sellerId,
  //   };

  //   console.log('Debug - Request Body:', requestBody);

  //   try {
  //     const response = await fetch(`${baseUrl}/updateOrderStatus.php`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(requestBody),
  //     });

  //     // Check if response is ok
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log('Server response:', data);

  //     if (data.success) {
  //       setOrders((prevOrders) =>
  //         prevOrders.map((order) =>
  //           order.id === orderId ? { ...order, status: newStatus } : order
  //         )
  //       );
  //       console.log('Order status updated successfully');

  //       // Show debug info if available
  //       if (data.debug) {
  //         console.log('Debug info:', data.debug);
  //       }

  //       // Call the callback to refresh new orders count
  //       if (onOrderUpdate) {
  //         onOrderUpdate();
  //       }

  //       alert('Order status updated successfully!');
  //     } else {
  //       console.error('Failed to update order status:', data.message);

  //       // Show debug info if available
  //       if (data.debug) {
  //         console.log('Debug info:', data.debug);
  //       }

  //       alert('Failed to update order status: ' + (data.message || 'Unknown error'));
  //     }
  //   } catch (error) {
  //     console.error('Error updating order status:', error);
  //     alert(
  //       'Error updating order status: ' + (error instanceof Error ? error.message : String(error))
  //     );
  //   } finally {
  //     setLoadingOrderId(null);
  //   }
  // };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const currentOrder = orders.find((order) => order.id === orderId);

    console.log('Debug - Order ID:', orderId, 'Type:', typeof orderId);
    console.log('Debug - New Status:', newStatus);
    console.log('Debug - Current Order:', currentOrder);

    // ✅ Prevent calling backend if status is unchanged
    if (currentOrder && currentOrder.status === newStatus) {
      alert(`Order is already ${newStatus}`);
      return;
    }

    setLoadingOrderId(orderId);

    try {
      // Send the request to the Laravel API using axios
      const response = await axios.post(`http://127.0.0.1:8000/api/order/${orderId}/${newStatus}`, {
        store_id: storeId,
        seller_id: sellerId,
      });

      // Handle the response
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        console.log('Order status updated successfully');

        // Call the callback to refresh new orders count
        if (onOrderUpdate) {
          onOrderUpdate();
        }

        alert('Order status updated successfully!');
      } else {
        console.error('Failed to update order status:', response.data.message);
        alert('Failed to update order status: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(
        'Error updating order status: ' + (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoadingOrderId(null);
    }
  };


  const handleExportOrders = () => {
    if (!orders.length) {
      showError('Export Error', 'No orders available to export.');
      return;
    }
    setShowExportModal(true);
  };

  const performOrdersExport = async () => {
    setIsExporting(true);

    try {
      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const headers = ['Order Number', 'Customer', 'Date', 'Amount', 'Status'];
      const rows = orders.map((order) => [
        order.order_number,
        order.customer,
        order.date,
        order.amount,
        order.status,
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess('Export Successful', 'Orders exported successfully!');
      setShowExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
      showError('Export Failed', 'Failed to export orders. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };


const filteredOrders = orders.filter((order) => {
  const matchesStatus =
    statusFilter === 'All' || order.status.toLowerCase() === statusFilter.toLowerCase();

  const customer = order.customer ? String(order.customer).toLowerCase() : '';
  const orderNumber = order.order_number ? String(order.order_number).toLowerCase() : '';
  const date = order.date ? String(order.date).toLowerCase() : '';
  const amount = order.amount ? String(order.amount).toLowerCase() : '';

  const search = searchQuery.toLowerCase();

  const matchesSearch =
    customer.includes(search) ||
    orderNumber.includes(search) ||
    date.includes(search) ||
    amount.includes(search);

  return matchesStatus && matchesSearch;
});


  // Calculate summary stats
  const summaryStats = [
    {
      title: 'Total Orders',
      value: orders.length,
      icon: '📦',
      color: COLORS.primary,
    },
    {
      title: 'Delivered Orders',
      value: orders.filter((order) => order.status === 'Delivered').length,
      icon: '✅',
      color: COLORS.secondary,
    },
    {
      title: 'Processing Orders',
      value: orders.filter((order) => order.status === 'Processing').length,
      icon: '⏳',
      color: COLORS.accent1,
    },
    {
      title: 'Out For Delivery',
      value: orders.filter((order) => order.status === 'Out For Delivery').length,
      icon: '�',
      color: COLORS.accent2,
    },
  ];

  // Animated container variants
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

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const viewOrderDetails = (orderId: string) => {
    const selectedOrder = orders.find((order) => order.id === orderId);
    if (selectedOrder) {
      setOrderDetails(selectedOrder);
      setModalOpen(true);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setOrderDetails(null);
  };


const handleDownload = (order: Order) => {
  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Plain text data to be added to the PDF
  const text = `
    Shipping Label

    From: ${order.store_name}
    To: ${order.shipping_info.first_name} ${order.shipping_info.last_name}
    Address: ${order.shipping_info.address}, ${order.shipping_info.address2 || ''}
    City: ${order.shipping_info.city}, ${order.shipping_info.province}
    Country: ${order.shipping_info.country}
    Postal Code: ${order.shipping_info.postal_code}
    Phone: ${order.shipping_info.phone}

    Order Number: ${order.order_number}
    Customer: ${order.customer}
    Date: ${order.date}
    Amount: Rs. ${order.amount.toFixed(2)}
    Status: ${order.status}
  `;

  // Add the plain text to the PDF
  doc.text(text, 10, 10);

  // Save the generated PDF as a file
  doc.save(`shipping-label-${order.order_number}.pdf`);
};



  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br flex relative overflow-hidden font-poppins"
      style={{ background: BG_GRADIENT }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: COLORS.primary }}
        animate={{
          x: ['-5%', '5%', '-5%'],
          y: ['-5%', '5%', '-5%'],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-52 h-52 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: COLORS.secondary }}
        animate={{
          x: ['5%', '-5%', '5%'],
          y: ['5%', '-5%', '5%'],
        }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: COLORS.accent1 }}
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
      />

      {/* Main Content */}
      <motion.div variants={fadeIn} className="flex-1 p-6 lg:p-8 z-10">
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
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h18M3 3v18M3 3l18 18M3 21h18M3 21v-6M21 21v-6M9 3v6M15 3v6"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-500">Manage and track your orders</p>
            </div>
          </motion.div>
          <motion.div className="flex items-center space-x-4 mt-4 md:mt-0" variants={itemVariants}>
            <motion.button
              onClick={handleExportOrders}
              className="flex items-center px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-5 w-5 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="font-semibold text-white">Export Orders</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Summary Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          {summaryStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
                style={{ backgroundColor: stat.color }}
              />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                >
                  <span>{stat.icon}</span>
                </motion.div>
              </div>
              <div className="flex flex-col">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-900">Order List</h3>
              <div className="ml-4 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 flex items-center">
                <PulseNotification />
                <span className="ml-2">Updated in real-time</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by customer or order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-64 placeholder-gray-500 text-gray-900"
              />
              <div className="flex space-x-2 bg-gray-50 p-1 rounded-lg">
                {['All', 'Processing', 'Out For Delivery', 'Delivered', 'Cancelled'].map(
                  (filter) => (
                    <motion.button
                      key={filter}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        statusFilter === filter
                          ? `shadow-sm text-white`
                          : 'bg-transparent text-gray-600 hover:bg-gray-100'
                      }`}
                      style={statusFilter === filter ? { backgroundColor: COLORS.primary } : {}}
                    >
                      {filter}
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">View</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-yellow-50 transition-colors`}
                    >
                      <td className="px-6 py-4 text-gray-700">{order.order_number}</td>
                      <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-700">{order.date}</td>
                      <td className="px-6 py-4 text-gray-700">Rs. {order.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            order.status === 'Delivered'
                              ? 'bg-green-50 text-green-700'
                              : order.status === 'Cancelled'
                              ? 'bg-red-50 text-red-700'
                              : order.status === 'Out For Delivery'
                              ? 'bg-blue-50 text-blue-700'
                              : order.status === 'Processing'
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <div className="relative">
                              <select
                                value=""
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                disabled={loadingOrderId === order.id}
                                className={`text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700 ${
                                  loadingOrderId === order.id
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'cursor-pointer'
                                }`}
                              >
                                <option value="" disabled>
                                  Update Status
                                </option>
                                <option value="Processing">Processing</option>
                                <option value="Out For Delivery">Out For Delivery</option>
                                <option value="Cancelled">Cancel Order</option>
                              </select>

                              {loadingOrderId === order.id && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                          )}
                          {(order.status === 'Delivered' || order.status === 'Cancelled') && (
                            <span className="text-xs text-gray-500 italic">
                              No actions available
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Add a View Button */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewOrderDetails(order.id)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          View
                        </button>
                      </td>
                      {/* Add the Download Button in the last column */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDownload(order)}
                          className="flex items-center px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all"
                          style={{
                            background: `linear-gradient(135deg, #4caf50, #8bc34a)`, // Customize gradient colors
                          }}
                        >
                          <svg
                            className="h-5 w-5 mr-2 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          <span className="font-semibold text-white">Download</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Modal for displaying order details */}
          {modalOpen && orderDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                <p>
                  <strong>Order Number:</strong> {orderDetails.order_number}
                </p>
                <p>
                  <strong>Customer:</strong> {orderDetails.customer}
                </p>
                <p>
                  <strong>Date:</strong> {orderDetails.date}
                </p>
                <p>
                  <strong>Amount:</strong> Rs. {orderDetails.amount.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {orderDetails.status}
                </p>

                <h3 className="mt-4 font-semibold">Products:</h3>
                <ul className="list-disc pl-6">
                  {orderDetails.products.map((product, index) => (
                    <li key={index}>
                      <p>
                        <strong>Product Name:</strong> {product.product_name}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {product.quantity}
                      </p>
                      <p>
                        <strong>Price:</strong> Rs. {product.item_price.toFixed(2)}
                      </p>
                      <img
                        src={product.product_image}
                        alt={product.product_name}
                        className="w-20 h-20 object-cover mt-2"
                      />
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-end">
                  <button onClick={closeModal} className="text-red-600 hover:text-red-800">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Alert Modal Components */}
      {AlertModalComponent}
      {ConfirmationModalComponent}

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={performOrdersExport}
        title="Export Orders"
        description={`Export ${orders.length} orders to CSV format. This will include all order details such as order numbers, customer information, dates, amounts, and status information.`}
        exportType="Orders"
        isExporting={isExporting}
      />
    </motion.div>
  );
};

export default Orders;
