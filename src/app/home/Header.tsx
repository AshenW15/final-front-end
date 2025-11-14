/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { type FC, useState, useEffect, useRef, Dispatch, SetStateAction, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  Smartphone,
  ShoppingBag,
  Home,
  Smile,
  Plus,
  UserCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { Spinner } from '@heroui/spinner';

interface HeaderProps {
  onBecomeSellerClick: () => void;
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  showSearch?: boolean;
}

const Header: FC<HeaderProps> = ({
  onBecomeSellerClick,
  searchQuery = '',
  setSearchQuery,
  showSearch = true,
}) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false); // State for search history dropdown
  const [history, setHistory] = useState<searchHistory[]>([]);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null); // Ref for search bar

  const router = useRouter();
  type CartItems = {
    id: string;
    product_id: number;
    // email: string;
    product_name: string;
    product_price: number;
    product_OriginalPrice?: number;
    product_image: string;
    product_quantity: number;
    product_discount: number;
    product_store_name: string;
    product_category: string;
    product_selected_color: string;
    product_selected_size: string;
    selected: boolean;
  };

  const [cartData, setCartData] = useState<CartItems[]>([]);
  const [displayCartCount, setDisplayCartCount] = useState(0);


  const fetchProductsToCart = useCallback(async (): Promise<void> => {
    let userEmail = user?.email || '';

    if (!userEmail) {
      if (typeof window === 'undefined') {
        // --- Server side (Next.js) ---
        try {
          const { cookies } = await import('next/headers');
          userEmail = (await cookies()).get('userEmail')?.value || '';
        } catch {
          userEmail = '';
        }
      } else {
        // --- Client side ---
        userEmail = sessionStorage.getItem('userEmail') || '';

        if (!userEmail) {
          const match = document.cookie.match(/(?:^|;\s*)userEmail=([^;]+)/);
          if (match) {
            userEmail = decodeURIComponent(match[1]);
          }
        }
      }
    }

    console.log('User Email:', userEmail);
    setIsLoading(true);

    const formdata = new FormData();
    formdata.append('user_email', userEmail);

    try {
      const response = await fetch(`${baseUrl}/fetch_cart_items.php`, {
        method: 'POST',
        body: formdata,
      });
      const data = await response.json();

      console.log('Fetched Data:', data);

      if (data.cart) {
        const cartitems: CartItems[] = data.cart;
        setCartData(cartitems);

        const cartCount = cartitems.length;
        console.log('Header Cart Count -> ', cartCount);

        setDisplayCartCount(cartCount);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cartCount', cartCount.toString());
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchProductsToCart();
    }
  }, [fetchProductsToCart]);

  interface searchHistory {
    search_keyword_name: string;
    search_id: number;
  }
  const fetchSearchedhistory = useCallback(async () => {
    let userEmail = user?.email || '';

    // use Cookies
    if (!userEmail) {
      if (typeof window === 'undefined') {
        // --- Server side (Next.js) ---
        try {
          const { cookies } = await import('next/headers');
          userEmail = (await cookies()).get('userEmail')?.value || '';
        } catch {
          userEmail = '';
        }
      } else {
        // --- Client side ---
        userEmail = sessionStorage.getItem('userEmail') || '';

        if (!userEmail) {
          const match = document.cookie.match(/(?:^|;\s*)userEmail=([^;]+)/);
          if (match) {
            userEmail = decodeURIComponent(match[1]);
          }
        }
      }
    }
    const formData = new FormData();
    formData.append('search_email', userEmail);

    try {
      const response = await fetch(`${baseUrl}/fetch_search_history.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Search History for users:', data);
      const history: searchHistory[] = data;
      setHistory(history);
      console.log('Search History on use:', history);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchSearchedhistory();
  }, [fetchSearchedhistory, searchQuery]); // Fetch search history when the component mounts or when searchQuery changes

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node))
        setIsUserDropdownOpen(false);
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node))
        setIsSearchHistoryOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      router.push(`/search?param=${encodeURIComponent(localSearchQuery)}`);
    }
  };

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearchHistoryOpen(true);
    const keyword = e.target.value;
    setLocalSearchQuery(keyword);
    if (setSearchQuery) {
      setSearchQuery(keyword);
    }
    fetchSuggestions(keyword);
  };

  const fetchSuggestions = async (keyword: string) => {
    if (keyword.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    const formData = new FormData();
    formData.append('query', keyword);

    try {
      const res = await fetch(`${baseUrl}/search_products.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Fetched suggestions:', data);
      setSuggestions(data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleHistoryItemClick = (item: string) => {
    setLocalSearchQuery(item);
    if (setSearchQuery) {
      setSearchQuery(item);
    }
    router.push(`/search?param=${encodeURIComponent(item)}`);
    setIsSearchHistoryOpen(false);
  };

  const clearSearchHistory = async () => {
    const userEmail = user?.email || '';
    const formData = new FormData();
    formData.append('search_email', userEmail);
    fetch(`${baseUrl}/clear_search_history.php`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Search history cleared:', data);
        confirm('Search history cleared successfully');
        setHistory([]);
      })
      .catch((error) => {
        console.error('Error clearing search history:', error);
      });
    setIsSearchHistoryOpen(false);
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
  };

  const navItemVariants = {
    hover: { scale: 1.05, color: '#EAB308', transition: { duration: 0.2 } },
  };

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  const searchButtonVariants = {
    hover: { scale: 1.05, backgroundColor: '#F59E0B' },
    tap: { scale: 0.95 },
  };

  const iconButtonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  const [username, setUsername] = useState('Guest');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartCount', '0');
        localStorage.removeItem('user_id');
        sessionStorage.setItem('userRole', 'guest');
        document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
      }
      await logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`${baseUrl}/get_user_profile.php`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email, // Pass the user's email to the backend
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseText = await response.text();
          let data;

          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Invalid JSON response:', responseText);
            console.error('Parse error:', parseError);
            // Set default guest state and continue without throwing
            setUsername('Guest');
            setUserImage(null);
            setLoading(false);
            return;
          }

          console.log('Fetched user profile data:', data);

          // If the backend returns the user data, update the profile state
          if (data.success) {
            const imageUrl =
              data.profile_picture &&
              data.profile_picture.startsWith('https://lh3.googleusercontent.com')
                ? data.profile_picture // If it's from Google, use the URL directly
                : `${baseUrl}/${data.profile_picture}`; // If it's a local image, construct the URL

            setUsername(data.first_name + ' ' + data.last_name); // Combine first and last name for the username
            setUserImage(imageUrl); // Set the profile image
          } else {
            console.error('Failed to fetch user profile:', data.message || 'Unknown error');
            // Set default guest state
            setUsername('Guest');
            setUserImage(null);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Set default guest state on error
          setUsername('Guest');
          setUserImage(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUsername('Guest');
        setUserImage(null);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Add loading animation to here..
  if (loading || !mounted) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
        <h1 className="text-4xl font-bold animate-pulse flex items-center space-x-1">
          <span className="text-yellow-500 animate-bounce drop-shadow-[0_0_8px_rgb(234,179,8)] font-extrabold">
            S
          </span>
          <span className="text-white">TOREVIA</span>
          <span className="text-yellow-500 typing-dots ml-2"></span> .....
        </h1>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isSidebarOpen ? 'open' : 'closed'}
        className="fixed top-0 left-0 w-72 h-full bg-white shadow-xl z-50 lg:hidden overflow-y-auto"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Link href="/">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="cursor-pointer flex items-center"
              >
                <Image
                  src="/web.png"
                  alt="Storevia Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
            </Link>

            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={toggleSidebar}
              className="text-gray-900 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-gray-900 font-medium mb-2">Navigation</h3>
              <nav className="space-y-2">
                {[
                  { name: 'Home', icon: Home, href: '/', enabled: true },
                  { name: 'Search', icon: Search, href: '/search', enabled: true },
                  { name: 'SuperDeals', icon: ShoppingBag, href: '/superdeals', enabled: false },
                ].map((item) =>
                  item.enabled ? (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        whileHover={{ x: 5, backgroundColor: '#F3F4F6' }}
                        onClick={toggleSidebar}
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <item.icon className="w-5 h-5 text-yellow-500" />
                        <span>{item.name}</span>
                      </motion.div>
                    </Link>
                  ) : (
                    <motion.div
                      key={item.name}
                      className="flex items-center gap-3 px-3 py-2 text-gray-400 rounded-lg bg-gray-50 cursor-not-allowed relative"
                    >
                      <item.icon className="w-5 h-5 text-gray-400" />
                      <span>{item.name}</span>
                      <span className="ml-auto bg-yellow-400 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Coming Soon
                      </span>
                    </motion.div>
                  )
                )}
              </nav>
            </div>
            <div className="pt-2 border-t">
              <Link href="/seller">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onBecomeSellerClick();
                    toggleSidebar();
                  }}
                  className="w-full bg-yellow-500 text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Become a Seller
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Header - Desktop only */}
      <motion.header
        className={`sticky top-0 z-30 hidden lg:block ${scrolled ? 'shadow-md' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Top Header Bar - White Background */}
        <div className="bg-white text-gray-900 shadow-sm">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              {/* Left side - Logo and Menu */}
              <div className="flex items-center space-x-4">
                <motion.button
                  variants={iconButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={toggleSidebar}
                  className="text-gray-900 lg:hidden p-1 rounded-full hover:bg-gray-100"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </motion.button>
                <Link href="/">
                  <motion.div
                    variants={logoVariants}
                    initial="initial"
                    animate="animate"
                    className="flex items-center cursor-pointer"
                  >
                    <Image
                      src="/web.png"
                      alt="Storevia Logo"
                      width={100}
                      height={32}
                      className="object-contain"
                    />
                  </motion.div>
                </Link>
              </div>

              {/* Center - Search Bar with Cart */}
              {showSearch && (
                <div className="flex-1 max-w-2xl mx-4 lg:mx-8 flex items-center gap-2">
                  <div className="relative w-full" ref={searchBarRef}>
                    <form onSubmit={handleSearch}>
                      <div className="flex items-center border border-gray-300 px-4 py-1.5 bg-white hover:shadow-sm transition-all duration-200">
                        <input
                          type="text"
                          placeholder="Search in Storevia"
                          value={localSearchQuery}
                          onChange={handleInputChange}
                          onFocus={() => setIsSearchHistoryOpen(true)}
                          className="bg-transparent outline-none text-gray-700 w-full placeholder-gray-400 text-sm"
                        />

                        {localSearchQuery && (
                          <motion.button
                            onClick={() => setLocalSearchQuery('')}
                            type="button"
                            whileHover="hover"
                            whileTap="tap"
                            className="rounded-full p-1 hover:bg-gray-200 transition"
                            aria-label="Clear search"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </motion.button>
                        )}

                        <motion.button
                          type="submit"
                          variants={searchButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="p-2 rounded-full hover:bg-gray-100 transition"
                          aria-label="Search"
                        >
                          <Search className="w-5 h-5 text-gray-600" />
                        </motion.button>
                      </div>
                    </form>

                    {/* Search History Dropdown */}
                    <AnimatePresence>
                      {isSearchHistoryOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden"
                        >
                          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                              <Search className="w-4 h-4 text-yellow-500" /> Search History
                            </h3>

                            {history.length > 0 && (
                              <button
                                onClick={clearSearchHistory}
                                className="text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
                              >
                                CLEAR
                              </button>
                            )}
                          </div>

                          {/* Search History */}
                          {history.length > 0 ? (
                            <ul>
                              {history.map((item, index) => (
                                <motion.li
                                  key={index}
                                  whileHover={{
                                    backgroundColor: '#FEF3C7',
                                    x: 5,
                                    transition: { duration: 0.2 },
                                  }}
                                  onClick={() => handleHistoryItemClick(item.search_keyword_name)}
                                  className="px-4 py-2.5 text-gray-700 cursor-pointer flex items-center gap-2 group transition-all"
                                >
                                  <span className="text-sm">{item.search_keyword_name}</span>
                                  <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </motion.li>
                              ))}
                            </ul>
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No items
                            </div>
                          )}

                          {/* Suggestions */}
                          {suggestions.length > 0 && (
                            <div className="border-t border-gray-100">
                              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-700">
                                Suggestions
                              </div>
                              <ul>
                                {suggestions.map((suggestion: any) => (
                                  <motion.li
                                    key={suggestion.id}
                                    whileHover={{
                                      backgroundColor: '#FEF3C7',
                                      x: 5,
                                      transition: { duration: 0.2 },
                                    }}
                                    onClick={() => handleHistoryItemClick(suggestion.name)}
                                    className="px-4 py-2.5 text-gray-700 cursor-pointer flex items-center gap-2 group transition-all"
                                  >
                                    <span className="text-sm">{suggestion.name}</span>
                                    <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Cart Button - Right next to search bar */}
                  <motion.button
                    variants={iconButtonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center justify-center relative ml-6 "
                    aria-label="Cart menu"
                    // style={{ minWidth: 48, minHeight: 48 }}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/cart');
                    }}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute top-0 right-0 -mt-1 -mr-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {displayCartCount}
                    </span>
                  </motion.button>
                </div>
              )}

              {/* Right Icons - User Profile, then SuperDeals */}
              <div className="flex items-center space-x-2 text-gray-900">
                <div ref={userDropdownRef} className="relative">
                  {user ? (
                    // When logged in, show clickable profile area
                    <motion.button
                      variants={iconButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={toggleUserDropdown}
                      className="flex items-center space-x-2 text-gray-900 p-1 lg:p-2 rounded-full hover:bg-gray-100"
                      aria-label="User profile menu"
                    >
                      <h3 className="text-gray-700" suppressHydrationWarning>
                        {username}
                      </h3>
                      {userImage && (
                        <Image
                          src={userImage}
                          alt="User profile"
                          width={30}
                          height={30}
                          style={{ borderRadius: '50%' }}
                        />
                      )}
                    </motion.button>
                  ) : (
                    // When not logged in, show User icon and Guest text
                    <motion.button
                      variants={iconButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={toggleUserDropdown}
                      className="flex items-center space-x-2 text-gray-900 p-1 lg:p-2 rounded-full hover:bg-gray-100"
                      aria-label="User menu"
                    >
                      <h3 className="text-gray-700" suppressHydrationWarning>
                        Guest
                      </h3>
                      <User className="w-5 h-5 lg:w-6 lg:h-6" />
                    </motion.button>
                  )}
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-48 lg:w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden"
                      >
                        {!user ? (
                          // Show login/register options when not authenticated
                          <>
                            <Link href="/user/login">
                              <motion.a
                                whileHover={{ backgroundColor: '#F3F4F6' }}
                                className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 cursor-pointer relative"
                              >
                                <User className="w-4 h-4" />
                                <span>Login</span>
                              </motion.a>
                            </Link>
                            <Link href="/user/register">
                              <motion.a
                                whileHover={{ backgroundColor: '#F3F4F6' }}
                                className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 cursor-pointer relative"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Register</span>
                              </motion.a>
                            </Link>
                            <Link href="/seller">
                              <motion.button
                                whileHover={{ backgroundColor: '#F3F4F6' }}
                                onClick={onBecomeSellerClick}
                                className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Become a Seller</span>
                              </motion.button>
                            </Link>
                          </>
                        ) : (
                          // Show profile and logout when authenticated
                          <>
                            <motion.a
                              whileHover={{ backgroundColor: '#F3F4F6' }}
                              href="/profile"
                              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>My Profile</span>
                            </motion.a>
                            <motion.button
                              whileHover={{ backgroundColor: '#F3F4F6' }}
                              onClick={handleLogout}
                              className="flex items-center gap-2 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </motion.button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Special SuperDeals Section - Moved after user profile */}
                <motion.div className="relative group" transition={{ duration: 0.3 }}>
                  {/* Coming Soon Badge - Positioned above the button */}
                  {/* <motion.div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-20 whitespace-nowrap">
                    Coming Soon
                  </motion.div> */}

                  <motion.div className="relative flex items-center gap-2 bg-amber-200 text-gray-500 font-bold px-4 py-2 rounded-full shadow-lg cursor-pointer">
                    <span className="text-lg">🔥</span>
                    <span className="relative z-10 text-sm font-bold">SuperDeals</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
