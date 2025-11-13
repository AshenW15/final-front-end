/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useContext, Suspense, useRef } from 'react';
// StoreRatingSection: Consistent with item page, but for store
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useAlerts from '@/hooks/useAlerts';
import {
  Star,
  MessageCircle,
  Heart,
  MapPin,
  Clock,
  Award,
  Package,
  Shield,
  Truck,
  Search,
  Grid,
  List,
  ChevronDown,
  Eye,
  ShoppingCart,
  Store,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import CartContext from '@/app/context/cartContext.js';
import { useRouter } from 'next/navigation';
import { formatPriceLKR } from '@/lib/utils';
import axios from 'axios';

// StoreRatingSection: Consistent with item page, but for store
type Review = {
  rating: number;
  comment: string;
  user?: string;
  avatar?: string;
  date?: string;
};

// StoreRatingSection: Consistent with item page, but for store
const StoreRatingSection = ({ storeId }: { storeId: string | null }) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [newReview, setNewReview] = React.useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fetchReviews = async () => {
    if (!storeId) return;
    setLoading(true);

    try {
      const res = await fetch(`${baseUrl}/fetch_store_reviews.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: storeId }),
      });

      const data = await res.json();

      if (data.success) {
        setReviews(data.reviews || []);
      } else {
        console.error('Failed to fetch reviews:', data.message);
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReviews();
  }, [storeId]);

  const handleSubmitReview = async () => {
    if (!storeId || !newReview.rating || !newReview.comment) return;
    setIsSubmitting(true);

    const userEmail = user?.email || '';
    console.log('User Email:', userEmail);
    console.log('Submitting Review:', newReview);
    console.log('Store ID:', storeId);
    if (!userEmail) {
      if (window.confirm('You need to log in to write a review. Go to login page?')) {
        window.location.href = '/user/login';
      }
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/add_store_review.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: storeId, //slug
          rating: newReview.rating,
          comment: newReview.comment,
          user_email: userEmail,
        }),
      });

      const result = await res.json();
      console.log(result);

      if (result.success) {
        setShowReviewForm(false);
        setNewReview({ rating: 0, comment: '' });
        fetchReviews();
      } else {
        console.error('Failed to submit review:', result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="font-bold text-lg">
          {reviews.length > 0
            ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
            : ''}
        </span>
        <div className="flex">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </div>
        <span className="text-gray-400">({reviews.length} reviews)</span>
      </div>
      <button
        onClick={() => setShowReviewForm((v) => !v)}
        className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-medium mb-4 hover:bg-yellow-200 transition-all"
      >
        {showReviewForm ? 'Cancel' : '+ Add Rating'}
      </button>
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-yellow-50 border-b border-yellow-200 mb-4"
          >
            <div className="p-4">
              <div className="flex items-center justify-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        i < newReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              <textarea
                rows={3}
                className="w-full p-3 border border-yellow-200 rounded-lg resize-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-sm"
                placeholder="Share your thoughts about this store..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              />
              <div className="flex justify-end space-x-2 mt-3">
                <motion.button
                  onClick={handleSubmitReview}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!newReview.comment || newReview.rating === 0 || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-3">
        {loading ? (
          <div className="text-gray-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-400">No reviews yet.</div>
        ) : (
          reviews.map((review, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <Image
                src={
                  review.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    review.user || 'U'
                  )}&background=f59e0b&color=000&size=32`
                }
                alt={review.user || 'User'}
                width={32}
                height={32}
                className="rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    review.user || 'U'
                  )}&background=f59e0b&color=000&size=32`;
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-800 text-sm">{review.user || 'User'}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                {review.date && <span className="text-xs text-gray-400 mt-1">{review.date}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Type definitions
interface StoreData {
  store_id: string;
  store_name: string;
  store_description: string;
  store_logo: string;
  store_banner: any;
  store_address: string;
  store_phone: string;
  store_email: string;
  store_website: string;
  rating: number;
  total_reviews: number;
  followers?: number;
  joinedDate?: string;
  responseTime?: string;
  certifications?: string[];
  categories?: string[];
  store_created_at?: string;
}

interface ProductData {
  product_id: string;
  product_name: string;
  product_description: string;
  product_price: number;
  product_image: string;
  category: string;
  product_stock: number;
  product_discount?: string;
  product_rating?: number;
  product_reviews?: number;
  product_sold?: number;
}

interface StoreResponse {
  stores: StoreData[];
  products: ProductData[];
  store_follow_count: number;
}

const StorePage = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const storeId = searchParams.get('id');
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // Chat popup state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: `Welcome to ${storeData?.store_name || 'the store'}!`,
      sender: 'support',
      timestamp: new Date(),
    },
    { id: 2, text: 'How can we help you today?', sender: 'support', timestamp: new Date() },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [replyMessages, setReplyMessages] = useState<any[]>([]); // Add this state to store reply messages
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isChatOpen, chatMessages]);

  // UI-only image support: blob/data URLs in chat
  const isLocalImageUrl = (val: string) => val.startsWith('blob:') || val.startsWith('data:image');
  const handleAttachClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.currentTarget.value = '';
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const url = URL.createObjectURL(file);
    setChatMessages((prev) => [
      ...prev,
      { id: prev.length + 1, text: url, sender: 'user', timestamp: new Date() },
    ]);
  };

  const saveMessage = async (message: string) => {
    //get logged in user
    const userEmail = user?.email || '';
    console.log('Session Email:', userEmail);

    const formData = new FormData();
    formData.append('product_id', 'NULL');
    formData.append('user_email', userEmail);
    formData.append('store_id', storeId || 'NULL');
    formData.append('message', message);
    formData.append('from', 'viewStore');

    try {
      const response = await fetch(`${baseUrl}/saveMessages.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (e) {
      console.error('Error Save Message data:', e);
    }
  };

  const fetchMessages = async () => {
    const userEmail = user?.email || '';
    const formData = new FormData();
    formData.append('user_email', userEmail);
    formData.append('store_id', storeId || 'NULL');
    formData.append('from', 'viewStore');

    try {
      const response = await fetch(`${baseUrl}/fetchMessages.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('messages', result);

      // Transform backend messages to chatMessages format
      if (result.messages && Array.isArray(result.messages)) {
        const transformed = result.messages.map((msg: any, idx: number) => ({
          id: idx + 1,
          text: msg.message,
          //sender: msg.sender === userEmail ? 'user' : 'support',
          sender: 'user',
          timestamp: msg.timestamp || new Date(),
        }));
        setChatMessages(transformed);
      }
    } catch (e) {
      console.error('Error fetching messages:', e);
    }
  };

  const fetchReplyMessages = async () => {
    const userEmail = user?.email || '';
    const formData = new FormData();
    formData.append('user_email', userEmail);
    formData.append('store_id', storeId || 'NULL');
    formData.append('from', 'viewStore');

    try {
      const response = await fetch(`${baseUrl}/fetchReplyMessages.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('reply messages', result);

      // Save reply messages to state
      if (result.messages && Array.isArray(result.messages)) {
        setReplyMessages(result.messages);
      }
    } catch (e) {
      console.error('Error fetching messages:', e);
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      fetchMessages();
      fetchReplyMessages();
    }
  }, [isChatOpen]);

  // Send chat message
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { id: prev.length + 1, text: chatInput, sender: 'user', timestamp: new Date() },
    ]);
    saveMessage(chatInput.trim());
    fetchMessages();
    setChatInput('');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: 'Thank you for your message! We will get back to you soon.',
          sender: 'support',
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { addToCart } = useContext(CartContext);
  const { error: showError, AlertModalComponent } = useAlerts();
  const router = useRouter();

  const fetchStoreData = async () => {
    if (!storeId || !baseUrl) {
      setError('Store ID not provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('seller_id', storeId);

      // const response = await fetch(`${baseUrl}/fetch_store_details.php`, {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to fetch store data');
      // }

      // const result: StoreResponse = await response.json();
      // console.log(result);

      // if (result.stores && result.stores.length > 0) {
      //   const store = result.stores[0];
      //   const storeProducts = result.products || [];

      //   console.log(store);

      //   // Transform store data to match our interface
      //   const transformedStore: StoreData = {
      //     ...store,
      //     followers: result.store_follow_count, // Default value
      //     joinedDate: store.store_created_at || '2020-01-15',
      //     responseTime: 'within 2 hours',
      //     certifications: ['Verified Seller', 'Premium Quality', 'Fast Shipping'],
      //     categories: ['Supplements', 'Herbal Extracts', 'Organic Products', 'Vitamins', 'Protein'],
      //   };

      //   setStoreData(transformedStore);

      //   // Transform products data
      //   const transformedProducts = storeProducts.map((product: ProductData) => ({
      //     ...product,
      //     product_discount: product.product_discount || '0',
      //     product_rating: product.product_rating || 4.5,
      //     product_reviews: product.product_reviews || 0,
      //     product_sold: product.product_sold || 0,
      //   }));

      //   setProducts(transformedProducts);
      // } else {
      //   setError('Store not found');
      // }

      axios
        .get(`http://127.0.0.1:8000/api/store/${storeId}`, {
          headers: { Accept: 'application/json' },
        })
        .then((response) => {
          console.log(response.data);
          console.log('follow count', response.data.follow_count);
          const store = response.data.store;
          const storeProducts = response.data.products || [];
          const transformedStore: StoreData = {
            ...store,
            followers: response.data.follow_count, // Default value
            joinedDate: store.store_created_at || '2020-01-15',
            responseTime: 'within 2 hours',
            certifications: ['Verified Seller', 'Premium Quality', 'Fast Shipping'],
            categories: [
              'Supplements',
              'Herbal Extracts',
              'Organic Products',
              'Vitamins',
              'Protein',
            ],
          };
          console.log(store);
          setStoreData(transformedStore);

          const transformedProducts = storeProducts.map((product: ProductData) => ({
            ...product,
            product_discount: product.product_discount || '0',
            product_rating: product.product_rating || 4.5,
            product_reviews: product.product_reviews || 0,
            product_sold: product.product_sold || 0,
          }));

          setProducts(transformedProducts);
        })
        .catch((error) => {
          console.error(error.response?.data || error.message);
        });
    } catch (err) {
      console.error('Error fetching store data:', err);
      setError('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedRole = sessionStorage.getItem('userRole');
    setRole(storedRole);

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  // Cart handler
  const addToCartHandler = async (product: ProductData) => {
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

    // Add to cart context
    addToCart(product);

    // Add to local state for UI feedback
    if (!addedToCart.includes(product.product_id)) {
      setAddedToCart([...addedToCart, product.product_id]);

      // Trigger confetti effect
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#F59E0B', '#000000', '#FBBF24'],
      });
    }
  };

  // Wishlist handler
  const handleToggleWishlist = (productId: string) => {
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

  // Quick view handler
  const handleQuickView = (product: ProductData) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  // Item view handler for routing
  const handleItemView = (productId: string) => {
    router.push(`/item?productId=${encodeURIComponent(productId)}`);
  };

  const followStore = async () => {
    if (!user?.email) {
      toast.error('Please login to follow stores');
      return;
    }

    const userEmail = user?.email || '';
    const formdata = new FormData();
    formdata.append('user_email', userEmail);
    formdata.append('store_id', storeId || '');
    formdata.append('operation', isFollowing ? 'delete' : 'add');

    try {
      const response = await fetch(`${baseUrl}/follow_store.php`, {
        method: 'POST',
        body: formdata,
      });

      const data = await response.json();
      console.log(data);

      if (data.status === 'success') {
        setIsFollowing(!isFollowing);
      } else {
        showError('Follow Failed', "You can't update follow status right now. Try again later.");
      }
    } catch (error) {
      console.error('Follow/Unfollow error:', error);
    }
  };

  const checkIsFollow = async () => {
    if (!user?.email) return;

    const userEmail = user?.email || '';
    const formdata = new FormData();
    formdata.append('user_email', userEmail);
    formdata.append('store_id', storeId || '');

    try {
      const response = await fetch(`${baseUrl}/check_follow_store.php`, {
        method: 'POST',
        body: formdata,
      });

      const data = await response.json();
      console.log(data);
      if (data.status === 'success') {
        //setIsFollowing(data.is_following || false);
        setIsFollowing(true);
      }
    } catch (error) {
      console.log('Check follow error:', error);
    }
  };

  useEffect(() => {
    if (storeId && user?.email) {
      checkIsFollow();
    }
  }, [storeId, user?.email]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      (storeData?.categories &&
        storeData.categories.some((cat) =>
          cat.toLowerCase().includes(selectedCategory.toLowerCase())
        ));
    return matchesSearch && matchesCategory;
  });

  // Merge user and reply messages for conversational display
  const mergedMessages = React.useMemo(() => {
    // Map user messages to a common format
    const userMsgs = chatMessages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      timestamp: new Date(msg.timestamp).getTime(),
      sender: 'user',
    }));

    // Map reply messages to a common format
    const replyMsgs = replyMessages.map((msg, idx) => ({
      id: `reply-${idx}`,
      text: msg.text,
      timestamp: new Date(msg.timestamp).getTime(),
      sender: 'support',
    }));

    // Merge and sort by timestamp
    return [...userMsgs, ...replyMsgs].sort((a, b) => a.timestamp - b.timestamp);
  }, [chatMessages, replyMessages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-20">
          <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700">Store not found</h1>
          <p className="text-gray-600">
            {error || 'This store does not exist or is no longer available.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert Modal Component */}
      {AlertModalComponent}

      {/* Store Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={
            `${baseUrl}/${storeData.store_banner}` ||
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop'
          }
          alt="Store Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Store Info Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Store Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl p-3 shadow-lg"
            >
              <Image
                src={`${baseUrl}/${storeData.store_logo}` || '/web.png'}
                alt={storeData.store_name}
                fill
                className="object-contain p-2"
              />
            </motion.div>

            {/* Store Details */}
            <div className="flex-1 text-white">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold mb-2"
              >
                {storeData.store_name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-200 mb-3 max-w-2xl"
              >
                {storeData.store_description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap items-center gap-4 text-sm"
              >
                {/* Store Rating Section (Consistent with item page) */}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {storeData.rating ? storeData.rating.toFixed(1) : '-'}
                  </span>
                  <span className="text-gray-300">Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-gray-300">{storeData.followers}+ followers</span>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {role === 'user' ? (
                <button
                  onClick={followStore}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isFollowing
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              ) : (
                <button className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30">
                  <Heart className="w-4 h-4" />
                  Follow
                </button>
              )}
              <button
                className="px-6 py-3 rounded-xl font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageCircle className="w-4 h-4" />
                Chat Now
              </button>
              {/* Chat Popup Section */}
              <AnimatePresence>
                {isChatOpen && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 right-6 z-50"
                    style={{ width: 350, maxWidth: '90vw' }}
                  >
                    <div className="bg-white rounded-xl shadow-2xl w-full h-96 flex flex-col border border-gray-200">
                      <div className="bg-yellow-500 text-black p-4 rounded-t-xl flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Chat with Store</h3>
                            <span className="font-bold">{storeData?.store_name}</span>
                          </div>
                          <p className="text-sm opacity-90">We&apos;re here to help!</p>
                        </div>
                        <button
                          onClick={() => setIsChatOpen(false)}
                          className="hover:bg-yellow-600 rounded-full p-1 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        <div className="space-y-3">
                          {mergedMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.sender === 'user' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                  msg.sender === 'user'
                                    ? 'bg-yellow-500 text-black rounded-br-sm'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                                }`}
                              >
                                {isLocalImageUrl(msg.text) ? (
                                  <a href={msg.text} target="_blank" rel="noopener noreferrer">
                                    <div className="relative w-[180px] h-[180px]">
                                      <Image
                                        src={msg.text}
                                        alt="attachment"
                                        fill
                                        className="object-cover rounded-md"
                                      />
                                    </div>
                                  </a>
                                ) : (
                                  <p>{msg.text}</p>
                                )}
                                <p
                                  className={`text-xs mt-1 ${
                                    msg.sender === 'user' ? 'text-yellow-900' : 'text-gray-500'
                                  }`}
                                >
                                  {new Date(msg.timestamp).toLocaleString([], {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                        <div className="flex items-center space-x-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <button
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            onClick={handleAttachClick}
                            title="Attach image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 10.828a4 4 0 10-5.656-5.656L6.343 11.172"
                              />
                            </svg>
                          </button>
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendChat();
                            }}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                          />
                          <button
                            onClick={handleSendChat}
                            disabled={!chatInput.trim()}
                            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-black rounded-lg px-3 py-2"
                          >
                            <MessageCircle size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Store Stats & Certifications */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold">
                {new Date(storeData.joinedDate || '2020-01-15').getFullYear()}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="font-semibold">{storeData.responseTime || 'within 2 hours'}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Return Policy</p>
              <p className="font-semibold">7 Days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Free Shipping</p>
              <p className="font-semibold">Rs. 2000+</p>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'products', label: 'Products', count: products.length },
              { id: 'about', label: 'About Store' },
              { id: 'reviews', label: 'Reviews', count: storeData.total_reviews },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              {/* <div className="bg-white rounded-xl shadow-sm border p-6 mb-6"> */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>

                {/* Categories Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="all">All Categories</option>
                    {storeData.categories?.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* </div> */}

              {/* Products Grid */}
              <div
                className={`grid gap-3 sm:gap-4 ${
                  viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product, index) => {
                  const price = parseFloat(product.product_price.toString()) || 0;
                  const discount = parseFloat(product.product_discount || '0') || 0;
                  const originalPrice = discount > 0 ? price / (1 - discount / 100) : price;
                  const rating = product.product_rating || 4.5 || 4.5;
                  console.log('rating', product.product_rating);

                  return (
                    <motion.div
                      key={product.product_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleItemView(product.product_id)}
                      className={`w-full bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-yellow-200 transition-all overflow-hidden group cursor-pointer ${
                        viewMode === 'list' ? 'flex gap-4 p-4' : ''
                      }`}
                      onHoverStart={() => setHoveredProduct(product.product_id)}
                      onHoverEnd={() => setHoveredProduct(null)}
                      whileHover={{
                        y: -5,
                        boxShadow:
                          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        borderColor: '#FBBF24',
                      }}
                    >
                      <div
                        className={`relative ${
                          viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'
                        } overflow-hidden`}
                      >
                        {/* Image with hover effect */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full"
                        >
                          <Image
                            src={
                              product.product_image
                                ? `${baseUrl}/${product.product_image}`
                                : '/default-product.jpg'
                            }
                            alt={product.product_name}
                            fill
                            className="object-cover w-full h-full"
                          />
                        </motion.div>

                        {/* Overlay for hover effect */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={
                            hoveredProduct === product.product_id ? { opacity: 1 } : { opacity: 0 }
                          }
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"
                        />

                        {/* Discount badge */}
                        {discount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05, type: 'spring' }}
                            className="absolute top-2 right-2 z-20"
                          >
                            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                              {Math.round(discount)}% OFF
                            </span>
                          </motion.div>
                        )}

                        {/* Action buttons */}
                        <motion.div
                          className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20"
                          initial={{ opacity: 0 }}
                          animate={
                            hoveredProduct === product.product_id ? { opacity: 1 } : { opacity: 0 }
                          }
                          transition={{ duration: 0.3 }}
                        >
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCartHandler(product);
                            }}
                            className={`p-2 rounded-full shadow-md ${
                              addedToCart.includes(product.product_id)
                                ? 'bg-yellow-500 text-black'
                                : 'bg-white text-black hover:bg-yellow-500 hover:text-black'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Add to Cart"
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(product.product_id);
                            }}
                            className={`p-2 rounded-full shadow-md ${
                              wishlist.includes(product.product_id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-black hover:bg-red-500 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Add to Wishlist"
                          >
                            <Heart className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickView(product);
                            }}
                            className="p-2 bg-white text-black hover:bg-black hover:text-white rounded-full shadow-md"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      </div>

                      <motion.div
                        className={`space-y-1 sm:space-y-2 ${
                          viewMode === 'list' ? 'flex-1' : 'p-3 sm:p-4'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <h3
                          className={`text-black font-medium line-clamp-2 ${
                            viewMode === 'list' ? 'text-lg mb-2' : 'text-xs sm:text-sm h-8 sm:h-10'
                          }`}
                        >
                          {product.product_name}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          </div>
                          <span className="text-xs text-gray-600 ml-1">{rating}</span>
                        </div>

                        <div className="flex items-baseline space-x-2">
                          <motion.span
                            className={`font-bold text-orange-500 ${
                              viewMode === 'list' ? 'text-lg' : 'text-sm sm:text-base'
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                          >
                            {formatPriceLKR(price)}
                          </motion.span>
                        </div>

                        <div className="flex items-center justify-between">
                          <motion.span
                            className="text-xs text-yellow-600 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                          >
                            {product.product_sold || 0} sold
                          </motion.span>
                          <span className="text-xs text-gray-500">
                            Stock: {product.product_stock}
                          </span>
                        </div>

                        {addedToCart.includes(product.product_id) && (
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

                        {viewMode === 'list' && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCartHandler(product);
                              }}
                              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickView(product);
                              }}
                              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border p-8"
            >
              <h2 className="text-2xl font-bold mb-6">About Our Store</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{storeData.store_description}</p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Founded in {new Date(storeData.joinedDate || '2020-01-15').getFullYear()}, we have
                  been committed to providing high-quality products to our customers. Our mission is
                  to help people achieve their goals through our carefully curated selection.
                </p>

                {storeData.store_phone && (
                  <div className="flex items-center gap-2 mb-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{storeData.store_phone}</span>
                  </div>
                )}

                {storeData.store_email && (
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{storeData.store_email}</span>
                  </div>
                )}

                {storeData.store_website && (
                  <div className="flex items-center gap-2 mb-6">
                    <Store className="h-5 w-5 text-gray-600" />
                    <a
                      href={storeData.store_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 hover:underline"
                    >
                      {storeData.store_website}
                    </a>
                  </div>
                )}

                {storeData.categories && storeData.categories.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Our Specialties</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {storeData.categories.map((category, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-700">{category}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Store Ratings</h2>
              <StoreRatingSection storeId={storeId} />
            </motion.div>
          )}
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
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden"
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
                      src={
                        quickViewProduct.product_image
                          ? `${baseUrl}/${quickViewProduct.product_image}`
                          : '/default-product.jpg'
                      }
                      alt={quickViewProduct.product_name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                    />

                    {quickViewProduct.product_discount &&
                      parseFloat(quickViewProduct.product_discount) > 0 && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-500 text-black text-sm font-bold px-3 py-1 rounded-full">
                            {Math.round(parseFloat(quickViewProduct.product_discount))}% OFF
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-6 flex flex-col">
                  <h2 className="text-xl font-bold text-black mb-2">
                    {quickViewProduct.product_name}
                  </h2>

                  <div className="flex items-center mb-3">
                    <div className="flex">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {quickViewProduct.product_rating || 4.5} Rating (
                      {quickViewProduct.product_reviews || 0} reviews)
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-3 mb-3">
                    <span className="text-xl font-bold text-orange-500">
                      {formatPriceLKR(parseFloat(quickViewProduct.product_price.toString()))}
                    </span>
                  </div>

                  <p className="text-sm text-yellow-600 font-medium mb-3">
                    {quickViewProduct.product_sold || 0} sold
                  </p>

                  <p className="text-sm text-gray-600 mb-6">
                    {quickViewProduct.product_description}
                  </p>

                  <div className="mt-auto space-y-3">
                    <motion.button
                      onClick={() => {
                        addToCartHandler(quickViewProduct);
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
                      onClick={() => handleToggleWishlist(quickViewProduct.product_id)}
                      className={`w-full py-2 rounded-lg font-medium flex items-center justify-center space-x-2 border border-gray-200 hover:bg-gray-100 ${
                        wishlist.includes(quickViewProduct.product_id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-white text-black'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Heart className="h-4 w-4" />
                      <span>
                        {wishlist.includes(quickViewProduct.product_id)
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
    </div>
  );
};

// Loading component for Suspense fallback
const StorePageLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
      />
      <p className="text-gray-600">Loading store...</p>
    </div>
  </div>
);

// Main export with Suspense boundary
export default function StorePageWithSuspense() {
  return (
    <Suspense fallback={<StorePageLoading />}>
      <StorePage />
    </Suspense>
  );
}
