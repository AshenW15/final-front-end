/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  ChevronLeft,
  ChevronDown,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  ShoppingCart,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Poppins } from 'next/font/google';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

import { useAlerts } from '@/hooks/useAlerts';
// import { useRouter } from 'next/navigation';
import { useLoading } from '@/hooks/useLoading';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { formatPriceLKR, parsePriceToNumber } from '@/lib/utils';

// Load Poppins font with specific weights and subsets
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

type CartItems = {
  product_cod_price: number;
  id: string;
  product_id: number;
  // email: string;
  product_name: string;
  product_price: number;
  product_cod: number;
  product_OriginalPrice?: number;
  product_image: string;
  product_quantity: number;
  product_discount: number;
  product_store_name: string;
  product_category: string;
  product_selected_color: string;
  product_selected_size: string;
  stock_available: number;
  selected: boolean;
};

type ProductItem = {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  image: string;
  favorited: boolean;
};

const EnhancedCart = () => {
  const { user } = useAuth();
  const { isLoading, withLoading } = useLoading();
  // Removed unused setUpdateLoading state setter
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // const [cartItems, setCartItems] = useState<CartItem[]>([
  //   {
  //     id: '1',
  //     name: 'Mobile Phone',
  //     price: 250000,
  //     originalPrice: 300000,
  //     size: 'S',
  //     image:
  //       'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vYmlsZSUyMPBob25lfGVufDB8fDB8fHww',
  //     quantity: 1,
  //     selected: false,
  //   },
  //   {
  //     id: '2',
  //     name: 'Mini Fan',
  //     price: 150000,
  //     originalPrice: 180000,
  //     size: 'S',
  //     image:
  //       'https://images.unsplash.com/photo-1718815416565-c65944a5ec14?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAyfHxoYWlyJTIwZHJ5ZXJ8ZW58MHx8MHx8fDA%3D',
  //     quantity: 1,
  //     selected: false,
  //   },
  //   {
  //     id: '3',
  //     name: 'Sunglass',
  //     price: 399000,
  //     originalPrice: 450000,
  //     size: 'S',
  //     image:
  //       'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN1bmdsYXNzfGVufDB8fDB8fHww',
  //     quantity: 1,
  //     selected: false,
  //   },
  // ]);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromoSuccess, setShowPromoSuccess] = useState(false);
  const [isRemovingItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const [cartData, setCartData] = useState<CartItems[]>([]);
  const [storeViaPicks, setStoreViaPicks] = useState<ProductItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  // Alert and confirmation modals
  const { error: showError, AlertModalComponent, ConfirmationModalComponent } = useAlerts();

  const fetchProductsFromBackend = async (): Promise<void> => {
    try {
      const res = await fetch(`${baseUrl}/fetch_all_products.php`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseText = await res.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Invalid JSON response from products API:', responseText);
        console.error('Parse error:', parseError);
        return;
      }

      console.log('Fetched product data:', data);

      if (data.products && Array.isArray(data.products)) {
        // Limit the result to 4 products
        const limitedProducts = data.products.slice(0, 4);

        // Update the state with the fetched data
        setStoreViaPicks(limitedProducts);
        console.log('Limited products:', limitedProducts);
      }
    } catch (err) {
      console.error('Error fetching products data:', err);
    }
  };

  useEffect(() => {
    fetchProductsFromBackend();
  }, []);

  useEffect(() => {
    if (user?.email) {
      withLoading(() => fetchProducts());
    }
  }, [user?.email]);

  useEffect(() => {
    console.log('Cart Data Updated:', cartData);
  }, [cartData]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // const handleSelectItem = (id: string) => {
  //   const newCartItems = cartItems.map((item) =>
  //     item.id === id ? { ...item, selected: !item.selected } : item
  //   );
  //   setCartItems(newCartItems);
  //   console.log(`Item ${id} selection toggled:`, newCartItems);
  // };

  // Keep fetchProducts OUTSIDE of handleRemoveItem
  // const fetchProducts = async (): Promise<void> => {
  //   const userEmail = user?.email || '';
  //   console.log('Session Email:', userEmail);

  //   const formData = new FormData();
  //   formData.append('user_email', userEmail);

  //   try {
  //     const res = await fetch(`${baseUrl}/fetch_cart_items.php`, {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     const data = await res.json();
  //     console.log('Cart data received:', data);

  //     if (data.cart) {
  //       const cartItems: CartItems[] = data.cart;
  //       setCartData(cartItems);

  //       const uniqueCategories = [
  //         ...new Set(cartItems.map((item) => item.product_category)),
  //       ] as string[];
  //       const productIds = cartItems.map((item) => item.product_id.toString());

  //       console.log('Unique categories from cart:', uniqueCategories);
  //       console.log('Product IDs from cart:', productIds);

  //       if (uniqueCategories.length > 0) {
  //         await fetchMatchingItems(uniqueCategories, productIds);
  //       }
  //     }else{
  //       setCartData([]);
  //     }
  //   } catch (err) {
  //     console.error('Error fetching cart items:', err);
  //     setCartData([]);
  //   }
  // };

 const fetchProducts = async (): Promise<void> => {
  setCartLoading(true);
  let userEmail = user?.email || '';

  if (!userEmail) {
    if (typeof window === 'undefined') {
      try {
        const { cookies } = await import('next/headers');
        userEmail = (await cookies()).get('userEmail')?.value || '';
      } catch {
        userEmail = '';
      }
    } else {
      const match = document.cookie.match(/(?:^|;\s*)userEmail=([^;]+)/);
      if (match) {
        userEmail = decodeURIComponent(match[1]);
      }
    }
  }

  console.log('Session Email:', userEmail);

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ user_email: userEmail }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    console.log('Cart data received:', data);

    const cartItems: CartItems[] = data.cart_items ?? [];
    setCartData(cartItems);

    if (cartItems.length > 0) {
      const uniqueCategories = [
        ...new Set(cartItems.map((item) => item.product_category)),
      ];
      const productIds = cartItems.map((item) => item.product_id.toString());

      console.log('Unique categories from cart:', uniqueCategories);
      console.log('Product IDs from cart:', productIds);

      await fetchMatchingItems(uniqueCategories, productIds);
    }

  } catch (err) {
    console.error('Error fetching cart items:', err);
    setCartData([]);
  } finally {
    setCartLoading(false);
  }
};


  const handleRemoveItem = async (id: string) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
      method: 'DELETE',
      headers: {
        "Accept": "application/json"
      },
    });

    const data = await response.json();
    console.log("Delete Response:", data);

    // update cartCount in localStorage
    const storedCount = parseInt(localStorage.getItem('cartCount') ?? '0', 10) || 0;
    const newCartCount = Math.max(storedCount - 1, 0);
    localStorage.setItem('cartCount', newCartCount.toString());

    console.log('new Cart Count -> ', newCartCount);

    // refresh cart list
    fetchProducts();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};


