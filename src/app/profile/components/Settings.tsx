/* eslint-disable @next/next/no-img-element */

/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// Color palette matching the provided theme
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

// Animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  cardType: string;
  lastFour: string;
  expiry: string;
  isDefault: boolean;
}

interface NotificationPreferences {
  emailOrderUpdates: boolean;
  emailPromotions: boolean;
  smsOrderUpdates: boolean;
  smsPromotions: boolean;
  pushNotifications: boolean;
}
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  profileImage?: string;
}

const UserSettings: FC = () => {
  const [activeSection, setActiveSection] = useState<'profile'>('profile');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [authProvider, setAuthProvider] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    username: 'Guest',
    phone: '',
    profileImage: '',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Assuming you get the user object from Firebase Auth

  useEffect(() => {
    if (user) {
      // If user is authenticated, make a request to fetch profile data from PHP backend
      const fetchUserProfile = async () => {
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

          const data = await response.json();
          console.log('Fetched user profile data:', data);

          // If the backend returns the user data, update the profile state
          if (data.success) {
            const imageUrl =
              data.profile_picture &&
              data.profile_picture.startsWith('https://lh3.googleusercontent.com')
                ? data.profile_picture // If it's from Google, use the URL directly
                : `${baseUrl}/${data.profile_picture}`;
            setUserProfile({
              id: data.user_id,
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              username: data.username || data.email,
              phone: data.phone || '',
              profileImage: imageUrl,
            });
          } else {
            console.error('Failed to fetch user profile:', data.message);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    } else {
      setUserProfile({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        username: 'Guest',
        phone: '',
        profileImage: '',
      });
      setLoading(false);
    }
  }, [user]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA',
      isDefault: true,
    },
    {
      id: '2',
      street: '456 Elm St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      isDefault: false,
    },
  ]);
  const [isEditingAddress, setIsEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      cardType: 'Visa',
      lastFour: '1234',
      expiry: '12/26',
      isDefault: true,
    },
    {
      id: '2',
      cardType: 'MasterCard',
      lastFour: '5678',
      expiry: '09/25',
      isDefault: false,
    },
  ]);
  const [isEditingPayment, setIsEditingPayment] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState({
    cardType: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    isDefault: false,
  });

  // Notification preferences state
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailOrderUpdates: true,
    emailPromotions: false,
    smsOrderUpdates: true,
    smsPromotions: false,
    pushNotifications: true,
  });

  // Security state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handlers
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  // Handle image upload and preview
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Set image preview
      setUserProfile({ ...userProfile, profileImage: previewUrl }); // Set profileImage preview URL
    }
  };

  // Save profile changes (including profile image)
 const saveProfile = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('id', userProfile.id);
    formData.append('firstName', userProfile.firstName);
    formData.append('lastName', userProfile.lastName);
    formData.append('email', userProfile.email);

    // If the user uploaded a new image, append it to the formData
    if (imageFile) {
      formData.append('profileImage', imageFile); 
    } else {
      // If no new image, send the current profile image path
      formData.append('profileImage', userProfile.profileImage); 
    }

    const res = await fetch(`${baseUrl}/update_user_profile.php`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      // Handle success (e.g., show success message, stop editing)
      showMessage('Profile updated successfully!');
      setIsEditingProfile(false); // Exit edit mode
      setImageFile(null); // Clear image file input
      setImagePreview(null); // Clear image preview
    } else {
      setError(data.message || 'Failed to update profile. Please try again.');
    }
  } catch (err) {
    setError('Failed to update profile. Please try again.');
  } finally {
    setLoading(false);
  }
};


  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditingProfile(!isEditingProfile);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
    const { name, value } = e.target;
    if (id) {
      setAddresses(addresses.map((addr) => (addr.id === id ? { ...addr, [name]: value } : addr)));
    } else {
      setNewAddress({ ...newAddress, [name]: value });
    }
  };

  const addAddress = () => {
    if (
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zipCode ||
      !newAddress.country
    ) {
      setError('All address fields are required');
      return;
    }
    setAddresses([...addresses, { ...newAddress, id: (addresses.length + 1).toString() }]);
    setNewAddress({
      id: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
    });
    showMessage('Address added successfully!');
  };

  const deleteAddress = (id: string) => {
    if (addresses.find((addr) => addr.id === id)?.isDefault) {
      setError('Cannot delete default address');
      return;
    }
    setAddresses(addresses.filter((addr) => addr.id !== id));
    showMessage('Address deleted successfully!');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    showMessage('Default address updated!');
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
    const { name, value } = e.target;
    if (id) {
      setPaymentMethods(paymentMethods.map((pm) => (pm.id === id ? { ...pm, [name]: value } : pm)));
    } else {
      setNewPayment({ ...newPayment, [name]: value });
    }
  };

  const addPaymentMethod = () => {
    if (!newPayment.cardType || !newPayment.cardNumber || !newPayment.expiry || !newPayment.cvv) {
      setError('All payment fields are required');
      return;
    }
    setPaymentMethods([
      ...paymentMethods,
      {
        id: (paymentMethods.length + 1).toString(),
        cardType: newPayment.cardType,
        lastFour: newPayment.cardNumber.slice(-4),
        expiry: newPayment.expiry,
        isDefault: newPayment.isDefault,
      },
    ]);
    setNewPayment({
      cardType: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
      isDefault: false,
    });
    showMessage('Payment method added successfully!');
  };

  const deletePaymentMethod = (id: string) => {
    if (paymentMethods.find((pm) => pm.id === id)?.isDefault) {
      setError('Cannot delete default payment method');
      return;
    }
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    showMessage('Payment method deleted successfully!');
  };

  const setDefaultPayment = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
    showMessage('Default payment method updated!');
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications({ ...notifications, [name]: checked });
  };

  const saveNotifications = () => {
    // Simulate API call to save notifications
    showMessage('Notification preferences updated!');
  };

  const changePassword = async (): Promise<void> => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/change_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        showMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordModalOpen(false);
        setError('');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  // const deleteAccount = (password: string) => {
  //   if (!password) {
  //     setError('Password is required to delete account');
  //     return;
  //   }
  //   // Simulate account deletion API call
  //   showMessage('Account deletion request submitted');
  //   setIsDeleteModalOpen(false);
  // };

  // // Modal Components
  // const DeleteAccountModal = () => {
  //   const [password, setPassword] = useState('');
  //   return (
  //     <AnimatePresence>
  //       {isDeleteModalOpen && (
  //         <motion.div
  //           className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50"
  //           initial={{ opacity: 0 }}
  //           animate={{ opacity: 1 }}
  //           exit={{ opacity: 0 }}
  //         >
  //           <motion.div
  //             className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
  //             variants={modalVariants}
  //           >
  //             <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Account Deletion</h3>
  //             <p className="text-gray-600 mb-4">
  //               This action cannot be undone. Please enter your password to confirm.
  //             </p>
  //             <div className="mb-4">
  //               <label className="text-sm font-medium text-gray-600">Password</label>
  //               <input
  //                 type="password"
  //                 value={password}
  //                 onChange={(e) => setPassword(e.target.value)}
  //                 className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
  //                 placeholder="Enter your password"
  //               />
  //               {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  //             </div>
  //             <div className="flex justify-end space-x-3">
  //               <motion.button
  //                 onClick={() => {
  //                   setPassword('');
  //                   setError('');
  //                   setIsDeleteModalOpen(false);
  //                 }}
  //                 className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 transition-all"
  //                 whileHover={{ scale: 1.05 }}
  //                 whileTap={{ scale: 0.95 }}
  //               >
  //                 Cancel
  //               </motion.button>
  //               <motion.button
  //                 onClick={() => deleteAccount(password)}
  //                 className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
  //                 whileHover={{ scale: 1.05 }}
  //                 whileTap={{ scale: 0.95 }}
  //               >
  //                 Confirm Delete
  //               </motion.button>
  //             </div>
  //           </motion.div>
  //         </motion.div>
  //       )}
  //     </AnimatePresence>
  //   );
  // };

  // Move handlers outside the modal component to prevent re-creation
  const handleClosePasswordModal = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsPasswordModalOpen(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword();
  };

  const ChangePasswordModal = () => {
    // Prevent modal from closing when clicking inside
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        handleClosePasswordModal();
      }
    };

    if (!isPasswordModalOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <div
          className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl m-4 border border-gray-200"
          onClick={handleModalClick}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleClosePasswordModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-black mb-6">Account Settings</h1>
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">{message}</div>
        )}
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* Navigation Tabs */}
        <div className="flex items-center mb-6 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile' },
            // { id: 'addresses', label: 'Addresses' },
            // { id: 'payments', label: 'Payment Methods' },
            // { id: 'notifications', label: 'Notifications' },
            // { id: 'security', label: 'Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-4 py-2 whitespace-nowrap font-medium text-sm sm:text-base ${
                activeSection === tab.id
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-black hover:text-yellow-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-black">Personal Information</h3>
              <button
                onClick={toggleEditMode}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 opacity-100">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  {userProfile.profileImage ? (
                    <img
                      src={imagePreview || userProfile.profileImage} // Show image preview or existing profile image
                      alt="Profile"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {isEditingProfile && (
                  <>
                    <label
                      htmlFor="profile-image-upload"
                      className="mt-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 cursor-pointer transition-all"
                    >
                      Upload Image
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userProfile.firstName}
                    onChange={handleProfileInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                    disabled={!isEditingProfile} // Disable field if not in edit mode
                  />
                </div>

                {userProfile.lastName && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userProfile.lastName}
                      onChange={handleProfileInputChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      disabled={!isEditingProfile} // Disable field if not in edit mode
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userProfile.email}
                    onChange={handleProfileInputChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-900 outline-none"
                    disabled // Email is always disabled (not editable)
                  />
                </div>

                {isEditingProfile && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={saveProfile}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Addresses Section
        {activeSection === 'addresses' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-black mb-4">Addresses</h3>
            {addresses.map((address) => (
              <div key={address.id} className="border border-gray-200 p-4 rounded-lg mb-4">
                {isEditingAddress === address.id ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={(e) => handleAddressChange(e, address.id)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={(e) => handleAddressChange(e, address.id)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">State</label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={(e) => handleAddressChange(e, address.id)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={(e) => handleAddressChange(e, address.id)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={(e) => handleAddressChange(e, address.id)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      />
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <motion.button
                        onClick={() => setIsEditingAddress(null)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={() => setIsEditingAddress(null)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-black">
                        {address.street}, {address.city}, {address.state} {address.zipCode},{' '}
                        {address.country}
                      </p>
                      {address.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="space-x-3">
                      <motion.button
                        onClick={() => setIsEditingAddress(address.id)}
                        className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => deleteAddress(address.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={address.isDefault}
                      >
                        Delete
                      </motion.button>
                      {!address.isDefault && (
                        <motion.button
                          onClick={() => setDefaultAddress(address.id)}
                          className="px-3 py-1 text-sm text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Set as Default
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-black mb-3">Add New Address</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={(e) => handleAddressChange(e)}
                  placeholder="Street Address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={(e) => handleAddressChange(e)}
                  placeholder="City"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={(e) => handleAddressChange(e)}
                  placeholder="State"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <input
                  type="text"
                  name="zipCode"
                  value={newAddress.zipCode}
                  onChange={(e) => handleAddressChange(e)}
                  placeholder="Zip Code"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={(e) => handleAddressChange(e)}
                  placeholder="Country"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <motion.button
                  onClick={addAddress}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Address
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Section */}
        {/* {activeSection === 'payments' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-black mb-4">Payment Methods</h3>
            {paymentMethods.map((payment) => (
              <div key={payment.id} className="border border-gray-200 p-4 rounded-lg mb-4">
                {isEditingPayment === payment.id ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Card Type</label>
                      <input
                        type="text"
                        name="cardType"
                        value={payment.cardType}
                        onChange={(e) => handlePaymentChange(e, payment.id)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={payment.lastFour}
                        onChange={(e) => handlePaymentChange(e, payment.id)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Expiry</label>
                      <input
                        type="text"
                        name="expiry"
                        value={payment.expiry}
                        onChange={(e) => handlePaymentChange(e, payment.id)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                      />
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <motion.button
                        onClick={() => setIsEditingPayment(null)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={() => setIsEditingPayment(null)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-black">
                        {payment.cardType} ending in {payment.lastFour}
                      </p>
                      <p className="text-sm text-gray-600">Expires {payment.expiry}</p>
                      {payment.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="space-x-3">
                      <motion.button
                        onClick={() => setIsEditingPayment(payment.id)}
                        className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        onClick={() => deletePaymentMethod(payment.id)}
                        className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={payment.isDefault}
                      >
                        Delete
                      </motion.button>
                      {!payment.isDefault && (
                        <motion.button
                          onClick={() => setDefaultPayment(payment.id)}
                          className="px-3 py-1 text-sm text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Set as Default
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-black mb-3">Add New Payment Method</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="cardType"
                  value={newPayment.cardType}
                  onChange={(e) => handlePaymentChange(e)}
                  placeholder="Card Type (e.g., Visa)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <input
                  type="text"
                  name="cardNumber"
                  value={newPayment.cardNumber}
                  onChange={(e) => handlePaymentChange(e)}
                  placeholder="Card Number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <input
                  type="text"
                  name="expiry"
                  value={newPayment.expiry}
                  onChange={(e) => handlePaymentChange(e)}
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <input
                  type="text"
                  name="cvv"
                  value={newPayment.cvv}
                  onChange={(e) => handlePaymentChange(e)}
                  placeholder="CVV"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-gray-900"
                />
                <motion.button
                  onClick={addPaymentMethod}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Payment Method
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {/* {activeSection === 'notifications' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-black mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="emailOrderUpdates"
                  checked={notifications.emailOrderUpdates}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Email Order Updates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="emailPromotions"
                  checked={notifications.emailPromotions}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Email Promotions</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="smsOrderUpdates"
                  checked={notifications.smsOrderUpdates}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">SMS Order Updates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="smsPromotions"
                  checked={notifications.smsPromotions}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">SMS Promotions</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={notifications.pushNotifications}
                  onChange={handleNotificationChange}
                  className="h-5 w-5 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Push Notifications</span>
              </label>
              <motion.button
                onClick={saveNotifications}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Preferences
              </motion.button>
            </div>
          </div>
        )} */}

        {/* Security Section */}
        {/* {activeSection === 'security' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-black mb-4">Account Security</h3>
            {authProvider === 'credentials' ? (
              <div className="space-y-4">
                <motion.button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Change Password
                </motion.button>
                <motion.button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all ml-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete Account
                </motion.button>
              </div>
            ) : (
              <div className="text-gray-600 italic text-sm">
                Account security options are not available for your{' '}
                <strong>{authProvider || 'current'}</strong> login method.
              </div>
            )}
          </div>
        )}  */}
        <ChangePasswordModal />
      </div>
    </div>
  );
};

export default UserSettings;
