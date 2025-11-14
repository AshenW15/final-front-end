/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

//@Route /cart/shippingdetails

import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Plus,
  Check,
  CreditCard,
  Truck,
  Package,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Types
type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

interface ShippingForm {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  useAsBilling: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  available: boolean;
  fee?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

// Main Component
export default function CheckoutPage() {
  const { user } = useAuth();
  // State
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [showAddressLine2, setShowAddressLine2] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  const getShippingAddress = useCallback(async () => {
    const currentloggedInEmail = user?.email;

    if (!currentloggedInEmail) {
      console.warn('User email is missing');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/getShippingAddress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_email: currentloggedInEmail,
        }),
      });

      const data = await response.json();
      console.log('Shipping Address Response:', data);

      if (data.billingAddress) {
        setHasSavedAddress(true);
        setShippingData((prev) => ({
          ...prev,
          ...data.billingAddress,
        }));
      } else {
        setHasSavedAddress(false);
      }
    } catch (error) {
      console.error('Error fetching shipping address:', error);
      setHasSavedAddress(false);
    }
  }, [user?.email]);

  useEffect(() => {
    getShippingAddress();
  }, [getShippingAddress]);

  const [shippingData, setShippingData] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    country: 'Sri Lanka (Rs)',
    address: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    useAsBilling: false,
  });

  type CheckoutItems = {
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
    stock_available: number;
    selected: boolean;
  };

  const router = useRouter(); // Initialize router for navigation
  const [checkoutList, setCheckoutList] = useState<CheckoutItems[]>([]);
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('cartItemsToCheckout');
    const JsonData = JSON.parse(data ?? 'no data passed');
    const ids = JsonData.map((item: { id: unknown }) => item.id);
    console.log('ID ->', ids);
    setIds(ids);
    setCheckoutList(JsonData);
    console.log('CheckoutList: ', JsonData);
  }, []);

  const calculatTotal = () => {
    return checkoutList.reduce(
      (total, item) => total + item.product_price * item.product_quantity,
      0
    );
  };

  // Source of truth for payment/delivery fee (e.g., COD fee)
  const COD = 200; // legacy fallback (kept for now if designs expect 200)

  // Set estimated delivery date (5-7 days from now)
  useEffect(() => {
    const today = new Date();
    const deliveryMin = new Date(today);
    deliveryMin.setDate(today.getDate() + 5);
    const deliveryMax = new Date(today);
    deliveryMax.setDate(today.getDate() + 7);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    };

    setDeliveryDate(`${formatDate(deliveryMin)} - ${formatDate(deliveryMax)}`);
  }, []);

  // Payment methods with fees
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cod',
      name: 'Cash On Delivery',
      icon: <Truck className="h-5 w-5" />,
      available: true,
      fee: 350, // Rs 350 COD fee (design value)
    },
    {
      id: 'visa',
      name: 'Visa Card',
      icon: <CreditCard className="h-5 w-5" />,
      available: false,
      fee: 0,
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      icon: <CreditCard className="h-5 w-5" />,
      available: false,
      fee: 0,
    },
  ];

  // Derive active payment fee (prefer method fee; fallback to legacy COD constant)
  const getPaymentFee = () => {
    const method = paymentMethods.find((m) => m.id === paymentMethod);
    const fee = method?.fee;
    return typeof fee === 'number' && !isNaN(fee) ? fee : COD;
  };

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Shiping Data : ', shippingData);
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Generate order number once when the component mounts
    const generated = `#ORD-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`;
    setOrderNumber(generated);
  }, []);

  const sendData = async () => {
    const userEmail = user?.email || '';

    console.log('submit final order: ');
    console.log('Order data : ', checkoutList);
    console.log('Shipping Data : ', shippingData);
    console.log('Order Number : ', orderNumber);
    console.log('Delivery date: ', deliveryDate);
    console.log('Special Note : ', specialInstructions);
    console.log('Total Fee : ', calculatTotal());
    console.log('user Email : ', userEmail);

    // Prepare payload for Laravel API
    const payload = {
      orderData: checkoutList,
      orderNumber: orderNumber,
      deliveryDate: deliveryDate,
      note: specialInstructions,
      totalFee: calculatTotal(),
      userEmail: userEmail,
    };

    // Only include shipping data if needed
    if (!hasSavedAddress || addressState === 'new') {
      payload.shippingData = shippingData;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/saveOrderDetails', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);
      if (data.status === 'success') {
        console.log('Confirmed..');
        //implement clear cart logic.
        // localStorage.removeItem('cartItemsToCheckout');
        // localStorage.removeItem('cart');
        // localStorage.setItem('cartCount', '0');

        const formdata = new FormData();
        formdata.append('ids', JSON.stringify(ids));
        try {
          const response = await fetch('http://127.0.0.1:8000/api/deletecartitems', {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: ids }),
          });

          const data = await response.json();
          console.log(data);
          localStorage.removeItem('cartItemsToCheckout');
          localStorage.removeItem('cart');
          localStorage.setItem('cartCount', '0');
        } catch (error) {
          console.error('error in delete cart from db: ', error);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    sendData();
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('confirmation');
      setConfettiActive(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
    visible: { opacity: 1, y: 0 },
  };

  const confettiVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  const spinTransition = {
    repeat: Number.POSITIVE_INFINITY,
    ease: 'linear',
    duration: 1,
  };

  const [addressState, setAddressState] = useState('current');

  const addNewAddress = () => {
    if (addressState === 'current') {
      setAddressState('new');
      setShippingData({
        firstName: '',
        lastName: '',
        country: 'Sri Lanka (Rs)',
        address: '',
        addressLine2: '',
        city: '',
        province: '',
        postalCode: '',
        phone: '',
        useAsBilling: false,
      });
    } else {
      setAddressState('current');
      getShippingAddress();
    }
  };

  // Step indicator component
  const StepIndicator = ({
    step,
    label,
    number,
  }: {
    step: CheckoutStep;
    label: string;
    number: number;
  }) => (
    <div className="flex items-center">
      <motion.div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center',
          currentStep === step ? 'bg-yellow-500' : 'bg-gray-200'
        )}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === step ? (
          <span className="text-xs font-medium text-white">{number}</span>
        ) : (
          <span className="text-xs font-medium text-gray-500">{number}</span>
        )}
      </motion.div>
      <motion.span
        className={cn(
          'ml-2 text-sm font-medium',
          currentStep === step ? 'text-yellow-500' : 'text-gray-500'
        )}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Step {number.toString().padStart(2, '0')}
      </motion.span>
    </div>
  );

  // Confetti component using Framer Motion
  const Confetti = () => {
    const colors = ['#FFD700', '#FFC107', '#FFEB3B', '#F9A825', '#FBC02D', '#FFE082', '#FFECB3'];
    const pieces = Array.from({ length: 50 }, (_, i) => i);

    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {confettiActive &&
          pieces.map((piece) => {
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 0.5;
            const randomDuration = Math.random() * 3 + 2;
            const randomRotate = Math.random() * 360;
            const randomSize = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];

            return (
              <motion.div
                key={piece}
                className="absolute rounded-full"
                style={{
                  left: `${randomX}%`,
                  width: `${randomSize}px`,
                  height: `${randomSize}px`,
                  backgroundColor: color,
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight,
                  opacity: 0,
                  rotate: randomRotate,
                }}
                transition={{
                  duration: randomDuration,
                  delay: randomDelay,
                  ease: 'easeOut',
                }}
              />
            );
          })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {confettiActive && <Confetti />}

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img
                src="/web.png"
                alt="Storevia Logo"
                width={100}
                height={32}
                className="object-contain cursor-pointer"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Need help?</span>
            <button className="text-sm font-medium text-yellow-500 hover:text-yellow-600">
              Contact Us
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
        <AnimatePresence mode="wait">
          {currentStep === 'confirmation' ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto text-center py-16"
            >
              <motion.div
                className="relative w-full mb-12"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {/* Animated gift box */}
                <motion.div
                  className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center mx-auto"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    type: 'spring',
                    scale: { type: 'spring', stiffness: 300, damping: 15 },
                    rotate: { duration: 0.8, ease: 'easeInOut' },
                  }}
                >
                  <span className="text-5xl">🎁</span>
                </motion.div>

                {/* Animated stars */}
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full"
                  variants={confettiVariants}
                >
                  <div className="relative h-40 w-full">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-2xl"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-3xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Order Placed Successfully!
              </motion.h2>

              <motion.div
                className="flex justify-center items-center space-x-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.span
                  className="text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  🎉
                </motion.span>
                <motion.span
                  className="text-xl font-medium text-yellow-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Thank you for your purchase!
                </motion.span>
                <motion.span
                  className="text-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  🎉
                </motion.span>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-sm p-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 border-b border-gray-100 pb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <Package className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-medium text-gray-700" id="Order_Number">
                        {/* #ORD-
                        {Math.floor(Math.random() * 10000)
                          .toString()
                          .padStart(4, '0')} */}
                        {orderNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <Calendar className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium text-gray-700">{deliveryDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      <p className="font-medium text-gray-700">
                        {shippingData.address}, {shippingData.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <Truck className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium text-gray-700">Cash On Delivery</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col space-y-4 items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm text-gray-500">
                  A confirmation email has been sent to your email address.
                </p>

                <motion.div className="flex space-x-4">
                  <motion.button
                    onClick={() => router.push('/')} // Navigate to home route
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Continue Shopping
                  </motion.button>

                  <motion.button
                    onClick={() => router.push('/profile')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border border-yellow-500 text-yellow-500 hover:bg-yellow-50 font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                  >
                    <Package className="mr-2 h-5 w-5" />
                    View My Orders
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column - Forms */}
              <div className="lg:col-span-2">
                {/* Shipping Section */}
                <div className={cn(currentStep !== 'shipping' && 'opacity-70')}>
                  <StepIndicator step="shipping" label="Shipping" number={1} />

                  <motion.h2
                    className="text-3xl font-bold text-gray-800 mt-6 mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Shipping
                  </motion.h2>

                  <motion.div
                    className="bg-white rounded-xl shadow-sm p-6 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <form ref={formRef} onSubmit={handleShippingSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-xs text-gray-500 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={shippingData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                            placeholder="First Name"
                            required
                            disabled={currentStep !== 'shipping'}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-xs text-gray-500 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={shippingData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                            placeholder="Last Name"
                            required
                            disabled={currentStep !== 'shipping'}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-xs text-gray-500 mb-1">
                          Destination/Region
                        </label>
                        <div className="relative">
                          <select
                            id="country"
                            name="country"
                            value={shippingData.country}
                            onChange={handleSelectChange}
                            className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 text-gray-900"
                            required
                            disabled={currentStep !== 'shipping'}
                          >
                            <option value="Sri Lanka (Rs)">Sri Lanka (Rs)</option>
                          </select>
                          <ChevronDown
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                            size={18}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-xs text-gray-500 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={shippingData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                          placeholder="Address"
                          required
                          disabled={currentStep !== 'shipping'}
                        />
                      </div>

                      {showAddressLine2 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label
                            htmlFor="addressLine2"
                            className="block text-xs text-gray-500 mb-1"
                          >
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            value={shippingData.addressLine2}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                            placeholder="Address Line 2"
                            disabled={currentStep !== 'shipping'}
                          />
                        </motion.div>
                      )}

                      {!showAddressLine2 && currentStep === 'shipping' && (
                        <button
                          type="button"
                          onClick={() => setShowAddressLine2(true)}
                          className="flex items-center text-sm text-yellow-500 hover:text-yellow-600"
                        >
                          <Plus size={16} className="mr-1" />
                          Add another line
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-xs text-gray-500 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={shippingData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                            placeholder="City"
                            required
                            disabled={currentStep !== 'shipping'}
                          />
                        </div>
                        <div>
                          <label htmlFor="province" className="block text-xs text-gray-500 mb-1">
                            Select Province
                          </label>
                          <div className="relative">
                            <select
                              id="province"
                              name="province"
                              value={shippingData.province}
                              onChange={handleSelectChange}
                              className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10 text-gray-900"
                              required
                              disabled={currentStep !== 'shipping'}
                            >
                              <option value="">Select a province</option>
                              <option value="WP">Western Province</option>
                              <option value="CP">Central Province</option>
                              <option value="SP">Southern Province</option>
                              <option value="NP">Northern Province</option>
                              <option value="EP">Eastern Province</option>
                              <option value="NWP">North Western Province</option>
                              <option value="NCP">North Central Province</option>
                              <option value="UP">Uva Province</option>
                              <option value="SG">Sabaragamuwa Province</option>
                            </select>
                            <ChevronDown
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                              size={18}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="postalCode" className="block text-xs text-gray-500 mb-1">
                            Postal or zip code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={shippingData.postalCode}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                            placeholder="Postal or zip code"
                            required
                            disabled={currentStep !== 'shipping'}
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-xs text-gray-500 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={shippingData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                            placeholder="Phone"
                            required
                            disabled={currentStep !== 'shipping'}
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="useAsBilling"
                              checked={shippingData.useAsBilling}
                              onChange={handleCheckboxChange}
                              className="sr-only"
                              disabled={currentStep !== 'shipping'}
                            />
                            <div
                              className={cn(
                                'w-5 h-5 border rounded flex items-center justify-center transition-colors',
                                shippingData.useAsBilling
                                  ? 'bg-yellow-500 border-yellow-500'
                                  : 'border-gray-300 bg-white'
                              )}
                            >
                              {shippingData.useAsBilling && (
                                <Check size={14} className="text-white" />
                              )}
                            </div>
                          </div>
                          <span className="ml-2 text-sm text-gray-700">Use as billing address</span>
                        </label>
                        <button
                          className="bg-amber-400 text-black cursor-pointer p-1 px-2 rounded-2xl mt-2"
                          onClick={addNewAddress}
                        >
                          {addressState == 'current' ? 'use new' : 'use default'}
                        </button>
                      </div>

                      {currentStep === 'shipping' && (
                        <div className="flex justify-end">
                          <motion.button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Continue to Payment
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </motion.button>
                        </div>
                      )}
                    </form>
                  </motion.div>
                </div>

                {/* Payment Section */}
                <AnimatePresence>
                  {(currentStep === 'payment' || currentStep === 'review') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={cn(currentStep !== 'payment' && 'opacity-70')}
                    >
                      <StepIndicator step="payment" label="Payment" number={2} />

                      <motion.h2
                        className="text-3xl font-bold text-gray-800 mt-6 mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Payment
                      </motion.h2>

                      <motion.div
                        className="bg-white rounded-xl shadow-sm p-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600 mb-4">
                              Select your payment method:
                            </p>

                            {paymentMethods.map((method) => (
                              <div key={method.id} className="relative">
                                <label
                                  className={cn(
                                    'flex items-center p-4 border rounded-lg cursor-pointer transition-colors',
                                    paymentMethod === method.id && method.available
                                      ? 'border-yellow-500 bg-yellow-50'
                                      : 'border-gray-200',
                                    !method.available && 'opacity-60 cursor-not-allowed'
                                  )}
                                >
                                  <div className="flex-1 flex items-center">
                                    <div
                                      className={cn(
                                        'w-5 h-5 rounded-full border flex items-center justify-center mr-3',
                                        paymentMethod === method.id && method.available
                                          ? 'border-yellow-500'
                                          : 'border-gray-300'
                                      )}
                                    >
                                      {paymentMethod === method.id && method.available && (
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <span className="mr-2 text-gray-600">{method.icon}</span>
                                      <span className="font-medium text-gray-700">
                                        {method.name}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-auto">
                                    {!method.available ? (
                                      <span className="text-xs bg-yellow-100 text-yellow-600 font-medium px-2 py-1 rounded">
                                        Coming Soon
                                      </span>
                                    ) : method.fee ? (
                                      <span className="text-xs text-gray-500"></span>
                                    ) : null}
                                  </div>
                                </label>
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value={method.id}
                                  checked={paymentMethod === method.id}
                                  onChange={() => method.available && setPaymentMethod(method.id)}
                                  className="sr-only"
                                  disabled={!method.available || currentStep !== 'payment'}
                                />
                              </div>
                            ))}
                          </div>

                          {paymentMethod === 'cod' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                  <Truck className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-yellow-800">
                                    Cash On Delivery Information
                                  </h3>
                                  <div className="mt-2 text-sm text-yellow-700">
                                    <p>
                                      Pay with cash upon delivery. Our delivery partner will collect
                                      the payment when your order arrives.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <label
                              htmlFor="specialInstructions"
                              className="block text-xs text-gray-500 mb-1"
                            >
                              Special Instructions (Optional)
                            </label>
                            <textarea
                              id="specialInstructions"
                              name="specialInstructions"
                              value={specialInstructions}
                              onChange={(e) => setSpecialInstructions(e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
                              placeholder="Any special instructions for delivery"
                              disabled={currentStep !== 'payment'}
                            />
                          </div>

                          {currentStep === 'payment' && (
                            <div className="flex justify-end">
                              <motion.button
                                type="submit"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Continue to Review
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </motion.button>
                            </div>
                          )}
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Review Section */}
                <AnimatePresence>
                  {currentStep === 'review' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <StepIndicator step="review" label="Review" number={3} />

                      <motion.h2
                        className="text-3xl font-bold text-gray-800 mt-6 mb-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Review
                      </motion.h2>

                      <motion.div
                        className="bg-white rounded-xl shadow-sm p-6 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium text-gray-800 mb-3">
                                Shipping Information
                              </h3>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-700">
                                  {shippingData.firstName} {shippingData.lastName}
                                </p>
                                <p className="text-sm text-gray-700">{shippingData.address}</p>
                                {shippingData.addressLine2 && (
                                  <p className="text-sm text-gray-700">
                                    {shippingData.addressLine2}
                                  </p>
                                )}
                                <p className="text-sm text-gray-700">
                                  {shippingData.city}, {shippingData.province}{' '}
                                  {shippingData.postalCode}
                                </p>
                                <p className="text-sm text-gray-700">{shippingData.country}</p>
                                <p className="text-sm text-gray-700">{shippingData.phone}</p>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-medium text-gray-800 mb-3">Payment Method</h3>
                              <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center">
                                  <Truck className="h-5 w-5 mr-2 text-yellow-500" />
                                  <p className="text-sm text-gray-700">Cash On Delivery</p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Fee: Rs{' '}
                                  {getPaymentFee().toLocaleString('en-LK', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  })}
                                </p>
                              </div>
                            </div>

                            {specialInstructions && (
                              <div>
                                <h3 className="font-medium text-gray-800 mb-3">
                                  Special Instructions
                                </h3>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-sm text-gray-700">{specialInstructions}</p>
                                </div>
                              </div>
                            )}

                            <div>
                              <h3 className="font-medium text-gray-800 mb-3">
                                Delivery Information
                              </h3>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-2">
                                  <Calendar className="h-4 w-4 mr-2 text-yellow-500" />
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Estimated Delivery:</span>{' '}
                                    {deliveryDate}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <Truck className="h-4 w-4 mr-2 text-yellow-500" />
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Shipping Method:</span> Standard
                                    Delivery
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
                              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                                {checkoutList.map((product) => (
                                  <div
                                    key={product.product_id}
                                    className="flex justify-between items-center"
                                  >
                                    <div className="flex items-center">
                                      <div className="w-10 h-10 bg-white rounded-md overflow-hidden relative mr-3 border border-gray-100">
                                        <Image
                                          src={product.product_image || '/placeholder.svg'}
                                          alt={product.product_name}
                                          width={40}
                                          height={40}
                                          className="object-cover"
                                        />
                                      </div>
                                      <span className="text-sm text-gray-700">
                                        {product.product_name}
                                      </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                      Rs{' '}
                                      {(
                                        product.product_price * product.product_quantity
                                      ).toLocaleString('en-LK', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </div>
                                ))}
                                <div className="border-t border-gray-200 pt-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="text-sm text-gray-700">
                                      Rs{' '}
                                      {calculatTotal().toLocaleString('en-LK', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-gray-600">COD Fee</span>
                                    <span className="text-sm text-gray-700">
                                      Rs{' '}
                                      {getPaymentFee().toLocaleString('en-LK', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                    <span className="font-medium text-gray-800">Total</span>
                                    <span className="font-bold text-yellow-500">
                                      Rs{' '}
                                      {(calculatTotal() + getPaymentFee()).toLocaleString('en-LK', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <motion.button
                              type="submit"
                              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <motion.div
                                    className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={spinTransition}
                                  />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Place Order
                                  <Package className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </motion.button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  className="bg-white rounded-xl shadow-sm p-6 sticky top-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.h3
                    className="text-2xl font-bold text-gray-800 mb-6"
                    variants={itemVariants}
                  >
                    Summary
                  </motion.h3>

                  <motion.div className="space-y-4 mb-6" variants={containerVariants}>
                    {checkoutList.map((product) => (
                      <motion.div
                        key={product.id}
                        className="flex items-center justify-between"
                        variants={itemVariants}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 bg-white rounded-md overflow-hidden relative border border-gray-100">
                            <Image
                              src={product.product_image || '/placeholder.svg'}
                              alt={product.product_name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>

                          <span className="ml-3 text-sm text-gray-700">{product.product_name}</span>
                          <span className="ml-3 text-sm text-gray-700">
                            x{product.product_quantity}
                          </span>
                        </div>
                        <span className="font-medium text-gray-700">
                          Rs{' '}
                          {product.product_price.toLocaleString('en-LK', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="border-t border-gray-200 pt-4 space-y-3"
                    variants={itemVariants}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm text-gray-700">
                        Rs{' '}
                        {calculatTotal().toLocaleString('en-LK', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {paymentMethod === 'cod' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Delivery Fee</span>
                        <span className="text-sm text-gray-700">
                          Rs{' '}
                          {getPaymentFee().toLocaleString('en-LK', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-lg font-medium text-gray-800">Total</span>
                      <motion.span
                        className="text-xl font-bold text-yellow-500"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        Rs{' '}
                        {(calculatTotal() + getPaymentFee()).toLocaleString('en-LK', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </motion.span>
                    </div>
                    <p className="text-xs text-gray-500 text-right">Import duties included</p>
                  </motion.div>

                  {currentStep !== 'shipping' && (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('shipping')}
                        className="text-sm text-yellow-500 hover:text-yellow-600 flex items-center"
                      >
                        <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
                        Edit shipping details
                      </button>
                    </div>
                  )}

                  {currentStep === 'review' && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('payment')}
                        className="text-sm text-yellow-500 hover:text-yellow-600 flex items-center"
                      >
                        <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
                        Edit payment method
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
