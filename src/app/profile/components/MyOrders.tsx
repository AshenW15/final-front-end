/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { FC, useState, useEffect } from 'react';
import TrackOrder from './TrackOrder';
import { useContext } from 'react';
import CartContext from '@/app/context/cartContext';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface OrderItems {
  index: number;
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  order_number: string;
  order_status: string;
  order_fee: string;
  quantity: string;
  delivary_date: string;
  ordred_date: string;
  item_price: string;
}

interface PurchasesProps {
  defaultTab?: 'all' | 'placed' | 'canceled' | 'processing' | 'delivered' | 'Out For Delivery';
}

const Purchases: FC<PurchasesProps> = ({ defaultTab = 'all' }) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'placed' | 'canceled' | 'processing' | 'delivered' | 'Out For Delivery'
  >(defaultTab);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'store'>('date');
  const [showFilter, setShowFilter] = useState(false);
  const [storeFilter, setStoreFilter] = useState<string | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<
    'all' | 'last-week' | 'last-month' | 'last-3-months'
  >('all');
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [orderItems, setOrderItems] = useState<OrderItems[]>([]);

  // const { currentloggedInEmail } = useContext(CartContext);
  // console.log('User email:', currentloggedInEmail);
  const { user } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const formData = new FormData();
      let userEmail = user?.email || '';

      if (!userEmail) {
        if (typeof window === 'undefined') {
          // --- Server side (Next.js SSR) ---
          try {
            const { cookies } = await import('next/headers');
            userEmail = (await cookies()).get('userEmail')?.value || '';
          } catch {
            userEmail = '';
          }
        } else {
          // --- Client side ---
          const match = document.cookie.match(/(?:^|;\s*)userEmail=([^;]+)/);
          if (match) {
            userEmail = decodeURIComponent(match[1]);
          }
        }
      }

      formData.append('email', userEmail);
      console.log('Logged in user Orders', userEmail);
      try {
        const response = await fetch(`${baseUrl}/fetch_my_orders.php`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        const OrderData: OrderItems[] = result;
        setOrderItems(OrderData);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [ user?.email]);

  useEffect(() => {
    setActiveTab(defaultTab);
    setSearchQuery('');
    setSortBy('date');
    setStoreFilter(null);
    setDateRangeFilter('all');
  }, [defaultTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'date' | 'price' | 'store');
  };

  const handleDateRangeFilter = (range: 'all' | 'last-week' | 'last-month' | 'last-3-months') => {
    setDateRangeFilter(range);
  };

  const getFilteredAndSortedPurchases = () => {
    let filtered = orderItems.filter((purchase) =>
      purchase.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab !== 'all') {
      filtered = filtered.filter((purchase) => purchase.order_status === activeTab);
    }

    if (dateRangeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (dateRangeFilter) {
        case 'last-week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'last-month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'last-3-months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter((purchase) => new Date(purchase.ordred_date) >= cutoffDate);
    }

    switch (sortBy) {
      case 'date':
        return [...filtered].sort(
          (a, b) => new Date(b.ordred_date).getTime() - new Date(a.ordred_date).getTime()
        );

      default:
        return filtered;
    }
  };

  const filteredPurchases = getFilteredAndSortedPurchases();

  const getStatusDetails = (status: OrderItems['order_status']) => {
    switch (status) {
      case 'Placed':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          ),
        };
      case 'Processing':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        };
      case 'Out For Delivery':
        return {
          color: 'text-orange-500',
          bgColor: 'bg-orange-200',
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case 'Delivered':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
        };
      case 'Canceled':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
        };
    }
  };

  const renderPurchaseCard = (purchase: OrderItems) => {
    const statusDetails = getStatusDetails(purchase.order_status);

    return (
      <div
        key={purchase.id}
        className="flex flex-col md:flex-row bg-white border rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="w-full md:w-32 h-32 bg-gray-100 flex-shrink-0">
          <img
            src={purchase.product_image}
            alt={purchase.product_name}
            className="w-32 h-32 object-cover"
          />
        </div>
        <div className="flex-grow p-4 flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-black">{purchase.product_name}</h3>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <p className="text-gray-500 text-sm">
                  Order Date: {new Date(purchase.ordred_date).toLocaleDateString()}
                </p>
                {purchase.order_number && (
                  <p className="text-gray-500 text-sm">Tracking: {purchase.order_number}</p>
                )}
                {purchase.delivary_date &&
                  purchase.order_status !== 'Delivered' &&
                  purchase.order_status !== 'Canceled' && (
                    <p className="text-gray-500 text-sm">
                      Estimated Delivery: {new Date(purchase.delivary_date).toLocaleDateString()}
                    </p>
                  )}
                {purchase.quantity && Number(purchase.quantity) > 1 && (
                  <p className="text-gray-500 text-sm">Quantity: {purchase.quantity}</p>
                )}
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
              <p className="font-semibold text-black text-lg">
                ${Number(purchase.item_price).toFixed(2)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(purchase.order_status === 'Placed' || purchase.order_status === 'Delivered') && (
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-3 rounded-md transition-colors duration-200 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Buy Again
                  </button>
                )}
                {purchase.order_status === 'Processing' && (
                  <button
                    onClick={() => {
                      setSelectedOrderId(purchase.id);
                      setIsTrackOrderOpen(true);
                    }}
                    className="border border-blue-500 text-blue-500 hover:bg-blue-50 py-1.5 px-3 rounded-md transition-colors duration-200 text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Track Order
                  </button>
                )}
                {purchase.order_status !== 'Canceled' && (
                  <button className="border border-gray-300 hover:border-gray-400 text-black py-1.5 px-3 rounded-md transition-colors duration-200 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                      />
                    </svg>
                    Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabCounts = {
    All: orderItems.length,
    Placed: orderItems.filter((p) => p.order_status === 'Placed').length,
    Processing: orderItems.filter((p) => p.order_status === 'Processing').length,
    out_for_delivered: orderItems.filter((p) => p.order_status === 'Out For Delivery').length,
    Delivered: orderItems.filter((p) => p.order_status === 'Delivered').length,
    Canceled: orderItems.filter((p) => p.order_status === 'Canceled').length,
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-black mb-6">Your Purchases</h1>

        <div className="flex items-center mb-6 border-b border-gray-200 overflow-x-auto">
          {['All', 'Placed', 'Processing', 'Out For Delivery', 'Delivered', 'Canceled'].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 py-2 whitespace-nowrap font-medium transition-colors text-sm sm:text-base ${
                  activeTab === tab
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-black hover:text-red-600'
                }`}
              >
                {tab}
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tabCounts[tab as keyof typeof tabCounts] ?? 0}
                </span>
              </button>
            )
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex-1 flex relative w-full">
            <input
              type="text"
              placeholder="Search in purchases"
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-200 px-4 py-2 pl-10 w-full text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="border border-gray-200 px-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="store">Sort by Store</option>
            </select>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center px-3 py-2 rounded-lg border ${
                showFilter ? 'bg-gray-100 border-gray-300' : 'border-gray-200'
              }`}
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:gap-8">
              <div>
                <h3 className="text-sm font-medium text-black mb-3">Filter by Date</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'last-week', label: 'Last Week' },
                    { value: 'last-month', label: 'Last Month' },
                    { value: 'last-3-months', label: 'Last 3 Months' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDateRangeFilter(option.value as typeof dateRangeFilter)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        dateRangeFilter === option.value
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-red-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {(storeFilter !== null || dateRangeFilter !== 'all') && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => {
                    setStoreFilter(null);
                    setDateRangeFilter('all');
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col flex-1">
          {filteredPurchases.length > 0 ? (
            filteredPurchases.map((order, index) => (
              <div
                key={order.index}
                className="flex flex-col md:flex-row bg-white border rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-full md:w-32 h-32 bg-gray-100 flex-shrink-0">
                  <img
                    src={order.product_image}
                    alt={order.product_name}
                    className="w-32 h-32 object-cover"
                  />
                </div>
                <div className="flex-grow p-4 flex flex-col justify-between">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-black">{order.product_name}</h3>
                          <p className="text-gray-600 text-sm">{order.order_number}</p>
                        </div>
                        <div
                          className={`flex items-center ${
                            order.order_status === 'Placed'
                              ? 'text-yellow-500 bg-yellow-100'
                              : order.order_status === 'Processing'
                              ? 'text-orange-500 bg-orange-200'
                              : order.order_status === 'Out For Delivery'
                              ? 'text-blue-500 bg-green-100'
                              : order.order_status === 'Delivered'
                              ? 'text-green-500 bg-green-100'
                              : order.order_status === 'Canceled'
                              ? 'text-red-500 bg-red-100'
                              : ''
                          } px-2 py-1 rounded-md text-xs font-medium`}
                        >
                          <span className="ml-1 capitalize">{order.order_status}</span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-500 text-sm">
                          Order Date: {new Date(order.ordred_date).toLocaleDateString()}
                        </p>
                        {order.delivary_date &&
                          order.order_status !== 'Delivered' &&
                          order.order_status !== 'Canceled' && (
                            <p className="text-gray-500 text-sm">
                              Estimated Delivery: {order.delivary_date}
                            </p>
                          )}
                        {order.quantity && Number(order.quantity) > 1 && (
                          <p className="text-gray-500 text-sm">Quantity: {order.quantity}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
                      <p className="font-semibold text-black text-lg">
                        ${Number(order.item_price).toFixed(2)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(order.order_status === 'Canceled' ||
                          order.order_status === 'Delivered') && (
                          <Link href={`/item?productId=${encodeURIComponent(order.product_id)}`}>
                            <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-3 rounded-md transition-colors duration-200 text-sm flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Buy Again
                            </button>
                          </Link>
                        )}
                        {order.order_status === 'Processing' && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setIsTrackOrderOpen(true);
                            }}
                            className="border border-blue-500 text-blue-500 hover:bg-blue-50 py-1.5 px-3 rounded-md transition-colors duration-200 text-sm flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            Track Order
                          </button>
                        )}
                        {order.order_status !== 'Canceled' && (
                          <button className="border border-gray-300 hover:border-gray-400 text-black py-1.5 px-3 rounded-md transition-colors duration-200 text-sm flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                              />
                            </svg>
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : searchQuery || storeFilter || dateRangeFilter !== 'all' ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 border border-gray-200 shadow-md">
              <div className="w-16 h-16 mb-4 text-gray-400">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-center mb-4">
                No purchases found matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStoreFilter(null);
                  setDateRangeFilter('all');
                  setSortBy('date');
                  setShowFilter(false);
                }}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 border border-gray-200 shadow-md">
              <div className="w-16 h-16 mb-4 text-gray-400">
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-center">
                {activeTab === 'placed'
                  ? 'No purchased items yet. Start shopping now!'
                  : activeTab === 'processing'
                  ? 'No orders in progress.'
                  : activeTab === 'Out For Delivery'
                  ? 'No orders out for delivery yet.'
                  : activeTab === 'delivered'
                  ? 'No delivered orders yet.'
                  : activeTab === 'canceled'
                  ? 'No canceled orders found.'
                  : 'No purchases found.'}
              </p>
              <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                Browse Products
              </button>
            </div>
          )}
        </div>

        {filteredPurchases.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button className="flex items-center text-gray-600 hover:text-black px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Purchase History
            </button>
          </div>
        )}
      </div>

      {/* <div className="fixed bottom-8 right-8">
        <button className="bg-yellow-500 rounded-full shadow-lg flex items-center hover:bg-yellow-600 transition-colors">
          <div className="flex items-center p-3">
            <svg
              className="w-6 h-6 text-black mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-black font-medium pr-4">Need help?</span>
          </div>
        </button>
      </div> */}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 left-8 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors duration-200"
      >
        <svg
          className="w-6 h-6 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      {isTrackOrderOpen && selectedOrderId && (
        <TrackOrder orderId={selectedOrderId} onClose={() => setIsTrackOrderOpen(false)} />
      )}
    </div>
  );
};

export default Purchases;
