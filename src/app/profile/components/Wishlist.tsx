/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatPriceLKR, parsePriceToNumber } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
}

interface WishlistProps {
  defaultTab?: 'wishlist' | 'recently-Added';
}

const Wishlist: FC<WishlistProps> = ({ defaultTab = 'wishlist' }) => {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'recently-Added'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useAuth();
  const router = useRouter();

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [recentlyViewedItems, setRecentlyViewedItems] = useState<Product[]>([]);
  const userEmail = user?.email || '';
  console.log('user_email:', userEmail);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${baseUrl}/get_wishlist.php?user_email=${userEmail}`);
      const result = await response.json();

      if (result.success) {
        setWishlistItems(result.wishlist);
      } else {
        console.error('Failed to fetch wishlist:', result.message);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch(`${baseUrl}/get_wishlist.php?user_email=${userEmail}&recent=1`);
      const result = await response.json();

      if (result.success) {
        setRecentlyViewedItems(result.wishlist);
      } else {
        console.error('Failed to fetch recently viewed:', result.message);
      }
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
    }
  };

  // ✅ Load on mount
  useEffect(() => {
    if (userEmail) {
      fetchWishlist();
      fetchRecentlyViewed();
    }
  }, [userEmail]);

  // Update activeTab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter items based on search query
  const filteredWishlistItems = wishlistItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentlyViewedItems = recentlyViewedItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFromWishlist = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/remove_wishlist.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: user?.email || '',
          product_id: id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
        setRecentlyViewedItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error('Failed to remove from wishlist:', result.message);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Single star rating display
  const renderStars = (_rating: number) => {
    void _rating;
    return (
      <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  };

  // Navigate to product detail
  const openProduct = (id: string) => {
    if (!id) return;
    router.push(`/item?productId=${encodeURIComponent(id)}`);
  };

  // Render product item (clickable wrapper)
  const renderProductItem = (product: Product) => (
    <div
      key={product.id}
      role="button"
      tabIndex={0}
      onClick={() => openProduct(product.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProduct(product.id);
        }
      }}
      className="group cursor-pointer flex flex-col md:flex-row bg-white border rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
    >
      <div className="w-full md:w-48 h-48 md:h-auto bg-gray-100 flex-shrink-0">
        <img src={`${baseUrl}/${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:opacity-95 transition" />
      </div>
      <div className="flex-grow p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-black group-hover:text-yellow-600 transition-colors">{product.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromWishlist(product.id);
              }}
              className="text-gray-400 hover:text-red-600"
              title="Remove"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center mt-1">
            {renderStars(product.rating)}
            <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
          </div>
          <p className="text-lg font-semibold mt-2 text-orange-500">
            {(() => {
              const n = parsePriceToNumber(String(product.price));
              return n != null ? formatPriceLKR(n) : `Rs ${product.price.toFixed(2)}`;
            })()}
          </p>
          <p className={`text-sm mt-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>

        {product.inStock && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={(e) => e.stopPropagation()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      {/* Main content area with padding */}
      <div className="p-6">
        {/* Tabs */}
        <div className="flex items-center mb-6 border-b">
          <button
            className={`px-3 py-2 text-black font-medium ${
              activeTab === 'wishlist' ? 'border-b-2 border-red-600' : ''
            }`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist
          </button>
          <button
            className={`px-3 py-2 text-black font-medium ${
              activeTab === 'recently-Added' ? 'border-b-2 border-red-600' : ''
            }`}
            onClick={() => setActiveTab('recently-Added')}
          >
            Recently Added
          </button>
          <div className="flex-grow"></div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 flex">
            <input
              type="text"
              placeholder={
                activeTab === 'wishlist' ? 'Search in Wishlist' : 'Search in Recently Added'
              }
              className="border border-gray-200 px-4 py-2 flex-grow text-black rounded-l"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r transition-colors duration-200">
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </div>

        {/* Content sections */}
        {activeTab === 'wishlist' && (
          <div>
            {filteredWishlistItems.length > 0 ? (
              <div className="space-y-4">
                {filteredWishlistItems.map((item) => renderProductItem(item))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 flex-1 min-h-64">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  No items in your wishlist yet. Start adding products you love!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recently-Added' && (
          <div>
            {filteredRecentlyViewedItems.length > 0 ? (
              <div className="space-y-4">
                {filteredRecentlyViewedItems.map((item) => renderProductItem(item))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 flex-1 min-h-64">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  No recently added items. Start browsing to see your history!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Need Help Button */}
      {/* <div className="fixed bottom-8 right-8">
        <button className="bg-yellow-500 hover:bg-yellow-600 rounded-full shadow-lg flex items-center transition-colors duration-200">
          <div className="flex items-center p-2">
            <img
              src="/api/placeholder/40/40"
              alt="Help assistant"
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-2 mr-4 text-black font-medium">Need help?</span>
          </div>
        </button>
      </div> */}
    </div>
  );
};

export default Wishlist;
