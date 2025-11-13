/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Seller = {
  seller: any;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  register_date: string;
  store_visibility: string;
  total_stores: number;
  total_products: number;
  seller_phone?: string;
  referred_by?: string;
  reference_number?: string;
  products?: Array<{
    discount: number;
    product_id: number;
    product_name: string;
    product_description: string;
    price: number;
    product_image?: string;
    store_name?: string;
  }>;
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

type SellerDetails = {
  register_date: string;
  seller_name: string;
  seller_email: string;
  seller_phone?: string;
  referred_by?: string;
  reference_number?: string;
  products?: Array<{
    product_description: string;
    discount: any;
    product_id: number;
    product_name: string;
    price: number;
    product_image?: string;
    store_name?: string;
  }>;
};

const SellersChecking = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  type SummaryStat = {
    title: string;
    value: number;
    icon: string;
    color: string;
  };
  const [summaryStats, setSummaryStats] = useState<SummaryStat[]>([]);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sellerDetails, setSellerDetails] = useState<SellerDetails | null>(null);
  const [loadingDetails] = useState(false);

  const fetchSellers = async () => {
    try {
      const response = await fetch(`${baseUrl}/sellers_info.php`, {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data);
      setSellers(data.sellers);
      setFilteredSellers(data.sellers);
      calculateSummaryStats(data.sellers);
    } catch (error) {
      console.error('Error fetching seller data:', error);
    }
  };
  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  useEffect(() => {
    let filtered = sellers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (seller) =>
          seller.seller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.seller_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSellers(filtered);
  }, [sellers, searchTerm]);

  const calculateSummaryStats = (sellers: Seller[]) => {
    const totalSellers = sellers.length;
    const totalShops = sellers.reduce((sum, seller) => sum + seller.total_stores, 0);
    const totalProducts = sellers.reduce((sum, seller) => sum + seller.total_products, 0);

    setSummaryStats([
      {
        title: 'Total Sellers',
        value: totalSellers,
        icon: '👥',
        color: COLORS.primary,
      },
      {
        title: 'Total Shops',
        value: totalShops,
        icon: '🏪',
        color: COLORS.accent3,
      },
      {
        title: 'Total Products',
        value: totalProducts,
        icon: '📦',
        color: COLORS.accent1,
      },
    ]);
  };

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

  return (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Sellers Management</h1>
              <p className="text-gray-500">Manage seller accounts and business information</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
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
                  {typeof stat.value === 'number' ? stat.value.toLocaleString('en-US') : 'N/A'}
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
              <h3 className="text-xl font-semibold text-gray-900">Seller List</h3>
            </div>
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search sellers by name, email, or business name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Seller Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Registered Date
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Products Count
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Seller Detials
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredSellers.map((seller, index) => (
                    <motion.tr
                      key={seller.seller_email}
                      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-yellow-50 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mr-3">
                            {seller.seller_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-gray-900 font-medium">{seller.seller_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${seller.seller_email}`}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          {seller.seller_email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(seller.register_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="px-6 py-4 text-gray-700">{seller.total_products}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <p
                          className="text-blue-600 hover:underline cursor-pointer"
                          onClick={async () => {
                            // alert(`${seller.seller_id} clicked`);
                            const clickedID = seller.seller_id;
                            const selectedSeller = filteredSellers.find(
                              (p) => p.seller_id === clickedID
                            );

                            // console.log('Selected Seller:', selectedSeller);

                            if (selectedSeller) {
                              setSellerDetails({
                                seller_name: selectedSeller.seller_name,
                                seller_email: selectedSeller.seller_email,
                                seller_phone: selectedSeller.seller_phone,
                                register_date: selectedSeller.register_date,
                                referred_by: selectedSeller.referred_by,
                                reference_number: selectedSeller.reference_number,
                                products: selectedSeller.products
                                  ? selectedSeller.products.map((product) => ({
                                      ...product,
                                      discount: product.discount ?? 0,
                                    }))
                                  : undefined,
                              });
                              setShowSellerModal(true);
                            } else {
                              setSellerDetails(null);
                              setShowSellerModal(false);
                            }
                          }}
                        >
                          View
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <button
                          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                            ${Number(seller.store_visibility) === 1
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400'
                              : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400'}
                          `}
                          onClick={async () => {
                            const confirmMsg = Number(seller.store_visibility) === 1
                              ? `Do you want to hide this store (ID: ${seller.seller_id})?`
                              : `Do you want to show this store (ID: ${seller.seller_id})?`;
                            if (!window.confirm(confirmMsg)) return;
                            const response = await fetch(`${baseUrl}/change_store_visibility.php`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                seller_id: seller.seller_id,
                                visible: seller.store_visibility,
                              }),
                            });
                            const data = await response.json();
                            console.log(data);
                            if (data.success) {
                              fetchSellers();
                            }
                          }}
                          aria-label={Number(seller.store_visibility) === 1 ? 'Hide Store' : 'Show Store'}
                        >
                          {Number(seller.store_visibility) === 1 ? 'Hide Store' : 'Show Store'}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Seller Details Modal */}
          {showSellerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in">
                <button
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    setShowSellerModal(false);
                    setSellerDetails(null);
                  }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                {/* ================================================================================== */}
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Seller Details</h2>
                {loadingDetails ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : sellerDetails ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full mb-6">
                      <tbody>
                        <tr>
                          <td className="font-semibold text-gray-700 py-2 pr-4">Name:</td>
                          <td className="text-gray-900 py-2">{sellerDetails.seller_name}</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-gray-700 py-2 pr-4">Email:</td>
                          <td className="text-gray-900 py-2">{sellerDetails.seller_email}</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-gray-700 py-2 pr-4">Phone No:</td>
                          <td className="text-gray-900 py-2">
                            {sellerDetails.seller_phone || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-gray-700 py-2 pr-4">Referral Code:</td>
                          <td className="text-gray-900 py-2">
                            {sellerDetails.reference_number || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-gray-700 py-2 pr-4">Referred by:</td>
                          <td className="text-gray-900 py-2">{sellerDetails.referred_by || '-'}</td>
                        </tr>
                        <tr>
                          <td className="font-semibold text-gray-700 py-2 pr-4">Joined Date:</td>
                          <td className="text-gray-900 py-2">
                            {sellerDetails.register_date || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Products</h3>
                    <div className="max-h-64 overflow-y-auto border rounded-lg">
                      <table className="min-w-full border">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border">
                              Image
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border">
                              Product Name
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border">
                              Product Description
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border">
                              Price
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border">
                              Discount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerDetails.products && sellerDetails.products.length > 0 ? (
                            sellerDetails.products.map((product) => (
                              <tr key={product.product_id}>
                                <td className="px-4 py-2 border text-gray-800">
                                  {product.product_image ? (
                                    <img
                                      src={`${baseUrl}/${product.product_image}`}
                                      alt={product.product_name}
                                      className="w-12 h-12 object-cover rounded"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder.svg';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                      No Image
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-2 border text-gray-800">
                                  {product.product_name}
                                </td>
                                <td className="px-4 py-2 border text-gray-800">
                                  {product.product_description}
                                </td>
                                <td className="px-4 py-2 border text-gray-800">
                                  Rs. {product.price.toLocaleString()}
                                </td>
                                <td className="px-4 py-2 border text-gray-800">
                                  {Math.round(Number(product.discount))}%
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                                No products found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No details found.</div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SellersChecking;
