/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import useAlerts from '@/hooks/useAlerts';
import { useLoading } from '@/hooks/useLoading';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { Button } from '@/components/ui/button';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

type Product = {
  features: unknown;
  id: string;
  name: string;
  price_admin: string;
  stock_admin: number;
  description: string;
  image: string;
  discount: string;
  seller_email: string;
};

const COLORS = {
  primary: '#FFC107',
  secondary: '#FFF8E1',
  accent1: '#FFCA28',
  accent2: '#FF8A65',
  accent3: '#AB47BC',
  accent4: '#4DD0E1',
  grey1: '#FFFFFF',
  grey2: '#F5F5F5',
  textPrimary: '#212121',
  textSecondary: '#616161',
};

const BG_GRADIENT = 'linear-gradient(to right bottom, #FFFFFF, #FFFDE7, #FFFFFF)';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isLoading, withLoading } = useLoading();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    // Alert and confirmation modals
  const {
    success: showSuccess,
    error: showError,
    info: showInfo,
    confirmDelete,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

  useEffect(() => {
    withLoading(async () => {
      await fetchAllProductsForAdmin();
    });
  }, [withLoading]);

  const fetchAllProductsForAdmin = async (): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/fetch_all_products.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (Array.isArray(result.products) && result.products.length > 0) {
        setProducts(result.products);
      } else {
        setProducts([]);
        showInfo('No Products', 'No products found.');
      }
    } catch (error) {
      console.error('Error fetching all admin products:', error);
      showError('Fetch Failed', 'Failed to fetch products. Please try again later.');
    }
  };

  const [summaryStatsData, setSummaryStatsData] = useState({
    total_products: 0,
    out_of_stock: 0,
    discounted_products: 0,
    total_stock_value: 0,
  });

  const fetchSummaryStats = async () => {
    try {
      const response = await fetch(`${baseUrl}/getAdminProductStats.php`);
      const data = await response.json();
      setSummaryStatsData(data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    }
  };

  useEffect(() => {
    fetchSummaryStats();
  },[baseUrl]);

  const summaryStats = [
    {
      title: 'Total Products',
      value: summaryStatsData.total_products,
      change: 5.0,
      icon: '🛍️',
      color: COLORS.primary,
      trend: 'up',
    },
    {
      title: 'Out of Stock',
      value: summaryStatsData.out_of_stock,
      change: -3.2,
      icon: '⚠️',
      color: COLORS.secondary,
      trend: 'down',
    },
    {
      title: 'Discounted Products',
      value: summaryStatsData.discounted_products,
      change: 2.5,
      icon: '🏷️',
      color: COLORS.accent1,
      trend: 'up',
    },
    {
      title: 'Total Stock Value',
      value: summaryStatsData.total_stock_value,
      prefix: 'Rs. ',
      change: 10.0,
      icon: '💰',
      color: COLORS.accent3,
      trend: 'up',
    },
  ];

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

    const handleDeleteProduct = async (id: string) => {
    confirmDelete(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      async () => {
        setDeleteLoading(id);
        try {
          const formData = new FormData();
          formData.append('id', id);

          const response = await fetch(`${baseUrl}/deleteProduct.php`, {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (result.status === 'success') {
            setProducts((prev) => prev.filter((product) => product.id !== id));
            showSuccess('Product Deleted', 'Product deleted successfully.');
            fetchSummaryStats();
          } else {
            showError('Delete Failed', 'Failed to delete product: ' + result.message);
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          showError('Error', 'An error occurred. Please try again.');
        } finally {
          setDeleteLoading('');
        }
      }
    );
  };

  return (
    <LoadingOverlay isLoading={isLoading} text="Loading products...">
      <motion.div
        className="min-h-screen bg-gradient-to-br flex relative overflow-hidden font-poppins"
        style={{ background: BG_GRADIENT }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
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

      <motion.div variants={fadeIn} className="flex-1 p-6 lg:p-8 z-10">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-500">Manage your store&#39;s product catalog</p>
            </div>
          </motion.div>
        </motion.div>

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
                  {stat.prefix || ''}
                  {typeof stat.value === 'number'
                    ? stat.value.toLocaleString('en-US', {
                        minimumFractionDigits: stat.prefix ? 2 : 0,
                        maximumFractionDigits: stat.prefix ? 2 : 0,
                      })
                    : 'N/A'}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-900">Product List</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Discount (%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-yellow-50 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <Image
                          src={
                            typeof product.image === 'string'
                              ? product.image.startsWith('/') || product.image.startsWith('http')
                                ? product.image.replace(/\\/g, '/')
                                : `${baseUrl}/${product.image.replace(/\\/g, '/')}`
                              : '/placeholder.svg'
                          }
                          alt={product.name}
                          width={40}
                          height={40}
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-700">{product.name}</td>
                      <td className="px-6 py-4 text-gray-700">Rs {product.price_admin}</td>
                      <td className="px-6 py-4 text-gray-700">{product.discount || '-'}</td>
                      <td className="px-6 py-4 text-gray-700">{product.stock_admin}</td>
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${product.seller_email}`}
                          className="text-blue-500 cursor-pointer"
                        >
                          {product.seller_email}
                        </a>
                      </td>

                      <td className="px-6 py-4 flex space-x-2">
                        <Button
                          onClick={() => handleDeleteProduct(product.id)}
                          variant="destructive"
                          size="sm"
                          loading={deleteLoading === product.id}
                          loadingText="Deleting..."
                        >
                          Delete
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Alert and Confirmation Modals */}
        {AlertModalComponent}
        {ConfirmationModalComponent}
      </motion.div>
      </motion.div>
    </LoadingOverlay>
  );
};

export default Products;
