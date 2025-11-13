/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import Header from '@/app/home/Header';
import { useLoading } from '@/hooks/useLoading';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { formatPriceLKR, parsePriceToNumber } from '@/lib/utils';


import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Clock,
  ArrowUpDown,
  Check,
  X,
  Sparkles,
  ArrowUp,
  Tag,
  Package,
  Palette,
  Ruler,
  DollarSign,
  Star as StarIcon,
  Truck,
  Store,
  BadgePercent,
} from 'lucide-react';
import { getSession } from '@/lib/auth-compat';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Mock product data with real image URLs
const mockProducts = [
  {
    id: 1,
    name: "Men's Casual Sports Shoes Running Athletic Sneakers",
    price: 3325.22,
    originalPrice: 4500.0,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.8,
    reviews: 911,
    sold: 1000,
    isBestSelling: true,
    isVesakDay: true,
    stock: 11,
    category: 'Athletic Shoes',
    brand: 'Puma',
    color: 'Red',
    size: '41',
    shipping: 'Same Day Delivery',
    sellerType: 'Star Seller',
  },
  {
    id: 2,
    name: "Men's Low-Top Skate Shoes Casual Sneakers",
    price: 2820.77,
    originalPrice: 3599.99,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.3,
    reviews: 78,
    sold: 65,
    isVesakDay: true,
    category: 'Casual Shoes',
    brand: 'Vans',
    color: 'Blue',
    size: '40',
    shipping: 'Free Shipping',
    sellerType: 'Verified Seller',
  },
  {
    id: 3,
    name: "Men's Casual Sneakers Breathable Running Shoes",
    price: 3068.52,
    originalPrice: 3999.99,
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: 4.6,
    reviews: 20,
    sold: 13,
    stock: 13,
    isVesakDay: true,
    category: 'Running Shoes',
    brand: 'Reebok',
    color: 'Green',
    size: '44',
    shipping: 'Fast Delivery',
    sellerType: 'Star Seller',
  },
];

// Filter options
const filterOptions = {
  // categories: ['Sneakers', 'Running Shoes', 'Casual Shoes', 'Athletic Shoes', 'Canvas Shoes'],
  // brands: ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse', 'Vans'],
  colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Brown', 'Multi'],
  sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
  priceRanges: [
    'Under Rs 2,000',
    'Rs 2,000 - 3,000',
    'Rs 3,000 - 4,000',
    'Rs 4,000 - 5,000',
    'Above Rs 5,000',
  ],
  ratings: ['4 & Above', '3 & Above', '2 & Above', '1 & Above'],
  // shipping: ['Free Shipping', 'Fast Delivery', 'Same Day Delivery'],
  // sellerType: ['Official Store', 'Star Seller', 'Verified Seller'],
};

// Icons for filter categories
const filterIcons: { [key: string]: React.ComponentType<any> } = {
  categories: Tag,
  brands: Package,
  colors: Palette,
  sizes: Ruler,
  priceRanges: DollarSign,
  ratings: StarIcon,
  shipping: Truck,
  sellerType: Store,
};

// Sort options
const sortOptions = [
  { id: 'relevance', name: 'Relevance' },
  { id: 'newest', name: 'Newest Arrivals' },
  { id: 'price_low', name: 'Price: Low to High' },
  { id: 'price_high', name: 'Price: High to Low' },
  { id: 'rating', name: 'Highest Rated' },
  { id: 'popular', name: 'Most Popular' },
];

