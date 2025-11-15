/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { FC, useState, useEffect, useRef, useContext, useCallback, Suspense } from 'react';
import Image from 'next/image';
import {
  ChevronRight,
  Minus,
  Plus,
  Star,
  ShoppingCart,
  Truck,
  Package,
  RefreshCw,
  Shield,
  Clock,
  MessageCircle,
  Award,
  Check,
  ShoppingBag,
  ThumbsUp,
  ChevronDown,
  ExternalLink,
  Info,
  X,
  Send,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/hooks/useLoading';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Zoom, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import CartContext from '@/app/context/cartContext';
import useAlerts from '@/hooks/useAlerts';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/app/home/Header';
import { formatPriceLKR, parsePriceToNumber } from '@/lib/utils';
import axios from 'axios';

interface Product {
  product_image: any;
  cod: number;
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  product_stock: number;
  sale: boolean;
  images: string[];
  thumImage: string;
  sold: string;
  rating: number;
  reviewCount: number;
  colors?: Array<{ name: string; image: string }>;
  sizes?: string[];
  sizeInfo?: { bust: string; shoulder: string; length: string; sleeveLength: string };
  store: {
    id: string;
    store_name: string;
    slug: string;
    rating: number;
    followers: string;
    responseRate: string;
    responseTime: string;
    joinedDate: string;
  };
  shipping: {
    country: string;
    delivery: string;
    options: Array<{ type: string; price: string; time: string }>;
  };
  description: string;
  features: string[];
  reviews: Array<{
    user: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
    images?: string[];
    size?: string;
    color?: string;
  }>;
  specifications: { [key: string]: string };
  relatedProducts: Array<{
    id: number;
    name: string;
    image: string;
    price: string;
    rating: number;
  }>;
  category: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

const Item: FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>();
  const [quantity, setQuantity] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('description');
  // const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [storename, setStorename] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const sriLankaRegions: { province: string; districts: string[] }[] = [
    { province: 'Western', districts: ['Colombo', 'Gampaha', 'Kalutara'] },
    { province: 'Central', districts: ['Kandy', 'Matale', 'Nuwara Eliya'] },
    { province: 'Southern', districts: ['Galle', 'Matara', 'Hambantota'] },
    {
      province: 'Northern',
      districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
    },
    { province: 'Eastern', districts: ['Trincomalee', 'Batticaloa', 'Ampara'] },
    { province: 'North Western', districts: ['Kurunegala', 'Puttalam'] },
    { province: 'North Central', districts: ['Anuradhapura', 'Polonnaruwa'] },
    { province: 'Uva', districts: ['Badulla', 'Monaragala'] },
  ];
  const allDistricts = sriLankaRegions.flatMap((r) =>
    r.districts.map((d) => ({ province: r.province, district: d }))
  );

  const handleBecomeSellerClick = () => {
    router.push('/seller');
  };
  const searchParams = useSearchParams();

  // Initialize loading hook
  const { isLoading, withLoading } = useLoading();

  // Base URL for API calls
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const thumbs = thumbsSwiper && !thumbsSwiper.destroyed ? { swiper: thumbsSwiper } : undefined;
  const swiperRef = useRef<any>(null);
  const thumbsSwiperRef = useRef<any>(null);
  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Combine the thumImage and images array into one array for main swiper

  // Alert and confirmation modals
  const {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    confirm,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

  useEffect(() => {
    const fetchReviews = async () => {
      const productId = searchParams.get('productId');
      if (!productId) return;

      const formData = new FormData();
      formData.append('product_id', productId);

      try {
        const response = await fetch(`${baseUrl}/getReviews.php`, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setReviews(result.reviews);
          setRating(result.rating);
          setReviewCount(result.reviewCount);
        } else {
          console.error('Failed to load reviews:', result.message);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [searchParams, baseUrl]);

  useEffect(() => {
    if (storename) {
      setMessages([
        {
          id: 1,
          text: `Welcome! To ${storename} store.`,
          sender: 'support',
          timestamp: new Date(),
        },
        {
          id: 2,
          text: 'Hello! How can I help you today?',
          sender: 'support',
          timestamp: new Date(),
        },
      ]);
    }
  }, [storename]);

  const handleItemView = (productId: number) => {
    router.push(`/item?productId=${encodeURIComponent(productId)}`);
  };

  const [inputValue, setInputValue] = useState<string>('');
  const productRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedReviews, setExpandedReviews] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<any>(null);

  const { addToCart } = useContext(CartContext);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    const productId = searchParams.get('productId');
    const userEmail = user?.email || '';
    console.log('Session Email:', userEmail);

    const formData = new FormData();
    formData.append('product_id', productId || '0');
    formData.append('user_email', userEmail);

    try {
      const response = await fetch(`${baseUrl}/fetchMessages.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      const newMessages = (Array.isArray(result) ? result : result.messages || []).map(
        (msg: { message: any; sender: any; timestamp: string | number | Date }, index: number) => ({
          id: `${msg.sender}-${msg.timestamp}-${index}`, // unique key
          text: msg.message,
          sender: msg.sender || 'user',
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        })
      );

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (e) {
      console.error('Error Save Message data:', e);
    }
  }, [searchParams, baseUrl, user?.email]);

  const fetchReplyMessages = useCallback(async () => {
    const productId = searchParams.get('productId');
    const userEmail = user?.email || '';
    console.log('Session Email:', userEmail);

    const formData = new FormData();
    formData.append('product_id', productId || '0');
    formData.append('user_email', userEmail);

    try {
      const response = await fetch(`${baseUrl}/fetchReplyMessagesForItem.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
    } catch (e) {
      console.error('Error Save Message data:', e);
    }
  }, [searchParams, baseUrl, user?.email]);

  useEffect(() => {
    fetchMessages();
    fetchReplyMessages();
  }, [fetchMessages, fetchReplyMessages]);

  const saveMessage = async (message: string) => {
    const productId = searchParams.get('productId');
    const userEmail = user?.email || '';
    console.log('Session Email:', userEmail);
    const storeId = data.storeDetails[0].store_id;

    const formData = new FormData();
    formData.append('product_id', productId || '0');
    formData.append('user_email', userEmail);
    formData.append('store_id_from_item', storeId);
    formData.append('message', message);

    console.log('Form Data Entries:', productId, userEmail, storeId, message);

    try {
      const response = await fetch(`${baseUrl}/saveMessages.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(' result of save message', result);
    } catch (e) {
      console.error('Error Save Message data:', e);
    }
  };

  const checkLogging = async (): Promise<boolean> => {
    const userEmail = user?.email || '';
    if (!userEmail) {
      showWarning('Login Required', 'Please login first!');

      return false;
    }
    return true;
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment || newReview.rating === 0) {
      showWarning('Incomplete Review', 'Please provide a comment and rating');
      return;
    }

    const productId = searchParams.get('productId');
    if (!productId) {
      showError('Error', 'Missing product ID');
      return;
    }

    const userEmail = user?.email;

    if (!userEmail) {
      confirm('Login Required', 'You need to log in to write a review. Go to login page?', () => {
        window.location.href = '/user/login';
      });
      return;
    }

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('user_email', userEmail);
    formData.append('rating', newReview.rating.toString());
    formData.append('comment', newReview.comment);

    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await fetch(`${baseUrl}/addReview.php`, {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      console.log('Raw response:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        showError('Server Error', 'Server returned an invalid response.');
        return;
      }

      console.log('Review Response:', result);

      if (result.success) {
        const newReviewObj = {
          user: userEmail.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userEmail.split('@')[0]
          )}&background=f59e0b&color=000&size=32`,
          rating: newReview.rating,
          date: 'Just now',
          comment: newReview.comment,
        };

        // Update the reviews state instead of product.reviews
        setReviews((prevReviews: any) => [newReviewObj, ...prevReviews]);
        setReviewCount((prevCount) => prevCount + 1);

        // Recalculate rating
        const allReviews = [newReviewObj, ...reviews];
        const newAverageRating =
          allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;
        setRating(newAverageRating);

        setShowReviewForm(false);
        setNewReview({ rating: 0, comment: '' });

        // Show success toast
        toast.success('Review added successfully!', {
          icon: '⭐',
          style: { background: '#FFFFFF', color: '#000000' },
          duration: 3000,
        });
      } else {
        showError('Review Failed', result.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Submit Review Error:', error);
      showError('Error', 'Something went wrong while submitting review.');
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    const isLoggedIn = await checkLogging();
    if (!isLoggedIn) {
      return;
    }

    if (inputValue.trim() !== '') {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date(),
      };
      console.log(newMessage);
      saveMessage(inputValue.trim());
      console.log(data.storeDetails[0].store_id);
      setMessages([...messages, newMessage]);
      setInputValue('');

      setTimeout(() => {
        const response: Message = {
          id: messages.length + 2,
          text: "Thanks for your message! I'll get back to you shortly.",
          sender: 'support',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, response]);
      }, 1000);
    }
    console.log('Messages: ', messages);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // UI-only image support (no backend/Firebase): use blob URLs
  const isLocalImageUrl = (val: string) => val.startsWith('blob:') || val.startsWith('data:image');

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // reset input so the same file can be chosen twice
    e.currentTarget.value = '';
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const url = URL.createObjectURL(file);
    const imgMessage: Message = {
      id: messages.length + 1,
      text: url,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, imgMessage]);
    // Do not send to backend; UI-only per requirement
    scrollToBottom();
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (data) {
      if (data.product_stock > 0) {
        setQuantity(1);
      } else {
        setQuantity(0);
      }
    }
  }, [data]);

  useEffect(() => {
    const fetchProductData = async () => {
      const productId = searchParams.get('productId');
      const formData = new FormData();
      formData.append('product_id', productId || '0');

      try {
        axios
          .get(`http://127.0.0.1:8000/api/product/${productId}`, {
            headers: { Accept: 'application/json' },
          })
          .then((response) => {
            console.log(response.data);
            setData(response.data);
            console.log('product Image', response.data.productImages[0].image_path);
            if (response.data.storeDetails && response.data.storeDetails.length > 0) {
              setStorename(response.data.storeDetails[0].store_name);
            } else {
              setStorename('Unknown Store'); // or handle accordingly
            }
          })
          .catch((error) => {
            console.error(error.response?.data || error.message);
          });
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    withLoading(fetchProductData);
  }, [baseUrl, searchParams, withLoading]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = 80; // Account for main header height
      setIsSticky(scrollY > headerHeight);
    };

    //console.log(data.productImages.image_path);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="text-black flex items-center justify-center w-full h-[80vh]">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!data) {
    return <div>Error: Product not found</div>;
  }
  // const images =
  //   data.productImages && data.productImages.length > 0
  //     ? data.productImages.map((img: { image_path: string }) => `${baseUrl}/${img.image_path}`)
  //     : [`${baseUrl}/${data.product_image}`];

  const images =
    data.productImages && data.productImages.length > 0
      ? data.productImages.map((img: { image_path: string }) => `${img.image_path}`)
      : [`${data.product_image}`];

  //console.log('Images array:', images);

  const product: Product = {
    id: Number.parseInt(data.product_id),
    name: data.product_name,
    price: data.product_price,
    cod: data.product_cod,
    product_stock: data.product_stock,
    sale: data.is_on_sale,
    discount: data.product_discount,
    // thumImage: `${baseUrl}/${data.product_image}`,
    thumImage: `${data.product_image}`,

    images: [
      // `${baseUrl}/${data.product_image}`, // thumbnail first
      `${data.product_image}`, // thumbnail first
      ...(data.productImages && data.productImages.length > 0
        ? data.productImages.map((img: { image_path: string }) => `${img.image_path}`)
        : []), // no fallback here because thumbnail is already first
    ], // fallback to main image

    sold: '318 sold',
    rating: rating,
    reviewCount: reviewCount,
    // colors: data.colors.length > 0
    //   ? data.colors.map((color: { name: string; image: string; }) => ({
    //     name: color.name,
    //     image: color.image.startsWith('http') ? color.image : `${baseUrl}/${color.image}`,
    //   }))
    //   : [{ name: 'Default Color', image: `${baseUrl}/default-color.jpg` }],
    sizes: data.options?.values || [],
    sizeInfo: { bust: '52cm', shoulder: '53cm', length: '69cm', sleeveLength: '20cm' },
    store: {
      id: data.storeDetails.store_id,
      store_name: data.storeDetails.store_name,
      slug: data.storeDetails.slug,
      rating: data.storeDetails.store_ratings,
      followers: '12.5K',
      responseRate: '98%',
      responseTime: 'Within 24 hours',
      joinedDate: 'Jan 2020',
    },
    shipping: {
      country: 'Sri Lanka',
      delivery: 'May 15-21',
      options: [
        { type: 'Standard', price: 'Rs 250', time: '3-5 days' },
        { type: 'Express', price: 'Rs 450', time: '1-2 days' },
        { type: 'Free', price: 'Rs 0', time: '5-7 days' },
      ],
    },
    // Normalize description from API (some endpoints use product_description)
    description: data.product_description ?? data.product_description ?? '',
    features: [
      '100% Premium Cotton',
      'Breathable fabric',
      'Reinforced stitching',
      'Pre-shrunk to minimize shrinkage',
      'Machine washable',
      'Color-fast dye',
    ],
    reviews: reviews,
    specifications: {
      Material: '100% Cotton',
      Collar: 'Crew Neck',
      Pattern: 'Solid',
      'Sleeve Length': 'Short Sleeve',
      Fit: 'Regular',
      'Care Instructions': 'Machine wash cold, tumble dry low',
      Origin: 'Made in Sri Lanka',
    },
    relatedProducts: [
      {
        id: 101,
        name: 'Polo Cotton T-shirt',
        image: '/api/placeholder/200/200',
        price: 'Rs 2,450.00',
        rating: 4.5,
      },
      {
        id: 102,
        name: 'V-Neck Premium T-shirt',
        image: '/api/placeholder/200/200',
        price: 'Rs 1,950.00',
        rating: 4.6,
      },
      {
        id: 103,
        name: 'Long Sleeve Cotton T-shirt',
        image: '/api/placeholder/200/200',
        price: 'Rs 2,650.00',
        rating: 4.3,
      },
      {
        id: 104,
        name: 'Graphic Print T-shirt',
        image: '/api/placeholder/200/200',
        price: 'Rs 2,250.00',
        rating: 4.7,
      },
    ],
    originalPrice: '',
    category: data.storeDetails.category_name,
    product_image: undefined,
  };

  const calculateDiscountPrice = (originalPrice: string, discount: number): string => {
    const p = parsePriceToNumber(originalPrice);
    if (p == null || p <= 0 || discount <= 0) return formatPriceLKR(p || 0);

    const discountedPrice = p - (p * discount) / 100;
    return formatPriceLKR(discountedPrice);
  };

  // Feature availability flags
  const hasColors = Array.isArray(data?.colors) && data.colors.length > 0;
  const hasSizes = Array.isArray(product?.sizes) && product.sizes.length > 0;

  const handleColorSelect = (color: string) => {
    const toastId = 'color-select';
    setSelectedColor((prev) => {
      const next = prev === color ? '' : color;
      if (next) {
        toast.success(`${color} color selected`, { id: toastId });
      } else {
        toast('Color unselected', {
          id: toastId,
          icon: '🧹',
          style: { background: '#FFFFFF', color: '#000000' },
        });
      }
      return next;
    });
  };

  const handleSizeSelect = (size: string) => {
    const toastId = 'size-select';
    setSelectedSize((prev) => {
      const next = prev === size ? undefined : size;
      if (next) {
        toast.success(`Size ${size} selected`, { id: toastId });
      } else {
        toast('Size unselected', {
          id: toastId,
          icon: '🧹',
          style: { background: '#FFFFFF', color: '#000000' },
        });
      }
      return next;
    });
  };

  const handleQuantityChange = (delta: number) => {
    const maxStock = data.product_stock ? data.product_stock : 1;
    // Only allow 0 if stock is 0
    const minQuantity = data.product_stock === 0 ? 0 : 1;
    let newQuantity = quantity + delta;
    if (data.product_stock === 0) {
      newQuantity = 0;
    } else {
      newQuantity = Math.max(minQuantity, Math.min(newQuantity, maxStock));
    }
    setQuantity(newQuantity);
  };

  const addToCartHandler = (product: Product, qty: number) => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      cod: product.cod,
      originalPrice: product.originalPrice,
      discount: product.discount,
      images: product.images,
      quantity: qty,
      stock: product.product_stock,
      selectedColor: selectedColor || 'Default Color',
      selectedSize: selectedSize || 'Default Size',
      store: product.store.store_name,
      category: product.category,
    };

    addToCart(productData, qty);
  };

  const handleBuyNow = (product: Product, qty: number) => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      cod: product.cod,
      originalPrice: product.originalPrice,
      discount: product.discount,
      images: product.images,
      quantity: qty,
      stock: product.product_stock,
      selectedColor: selectedColor || 'Default Color',
      selectedSize: selectedSize || 'Default Size',
      store: product.store.store_name,
      category: product.category,
    };

    addToCart(productData, qty);

    toast.success('Proceeding to checkout!', {
      icon: '💳',
      style: { background: '#FFFFFF', color: '#000000' },
    });

    // Redirect to the cart page
    router.push('/cart');
  };

  const handleAddToWishlist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();
    const productId = searchParams.get('productId');
    const userId = localStorage.getItem('user_id');

    if (!user?.email) {
      confirm(
        'Login Required',
        'You need to login to add items to your wishlist. Go to login page?',
        () => {
          window.location.href = '/user/login';
        }
      );
      return;
    }

    if (!productId) {
      console.error('Missing productId');
      return;
    }

    const addToWishlist = async () => {
      try {
        const payload = {
          user_email: user?.email || '',
          product_id: productId,
        };

        const response = await fetch('http://127.0.0.1:8000/api/addToWishlist', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.success) {
          if (result.message === 'Product already in wishlist') {
            toast('Product already in wishlist', {
              icon: 'ℹ️',
              style: { background: '#FFFFFF', color: '#000000' },
            });
          } else {
            toast.success('Added to wishlist!', {
              icon: '💖',
              style: { background: '#FFFFFF', color: '#000000' },
            });
          }
        } else {
          toast.error('Failed to add to wishlist');
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        toast.error('Error adding to wishlist');
      }
    };

    addToWishlist();
  };

  const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };
  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const imageArray =
    product.images &&
    product.images[0] !== `${baseUrl}/undefined` &&
    product.images[0] !== undefined
      ? [product.images[0], ...product.images.slice(1)] // Keep the first image if it's valid
      : [...product.images.slice(1)];

  //console.log('Final Image Array:', imageArray);

  const renderProductView = () => {
    switch (product.category) {
      case 'Apparel & Accessories':
      case 'Bags & Purses':
      case 'Electronics':
      case 'Home & Garden':
      case 'Beauty & Personal Care':
      case 'Office Products':
      case 'Craft Supplies & Tools':
      case 'Pet Supplies':
      case 'Health & Household':
      case 'Sports & Outdoors':
      case 'Art & Collectibles':
      case 'Toys & Games':
      case 'Weddings':
      case 'Baby':
      case 'Gifts':
      case 'Tech and Gadget':
        return (
          <>
            <div className="relative mb-4 bg-gray-50 rounded-lg overflow-hidden">
              <Swiper
                ref={swiperRef}
                spaceBetween={10}
                modules={[FreeMode, Navigation, Thumbs, Zoom, Autoplay]}
                zoom={true}
                className="product-swiper rounded-lg"
                onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)} // Ensures large image updates
                thumbs={thumbs}
                initialSlide={selectedImage} // Initializes with the selected image
              >
                {imageArray.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-zoom-container" onClick={() => setIsZoomed(!isZoomed)}>
                      <div className="relative aspect-square w-full">
                        <Image
                          src={image || '/placeholder.svg'}
                          alt={product.name}
                          fill
                          className="object-contain cursor-zoom-in "
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnails Section */}
            <div className="w-full max-w-[560px] mx-auto">
              <Swiper
                onSwiper={(swiper) => setThumbsSwiper(swiper)}
                spaceBetween={14}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumbs-swiper mb-6 "
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                        selectedImage === index ? 'border-gray-500' : 'border-gray-200'
                      }`}
                      onClick={() => handleThumbnailClick(index)} // Update large image
                    >
                      <div className="relative aspect-square w-[90px] h-[90px]">
                        <Image
                          src={`${image}`}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        );

      default:
        return <div className="text-center text-gray-500">Category not supported</div>;
    }
  };

  return (
    <LoadingOverlay isLoading={isLoading}>
      <div className="bg-white min-h-screen">
        <div className="relative z-[100]">
          <Header onBecomeSellerClick={handleBecomeSellerClick} showSearch={false} />
        </div>
        {/* Toaster is provided globally in layout; avoid duplicates here */}
        <AnimatePresence>
          {isSticky && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="hidden md:block fixed top-0 left-0 right-0 bg-white shadow-lg py-3 px-4 z-[9999] border-b border-gray-200"
            >
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Image
                    src={`${product.thumImage}` || '/placeholder.svg'}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <div className="truncate max-w-xs">
                    <p className="font-medium text-sm text-black truncate">{product.name}</p>
                    <p className="text-[#a4a4a4] font-bold text-sm">
                      {(() => {
                        const n = parsePriceToNumber(product.price);
                        return n != null ? formatPriceLKR(n) : product.price;
                      })()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {quantity > 0 ? (
                    <>
                      <Button
                        onClick={() => withLoading(async () => handleBuyNow(product, quantity))}
                        size="sm"
                        className="px-3 py-2 bg-[#010101] text-white rounded-full text-xs font-medium hover:bg-gray-800"
                        loading={isLoading}
                      >
                        <ShoppingBag />
                        Buy Now
                      </Button>
                      <Button
                        onClick={() => withLoading(async () => addToCartHandler(product, quantity))}
                        size="sm"
                        className="px-3 py-2 bg-yellow-500 text-black rounded-full text-xs font-medium hover:bg-yellow-600"
                        loading={isLoading}
                      >
                        Add to Cart
                      </Button>
                    </>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToWishlist}
                      className="px-3 py-2 bg-pink-500 text-white rounded-full text-xs font-medium hover:bg-pink-600 transition-colors"
                    >
                      Add to Wishlist
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={productRef} className="max-w-7xl mx-auto pt-6 px-4 pb-28 md:pb-16">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-sm text-gray-500 mb-4 flex items-center space-x-2"
          >
            <Link href="/" className="hover:text-yellow-500 cursor-pointer">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            {data.storeDetails.category_name && (
              <>
                <span className="hover:text-yellow-500 cursor-pointer">
                  {data.storeDetails.category_name}
                </span>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            {data.tags && (
              <>
                <span className="hover:text-yellow-500 cursor-pointer">{data.tags}</span>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            {/* Breadcrumb product name: clamp on mobile only */}
            <span
              className="text-black font-medium truncate max-w-[70vw] sm:hidden"
              title={data.product_name}
            >
              {data.product_name}
            </span>
            <span className="hidden sm:inline text-yellow-500 font-medium">
              {data.product_name}
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 bg-white rounded-xl shadow-sm overflow-hidden">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="w-full lg:w-[420px] lg:flex-shrink-0 p-4 pt-2"
            >
              <div className="sticky top-24">
                {/* Constrain image area to be more compact */}
                <div className="mx-auto w-full max-w-[380px]">{renderProductView()}</div>
                {/* Removed Share and Like buttons beneath the image to reduce clutter */}
              </div>
            </motion.div>
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              className="w-full lg:flex-1 p-4"
            >
              {/* Removed promotional banner (SUPER DEAL OFFER / LIMITED TIME OFFER) */}
              {/* Store Information Section moved below full item details */}
              <h1 className="text-xl lg:text-2xl font-medium text-black mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center">
                  <div className="flex">
                    <Star className="w-4 h-4 text-[#edcf5d] fill-[#edcf5d]" />
                  </div>
                  <span className="text-sm text-[#a4a4a4] ml-1">Ratings {product.reviewCount}</span>
                </div>
                <span className="text-sm text-[#a4a4a4]">{product.sold}</span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-black">
                    {(() => {
                      const n = parsePriceToNumber(product.price);
                      return n != null ? formatPriceLKR(n) : product.price;
                    })()}
                  </span>
                  {product.discount && (
                    <span className="text-sm text-gray-600">
                      {/* -{String(product.discount).replace(/[^0-9]/g, '')}% */}-
                      {parseInt(product.discount)}%
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  {/* <span className="text-sm text-gray-700 mr-2">Promotions</span> */}
                  {/* <span className="inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                    Min. spend Rs. 2,500 <ChevronDown className="w-3 h-3 ml-1" />
                  </span> */}
                </div>
                {/* Installment hint removed by request */}
              </motion.div>
              {hasColors || hasSizes ? (
                <>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="mb-2"
                  >
                    {hasColors && (
                      <>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-black">
                            Color family:{' '}
                            <span className="text-yellow-500">
                              {selectedColor || 'Please select'}
                            </span>
                          </span>
                        </div>
                        <h2 className="text-sm font-medium text-black">
                          Stock <span>{product.product_stock}</span>
                        </h2>
                        <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
                          {product.colors?.map((color, index) => (
                            <motion.div
                              key={index}
                              variants={slideUp}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`border rounded-lg cursor-pointer relative overflow-hidden ${
                                selectedColor === color.name
                                  ? 'ring-2 ring-yellow-500 border-yellow-500'
                                  : 'border-gray-200 hover:border-yellow-200'
                              }`}
                              onClick={() => handleColorSelect(color.name)}
                            >
                              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                                <Image
                                  src={color.image || '/placeholder.svg'}
                                  alt={color.name}
                                  fill
                                  className="object-cover"
                                />
                                {selectedColor === color.name && (
                                  <div className="absolute bottom-0 right-0 bg-yellow-500 p-1 rounded-tl-md">
                                    <Check className="w-3 h-3 text-black" />
                                  </div>
                                )}
                              </div>
                              <div className="text-center py-0.5 text-[9px] bg-gray-50 text-black">
                                {color.name}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="mb-2"
                  >
                    {hasSizes && (
                      <>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-black">
                            Size: <span className="text-yellow-500">{selectedSize}</span>
                          </span>
                          <button
                            onClick={() => setShowSizeGuide(!showSizeGuide)}
                            className="text-xs text-black hover:underline flex items-center"
                          >
                            <Info className="w-3 h-3 mr-1" /> Size Guide
                          </button>
                        </div>
                        <div className="grid grid-cols-8 gap-1.5">
                          {product.sizes?.map((size) => (
                            <motion.button
                              key={size}
                              variants={slideUp}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`py-1 px-1 text-xs rounded-md transition-all ${
                                selectedSize === size
                                  ? 'border-2 border-yellow-500 text-yellow-500 bg-yellow-50 font-medium'
                                  : 'border border-gray-300 text-black hover:border-yellow-300'
                              }`}
                              onClick={() => handleSizeSelect(size)}
                            >
                              {size}
                            </motion.button>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {hasSizes && showSizeGuide && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black z-40"
                          onClick={() => setShowSizeGuide(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 50 }}
                          className="fixed inset-0 z-50 flex items-center justify-center"
                        >
                          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium text-black">Size Guide</h3>
                              <button
                                onClick={() => setShowSizeGuide(false)}
                                className="text-gray-500 hover:text-black"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
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
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">
                                      Size
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">
                                      Bust (cm)
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">
                                      Shoulder (cm)
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">
                                      Length (cm)
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border">
                                      Sleeve (cm)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {product.sizes?.map((size, index) => (
                                    <tr
                                      key={size}
                                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                    >
                                      <td className="px-4 py-2 text-sm border text-black">
                                        {size}
                                      </td>
                                      <td className="px-4 py-2 text-sm border text-black">
                                        {50 + index * 2}
                                      </td>
                                      <td className="px-4 py-2 text-sm border text-black">
                                        {48 + index * 2}
                                      </td>
                                      <td className="px-4 py-2 text-sm border text-black">
                                        {68 + index}
                                      </td>
                                      <td className="px-4 py-2 text-sm border text-black">
                                        {20 + index * 0.5}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="mt-4 text-xs text-gray-500">
                              Measurements may vary by ±2cm due to manual measurement process.
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              ) : null}
              <div className="flex items-center mb-6">
                <span className="text-sm font-medium text-black mr-4">Quantity:</span>
                <div className="flex overflow-hidden">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-2 flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 0}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center py-2 bg-white text-black "
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-2 flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= data.product_stock}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-xs text-yellow-500 ml-4 flex items-center">
                  <Package className="w-3 h-3 mr-1" />
                  {data.product_stock ? data.product_stock : '0'} Items Available
                </span>
              </div>

              <div className="flex items-center mb-6">
                <span className="text-sm font-medium text-black mr-4"><Truck /></span>
                <div className="flex overflow-hidden text-sm text-[#5c5c5c]">
                 Rs. {parseFloat(data.product_cod).toFixed(2)}
                </div>
              </div>

              {/* Primary CTAs placed after Quantity */}
              <div className="hidden md:flex flex-row gap-2 mb-6">
                {quantity > 0 ? (
                  <>
                    <Button
                      onClick={() => withLoading(async () => handleBuyNow(product, quantity))}
                      className="w-[50%] bg-[#010101] text-[#f2f0ea] py-3 rounded-md font-medium cursor-pointer hover:bg-gray-800"
                      loading={isLoading}
                    >
                      <ShoppingBag />Buy Now
                    </Button>
                    <Button
                      onClick={() => withLoading(async () => addToCartHandler(product, quantity))}
                      className="w-[50%] bg-[#edcf5d] text-black py-3 rounded-md font-medium hover:bg-yellow-300"
                      loading={isLoading}
                    >
                      <ShoppingCart />
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleAddToWishlist}
                    className="w-[50%] bg-[#edcf5d] text-[#010101] py-3 rounded-md font-medium hover:bg-pink-600"
                    loading={isLoading}
                  >
                    Add to Wishlist
                  </Button>
                )}
              </div>
              {/* Shipping (address) collapsible to keep CTAs above the fold */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 bg-gray-50 p-4 rounded-lg relative"
              >
                <button
                  type="button"
                  onClick={() => setShippingOpen((v) => !v)}
                  className="w-full flex items-center justify-between"
                  aria-expanded={shippingOpen}
                >
                  <h2 className="text-sm font-medium text-black flex items-center">
                    <Truck className="w-4 h-4 mr-2" /> Delivery Options
                  </h2>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      shippingOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {shippingOpen && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <div className="text-black flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {selectedProvince && selectedDistrict
                          ? `${selectedProvince}, ${selectedDistrict}`
                          : product.shipping.country}
                      </div>
                      <button
                        type="button"
                        onClick={() => setAddressOpen(true)}
                        className="text-sky-600 font-medium hover:underline"
                      >
                        CHANGE
                      </button>
                    </div>
                    <div className="text-sm text-black">Delivery: {product.shipping.delivery}</div>
                  </div>
                )}

                {/* Address dropdown popover */}
              {/* {addressOpen && (
                    <div className="absolute z-[10000] mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Select Address</span>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setAddressOpen(false)}
                          aria-label="Close address selector"
                        > */}
              {/* <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative mb-3">
                      <input
                        type="text"
                        value={addressSearch}
                        onChange={(e) => setAddressSearch(e.target.value)}
                        placeholder="Select Address"
                        className="w-full border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                      <svg
                        className="w-4 h-4 absolute right-2 top-2.5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                    <div className="max-h-64 overflow-auto text-sm">
                      {sriLankaRegions.map((region) => (
                        <div key={region.province} className="mb-2">
                          <div className="px-2 py-1 text-gray-500 text-xs uppercase tracking-wide">
                            {region.province}
                          </div>
                          <div>
                            {region.districts
                              .filter((d) => d.toLowerCase().includes(addressSearch.toLowerCase()))
                              .map((d) => (
                                <button
                                  key={d}
                                  onClick={() => {
                                    setSelectedProvince(region.province);
                                    setSelectedDistrict(d);
                                    setAddressOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                >
                                  {d}
                                </button>
                              ))}
                          </div>
                        </div>
                      ))} */}
              {/* </div>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        className="text-sky-600 text-sm hover:underline"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(() => {
                              // Without reverse geocoding, just mark as detected
                              setSelectedProvince('Detected');
                              setSelectedDistrict('Current Location');
                              setAddressOpen(false);
                            });
                          }
                        }}
                      >
                        Use my location
                      </button>
                      <button
                        className="text-gray-600 text-sm"
                        onClick={() => {
                          setSelectedProvince('');
                          setSelectedDistrict('');
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div> */}
              {/* )} */}
              {/* </motion.div> */}
              {/* Seller store details - Lazada style */}
              <div className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border border-gray-200 rounded-lg bg-white"
                >
                  {/* Header: Sold by + Chat Now */}
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#a4a4a4]font-semibold leading-tight">
                          {product.store.store_name}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsChatOpen(true)}
                        className="text-sky-600 text-sm font-medium hover:underline inline-flex items-center"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" /> Chat Now
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">
                        Mall
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">
                        Certified Store
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 divide-x divide-gray-200 border-y border-gray-200">
                    <div className="p-4 text-center">
                      <div className="text-xs text-gray-500 mb-1">Seller Ratings</div>
                      <div className="text-lg font-semibold text-black">
                        {Math.round((product.store.rating || 0) * 20)}%
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <div className="text-xs text-gray-500 mb-1">Ship on Time</div>
                      <div className="text-lg font-semibold text-black">100%</div>
                    </div>
                   
                  </div>

                  {/* Footer link */}
                  <div className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/store?id=${encodeURIComponent(product.store.slug)}`)
                      }
                      className="text-sky-600 text-sm font-semibold hover:underline"
                    >
                      GO TO STORE
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          {/* Description Section */}
          <motion.div
            className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
              <p className="text-gray-700 text-base whitespace-pre-line">{product.description}</p>
            </div>
          </motion.div>
          {/* End Description Section */}
          <motion.div
            className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Compact Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="bg-white/20 rounded-full p-2"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                  >
                    <Star className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Reviews</h2>
                    <div className="flex items-center space-x-2 text-white/90 text-sm">
                      <span className="font-bold">{product.rating}</span>
                      <div className="flex">
                        <Star className="w-3 h-3 fill-white" />
                      </div>
                      <span>({product.reviewCount})</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showReviewForm ? 'Cancel' : '+ Review'}
                </motion.button>
              </div>
            </div>

            {/* Compact Review Form */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-yellow-50 border-b border-yellow-200"
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
                              i < newReview.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      className="w-full p-3 border border-yellow-200 rounded-lg resize-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent text-sm"
                      placeholder="Share your thoughts about this product..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                    <div className="flex justify-end space-x-2 mt-3">
                      <motion.button
                        onClick={handleSubmitReview}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!newReview.comment || newReview.rating === 0}
                      >
                        Submit
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Compact Reviews List */}
            <div className="p-4">
              <div className="space-y-3">
                {(expandedReviews ? product.reviews : product.reviews.slice(0, 2)).map(
                  (review, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Image
                        src={
                          review.avatar ||
                          `https://ui-avatars.com/api/?name=${review.user}&background=f59e0b&color=000&size=32`
                        }
                        alt={review.user}
                        width={32}
                        height={32}
                        className="rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${review.user}&background=f59e0b&color=000&size=32`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-800 text-sm">{review.user}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                        <span className="text-xs text-gray-400 mt-1">{review.date}</span>
                      </div>
                    </motion.div>
                  )
                )}
              </div>

              {product.reviews.length > 2 && (
                <motion.button
                  onClick={() => setExpandedReviews(!expandedReviews)}
                  className="w-full mt-3 py-2 text-yellow-600 text-sm font-medium hover:text-yellow-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  {expandedReviews ? 'Show Less' : `View All ${product.reviews.length} Reviews`}
                </motion.button>
              )}
            </div>
          </motion.div>
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-black mb-4">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data?.relatedProducts?.map((item: any) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="border rounded-lg p-2 cursor-pointer"
                  onClick={() => handleItemView(item.product_id)}
                >
                  <div className="relative aspect-[3/4] mb-2">
                    <Image
                      src={`${baseUrl}/${item.product_image}`}
                      alt={item.product_name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-black">{item.product_name}</h3>
                  <h3 className="text-sm font-light text-gray-600">{item.product_description}</h3>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-light text-gray-400 line-clamp-2 leading-tight line-through">
                      Rs.{Number(item.product_price).toFixed(2)}
                    </h3>
                    {/* Discount Percentage next to price */}
                    {item.product_discount !== 0 &&
                      (() => {
                        return (
                          <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            -{item.product_discount}%
                          </span>
                        );
                      })()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-orange-500">
                      {calculateDiscountPrice(item.product_price, item.product_discount)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-black ml-1">{item.product_rating}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {/* Floating chat is hidden on mobile due to bottom action bar */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="hidden md:flex fixed bottom-4 right-4 bg-yellow-500 text-black p-4 rounded-full shadow-lg z-[9998] hover:bg-yellow-600 transition-colors"
        >
          <MessageCircle size={24} />
        </motion.button>

        {/* Mobile sticky bottom action bar */}
        <div
          className="md:hidden fixed inset-x-0 bottom-0 z-[9998] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-stretch gap-1 px-3 py-2">
            {/* Store tile */}
            <button
              type="button"
              onClick={() => router.push(`/store?id=${encodeURIComponent(product.store.slug)}`)}
              className="flex flex-col items-center justify-center w-14 h-12 rounded-md border border-gray-200 text-gray-700"
            >
              <ExternalLink className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">Store</span>
            </button>
            {/* Chat tile */}
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="flex flex-col items-center justify-center w-14 h-12 rounded-md border border-gray-200 text-gray-700"
            >
              <MessageCircle className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] leading-none">Chat</span>
            </button>

            {/* Primary CTAs (mobile): show wishlist when out of stock */}
            {quantity > 0 ? (
              <div className="flex-1 flex gap-0">
                {/* Buy Now - angled left edge */}
                <Button
                  onClick={() => withLoading(async () => handleBuyNow(product, quantity))}
                  className="flex-1 h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-sm"
                  style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                >
                  Buy Now
                </Button>

                {/* Add to Cart - angled right edge */}
                <Button
                  onClick={() => withLoading(async () => addToCartHandler(product, quantity))}
                  className="flex-1 h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md shadow-sm"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, 100% 100%, 0 100%)' }}
                >
                  Add to Cart
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToWishlist}
                className="flex-1 h-12 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md shadow-sm"
                loading={isLoading}
              >
                Add to Wishlist
              </Button>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-20 right-4 z-[9997]"
            >
              <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200">
                <div className="bg-yellow-500 text-black p-4 rounded-t-lg flex justify-between items-center">
                  <div>
                    <div className="flex justify-between items-center gap-5">
                      <h3 className="font-semibold">Chat with Seller :</h3>
                      {/* <h3><strong>Seller name</strong></h3> */}
                      <p>{product.store.store_name}</p>
                    </div>

                    <p className="text-sm opacity-90">We&apos;re here to help!</p>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="hover:bg-yellow-600 rounded-full p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.sender === 'user'
                              ? 'bg-yellow-500 text-black rounded-br-sm'
                              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                          }`}
                        >
                          {isLocalImageUrl(message.text) ? (
                            <a href={message.text} target="_blank" rel="noopener noreferrer">
                              <div className="relative w-[180px] h-[180px]">
                                <Image
                                  src={message.text}
                                  alt="attachment"
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            </a>
                          ) : (
                            <p>{message.text}</p>
                          )}
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-yellow-900' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={handleAttachClick}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      title="Attach image"
                    >
                      <ImageIcon className="w-4 h-4 text-gray-700" />
                    </button>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                    />
                    <Button
                      onClick={() => withLoading(handleSendMessage)}
                      disabled={!inputValue.trim()}
                      className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-black rounded-lg px-3 py-2"
                      loading={isLoading}
                      size="sm"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert and Confirmation Modals */}
        {AlertModalComponent}
        {ConfirmationModalComponent}
      </div>
    </LoadingOverlay>
  );
};

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex min-h-screen bg-gray-50 items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Product...</p>
    </div>
  </div>
);

// Main page component wrapped with Suspense
const ItemPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Item />
    </Suspense>
  );
};

export default ItemPage;
