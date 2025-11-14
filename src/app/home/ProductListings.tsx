'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { formatPriceLKR, parsePriceToNumber } from '@/lib/utils';
import axios from 'axios';

interface Product {
  product_rating: number;
  product_price: string;
  product_discount: number;
  product_name: string | undefined;
  product_image: any;
  product_id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  soldRanking?: string | null;
  soldDescription: string;
  rating: number;
  stock?: string;
  description: string;
  tags: string[];
  discount?: number;
}

const ProductListings: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMoreProducts, setHasMoreProducts] = useState<boolean>(true);

  const PRODUCTS_PER_PAGE = 20;
  const INITIAL_DISPLAY = 20;

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const backendUrl = process.env.BACKEND_URL;


  const calculateDiscountPrice = (originalPrice: string, discount: number): string => {
    const p = parsePriceToNumber(originalPrice);
    if (p == null || p <= 0 || discount <= 0) return formatPriceLKR(p || 0);

    const discountedPrice = p - (p * discount) / 100;
    return formatPriceLKR(discountedPrice);
  };

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        axios.get(`http://127.0.0.1:8000/api/product`).then((response) => {
          console.log(response.data);
          const productsData: Product[] = response.data;
          setProducts(productsData);
          setDisplayedProducts(productsData);
        });
      } catch (err) {
        setError('Error fetching products.');
        console.error(err);
        setDisplayedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [baseUrl]);

  const handleItemView = (productId: number) => {
    router.push(`/item?productId=${encodeURIComponent(productId)}`);
  };

  const loadMoreProducts = () => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);

    setTimeout(() => {
      const currentLength = displayedProducts.length;
      const newProducts = products.slice(currentLength, currentLength + PRODUCTS_PER_PAGE);

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setHasMoreProducts(currentLength + newProducts.length < products.length);
      } else {
        setHasMoreProducts(false);
      }

      setLoadingMore(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Just For You</h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              onClick={() => handleItemView(product.product_id)}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-square">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={`${baseUrl}/${product.product_image}`}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 space-y-2">
                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                  {product.product_name}
                </h3>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-light text-gray-400 line-clamp-2 leading-tight line-through">
                    Rs.{Number(product.product_price).toFixed(2)}
                  </h3>
                  {/* Discount Percentage next to price */}
                  {product.product_discount !== 0 &&
                    (() => {
                      return (
                        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          -{product.product_discount}%
                        </span>
                      );
                    })()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-orange-500">
                    {calculateDiscountPrice(product.product_price, product.product_discount)}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {/* Mobile: 1 star, Desktop: 5 stars */}
                    {Array.from({ length: 1 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs md:hidden ${
                          i < Math.floor(product.product_rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs hidden md:inline ${
                          i < Math.floor(product.product_rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.product_rating})</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMoreProducts && (
          <div className="text-center">
            <motion.button
              onClick={loadMoreProducts}
              disabled={loadingMore}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading...' : 'Load More Products'}
            </motion.button>
          </div>
        )}

        {/* Loading indicator for more products */}
        {loadingMore && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg aspect-square" />
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default ProductListings;