const handleQuantityChange = async (id: string, change: number) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ change }),
    });

    const data = await response.json();
    console.log("Update Quantity Response:", data);

    fetchProducts(); // refresh cart
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
};


  const calculateSubtotal = () => {
    return cartData
      .filter((item) => item.selected) // Only calculate for selected items
      .reduce((total, item) => total + item.product_price * item.product_quantity, 0);
  };

  const calculateCod = () => {
    // Sum Cash-on-Delivery (shipping) safely, falling back to 0 when missing/invalid
    // Only for selected items
    const codTotal = cartData
      .filter((item) => item.selected) // Only calculate for selected items
      .reduce((total, item) => {
        // Try primary field
        const primary =
          typeof item.product_cod_price === 'number'
            ? item.product_cod_price
            : Number((item as any).product_cod_price);
        // Try legacy/alternate field
        const legacy =
          typeof (item as any).product_cod === 'number'
            ? (item as any).product_cod
            : Number((item as any).product_cod);

        const cod = Number.isFinite(primary) ? primary : Number.isFinite(legacy) ? legacy : 0;

        return total + cod;
      }, 0);

    return codTotal; // return as number
  };

  const calculateTotal = () => {
    // Total = Subtotal + Shipping (COD). Return as a number; caller formats.
    const subtotal = Number(calculateSubtotal()) || 0;
    const shipping = Number(calculateCod()) || 0;
    const total = subtotal + shipping;
    // Normalize floating point to 2dp without converting to string prematurely
    return Math.round(total * 100) / 100;
  };

  const handleApplyPromo = async () => {
    setCheckoutLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (promoCode.toLowerCase() === 'discount20') {
        const selectedItemsSubtotal = calculateSubtotal(); // This now only calculates selected items
        const discountAmount = selectedItemsSubtotal * 0.2;
        setDiscount(discountAmount);
        setShowPromoSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#000000', '#FF0000'],
        });
        setTimeout(() => {
          setShowPromoSuccess(false);
        }, 3000);
      } else {
        showError('Invalid Promo Code', "Invalid promo code. Try 'DISCOUNT20'");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);

    // Save cart data before navigating
    localStorage.setItem('cartItemsToCheckout', JSON.stringify(cartData));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#000000', '#FF0000'],
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  // const handleAddToCart = async (product: ProductItem) => {
  //   setUpdateLoading(String(product.id));
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     const newItem: CartItem = {
  //       id: `new-${Date.now()}`,
  //       name: product.name,
  //       price: product.price,
  //       originalPrice: product.originalPrice,
  //       size: 'M',
  //       image: product.image,
  //       quantity: 1,
  //       selected: false,
  //     };
  //     setCartItems((prev) => [...prev, newItem]);
  //     confetti({
  //       particleCount: 50,
  //       spread: 50,
  //       origin: { y: 0.6 },
  //       colors: ['#FACC15', '#000000', '#FF0000'],
  //     });
  //   } finally {
  //     setUpdateLoading(null);
  //   }
  // };

  const handleAddToCart = (product: ProductItem) => {
    console.log('Add to cart:', product);
    // Placeholder function - implement cart addition logic here
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
        duration: 0.5,
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
    exit: {
      opacity: 0,
      x: -300,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // const [matchingItems, setMatchingItems] = useState<ProductItem[]>([]);
  const fetchMatchingItems = async (categoryNames: string[], excludedProductIds: string[]) => {
    console.log('Fetching matching items with categories:', categoryNames);
    console.log('Excluding product IDs:', excludedProductIds);

    try {
      const res = await fetch(`${baseUrl}/fetch_matching_items.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categories: categoryNames,
          exclude_ids: excludedProductIds,
        }),
      });

      const data = await res.json();
      console.log('Response from matching items API:', data);

      if (data.matchingItems) {
        const products = data.matchingItems.map((item: any) => ({
          ...item,
          favorited: false,
        }));
        console.log('Setting matching items:', products);
        // setMatchingItems(products); // Commented out for now
      } else if (data.error) {
        console.error('API Error:', data.error);
      } else {
        console.log('No matching items found');
      }
    } catch (error) {
      console.error('Failed to fetch matching items', error);
    }
  };
  // const router = useRouter();
  // const handleItemView = (productId: number) => {
  //   router.push(`/item?productId=${encodeURIComponent(productId)}`);
  // };

  return (
    <LoadingOverlay isLoading={isLoading || cartLoading} text="Loading cart...">
      <style jsx global>{`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
      <div className={`min-h-screen bg-white ${poppins.className}`}>
        <motion.div
          className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
            scrolled ? 'shadow-md' : ''
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center">
              <Link href="/">
                <motion.div
                  className="flex items-center cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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

              <div className="ml-6 text-gray-500 flex items-center">
                <Link href="/" className="hover:text-yellow-500 transition-colors">
                  Home
                </Link>
                <ChevronLeft className="h-4 w-4 mx-1 rotate-180 text-gray-500" />
                <span className="font-medium text-black">Cart</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Main Cart Section */}
            <motion.div className="lg:col-span-3 space-y-4" variants={fadeInVariants}>
              {/* Categories and Controls Section - Desktop only, mobile gets simplified */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  {/* Mobile View - Simplified */}
                  <div className="flex items-center space-x-2 md:space-x-4 md:hidden">
                    {/* Select All Checkbox - Mobile */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="select-all-mobile"
                        className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setCartData((prevItems) =>
                            prevItems.map((item) => ({ ...item, selected: isChecked }))
                          );
                        }}
                        checked={cartData.length > 0 && cartData.every((item) => item.selected)}
                      />
                      <label
                        htmlFor="select-all-mobile"
                        className="text-xs text-gray-600 cursor-pointer"
                      >
                        ALL ({cartData.length})
                      </label>
                    </div>
                  </div>

                  {/* Desktop View - Full */}
                  <div className="hidden md:flex items-center space-x-4">
                    {/* Categories Dropdown */}
                    <div className="relative">
                      <motion.button
                        className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-sm font-medium">Categories</span>
                        <ChevronDown className="h-4 w-4" />
                      </motion.button>
                    </div>

                    {/* Select All Checkbox - Desktop */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="select-all"
                        className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setCartData((prevItems) =>
                            prevItems.map((item) => ({ ...item, selected: isChecked }))
                          );
                        }}
                        checked={cartData.length > 0 && cartData.every((item) => item.selected)}
                      />
                      <label htmlFor="select-all" className="text-sm text-gray-600 cursor-pointer">
                        SELECT ALL ({cartData.length} ITEM{cartData.length !== 1 ? 'S' : ''})
                      </label>
                    </div>
                  </div>

                  {/* Delete Button - Both Mobile & Desktop */}
                  <motion.button
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 px-3 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!cartData.some((item) => item.selected)}
                    onClick={() => {
                      const selectedItems = cartData.filter((item) => item.selected);
                      selectedItems.forEach((item) => handleRemoveItem(item.id, 3));
                    }}
                  >
                    <span className="text-sm">🗑️</span>
                    <span className="text-sm hidden md:inline">DELETE</span>
                  </motion.button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {cartData.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {cartData.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate={
                            isRemovingItem === item.id || isRemovingItem === 'selected'
                              ? 'exit'
                              : 'visible'
                          }
                          exit="exit"
                          className="p-4 hover:bg-gray-50 transition-colors duration-200"
                        >
                          {/* Mobile Layout */}
                          <div className="flex items-start space-x-3 md:hidden">
                            {/* Checkbox */}
                            <div className="flex items-center pt-1">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() => {
                                  setCartData((prevItems) =>
                                    prevItems.map((cartItem) =>
                                      cartItem.id === item.id
                                        ? { ...cartItem, selected: !cartItem.selected }
                                        : cartItem
                                    )
                                  );
                                }}
                                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                              />
                            </div>

                            {/* Product Image - Mobile */}
                            <div className="flex-shrink-0">
                              <div className="relative h-16 w-16 overflow-hidden rounded-lg group">
                                <Image
                                  src={`${
                                    item.product_image.startsWith('http')
                                      ? item.product_image
                                      : baseUrl + '/' + item.product_image
                                  }`}
                                  alt={item.product_name}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                />
                                {item.product_OriginalPrice && (
                                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded text-[10px]">
                                    -
                                    {Math.round(
                                      (1 - item.product_price / item.product_OriginalPrice) * 100
                                    )}
                                    %
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Details - Mobile */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                {item.product_name}
                              </h3>
                              <div className="mt-1 flex items-center space-x-2">
                                <span className="text-xs text-gray-500 truncate">
                                  {item.product_store_name}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Color: {item.product_selected_color}
                              </div>

                              {/* Price - Mobile */}
                              <div className="mt-2 flex items-center space-x-1">
                                <span className="text-sm font-semibold text-orange-500">
                                  Rs. {item.product_price.toLocaleString()}
                                </span>
                                {item.product_OriginalPrice && (
                                  <span className="text-xs text-gray-500 line-through">
                                    Rs. {item.product_OriginalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>

                              {/* Quantity and Remove - Mobile */}
                              <div className="mt-2 flex items-center justify-between">
                                {/* Quantity Controls - Mobile */}
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded overflow-hidden">
                                  <motion.button
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    disabled={item.product_quantity <= 1}
                                    className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </motion.button>
                                  <div className="px-2 py-1 bg-white border-x border-gray-200 min-w-[30px] text-center">
                                    <motion.span
                                      key={item.product_quantity}
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="text-xs font-medium text-gray-900"
                                    >
                                      {item.product_quantity}
                                    </motion.span>
                                  </div>
                                  <motion.button
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    disabled={item.product_quantity >= 10}
                                    className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </motion.button>
                                </div>

                                {/* Remove Button - Mobile */}
                                <motion.button
                                  onClick={() => handleRemoveItem(item.id, 3)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:flex items-start space-x-4">
                            {/* Checkbox */}
                            <div className="flex items-center pt-2">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={() => {
                                  setCartData((prevItems) =>
                                    prevItems.map((cartItem) =>
                                      cartItem.id === item.id
                                        ? { ...cartItem, selected: !cartItem.selected }
                                        : cartItem
                                    )
                                  );
                                }}
                                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded cursor-pointer"
                              />
                            </div>

                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="relative h-24 w-24 overflow-hidden rounded-lg group">
                                <Image
                                  src={`${
                                    item.product_image.startsWith('http')
                                      ? item.product_image
                                      : baseUrl + '/' + item.product_image
                                  }`}
                                  alt={item.product_name}
                                  width={96}
                                  height={96}
                                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                />
                                {item.product_OriginalPrice && (
                                  <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1 py-0.5 rounded">
                                    -
                                    {Math.round(
                                      (1 - item.product_price / item.product_OriginalPrice) * 100
                                    )}
                                    %
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {item.product_name}
                                  </h3>
                                  <div className="mt-1 flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                      {item.product_store_name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      Color: {item.product_selected_color}
                                    </span>
                                  </div>

                                  {/* Price */}
                                  <div className="mt-2 flex items-center space-x-2">
                                    <span className="text-lg font-semibold text-orange-500">
                                      Rs. {item.product_price.toLocaleString()}
                                    </span>
                                    {item.product_OriginalPrice && (
                                      <span className="text-sm text-gray-500 line-through">
                                        Rs. {item.product_OriginalPrice.toLocaleString()}
                                      </span>
                                    )}
                                  </div>

                                  {/* Stock Info */}
                                  <div className="mt-1">
                                    <span className="text-xs text-gray-500">
                                      Stock: {item.stock_available} available
                                    </span>
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col items-end space-y-2">
                                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
                                    <motion.button
                                      onClick={() => handleQuantityChange(item.id, -1)}
                                      disabled={item.product_quantity <= 1}
                                      className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </motion.button>
                                    <div className="px-4 py-1 bg-white border-x border-gray-200">
                                      <motion.span
                                        key={item.product_quantity}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm font-medium text-gray-900"
                                      >
                                        {item.product_quantity}
                                      </motion.span>
                                    </div>
                                    <motion.button
                                      onClick={() => handleQuantityChange(item.id, 1)}
                                      disabled={item.product_quantity >= 10}
                                      className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </motion.button>
                                  </div>

                                  {/* Remove Button */}
                                  <motion.button
                                    onClick={() => handleRemoveItem(item.id, 3)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <X className="h-4 w-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Free Shipping Banner */}
                    {cartData.length > 0 && (
                      <div className="p-4 bg-green-50 border-t border-green-200">
                        <div className="flex items-center space-x-2">
                          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                            ✓ Eligible for free Standard delivery
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 10 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.3,
                      }}
                      className="inline-block mb-6 relative"
                    >
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30"></div>
                      <div className="relative bg-white rounded-full p-6 shadow-md">
                        <ShoppingCart className="h-16 w-16 text-yellow-500 mx-auto" />
                      </div>
                    </motion.div>
                    <h3 className="text-2xl font-medium text-black mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Looks like you haven&apos;t added anything to your cart yet. Explore our
                      products and find something you&apos;ll love!
                    </p>
                    <Link href="/">
                      <motion.button
                        className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full font-medium shadow-lg"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Start Shopping
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div className="lg:col-span-1" variants={fadeInVariants}>
              {/* Mobile: Fixed bottom summary */}
              <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Total ({cartData.filter((item) => item.selected).length} items)
                  </span>
                  <span className="text-lg font-bold text-orange-500">
                    Rs. {calculateTotal().toLocaleString()}
                  </span>
                </div>
                <Link href={'/cart/shippingdetails'}>
                  <Button
                    onClick={handleCheckout}
                    disabled={cartData.filter((item) => item.selected).length === 0}
                    loading={checkoutLoading}
                    loadingText="Processing..."
                    className={`w-full py-3 rounded-md font-medium text-sm ${
                      cartData.filter((item) => item.selected).length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    CHECKOUT ({cartData.filter((item) => item.selected).length})
                  </Button>
                </Link>
              </div>

              {/* Desktop: Regular sidebar */}
              <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-4 space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({cartData.filter((item) => item.selected).length} items)
                    </span>
                    <span className="font-medium text-gray-900">
                      Rs. {calculateSubtotal().toLocaleString()}
                    </span>
                  </div>

                  {/* Shipping Fee */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium text-gray-900">
                      Rs. {calculateCod().toLocaleString()}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>Discount</span>
                      <span>- Rs. {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <hr className="border-gray-200" />

                  {/* Total */}
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-orange-500">
                      Rs. {calculateTotal().toLocaleString()}
                    </span>
                  </div>

                  {/* Voucher Code */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter Voucher Code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                      />
                      <Button
                        onClick={handleApplyPromo}
                        loading={checkoutLoading}
                        loadingText="Applying..."
                        disabled={cartData.filter((item) => item.selected).length === 0}
                        className={`px-4 py-2 rounded-md font-medium text-sm ${
                          cartData.filter((item) => item.selected).length === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}
                      >
                        APPLY
                      </Button>
                    </div>
                    <AnimatePresence>
                      {showPromoSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-green-600 text-sm"
                        >
                          Voucher applied successfully! 20% off
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Checkout Button */}
                  <Link href={'/cart/shippingdetails'}>
                    <Button
                      onClick={handleCheckout}
                      disabled={cartData.filter((item) => item.selected).length === 0}
                      loading={checkoutLoading}
                      loadingText="Processing..."
                      className={`w-full py-3 rounded-md font-medium text-sm ${
                        cartData.filter((item) => item.selected).length === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      PROCEED TO CHECKOUT({cartData.filter((item) => item.selected).length})
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Explore Storevia's Picks Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Explore Storevia&apos;s Picks</h2>
              <Link href="/">
                <motion.button
                  className="text-yellow-500 hover:text-yellow-600 flex items-center space-x-1"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4 text-yellow-500" />
                </motion.button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-20 md:mb-8">
              {storeViaPicks.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-yellow-200 transition-all duration-300 shadow-md group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={
                        product.image.startsWith('http')
                          ? product.image
                          : baseUrl + '/' + product.image || '/placeholder.svg'
                      }
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-lg">
                      {product.discount} OFF
                    </div>
                    <motion.button
                      onClick={() => handleToggleFavorite(product.id.toString())}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full text-gray-600 hover:text-red-500 shadow-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        className={`h-3 w-3 md:h-4 md:w-4 ${
                          favorites[product.id] ? 'text-red-500 fill-red-500' : 'text-gray-600'
                        }`}
                      />
                    </motion.button>
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      className="absolute bottom-2 right-2 p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full shadow-sm"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-black" />
                    </motion.button>
                  </div>

                  <div className="p-3 md:p-4">
                    <h3 className="font-medium text-black text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-1 mb-2">
                      <div className="flex">
                        <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-yellow-500" />
                      </div>
                      <span className="text-xs md:text-sm text-gray-500 ml-1">
                        {product.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-orange-500 text-sm md:text-base">
                        {(() => {
                          const n = parsePriceToNumber(String(product.price));
                          return n != null
                            ? formatPriceLKR(n)
                            : `Rs ${product.price.toLocaleString()}`;
                        })()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Alert and Confirmation Modals */}
          {AlertModalComponent}
          {ConfirmationModalComponent}
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default EnhancedCart;
