/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chart from 'chart.js/auto';
import { useRouter } from 'next/navigation';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Color palette for light mode
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

const Dashboard = () => {
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

  const [totalsales, setTotalSales] = useState<number | undefined>();
  const [totalOrders, setTotalOrders] = useState<number | undefined>();
  const [totalSaleProducts, setTotalSaleProducts] = useState<number | undefined>();
  const [dates, setDates] = useState([]);
  const [itemCount, setItemCount] = useState([]);

  // Sample chart for Recent Orders
  useEffect(() => {
    if (!dates.length || !itemCount.length) return;

    const ctx = document.getElementById('recentOrderChart') as HTMLCanvasElement;
    if (ctx) {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Orders',
              data: itemCount,
              borderColor: COLORS.primary,
              backgroundColor: `${COLORS.primary}33`,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Orders',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }
  }, [dates, itemCount]);

  interface TopRatedProduct {
    id: number;
    name: string;
    image: string;
    discount: string;
    price: string;
    discountPrice: number;
    rating: number;
    stock?: string;
  }

  interface saleProduct {
    id: number;
    name: string;
    image: string;
    saleDiscount: string;
    price: string;
    stock?: string;
  }
  const [topProducts, setTopProducts] = useState<TopRatedProduct[]>([]);
  const [saleProducts, setSaleProducts] = useState<saleProduct[]>([]);
  const [registedUserCount, setRegistedUserCount] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/adminDashboardStats.php`);
        const data = await response.json();

        console.log('Fetched Stats:', data);
        const totalOrders = Number(data.stats.total_orders);
        const totalQuantity = data.stats.total_sales.total_quantity;
        const totalPrice = data.stats.total_sales.total_price;
        const orders = data.stats.orders_by_date;
        setTotalOrders(totalOrders);
        setTotalSales(totalPrice);
        setTotalSaleProducts(totalQuantity);
        setDates(orders.map((order: { date: any }) => order.date));
        setItemCount(orders.map((order: { count: any }) => Number(order.count)));

        //top rated products
        const topProductsDataRaw = data.topRatedProduct;
        const topProductsData: TopRatedProduct[] = topProductsDataRaw.map(
          (item: {
            product_price: any;
            product_discount: any;
            product_id: any;
            product_name: any;
            product_image: any;
            product_rating: any;
            product_stock: any;
          }) => {
            const price = Number(item.product_price);
            const discountPercent = Number(item.product_discount);
            const discountAmount = (price * discountPercent) / 100;
            const discountPrice = price - discountAmount;

            return {
              id: Number(item.product_id),
              name: item.product_name,
              image: item.product_image,
              discount: discountPercent.toString(),
              rating: Number(item.product_rating) || 0,
              stock: item.product_stock,
              price: item.product_price,
              discountPrice: discountPrice.toFixed(2),
            };
          }
        );

        setTopProducts(topProductsData);
        setRegistedUserCount(data.userCount[0].count);

        //sale product
        const saleProductsDataRaw = data.saleProduct;
        const saleProductsData: saleProduct[] = saleProductsDataRaw.map(
          (item: {
            product_id: any;
            product_name: any;
            product_image: any;
            sale_discount: any;
            product_price: any;
            product_stock: any;
          }) => ({
            id: Number(item.product_id),
            name: item.product_name,
            image: item.product_image,
            saleDiscount: Number(item.sale_discount),
            price: item.product_price,
            stock: item.product_stock,
          })
        );

        setSaleProducts(saleProductsData);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log(topProducts);
  });
  const router = useRouter();

  const handleItemView = (productId: number) => {
    router.push(`/item?productId=${encodeURIComponent(productId)}`);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex relative overflow-hidden"
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">Key metrics and insights</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          {[
            {
              title: 'Total Orders',
              value: totalOrders,
              change: 1.56,
              icon: (
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ),
              bgColor: 'bg-white',
              color: COLORS.primary,
              trend: 'up',
              progress: 70,
            },
            {
              title: 'Total Income',
              value: totalsales,
              prefix: 'Rs.',
              change: -1.56,
              icon: (
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              bgColor: 'bg-white',
              color: COLORS.accent1,
              trend: 'down',
              progress: 60,
            },
            {
              title: 'Total Sale Items',
              value: totalSaleProducts,
              change: 0.0,
              icon: (
                <svg
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              ),
              bgColor: 'bg-white',
              color: COLORS.grey2,
              trend: 'neutral',
              progress: 50,
            },
            {
              title: 'Total Visitor',
              value: registedUserCount,
              change: 1.56,
              icon: (
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              ),
              bgColor: 'bg-white',
              color: COLORS.accent4,
              trend: 'up',
              progress: 80,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
              className={`${stat.bgColor} p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
                style={{ backgroundColor: stat.color }}
              />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center`}
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  {stat.icon}
                </motion.div>
              </div>
              <div className="flex flex-col">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.prefix || ''}
                  {(stat.value ?? 0).toLocaleString()}
                </p>
                <div className="flex items-center text-sm">
                  {stat.trend === 'up' ? (
                    <svg
                      className="h-5 w-5 mr-1 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  ) : stat.trend === 'down' ? (
                    <svg
                      className="h-5 w-5 mr-1 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  ) : (
                    <span className="text-gray-500 mr-1">-</span>
                  )}
                  <span
                    className={
                      stat.change > 0
                        ? 'text-green-500'
                        : stat.change < 0
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }
                  >
                    {stat.change > 0 ? '+' : ''}
                    {stat.change}%
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-2.5 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Order with Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300 lg:col-span-2"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Order</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="h-64 w-full">
              <canvas id="recentOrderChart" className="w-full h-full"></canvas>
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <button className="text-sm text-blue-500 hover:text-blue-700">View all</button>
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center cursor-pointer"
                  onClick={() => handleItemView(product.id)}
                >
                  <div
                    className="h-12 w-12 rounded-md flex items-center justify-center mr-3 overflow-hidden"
                    style={{ backgroundColor: 'white' }}
                  >
                    <img
                      src={`${baseUrl}/${product.image}`}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <div className="flex gap-6 items-center">
                      <p className="text-xs text-green-100 bg-green-500 rounded-2xl p-1">
                        Rs.{product.discountPrice}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end mb-1">
                      <span className="text-xs font-medium text-gray-600">Discount</span>
                      <div
                        className="ml-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'orange' }}
                      >
                        <span className="text-white text-xs">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="text-xs text-red-500 font-medium">{product.discount}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Product Overview */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Super Sale Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Product ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Stock
                  </th>

                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Sale Discount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {saleProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="py-3">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-8 w-8 mr-2 rounded object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600">{product.id}</td>
                    <td className="text-sm text-gray-600">{product.price}</td>
                    <td className="text-sm text-gray-600">{product.stock}</td>
                    <td className="text-sm text-gray-600">{product.saleDiscount} %</td>

                    <td className="text-sm">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        On going
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
