/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useAlerts } from '@/hooks/useAlerts';
import { useRouter } from 'next/navigation';

// Color palette matching Reports.tsx
const COLORS = {
  primary: '#FFC107', // Yellow
  secondary: '#FFD54F', // Light yellow
  accent1: '#FF9800', // Orange-yellow
  accent2: '#FF5722', // Coral
  accent3: '#8C52FF', // Purple
  accent4: '#5CE1E6', // Teal
  grey1: '#F9FAFB',
  grey2: '#F3F4F6',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  red: '#EF4444', // Red for delete actions
  white: '#FFFFFF',
  black: '#000000',
};

// Pie chart colors
const PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent1,
  COLORS.accent2,
  COLORS.accent3,
  COLORS.accent4,
];

// Background gradient
const BG_GRADIENT = 'linear-gradient(to right bottom, #F9FAFB, #FFF9C4, #FFFFFF)';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

// Data for PieChart (sample customer sources)
const pieChartData = [
  { name: 'Website', value: 400 },
  { name: 'Referrals', value: 300 },
  { name: 'Social Media', value: 250 },
  { name: 'Ads', value: 200 },
  { name: 'Partners', value: 150 },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Custom Label for PieChart
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-sm font-semibold"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

// PieChart Component
const PieChart = () => (
  <div className="h-72 bg-white rounded-xl p-6 shadow-sm">
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1500}
        >
          {pieChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
              style={{ transition: 'transform 0.3s ease' }}
              onMouseEnter={(e: any) => (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e: any) => (e.target.style.transform = 'scale(1)')}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => Number(value).toLocaleString('en-US')}
          wrapperStyle={{ color: COLORS.textPrimary, fontSize: '14px' }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ paddingLeft: '20px', fontSize: '14px', color: COLORS.textPrimary }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  </div>
);

