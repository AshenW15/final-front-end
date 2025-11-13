/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Eye,
  Star,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { formatPriceLKR, parsePriceToNumber } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  originalPrice: string;
  image: string;
  soldRanking?: string | null;
  soldDescription: string;
  rating: number;
  stock?: string;
  description: string;
  tags: string[];
  saleEndDate: string;
  discount: string;
  sale: boolean;
}

export default function SuperDeals() {
  const { user } = useAuth();
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const [pulseBackground, setPulseBackground] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);

  // Banner pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseBackground(true);
      setTimeout(() => setPulseBackground(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = 200;
      if (direction === 'left') {
        categoriesRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleAddToCart = (productId: number) => {
    if (addedToCart.includes(productId)) {
      setAddedToCart(addedToCart.filter((id) => id !== productId));
    } else {
      setAddedToCart([...addedToCart, productId]);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#10B981', '#FFFFFF', '#FBBF24'],
      });
    }
  };

  const handleToggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#EF4444', '#F87171'],
      });
    }
  };

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const handleQuickView = (product: (typeof products)[0]) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const renderStars = (_rating: number) => {
    void _rating;
    return (
      <div className="flex">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
      </div>
    );
  };

  interface Category {
    category_id: number;
    category_name: string;
    category_icon: string | null;
    width?: 'normal' | 'wide';
  }

  const [categories1, setCategories1] = useState<Category[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Recommended');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const filterProductsByCategory = (category: string): void => {
    setActiveCategory(category);
    console.log(category);
    if (category == 'All') {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((product) => product.category.includes(category));
    setFilteredProducts(filtered);
  };
  const fetchProducts = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/fetch_sale_products.php`);
      const data = await response.json();

      console.log('Fetched Data:', data);

      if (data.products) {
        const productsData: Product[] = data.products;
        setProducts(productsData);
        setFilteredProducts(productsData);
      } else {
        setError('No products found.');
        setFilteredProducts([]);
      }
    } catch (err) {
      setError('Error fetching products.');
      console.error(err);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [baseUrl]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/fetch_categories.php`);
        const data = await response.json();
        const categorizedData = data.categories.map((category: Category, index: number) => ({
          ...category,
          width: index % 5 === 0 ? 'wide' : 'normal',
        }));

        const allCategory = {
          id: 'all',
          category_name: 'All',
          category_icon: '/images/global.png',
          width: 'normal',
        };

        setCategories1([allCategory, ...categorizedData]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchSession();
  }, []);

  useEffect(() => {
    console.log('Products state updated:', products);
  }, [products]);

  useEffect(() => {
    console.log('products: ', filteredProducts);
  }, []);

  const [timeLeft, setTimeLeft] = useState<{
    [key: number]: { days: number; hours: number; minutes: number; seconds: number };
  }>({});

  useEffect(() => {
    if (products.length === 0) return;
    const now = new Date().getTime();
    const newTimeLeft = products.reduce((acc, product) => {
      const end = product.saleEndDate ? new Date(product.saleEndDate).getTime() : 0;

      const diff = Math.max(end - now, 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      acc[product.id] = { days, hours, minutes, seconds };
      return acc;
    }, {} as { [key: number]: { days: number; hours: number; minutes: number; seconds: number } });

    setTimeLeft(newTimeLeft);
  }, [products]);

  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (Object.keys(timeLeft).length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTimeLeft = { ...prevTimeLeft };

        Object.keys(newTimeLeft).forEach((id) => {
          const numId = Number(id);
          let { days, hours, minutes, seconds } = newTimeLeft[numId];

          if (seconds > 0) {
            seconds -= 1;
          } else if (minutes > 0) {
            minutes -= 1;
            seconds = 59;
          } else if (hours > 0) {
            hours -= 1;
            minutes = 59;
            seconds = 59;
          } else if (days > 0) {
            days -= 1;
            hours = 23;
            minutes = 59;
            seconds = 59;
          } else {
            // Time expired
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
            
            //remove item from sales page
            if (!removedIds.has(numId)) {
              setRemovedIds((prev) => new Set(prev).add(numId));
              removeItemFromSale(numId);
              fetchProducts();
            }
          }

          newTimeLeft[numId] = { days, hours, minutes, seconds };
        });

        return newTimeLeft;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const removeItemFromSale = async (id: number) => {
    const formData = new FormData();
    formData.append('product_id', String(id));

    try {
      const response = await fetch(`${baseUrl}/remove_sale_product.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      // console.log(result);

      if (result.success) {
        console.log('Product removed from sale:', id);
      } else {
        console.error('Failed to remove product from sale:', result.message);
      }
    } catch (error) {
      console.error('Error while removing product:', error);
    }
  };

  const router = useRouter();
  const handleItemView = (productId: number, sale: boolean) => {
    router.push(
      `/item?productId=${encodeURIComponent(productId)}&sale=${encodeURIComponent(sale)}`
    );
  };

  const fetchSession = async () => {
    console.log('User:', user);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <motion.div
        className="relative bg-green-500 text-white py-4 px-6 overflow-hidden"
        animate={{ scale: pulseBackground ? 1.01 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center relative z-10"
        >
          <div className="flex items-center">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mr-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              SuperDeals
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden sm:flex items-center"
            >
              <span className="text-sm md:text-base">SunShine Savings • Up to 70% off</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute top-0 right-0 h-full w-1/3">
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-green-300 opacity-20 rounded-full"
            animate={{ scale: [1, 1.2], rotate: [0, 360] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'loop',
              duration: 8,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute right-20 top-1/4 w-16 h-16 bg-yellow-300 opacity-20 rounded-full"
            animate={{ scale: [1, 1.5], x: [0, 20], y: [0, -20] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
              duration: 2.5,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>

      {/* Extra 10% off banner */}
      <motion.div
        className="py-8 px-6 text-center bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold"
          animate={{ scale: [1, 1.05] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            duration: 1.5,
            ease: 'easeInOut',
          }}
        >
          <motion.span
            animate={{ color: ['#000', '#F59E0B'] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
              duration: 1.5,
              ease: 'easeInOut',
            }}
          >
            Extra 10% off
          </motion.span>
        </motion.h2>
      </motion.div>

      {/* Categories */}
      <div className="relative px-4 mb-6">
        <motion.button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 flex items-center justify-center"
          onClick={() => scrollCategories('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </motion.button>

        <div
          
          className="flex overflow-x-auto space-x-2 py-2 px-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories1.map((category) => {
          
            return (
              <motion.button
                key={category.category_id}
                onClick={() => filterProductsByCategory(category.category_name)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === category.category_name
                    ? 'bg-gray-100 shadow-md'
                    : 'bg-white border border-gray-200'
                }`}
                whileHover={{ scale: 1.05, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`p-1 rounded-full ${
                    activeCategory === category.category_name ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                  animate={
                    activeCategory === category.category_name
                      ? { rotate: [-10, 10], scale: [1, 1.1] }
                      : { rotate: 0, scale: 1 }
                  }
                  style={{ width: 28, height: 28, overflow: 'visible' }}
                  transition={{
                    duration: 0.5,
                    repeat:
                      activeCategory === category.category_name ? Number.POSITIVE_INFINITY : 0,
                    repeatType: 'reverse',
                  }}
                >
                  <Image
                    src={`${baseUrl}${category.category_icon}`}
                    alt="Category Icon"
                    width={20}
                    height={20}
                  />
                </motion.div>

                <span
                  className={`text-sm font-medium ${
                    activeCategory === category.category_name ? 'text-black' : 'text-gray-700'
                  }`}
                >
                  {category.category_name}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 flex items-center justify-center"
          onClick={() => scrollCategories('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </motion.button>
      </div>

      {/* Special Promotion Banner */}
      <div className="px-4 mb-6">
        <motion.div
          className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg overflow-hidden relative"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 text-white relative z-10">
            <motion.h3
              className="text-2xl font-bold mb-1"
              animate={{ y: [0, -5] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse', duration: 1 }}
            >
              Beat the heat sale
            </motion.h3>
            <p className="text-lg mb-4">Up to 70% off</p>
            <motion.button
              className="bg-black text-white px-6 py-2 rounded-full font-medium"
              whileHover={{ scale: 1.05, backgroundColor: '#333' }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
          </div>

          {/* Animated elements */}
          <motion.div
            className="absolute right-6 bottom-0 w-24 h-24 opacity-80"
            animate={{ y: [0, -10], rotate: [0, 5] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse', duration: 1.5 }}
          >
            <Image
              src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Sale-Stickers-PNG/Green_Sale_Tag_Transparent_PNG_Clip_Art_Image.png?m=1629814167"
              alt="Sale"
              width={100}
              height={100}
              className="object-contain"
            />
          </motion.div>

          {/* Background pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: 'linear' }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </motion.div>
      </div>

      {/* Products Grid */}
      <div className="px-3 sm:px-4 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="w-full bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all overflow-hidden shadow-sm hover:shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
                onClick={() => handleItemView(product.id, product.sale)} // Navigate to item page
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"
                    initial={{ opacity: 0 }}
                    animate={hoveredProduct === product.id ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={`${baseUrl}/${product.image}`}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>

                  {/* Sale tag with shining animation */}
                  <motion.div
                    className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <motion.span
                      animate={{
                        boxShadow: [
                          '0 0 5px rgba(255, 0, 0, 0.5)',
                          '0 0 15px rgba(255, 0, 0, 1)',
                          '0 0 5px rgba(255, 0, 0, 0.5)',
                        ],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }}
                    >
                      Sale
                    </motion.span>
                  </motion.div>

                  {/* Discount badge with shining animation */}
                  <motion.div
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05, type: 'spring' }}
                  >
                    <motion.span
                      animate={{
                        boxShadow: [
                          '0 0 5px rgba(255, 0, 0, 0.5)',
                          '0 0 15px rgba(255, 0, 0, 1)',
                          '0 0 5px rgba(255, 0, 0, 0.5)',
                        ],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }}
                    >
                      -{product.discount}
                    </motion.span>
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      hoveredProduct === product.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      onClick={() => handleAddToCart(product.id)}
                      className={`p-2 rounded-full shadow-md ${
                        addedToCart.includes(product.id)
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-white text-black hover:bg-green-500 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`p-2 rounded-full shadow-md ${
                        wishlist.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-black hover:bg-red-500 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      onClick={() => handleQuickView(product)}
                      className="p-2 bg-white text-black hover:bg-black hover:text-white rounded-full shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 space-y-1 sm:space-y-2">
                  {/* Price */}
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
                  </div>

                  {/* Product Name */}
                  <h3 className="text-xs sm:text-sm text-black font-medium line-clamp-2 h-8 sm:h-10">
                    {product.name}
                  </h3>

                  {/* Lowest price indicator */}
                  <div className="mb-1">
                    <motion.span
                      className="text-xs sm:text-sm text-red-500 font-medium"
                      animate={{ color: ['#EF4444', '#F87171'] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                        duration: 1,
                      }}
                    >
                      Lowest price in 90 days
                    </motion.span>
                  </div>

                  {/* Rating and Sold Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-600">30</span> {/* hard Coded Value */}
                  </div>

                  {/* Low Stock Indicator */}
                  {product.stock === 'Low stock' && (
                    <motion.div
                      className="flex items-center text-red-500 text-xs sm:text-sm font-medium"
                      animate={{ scale: [1, 1.05], color: ['#EF4444', '#F87171'] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                        duration: 1,
                        ease: 'easeInOut',
                      }}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span>Low stock</span>
                    </motion.div>
                  )}

                  {/* Countdown Timer */}
                  <motion.div
                    className="bg-gray-100 rounded-md p-1 flex items-center justify-between"
                    animate={{
                      backgroundColor:
                        timeLeft[product.id]?.days < 1 && timeLeft[product.id]?.hours < 5 
                          ? ['#FEE2E2', '#FEF2F2']
                          : ['#F3F4F6', '#F9FAFB'],
                    }}
                    transition={{
                      repeat: timeLeft[product.id]?.hours < 5 ? Number.POSITIVE_INFINITY : 0,
                      repeatType: 'reverse',
                      duration: 1,
                    }}
                  >
                    <div className="flex items-center">
                      <Clock
                        className={`h-3 w-3 mr-1 ${
                          timeLeft[product.id]?.days < 1 && timeLeft[product.id]?.hours < 5 ? 'text-red-500' : 'text-gray-500'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          timeLeft[product.id]?.days < 1 && timeLeft[product.id]?.hours < 5  ? 'text-red-500' : 'text-yellow-600'
                        }`}
                      >
                        Deal ends in:
                      </span>
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        timeLeft[product.id]?.hours < 5 && timeLeft[product.id]?.days === 0
                          ? 'text-red-500'
                          : 'text-blue-800'
                      }`}
                    >
                      {timeLeft[product.id]?.days === 0 &&
                      timeLeft[product.id]?.hours === 0 &&
                      timeLeft[product.id]?.minutes === 0 &&
                      timeLeft[product.id]?.seconds === 0 ? (
                        'Sale Ended'
                      ) : (
                        <>
                          {timeLeft[product.id]?.days > 0 && (
                            <> {`${String(timeLeft[product.id]?.days).padStart(2, '0')} Days  `}</>
                          )}
                          {`${String(timeLeft[product.id]?.hours).padStart(2, '0')}:`}
                          {`${String(timeLeft[product.id]?.minutes).padStart(2, '0')}:`}
                          {`${String(timeLeft[product.id]?.seconds).padStart(2, '0')}`}
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

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
              className="bg-white rounded-lg max-w-3xl w-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-square">
                    <Image
                      src={`${baseUrl}/${quickViewProduct.image}`}
                      alt={quickViewProduct.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                    />

                    <div className="absolute top-4 right-4">
                      <motion.span
                        className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-sm"
                        animate={{
                          boxShadow: [
                            '0 0 5px rgba(255, 0, 0, 0.5)',
                            '0 0 15px rgba(255, 0, 0, 1)',
                            '0 0 5px rgba(255, 0, 0, 0.5)',
                          ],
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1.5,
                          ease: 'easeInOut',
                        }}
                      >
                        -{quickViewProduct.discount}
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-6 flex flex-col">
                  <h2 className="text-xl font-bold text-black mb-2">{quickViewProduct.name}</h2>

                  <div className="flex items-center mb-3">
                    <div className="flex">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
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
                  </div>

                  <p className="text-sm text-gray-600 font-medium mb-3">30</p>

                  {/* Lowest price indicator */}
                  <div className="mb-3">
                    <motion.span
                      className="text-sm text-red-500 font-medium"
                      animate={{ color: ['#EF4444', '#F87171'] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                        duration: 1,
                      }}
                    >
                      Lowest price in 90 days
                    </motion.span>
                  </div>

                  {/* Countdown Timer */}
                  <motion.div
                    className="mb-4 bg-gray-100 rounded-md p-2 flex items-center justify-between"
                    animate={{
                      backgroundColor:
                        timeLeft[quickViewProduct.id]?.hours < 5
                          ? ['#FEE2E2', '#FEF2F2']
                          : ['#F3F4F6', '#F9FAFB'],
                    }}
                    transition={{
                      repeat:
                        timeLeft[quickViewProduct.id]?.hours < 5 ? Number.POSITIVE_INFINITY : 0,
                      repeatType: 'reverse',
                      duration: 1,
                    }}
                  >
                    <div className="flex items-center">
                      <Clock
                        className={`h-4 w-4 mr-2 ${
                          timeLeft[quickViewProduct.id]?.hours < 5
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          timeLeft[quickViewProduct.id]?.hours < 5
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        Deal ends in:
                      </span>
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        timeLeft[quickViewProduct.id]?.hours < 5 ? 'text-red-500' : 'text-gray-700'
                      }`}
                    >
                      {String(timeLeft[quickViewProduct.id]?.hours).padStart(2, '0')}:
                      {String(timeLeft[quickViewProduct.id]?.minutes).padStart(2, '0')}:
                      {String(timeLeft[quickViewProduct.id]?.seconds).padStart(2, '0')}
                    </div>
                  </motion.div>

                  {/* Low Stock Indicator */}
                  {quickViewProduct.stock === 'Low stock' && (
                    <motion.div
                      className="flex items-center text-red-500 text-sm font-medium mb-4"
                      animate={{ scale: [1, 1.05], color: ['#EF4444', '#F87171'] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: 'reverse',
                        duration: 1,
                        ease: 'easeInOut',
                      }}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>Low stock - Order soon!</span>
                    </motion.div>
                  )}

                  <div className="mt-auto space-y-3">
                    <motion.button
                      onClick={() => {
                        handleAddToCart(quickViewProduct.id);
                        setTimeout(() => handleCloseQuickView(), 1000);
                      }}
                      className={`w-full py-2 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                        addedToCart.includes(quickViewProduct.id)
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>
                        {addedToCart.includes(quickViewProduct.id)
                          ? 'Remove from Cart'
                          : 'Add to Cart'}
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleToggleWishlist(quickViewProduct.id)}
                      className={`w-full py-2 rounded-lg font-medium flex items-center justify-center space-x-2 border ${
                        wishlist.includes(quickViewProduct.id)
                          ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                          : 'bg-white text-black hover:bg-gray-100 border-gray-200'
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
      {/* <button onClick={() => removeItemFromSale(23)}>click</button> */}
    </div>
  );
}
