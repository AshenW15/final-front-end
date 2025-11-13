/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useRef, useEffect, useContext } from 'react';
import type React from 'react';

import { motion, AnimatePresence, useInView, useAnimation, type Variants } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye, Star, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Poppins } from 'next/font/google';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import CartContext from '@/app/context/cartContext.js';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { formatPriceLKR, parsePriceToNumber } from '@/lib/utils';

// Load Poppins font with specific weights and subsets
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

interface Product {
  id: number;
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
}

interface LocalUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  providerName?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

const ProductListings: React.FC = () => {
  const { user } = useAuth();
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

  const { addToCart } = useContext(CartContext);

  const addToCartHandler = async (product: Product) => {
    if (!user?.email) {
      toast.error('Please login to continue', {
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '500',
          padding: '20px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          minWidth: '350px',
          maxWidth: '500px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
        },
        duration: 3000,
      });
      return;
    }
    addToCart(product);
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseUrl}/fetch_all_products.php`);
        const data = await response.json();

        if (data.products) {
          const productsData: Product[] = data.products;
          setProducts(productsData);
          
          const initialProducts = productsData.slice(0, INITIAL_DISPLAY);
          setDisplayedProducts(initialProducts);
          setHasMoreProducts(productsData.length > INITIAL_DISPLAY);
        } else {
          setError('No products found.');
          setDisplayedProducts([]);
        }
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
        setDisplayedProducts(prev => [...prev, ...newProducts]);
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
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              onClick={() => handleItemView(product.id)}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-square">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={`${baseUrl}/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 space-y-2">
                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">
                    {(() => {
                      const n = parsePriceToNumber(product.price);
                      return n != null ? formatPriceLKR(n) : product.price;
                    })()}
                  </span>
                  {product.originalPrice && product.originalPrice !== product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {(() => {
                        const n = parsePriceToNumber(product.originalPrice);
                        return n != null ? formatPriceLKR(n) : product.originalPrice;
                      })()}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.rating})</span>
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
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg aspect-square"
              />
            ))}
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default ProductListings;
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const buttonVariants: Variants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
    initial: { scale: 1 },
  };

  const categoryVariants: Variants = {
    hover: {
      scale: 1.05,
      backgroundColor: '#FBBF24',
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    active: {
      backgroundColor: '#F59E0B', // Using yellow-500
      color: '#000000',
      scale: 1.05,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    inactive: {
      backgroundColor: '#E5E7EB',
      color: '#4B5563',
      scale: 1,
    },
  };

  const imageVariants: Variants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.5 },
    },
    initial: {
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const overlayVariants: Variants = {
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    initial: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const actionButtonVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1,
      },
    },
    tap: { scale: 0.9 },
  };

  const quickViewVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleAddToCart = (product: Product) => {
    setIsLoading(true);

    // Simulate loading
    setTimeout(() => {
      if (!addedToCart.includes(product.id)) {
        setAddedToCart([...addedToCart, product.id]);

        // Trigger confetti effect
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#F59E0B', '#000000', '#FBBF24'],
        });
      }

      setIsLoading(false);
    }, 600);
  };

  const handleToggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);

      // Small confetti burst for wishlist
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#EF4444', '#F87171'],
      });
    }
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    const container = document.getElementById('categories-container');
    if (container) {
      const scrollAmount = 200;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const calculateDiscount = (price: string, originalPrice: string) => {
    if (!originalPrice) return null;

    const currentPrice = parsePriceToNumber(price);
    const original = parsePriceToNumber(originalPrice);

    if (currentPrice == null || original == null || original <= currentPrice) return null;

    const discount = Math.round(((original - currentPrice) / original) * 100);
    return discount;
  };

  const updateGoogleUserInDB = async (user: LocalUser) => {
    try {
      const response = await fetch(`${baseUrl}/user_auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_user_id: user.id,
          first_name: user.name?.split(' ')[0] ?? '',
          last_name: user.name?.split(' ')[1] ?? '',
          email: user.email ? user.email : null,
          provider_name: user.providerName,
          profile_picture: user.image,
          access_token: user.accessToken,
          refresh_token: user.refreshToken,
          expires_at: user.expiresAt,
        }),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        console.log('Database Update Response:', data);
        if (data?.user_id) {
          localStorage.setItem('user_id', data.user_id);
        }
      } catch {
        console.error('Response is not valid JSON:', text);
      }
    } catch (error) {
      console.error('Error updating user in DB:', error);
    }
  };

  const useUserAuth = () => {
    useEffect(() => {
      const updateUser = async () => {
        if (user?.email) {
          console.log('User Info:', user);

          const localUser: LocalUser = {
            id: user.uid,
            name: user.displayName ?? '',
            email: user.email ?? '',
            image: user.photoURL ?? '',
            providerName: 'firebase',
          };

          await updateGoogleUserInDB(localUser);
        }
      };

      updateUser();
    }, []);
  };

  useUserAuth();

  const router = useRouter();
  const handleItemView = (productId: number) => {
    router.push(`/item?productId=${encodeURIComponent(productId)}`);
  };

  const renderStars = (_rating: number) => {
    // Single filled star per new design
    return (
      <div className="flex">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
      </div>
    );
  };

  return (
    <div className={`py-6 px-3 sm:px-4 bg-white ${poppins.className}`} ref={containerRef}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            className="bg-white p-6 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <ShoppingCart className="h-8 w-8 text-yellow-500" />
          </motion.div>
        </div>
      )}

      {/* Simple Title */}
      <motion.h2
        className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 text-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        EXPLORE YOUR INTERESTS
      </motion.h2>

      {/* Categories with scroll buttons */}
      <div className="relative mb-6 sm:mb-8">
        <motion.button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md h-8 w-8 flex items-center justify-center"
          onClick={() => scrollCategories('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </motion.button>

        <div
          id="categories-container"
          className="flex overflow-x-auto space-x-2 mb-2 pb-2 px-8 sm:px-10 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => filterProductsByCategory(category)} // Call the filtering function here
              variants={categoryVariants}
              initial="inactive"
              animate={activeCategory === category ? 'active' : 'inactive'}
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap h-8 flex items-center justify-center ${
                activeCategory === category ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <motion.button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md h-8 w-8 flex items-center justify-center"
          onClick={() => scrollCategories('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </motion.button>
      </div>

      {/* Products Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
      >
        <AnimatePresence>
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <motion.div
                className="bg-yellow-500 p-4 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                <ShoppingCart className="h-6 w-6 text-white" />
              </motion.div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500 font-medium">{error}</div>
          ) : displayedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No products available.</div>
          ) : (
            displayedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                custom={index}
                onClick={() => handleItemView(product.id)}
                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-yellow-200 transition-all overflow-hidden"
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
                whileHover={{
                  y: -5,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  borderColor: '#FBBF24',
                }}
                initial={{
                  opacity: 0,
                  y: 50 + (index % 5) * 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 24,
                    delay: 0.05 * index,
                  },
                }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <motion.div
                    variants={overlayVariants}
                    initial="initial"
                    animate={hoveredProduct === product.id ? 'hover' : 'initial'}
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"
                  />

                  <motion.div
                    variants={imageVariants}
                    initial="initial"
                    animate={hoveredProduct === product.id ? 'hover' : 'initial'}
                    className="w-full h-full"
                  >
                    <Image
                      src={
                        product.image
                          ? product.image.startsWith('http')
                            ? product.image
                            : `${baseUrl}/${
                                product.image.startsWith('/')
                                  ? product.image.slice(1)
                                  : product.image
                              }`
                          : '/placeholder.svg'
                      }
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>

                  {/* Stock badge */}
                  {product.stock && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="absolute top-2 left-2 z-20"
                    >
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {product.stock}
                      </span>
                    </motion.div>
                  )}

                  {/* Discount badge moved next to price; removed from top-right */}

                  {/* Action buttons */}
                  <motion.div
                    className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20"
                    variants={overlayVariants}
                    initial="initial"
                    animate={hoveredProduct === product.id ? 'hover' : 'initial'}
                  >
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCartHandler(product);
                      }}
                      className={`p-2 rounded-full shadow-md ${
                        addedToCart.includes(product.id)
                          ? 'bg-yellow-500 text-black'
                          : 'bg-white text-black hover:bg-yellow-500 hover:text-black'
                      }`}
                      variants={actionButtonVariants}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Add to Cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </motion.button>
                    {/* <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product.id);
                      }}
                      className={`p-2 rounded-full shadow-md ${
                        wishlist.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-black hover:bg-red-500 hover:text-white'
                      }`}
                      variants={actionButtonVariants}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="h-4 w-4" />
                    </motion.button> */}

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickView(product);
                      }}
                      className="p-2 bg-white text-black hover:bg-black hover:text-white rounded-full shadow-md"
                      variants={actionButtonVariants}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                </div>

                <motion.div
                  className="p-3 sm:p-4 space-y-1 sm:space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <h3 className="text-xs sm:text-sm text-black font-medium truncate" title={product.name}>
                    {product.name}
                  </h3>

                  <div className="flex items-baseline space-x-2">
                    <motion.span
                      className="text-sm sm:text-base font-bold text-orange-500"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      {(() => {
                        const n = parsePriceToNumber(product.price);
                        return n != null ? formatPriceLKR(n) : product.price;
                      })()}
                    </motion.span>
                    {product.originalPrice && (() => {
                      const d = calculateDiscount(product.price, product.originalPrice);
                      return d ? (
                        <motion.span
                          className="text-[10px] sm:text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded-full font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.45 + index * 0.05 }}
                          title={`${d}% OFF`}
                        >
                          {d}% OFF
                        </motion.span>
                      ) : null;
                    })()}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {product.soldRanking && (
                        <motion.span
                          className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                        >
                          {product.soldRanking}
                        </motion.span>
                      )}
                      <motion.span
                        className="text-xs text-yellow-600 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        {product.soldDescription}
                      </motion.span>
                    </div>
                  </div>

                  {addedToCart.includes(product.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-2"
                    >
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center justify-center">
                        Added to cart
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {!loading && displayedProducts.length > 0 && hasMoreProducts && (
        <div className="flex justify-center mt-8 mb-6">
          <motion.button
            onClick={loadMoreProducts}
            disabled={loadingMore}
            className={`px-8 py-3 rounded-full font-medium text-white transition-all duration-300 ${
              loadingMore 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-600 hover:shadow-lg'
            }`}
            whileHover={!loadingMore ? { scale: 1.05 } : {}}
            whileTap={!loadingMore ? { scale: 0.95 } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {loadingMore ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Load More Products</span>
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  ⬇️
                </motion.div>
              </div>
            )}
          </motion.button>
        </div>
      )}

      {/* No More Products Message */}
      {!loading && displayedProducts.length > 0 && !hasMoreProducts && (
        <div className="flex justify-center mt-8 mb-6">
          <motion.div
            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            🎉 You&apos;ve seen all products in this category!
          </motion.div>
        </div>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseQuickView}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden"
              variants={quickViewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-square">
                    <Image
                      src={
                        quickViewProduct.image
                          ? quickViewProduct.image.startsWith('http')
                            ? quickViewProduct.image
                            : `${baseUrl}/${
                                quickViewProduct.image.startsWith('/')
                                  ? quickViewProduct.image.slice(1)
                                  : quickViewProduct.image
                              }`
                          : '/placeholder.svg'
                      }
                      alt={quickViewProduct.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                    />

                    {/* Discount badge moved next to price in details; removed from image corner */}
                  </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-6 flex flex-col">
                  <h2 className="text-xl font-bold text-black mb-2">{quickViewProduct.name}</h2>

                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(quickViewProduct.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {quickViewProduct.rating} Rating
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-3 mb-3">
                    <span className="text-xl font-bold text-orange-500">
                      {(() => {
                        const n = parsePriceToNumber(quickViewProduct.price);
                        return n != null ? formatPriceLKR(n) : quickViewProduct.price;
                      })()}
                    </span>
                    {quickViewProduct.originalPrice && (() => {
                      const d = calculateDiscount(
                        quickViewProduct.price,
                        quickViewProduct.originalPrice
                      );
                      return d ? (
                        <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">
                          {d}% OFF
                        </span>
                      ) : null;
                    })()}
                  </div>

                  <p className="text-sm text-yellow-600 font-medium mb-3">
                    {quickViewProduct.soldDescription}
                  </p>

                  <p className="text-sm text-gray-700 mb-6">{quickViewProduct.description}</p>

                  <div className="mt-auto space-y-3">
                    <motion.button
                      onClick={() => {
                        handleAddToCart(quickViewProduct);
                        setTimeout(() => handleCloseQuickView(), 1000);
                      }}
                      className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleToggleWishlist(quickViewProduct.id)}
                      className={`w-full py-2 rounded-lg font-medium flex items-center justify-center space-x-2 border border-gray-200 hover:bg-gray-100 ${
                        wishlist.includes(quickViewProduct.id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-white text-black'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Heart className="h-4 w-4" />
                      <span>
                        {wishlist.includes(quickViewProduct.id)
                          ? 'Remove from Wishlist'
                          : 'Add to Wishlist'}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <motion.button
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md"
                onClick={handleCloseQuickView}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating "Back to Top" button */}
      <AnimatePresence>
        {scrollPosition > 300 && (
          <motion.button
            className="fixed bottom-6 right-6 p-3 bg-yellow-500 text-black rounded-full shadow-lg z-40"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductListings;