function SearchPage() {
  const router = useRouter();
  const { isLoading, withLoading } = useLoading();

  interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    soldRanking?: string | null;
    soldDescription: string;
    rating: number;
    stock?: number;
    description: string;
    discount: number;
    tags: string[];
    is_on_sale: string;
  }

  const searchParams = useSearchParams();
  const query = searchParams.get('param') || '';
  const params = new URLSearchParams(searchParams.toString());
  params.delete('param');
  console.log('Search Keyword: ', query);

  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [, setError] = useState<string | null>(null);

  const fetchProducts = async (query: string): Promise<void> => {
    setError(null);
    const session = await getSession();
    console.log('Session Email:', session?.user.email);
    const formData = new FormData();
    formData.append('search_keyword', query);
    formData.append('search_email', session?.user.email || '');
    

    try {
      const response = await fetch(`${baseUrl}/fetch_searched_products.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      console.log('Fetched Data:', data);

      if (data.products) {
        const productsData: Product[] = data.products;
        setSearchedProducts(productsData);
      } else {
        setError('No products found.');
      }
    } catch (err) {
      setError('Error fetching products.');
      console.error(err);
    } finally {
      // Loading handled by withLoading
    }
  };
  // useEffect(() => {
  //   withLoading(async () => {
  //     await fetchProducts(query);
  //   });
  // }, [query, withLoading]);

  useEffect(()=>{
    fetchProducts(query);
  },[query])

  const [searchQuery, setSearchQuery] = useState(query);
  const [displayQuery] = useState(query);
  const [, setShowSellerRegistration] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expandedFilterGroup, setExpandedFilterGroup] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [showScrollToTop] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<{ [key: string]: string[] }>({});
  const [isHeaderVisible] = useState(true);
  const [] = useState(0);

  const resultsRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const isResultsInView = useInView(resultsRef, { once: true, amount: 0.1 });

  const handleBecomeSellerClick = () => {
    setShowSellerRegistration(true);
    router.push('/seller/sellerregistration');
  };

  const applyFiltersToProducts = (products: typeof mockProducts) => {
    return products.filter((product) => {
      let passesAllFilters = true;

      Object.entries(appliedFilters).forEach(([category, selectedOptions]) => {
        if (selectedOptions.length === 0) return;

        if (category === 'categories' && !selectedOptions.includes(product.category)) {
          passesAllFilters = false;
        }
        if (category === 'brands' && !selectedOptions.includes(product.brand)) {
          passesAllFilters = false;
        }
        if (category === 'colors' && !selectedOptions.includes(product.color)) {
          passesAllFilters = false;
        }
        if (category === 'sizes' && !selectedOptions.includes(product.size)) {
          passesAllFilters = false;
        }
        if (category === 'priceRanges') {
          const price = product.price;
          const passesPrice = selectedOptions.some((range) => {
            if (range === 'Under Rs 2,000') return price < 2000;
            if (range === 'Rs 2,000 - 3,000') return price >= 2000 && price <= 3000;
            if (range === 'Rs 3,000 - 4,000') return price > 3000 && price <= 4000;
            if (range === 'Rs 4,000 - 5,000') return price > 4000 && price <= 5000;
            if (range === 'Above Rs 5,000') return price > 5000;
            return false;
          });
          if (!passesPrice) passesAllFilters = false;
        }
        if (category === 'ratings') {
          const rating = product.rating;
          const passesRating = selectedOptions.some((range) => {
            if (range === '4 & Above') return rating >= 4;
            if (range === '3 & Above') return rating >= 3;
            if (range === '2 & Above') return rating >= 2;
            if (range === '1 & Above') return rating >= 1;
            return false;
          });
          if (!passesRating) passesAllFilters = false;
        }
        if (category === 'shipping' && !selectedOptions.includes(product.shipping)) {
          passesAllFilters = false;
        }
        if (category === 'sellerType' && !selectedOptions.includes(product.sellerType)) {
          passesAllFilters = false;
        }
      });

      return passesAllFilters && product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };



  const toggleFilterGroup = (group: string) => {
    setExpandedFilterGroup(expandedFilterGroup === group ? null : group);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        setExpandedFilterGroup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = (category: string, filter: string) => {
    const filterKey = `${category}:${filter}`;

    setAppliedFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[category]) {
        newFilters[category] = [];
      }

      if (newFilters[category].includes(filter)) {
        newFilters[category] = newFilters[category].filter((f) => f !== filter);
        if (newFilters[category].length === 0) {
          delete newFilters[category];
        }
      } else {
        newFilters[category] = [...newFilters[category], filter];
      }

      return newFilters;
    });

    if (activeFilters.includes(filterKey)) {
      setActiveFilters(activeFilters.filter((f) => f !== filterKey));
    } else {
      setActiveFilters([...activeFilters, filterKey]);
    }

    withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const filtered = applyFiltersToProducts(mockProducts);
      setFilteredProducts(filtered);
    });
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setAppliedFilters({});
    withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const filtered = applyFiltersToProducts(mockProducts);
      setFilteredProducts(filtered);
    });
  };

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    setIsSortDropdownOpen(false);

    withLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      let sortedProducts = [...filteredProducts];

      switch (sortId) {
        case 'price_low':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          sortedProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          sortedProducts.sort((a, b) => b.sold - a.sold);
          break;
        default:
          sortedProducts = [...filteredProducts];
      }

      setFilteredProducts(sortedProducts);
    });
  };

  const toggleWishlist = (productId: number) => {
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

  const addToCart = (productId: number) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#F59E0B', '#000000', '#FBBF24'],
      });
    }
  };

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

   const handleItemView = (productId: number) => {
    router.push(`/item?productId=${encodeURIComponent(productId)}`);
  };

  const renderStars = (_rating: number) => {
    void _rating; // keep signature compatible with existing calls
    // Show a single filled star as per new design requirement
    return (
      <div className="flex">
        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
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

  const filterVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const quickViewVariants = {
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

  const overlayVariants = {
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    initial: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.5 },
    },
    initial: {
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const actionButtonVariants = {
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

  return (
    <LoadingOverlay isLoading={isLoading} text="Searching products...">
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <motion.header
        className={`bg-white z-30 ${isHeaderVisible ? 'block' : 'hidden'}`}
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <Header
          onBecomeSellerClick={handleBecomeSellerClick}
          searchQuery={searchQuery} //input word
          setSearchQuery={(query) => {
            setSearchQuery(query);
            // handleSearchSubmit();
          }}
        />
      </motion.header>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-100 p-6 rounded-full"
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
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow bg-white">
        <div
          className={`bg-white border-b border-gray-200 ${isHeaderVisible ? 'block' : 'hidden'}`}
          ref={filterBarRef}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 border border-gray-300"
                    onClick={() => setIsFilterSidebarOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Filter className="w-4 h-4 text-gray-600" />
                    <span>Filters</span>
                    {activeFilters.length > 0 && (
                      <span className="bg-yellow-500 text-xs text-black font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFilters.length}
                      </span>
                    )}
                  </motion.button>

                  <motion.button
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 border border-gray-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span>Deals end today</span>
                  </motion.button>
                </div>

                <div className="relative">
                  <motion.button
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 border border-gray-300"
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowUpDown className="w-4 h-4 text-gray-600" />
                    <span>Sort by: {sortOptions.find((opt) => opt.id === selectedSort)?.name}</span>
                    {isSortDropdownOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {isSortDropdownOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {sortOptions.map((option) => (
                          <motion.button
                            key={option.id}
                            className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left text-gray-700 ${
                              selectedSort === option.id
                                ? 'bg-yellow-50 text-yellow-600'
                                : 'hover:bg-gray-100'
                            }`}
                            onClick={() => handleSortChange(option.id)}
                            whileHover={{
                              backgroundColor: selectedSort === option.id ? '#FEF3C7' : '#F3F4F6',
                            }}
                          >
                            {option.name}
                            {selectedSort === option.id && (
                              <Check className="w-4 h-4 text-yellow-500" />
                            )}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {activeFilters.length > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {Object.entries(appliedFilters).map(([category, filters]) =>
                      filters.map((filter) => (
                        <motion.div
                          key={`${category}:${filter}`}
                          className="flex items-center bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 text-xs"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <span>{filter}</span>
                          <button className="ml-1" onClick={() => toggleFilter(category, filter)}>
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))
                    )}

                    <motion.button
                      className="text-xs text-gray-600 underline"
                      onClick={clearAllFilters}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear all
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="hidden md:flex flex-wrap gap-2 pb-4">
                {Object.entries(filterOptions).map(([category, options], index) => {
                  const IconComponent = filterIcons[category];
                  return (
                    <motion.div
                      key={category}
                      className="relative"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <motion.button
                        className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 shadow-sm"
                        onClick={() => toggleFilterGroup(category)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent className="w-4 h-4 text-gray-600" />
                        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        {expandedFilterGroup === category ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                      </motion.button>

                      <AnimatePresence>
                        {expandedFilterGroup === category && (
                          <motion.div
                            className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{ top: '100%', transformOrigin: 'top' }}
                          >
                            <div className="max-h-60 overflow-y-auto">
                              {options.map((option) => (
                                <motion.button
                                  key={option}
                                  className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left text-gray-700 ${
                                    appliedFilters[category]?.includes(option)
                                      ? 'bg-yellow-50 text-yellow-600'
                                      : 'hover:bg-gray-100'
                                  }`}
                                  onClick={() => toggleFilter(category, option)}
                                  whileHover={{
                                    backgroundColor: appliedFilters[category]?.includes(option)
                                      ? '#FEF3C7'
                                      : '#F3F4F6',
                                  }}
                                >
                                  {option}
                                  {appliedFilters[category]?.includes(option) && (
                                    <Check className="w-4 h-4 text-yellow-500" />
                                  )}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isFilterSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-gray-500/30 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterSidebarOpen(false)}
              />

              <motion.div
                className="fixed top-0 left-0 h-full w-80 bg-white z-50 overflow-y-auto"
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                  <motion.button
                    className="p-2 rounded-full hover:bg-gray-200"
                    onClick={() => setIsFilterSidebarOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                <div className="p-4 bg-white">
                  {Object.entries(filterOptions).map(([category, options]) => {
                    const IconComponent = filterIcons[category];
                    return (
                      <div key={category} className="mb-4">
                        <motion.button
                          className="flex items-center justify-between w-full text-left font-semibold text-gray-800 py-2 px-2 rounded-lg hover:bg-gray-100"
                          onClick={() => toggleFilterGroup(category)}
                          whileHover={{ backgroundColor: '#F3F4F6' }}
                        >
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-5 h-5 text-gray-600" />
                            <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                          </div>
                          {expandedFilterGroup === category ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </motion.button>

                        <AnimatePresence>
                          {expandedFilterGroup === category && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2 mt-2">
                                {options.map((option) => (
                                  <motion.div
                                    key={option}
                                    className="flex items-center px-2 py-1 rounded-lg hover:bg-gray-100"
                                    whileHover={{ x: 5 }}
                                  >
                                    <input
                                      type="checkbox"
                                      id={`${category}-${option}`}
                                      checked={appliedFilters[category]?.includes(option) || false}
                                      onChange={() => toggleFilter(category, option)}
                                      className="w-4 h-4 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500"
                                    />
                                    <label
                                      htmlFor={`${category}-${option}`}
                                      className="ml-2 text-sm text-gray-700 flex-1"
                                    >
                                      {option}
                                    </label>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex space-x-2">
                  <motion.button
                    className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                    onClick={clearAllFilters}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear All
                  </motion.button>
                  <motion.button
                    className="flex-1 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-600"
                    onClick={() => setIsFilterSidebarOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 py-6" ref={resultsRef} style={{ marginTop: '20px' }}>
          {filteredProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate={isResultsInView ? 'visible' : 'hidden'}
            >
              {searchedProducts.length == 0 && (
                <div className="flex justify-center items-center h-96">
                  <div className="bg-yellow-200 rounded-md p-6 max-w-md w-full text-center">
                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      We couldn&apos;t find any products matching “{displayQuery}”. Try using
                      different keywords or removing some filters.
                    </p>
                  </div>
                </div>
              )}
              {searchedProducts.map((product, index) => (
                <motion.div
                onClick={() => handleItemView(product.id)}
                  key={product.id}
                  variants={itemVariants}
                  custom={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-gray-200/50 to-transparent z-10"
                      variants={overlayVariants}
                      initial="initial"
                      whileHover="hover"
                    />
                    <motion.div
                      variants={imageVariants}
                      whileHover="hover"
                      initial="initial"
                      className="relative w-full h-full"
                    >
                      <Image
                        src={`${baseUrl}/${product.image}`}
                        alt={product.name}
                        layout="fill"
                        objectFit="contain"
                        objectPosition="center"
                        className="w-full h-full"
                      />
                    </motion.div>
                    {product.is_on_sale === '1' && (
                      <div className="absolute top-2 left-2 z-20">
                        <span className="flex item-center justify-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          <BadgePercent className="w-4 h-4" />
                          Super Deal
                        </span>
                      </div>
                    )}

                    {product.originalPrice && (
                      <div className="absolute top-2 right-2 z-20">
                        <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                          {/* {calculateDiscount(product.price, product.originalPrice)}% OFF */}
                          {product.discount}% OFF
                        </span>
                      </div>
                    )}

                    {product.stock && product.stock <= 15 && (
                      <div className="absolute bottom-2 left-2 z-20">
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          ONLY {product.stock} LEFT
                        </span>
                      </div>
                    )}

                    <motion.div
                      className="absolute bottom-2 right-2 flex space-x-1 z-20"
                      variants={overlayVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      <motion.button
                        onClick={() => addToCart(product.id)}
                        className={`p-2 rounded-full shadow-md ${
                          cart.includes(product.id)
                            ? 'bg-yellow-500 text-black'
                            : 'bg-white text-black hover:bg-yellow-500 hover:text-black'
                        }`}
                        variants={actionButtonVariants}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => toggleWishlist(product.id)}
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
                      </motion.button>
                      <motion.button
                        onClick={() => handleQuickView(product)}
                        className="p-2 bg-white text-black hover:bg-black hover:text-white rounded-full shadow-md"
                        variants={actionButtonVariants}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-700 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-sm font-bold text-orange-500">
                        {(() => {
                          const n = parsePriceToNumber(product.price as unknown as string);
                          return n != null ? formatPriceLKR(n) : `Rs ${product.price}`;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                        <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">30+ sold</span>{' '}
                      {/* ----- Hard Codeed ---- */}
                    </div>
                    <AnimatePresence>
                      {cart.includes(product.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2"
                        >
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center justify-center">
                            Added to cart
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="inline-block p-4 bg-gray-100 rounded-full mb-4"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                }}
              >
                <Search className="w-8 h-8 text-gray-400" />
              </motion.div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn&apos;t find any products matching “{displayQuery}”. Try using different
                keywords or removing some filters.
              </p>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {quickViewProduct && (
            <motion.div
              className="fixed inset-0 bg-gray-500/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseQuickView}
            >
              <motion.div
                className="bg-white rounded-lg max-w-3xl w-full overflow-hidden"
                variants={quickViewVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={quickViewProduct.image}
                        alt={quickViewProduct.name}
                        layout="fill"
                        objectFit="contain"
                        objectPosition="center"
                        className="w-full h-full"
                      />
                      {quickViewProduct.originalPrice && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-500 text-black text-sm font-bold px-3 py-1 rounded-full">
                            {calculateDiscount(
                              quickViewProduct.price,
                              quickViewProduct.originalPrice
                            )}
                            % OFF
                          </span>
                        </div>
                      )}
                      {quickViewProduct.is_on_sale && (
                        <div className="absolute top-4 left-4">
                          <span className="flex items-center gap-1 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                            <BadgePercent className="w-4 h-4" />
                            Super Deal!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">
                      {quickViewProduct.name}
                    </h2>
                    <div className="flex items-center mb-3">
                      <div className="flex">{renderStars(quickViewProduct.rating)}</div>
                      <span className="text-sm text-gray-600 ml-2">
                        {quickViewProduct.rating} Rating
                      </span>
                    </div>
                    <div className="flex items-baseline space-x-3 mb-3">
                      <span className="text-xl font-bold text-orange-500">
                        {(() => {
                          const n = parsePriceToNumber(quickViewProduct.price as unknown as string);
                          return n != null ? formatPriceLKR(n) : `Rs ${quickViewProduct.price}`;
                        })()}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-600 font-medium mb-3">30+ sold</p>
                    {quickViewProduct.stock && quickViewProduct.stock <= 15 && (
                      <div className="mb-3">
                        <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          ONLY {quickViewProduct.stock} LEFT
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-gray-700 mb-6">
                      {quickViewProduct.name} - {quickViewProduct.description}
                    </p>
                    <div className="mt-auto space-y-3">
                      <motion.button
                        onClick={() => {
                          addToCart(quickViewProduct.id);
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
                        onClick={() => toggleWishlist(quickViewProduct.id)}
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
                  <X className="h-5 w-5 text-gray-600" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              className="fixed bottom-6 right-6 p-3 bg-yellow-500 text-black rounded-full shadow-lg z-40"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </main>

      {/* <Footer /> */}
    </div>
    </LoadingOverlay>
  );
}

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex min-h-screen bg-gray-50 items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Search...</p>
    </div>
  </div>
);

// Main page component wrapped with Suspense
const SearchPageWrapper = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchPage />
    </Suspense>
  );
};

export default SearchPageWrapper;