// Delete Confirmation Popup Component
const DeleteStorePopup = ({
  isOpen,
  onClose,
  onConfirm,
  colors,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  colors: typeof COLORS;
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    onConfirm(password);
    setPassword('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Store Deletion</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. Please enter your password to confirm.
            </p>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                placeholder="Enter your password"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                onClick={() => {
                  setPassword('');
                  setError('');
                  onClose();
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: colors.red }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirm Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function StoreProfile() {
  const initialBusinessHours = [
    { day: 'Monday', hours: '9:00 AM - 6:00 PM', editing: false },
    { day: 'Tuesday', hours: '9:00 AM - 6:00 PM', editing: false },
    { day: 'Wednesday', hours: '9:00 AM - 6:00 PM', editing: false },
    { day: 'Thursday', hours: '9:00 AM - 6:00 PM', editing: false },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM', editing: false },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM', editing: false },
    { day: 'Sunday', hours: 'Closed', editing: false },
  ];

  // State for form fields (pre-filled with sample data)
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessHours, setBusinessHours] = useState(initialBusinessHours);
  const [isEditing, setIsEditing] = useState(false);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Store cover (banner) image state
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  // Handle cover image upload (client-side preview)
  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  // State for delete popup
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  // Alert and confirmation modals
  const {
    success: showSuccess,
    error: showError,
    confirmDelete,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

    const storedSellerId = localStorage.getItem('seller_id');
    console.log('Retrieved seller_id from localStorage:', storedSellerId);

  // Handle image upload (client-side preview)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the file object for later upload
      setImageFile(file);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  // Handle business hours editing (client-side)
  const toggleEditHours = (index: number) => {
    setBusinessHours((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, editing: !entry.editing } : entry))
    );
  };

  const updateHours = (index: number, hours: string) => {
    setBusinessHours((prev) =>
      prev.map((entry, i) => (i === index ? { ...entry, hours, editing: false } : entry))
    );
  };

  // Toggle editing mode
  const toggleEditing = () => {
    if (isEditing) {
      // Reset to initial values when canceling
      // setShopName('');
      // setDescription('');
      // setUsername('');
      // setCurrentPassword('');
      // setNewPassword('');
      // setConfirmPassword('');
      // setBusinessHours(initialBusinessHours);
      // setProfileImage(null);
    }
    setIsEditing(!isEditing);
  };

  type Store = {
    id: string;
    store_name: string;
    store_username: string;
    store_password: string;
    store_description: string;
    store_logo: string;
    store_banner?: string;
  };
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const searchParams = useSearchParams();
  const storeId = searchParams.get('shopId');
  const [store, setStore] = useState<Store[]>([]);

  // const fetchStoreData = async () => {
  //   console.log('storeId for fetching:', storeId);
  //   try {
  //     const formData = new URLSearchParams();
  //     formData.append('store_id', storeId || ''); //slug

  //     const response = await fetch(`${baseUrl}/get_store_details.php`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //       body: formData.toString(),
  //     });

  //     const data = await response.json();
  //     console.log('Store data fetched:', data);

  //     if (Array.isArray(data.storeData)) {
  //       setStore(data.storeData);
  //     } else {
  //       console.warn('Expected data to be an array:', data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching store data:', error);
  //   }
  // };

  const fetchStoreData = async () => {
  console.log('storeId for fetching:', storedSellerId);

  try {
    // Make the GET request to the Laravel API endpoint
    const response = await fetch(`http://127.0.0.1:8000/api/seller/${storedSellerId}/store`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Ensure the request expects JSON responses
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response data
    const data = await response.json();
    console.log('Store data fetched:', data);


    // Check if the data contains store data
    if (data) {
      setStore(data); // Assuming 'store' is the key containing store data in the response
      console.log('Store state updated:', data.storeData);
    } else {
      console.warn('Unexpected response structure:', data);
    }
  } catch (error) {
    console.error('Error fetching store data:', error);
  }
};


  useEffect(() => {
    if (storeId) fetchStoreData();
  }, [storeId]);

  useEffect(() => {
    if (store.length > 0) {
      console.log('Updated store state:', store[0].store_name);
      console.log('Updated store state:', store[0].store_password);
    }
  }, [store]);

  useEffect(() => {
    if (store.length > 0) {
      const s = store[0];
      setShopName(s.store_name);
      setUsername(s.store_username);
      setDescription(s.store_description);
      setProfileImage(s.store_logo);
      if (s.store_banner) setCoverImage(s.store_banner);
    }
  }, [store]);

  useEffect(() => {
    console.log(shopName);
  }, [shopName]);

  const [message, setMessage] = useState('');

  // Function to display messages
  const dispalyMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const updateStoreDetails = async () => {
    try {
      const formData = new FormData();
      formData.append('id', storeId || '');
      formData.append('name', shopName);
      formData.append('description', description);
      formData.append('username', username);
      formData.append('current_password', currentPassword);
      formData.append('banner', coverImage || '');
      formData.append('logo', profileImage || '');
      console.log('storelogo', profileImage);
      if (newPassword !== confirmPassword) {
        dispalyMessage('Password and Confirm Password do not match!');
        return;
      }
      formData.append('new_password', newPassword);


      if (imageFile instanceof File) {
        formData.append('image', imageFile);
      }
      if (coverFile instanceof File) {
        formData.append('cover', coverFile);
      }

      const response = await fetch(`${baseUrl}/editStore.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Update result:', result);

      if (result.status === 'success') {
        showSuccess('Store Updated', 'Store updated successfully!');
        fetchStoreData();
        setCurrentPassword('');
        setConfirmPassword('');
        setNewPassword('');
      } else {
        if (result.message === 'Current password is incorrect.') {
          dispalyMessage('Current password is incorrect.');
          return;
        }
        showError('Update Failed', 'Failed to update store: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating store:', error);
      showError('Error', 'An error occurred. Please try again.');
    }
  };

  // Handle store deletion
  const handleDeleteStore = async (password: string) => {
    console.log(password);
    console.log(storeId);
    try {
      const formData = new FormData();
      formData.append('store_id', storeId || '');
      formData.append('password', password);

      const response = await fetch(`${baseUrl}/delete_store.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Delete result:', result);

      if (result.status === 'success') {
        showSuccess('Store Deleted', 'Store deleted successfully!');
        setIsDeletePopupOpen(false);
        // Example: Redirect to home or stores list
        window.location.href = 'seller/shops';
      } else {
        showError('Delete Failed', 'Failed to delete store: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting store:', error);
      dispalyMessage('An error occurred. Please try again.');
    }
  };

  //navigate to store page
  const router = useRouter();
  const visitStore = () => {
    const store_id = storeId;
    console.log(store_id);
    if (store_id) {
      // Use the new query parameter routing approach
      router.push(`/store?id=${encodeURIComponent(store_id)}`);
    } else {
      console.error('Store ID is null');
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex relative overflow-hidden font-poppins"
      style={{ background: BG_GRADIENT }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: COLORS.primary }}
        animate={{
          x: ['-5%', '5%', '-5%'],
          y: ['-5%', '5%', '-5%'],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-52 h-52 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: COLORS.secondary }}
        animate={{
          x: ['5%', '-5%', '5%'],
          y: ['5%', '-5%', '5%'],
        }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: COLORS.accent1 }}
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
      />

      {/* Delete Store Popup */}
      <DeleteStorePopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={handleDeleteStore}
        colors={COLORS}
      />

      {/* Main Content */}
      <motion.div variants={fadeIn} className="flex-1 p-6 lg:p-8 z-10 w-full">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-8"
          variants={itemVariants}
        >
          <motion.div className="flex items-center">
            <motion.div
              className="w-12 h-12 flex items-center justify-center rounded-xl mr-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                <span className="text-yellow-500">Store Profile</span>
              </h1>
              <p className="text-gray-500">Manage your store’s information and settings</p>
            </div>
          </motion.div>
          <motion.div className="flex items-center space-x-4 mt-4 md:mt-0" variants={itemVariants}>
            <motion.button
              onClick={toggleEditing}
              className="flex items-center px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all text-white"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isEditing ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                )}
              </svg>
              <span className="font-semibold">{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </motion.button>
            <motion.button
              onClick={updateStoreDetails}
              className={`flex items-center px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all text-white ${
                isEditing ? '' : 'hidden'
              }`}
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-semibold">Save Changes</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Profile Card */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Store Information</h3>
            <div className={`grid gap-6 md:grid-cols-2 ${!isEditing ? 'opacity-60' : ''}`}>
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Store Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : profileImage ? (
                    <img
                      src={`${baseUrl}/${profileImage}`}
                      alt="Store Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
                <label
                  htmlFor="profile-image-upload"
                  className={`mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 cursor-pointer transition-all ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`}
                >
                  Upload Image
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={!isEditing}
                />
              </div>
              {/* Cover (Banner) Image */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100"
                  style={{ maxWidth: 320 }}
                  whileHover={{ scale: 1.03 }}
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Store Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : coverImage ? (
                    <img
                      src={`${baseUrl}/${coverImage}`}
                      alt="Store Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm4 8l4 4 4-4"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
                <label
                  htmlFor="cover-image-upload"
                  className={`mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 cursor-pointer transition-all ${
                    !isEditing ? 'cursor-not-allowed' : ''
                  }`}
                >
                  Upload Cover Image
                </label>
                <input
                  id="cover-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={!isEditing}
                />
              </div>
              {/* Shop Name and Description */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Shop Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-y text-gray-900 ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                    rows={4}
                    disabled={!isEditing}
                  />
                </div>
                <div className="">
                  <motion.button
                    onClick={() => {
                      if (!isEditing) return;
                      const confirmed = window.confirm(
                        'Are you sure you want to delete this store?'
                      );
                      if (confirmed) {
                        setIsDeletePopupOpen(true);
                      }
                    }}
                    className={`px-4 py-2 text-white font-bold rounded-lg ${
                      isEditing
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isEditing}
                    whileHover={{ scale: isEditing ? 1.05 : 1 }}
                    whileTap={{ scale: isEditing ? 0.95 : 1 }}
                  >
                    Delete Store
                  </motion.button>
                  <motion.button
                  onClick={visitStore}
                    className={`ml-5 px-4 py-2 text-white font-bold rounded-lg ${
                      isEditing
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isEditing}
                    whileHover={{ scale: isEditing ? 1.05 : 1 }}
                    whileTap={{ scale: isEditing ? 0.95 : 1 }}
                  >
                    View Store
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Credentials Details */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Credential Details</h3>
            </div>
            {message && (
              <div className="w-full bg-red-100 py-5 mb-5 text-red-600 px-3 rounded-md text-sm">
                {message}
              </div>
            )}

            <div className={`grid gap-4 md:grid-cols-3 ${!isEditing ? 'opacity-60' : ''}`}>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: COLORS.primary }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7.5m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0L12 9l-8 4.5"
                    />
                  </svg>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 ${
                    !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: COLORS.primary }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Current Password
                </label>
                <input
                  type="text"
                  value={currentPassword}
                  placeholder="Enter current password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 ${
                    !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: COLORS.primary }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  New Password
                </label>
                <input
                  type="text"
                  value={newPassword}
                  placeholder="Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 ${
                    !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: COLORS.primary }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Confirm New Password
                </label>
                <input
                  type="text"
                  value={confirmPassword}
                  placeholder="Confirm new password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900 ${
                    !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </motion.div>

          {/* Business Hours */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: COLORS.primary }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Business Hours
              </h3>
            </div>
            <div className={`${!isEditing ? 'opacity-60' : ''}`}>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-600 py-2">Day</th>
                    <th className="text-left text-sm font-medium text-gray-600 py-2">Hours</th>
                    <th className="text-left text-sm font-medium text-gray-600 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {businessHours.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2 font-medium text-gray-900">{entry.day}</td>
                      <td className="py-2 text-gray-600">
                        {entry.editing && isEditing ? (
                          <input
                            type="text"
                            value={entry.hours}
                            onChange={(e) => updateHours(idx, e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                          />
                        ) : (
                          entry.hours
                        )}
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => toggleEditHours(idx)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 transition-all ${
                            !isEditing ? 'cursor-not-allowed' : ''
                          }`}
                          disabled={!isEditing}
                        >
                          {entry.editing && isEditing ? 'Save' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Customer Sources Pie Chart */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Sources</h3>
            <PieChart />
          </motion.div>
        </div>
      </motion.div>

      {/* Alert and Confirmation Modals */}
      {AlertModalComponent}
      {ConfirmationModalComponent}
    </motion.div>
  );
}
