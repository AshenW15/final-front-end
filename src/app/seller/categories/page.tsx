/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '@/app/home/Footer';
import { useAlerts } from '@/hooks/useAlerts';

// Import Poppins font from Google Fonts
const poppinsFont = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  body, html {
    font-family: 'Poppins', sans-serif;
  }
`;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Type definitions
interface CategoryType {
  id: number;
  category_name: string;
  category_icon: string;
}

interface CategorySelectionProps {
  onSelectCategory: (category: CategoryType) => void;
}

interface RegistrationFormProps {
  category: CategoryType | null;
  onBack: () => void;
}

interface FormFieldProps {
  field: {
    label: string;
    type: string;
    id: string;
    placeholder?: string;
    options?: string[];
    accept?: string;
    text?: string;
    component?: React.ComponentType<any>;
    props?: AccountTypeSelectionProps;
  };
  onImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoPreview?: string | null;
  bannerPreview?: string | null;
  defaultBanner?: string;
  showPassword?: boolean;
  showConfirmPassword?: boolean;
  onTogglePassword?: () => void;
  onToggleConfirmPassword?: () => void;
}

interface AccountTypeSelectionProps {
  accountType: string;
  setAccountType: (type: string) => void;
}

// Main component for SellerRegistration
const SellerRegistration: FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [step, setStep] = useState<'categories' | 'form'>('categories');
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Alert and confirmation modals
  const {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole');
    console.log('Role:', userRole);

    if (userRole !== 'seller' && userRole !== 'admin') {
      router.push('/unauthorizePage');
    }
  }, []);

  useEffect(() => {
    const id = localStorage.getItem('seller_id');
    setSellerId(id);
    console.log('Logged in seller:', id);
  }, []); // meka session variable ekak wage use karanna puluwan

  const handleCategorySelect = (category: CategoryType): void => {
    setSelectedCategory(category);
    setStep('form');
  };

  const handleBack = (): void => {
    setStep('categories');
  };

  const handleBecomeSellerClick = () => {
    // Already on SellerRegistration page, no action needed
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style>{poppinsFont}</style>
      <main className="flex-grow container mx-auto px-4 py-8">
        {step === 'categories' ? (
          <CategorySelection onSelectCategory={handleCategorySelect} />
        ) : (
          <RegistrationForm category={selectedCategory} onBack={handleBack} />
        )}
      </main>
    </div>
  );
};

// Category selection component
const CategorySelection: FC<CategorySelectionProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${baseUrl}/fetch_categories.php`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error('Data is not in the expected format', data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">
        Select Your Store Category
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Choose the category that best represents your products
      </p>
      <button
        className="border-1 bg-amber-400 p-2 mb-2 cursor-pointer"
        onClick={() => {
          try {
            localStorage.removeItem('seller_id');
            localStorage.removeItem('seller_email');
            router.push('/seller');
          } catch (error) {
            console.error('Error during logout:', error);
          }
        }}
      >
        Logout
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id || index}
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:border-yellow-400 cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category)}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <motion.div
                className="text-4xl mb-4"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                {category.category_icon.startsWith('/images/') ? (
                  <img
                    src={`${baseUrl}${category.category_icon}`}
                    alt={category.category_name}
                    className="w-10"
                  />
                ) : (
                  <span>{category.category_icon}</span>
                )}
              </motion.div>

              <h3 className="font-semibold text-lg mb-2 text-gray-900">{category.category_name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Registration form component
const RegistrationForm: FC<RegistrationFormProps> = ({ category, onBack }) => {
  const router = useRouter();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  // const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Default Storevia banner
  // const defaultBanner = `data:image/svg+xml;base64,${btoa(`
  //   <svg width="1200" height="400" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  //     <defs>
  //       <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
  //         <stop offset="0%" style="stop-color:#FFC107;stop-opacity:1" />
  //         <stop offset="50%" style="stop-color:#FFD54F;stop-opacity:1" />
  //         <stop offset="100%" style="stop-color:#FFC107;stop-opacity:1" />
  //       </linearGradient>
  //     </defs>
  //     <rect width="1200" height="400" fill="url(#gradient)"/>
  //     <text x="600" y="200" text-anchor="middle" fill="#000" font-family="Arial, sans-serif" font-size="72" font-weight="bold">Storevia</text>
  //     <text x="600" y="250" text-anchor="middle" fill="#000" font-family="Arial, sans-serif" font-size="24">Your Store, Your Success</text>
  //     <circle cx="150" cy="100" r="30" fill="#000" opacity="0.1"/>
  //     <circle cx="1050" cy="300" r="40" fill="#000" opacity="0.1"/>
  //     <circle cx="200" cy="350" r="20" fill="#000" opacity="0.1"/>
  //     <circle cx="1100" cy="150" r="25" fill="#000" opacity="0.1"/>
  //   </svg>
  // `)}`;
  const defaultBanner = `${baseUrl}/storeBanners/banner.jpg`;

  const [bannerPreview, setBannerPreview] = useState<string>(defaultBanner);
  // Alert and confirmation modals
  const {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

  const formSections = [
    {
      title: 'Business Information',
      fields: [
        {
          label: 'Business Name',
          type: 'text',
          id: 'store_business_name',
          placeholder: 'Enter your business name',
        },
        {
          label: 'Business Type',
          type: 'select',
          id: 'store_business_type',
          options: [
            'Sole Proprietorship',
            'Partnership',
            'Private Limited Company',
            'Public Limited Company',
            'Other',
          ],
        },
        {
          label: 'Business Registration Number',
          type: 'text',
          id: 'store_business_registration_number',
          placeholder: 'Enter your business registration number',
        },
        {
          label: 'Business Address',
          type: 'textarea',
          id: 'store_business_address',
          placeholder: 'Enter your complete business address',
        },
      ],
    },
    {
      title: 'Shop/Store Information',
      fields: [
        {
          label: 'Shop/Store Name',
          type: 'text',
          id: 'store_name',
          placeholder: 'Enter your store name',
        },
        {
          label: 'Shop/Store Description',
          type: 'textarea',
          id: 'store_description',
          placeholder: 'Describe your store and products',
        },
        {
          label: 'Store Banner',
          type: 'file',
          id: 'store_banner',
          value: 'banner.jpg',
          accept: 'image/*',
        },
        {
          label: 'Store Logo',
          type: 'file',
          id: 'store_logo',
          accept: 'image/*',
        },
      ],
    },

    {
      title: 'Store Account Credentials',
      fields: [
        {
          label: 'Store Username',
          type: 'text',
          id: 'store_username',
          placeholder: 'Choose a store username',
        },
        {
          label: 'Store Password',
          type: 'password',
          id: 'store_password',
          placeholder: 'Choose a strong password',
        },
        {
          label: 'Confirm Password',
          type: 'password',
          id: 'confirmPassword',
          placeholder: 'Confirm your password',
        },
      ],
    },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (category?.category_name) {
      formData.append('category_name', category.category_name.toString());
    }
    const sellerId = localStorage.getItem('seller_id');
    if (sellerId) {
      formData.append('seller_id', sellerId);
    } else {
      showWarning('Authentication Required', 'Seller not logged in.');
      return;
    }
    // If no file uploaded for banner
    if (!formData.get('store_banner') || (formData.get('store_banner') as File).size === 0) {
      // Add default banner filename or URL
      formData.append('default_banner', 'banner.jpg'); // or the URL or file path you want backend to use
    }

    // console.log(formData);

    try {
      const response = await fetch(`${baseUrl}/register_store.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      if (result.status === 'success') {
        showSuccess('Registration Complete', 'Registration successful!');
        router.push('/seller/shops');
      } else {
        showError('Registration Failed', result.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="py-6">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold flex-1 text-gray-900">
          Register as a {category?.category_name} Seller
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {formSections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-900">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIdx) => {
                if (field && 'component' in field && field.component) {
                  const Component = field.component;
                  return Component && 'props' in field && field.props
                    ? React.createElement(Component as React.ComponentType<any>, {
                        key: fieldIdx,
                        ...field.props,
                      })
                    : null;
                }
                return (
                  <div
                    key={fieldIdx}
                    className={
                      field?.type === 'textarea' || field?.type === 'checkbox' ? 'col-span-2' : ''
                    }
                  >
                    <FormField
                      field={field}
                      onImageChange={
                        field.id === 'store_logo'
                          ? handleImageChange
                          : field.id === 'store_banner'
                          ? handleBannerChange
                          : undefined
                      }
                      logoPreview={field.id === 'store_logo' ? logoPreview : undefined}
                      bannerPreview={field.id === 'store_banner' ? bannerPreview : undefined}
                      defaultBanner={field.id === 'store_banner' ? defaultBanner : undefined}
                      showPassword={field.id === 'store_password' ? showPassword : false}
                      showConfirmPassword={
                        field.id === 'confirmPassword' ? showConfirmPassword : false
                      }
                      onTogglePassword={
                        field.id === 'store_password'
                          ? () => setShowPassword(!showPassword)
                          : undefined
                      }
                      onToggleConfirmPassword={
                        field.id === 'confirmPassword'
                          ? () => setShowConfirmPassword(!showConfirmPassword)
                          : undefined
                      }
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
        <div className="flex justify-center pt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
            type="submit"
          >
            Submit Registration
          </motion.button>
        </div>
      </form>
    </div>
  );
};

// Account type selection component
const AccountTypeSelection: FC<AccountTypeSelectionProps> = ({ accountType, setAccountType }) => (
  <div className="col-span-2 flex flex-col sm:flex-row gap-4">
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex-1 p-4 rounded-lg border-2 cursor-pointer ${
        accountType === 'individual' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
      }`}
      onClick={() => setAccountType('individual')}
    >
      <div className="flex items-start">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            accountType === 'individual' ? 'border-yellow-400' : 'border-gray-400'
          }`}
        >
          {accountType === 'individual' && (
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">Individual Seller Account</h3>
          <p className="text-gray-600 text-sm mt-1">
            Best for new sellers or those with low sales volume
          </p>
        </div>
      </div>
    </motion.div>
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex-1 p-4 rounded-lg border-2 cursor-pointer ${
        accountType === 'professional' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
      }`}
      onClick={() => setAccountType('professional')}
    >
      <div className="flex items-start">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            accountType === 'professional' ? 'border-yellow-400' : 'border-gray-400'
          }`}
        >
          {accountType === 'professional' && (
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">Professional Seller Account</h3>
          <p className="text-gray-600 text-sm mt-1">
            Suitable for businesses or individuals with higher sales volumes
          </p>
        </div>
      </div>
    </motion.div>
  </div>
);

// Generic form field component
const FormField: FC<FormFieldProps> = ({
  field,
  onImageChange,
  logoPreview,
  bannerPreview,
  defaultBanner,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
}) => {
  const { label, type, id, placeholder, options, accept, text } = field;

  switch (type) {
    case 'select':
      return (
        <div className="form-control">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <select
            id={id}
            name={id}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-gray-900"
          >
            <option value="">Select {label}</option>
            {options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    case 'textarea':
      return (
        <div className="form-control">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <textarea
            id={id}
            name={id}
            rows={3}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 placeholder-gray-400 placeholder:font-normal"
          ></textarea>
        </div>
      );
    case 'file':
      return (
        <div className="form-control">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            id={id}
            name={id}
            type="file"
            accept={accept}
            onChange={onImageChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-gray-400 font-normal file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
          />

          {/* Banner Preview */}
          {id === 'store_banner' && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Banner Preview (same size as store page):
              </p>
              <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg border border-gray-300">
                <Image
                  src={bannerPreview || defaultBanner || '/web.png'}
                  alt="Store Banner Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-lg font-bold">Your Store Name</p>
                  <p className="text-sm opacity-90">Preview how your banner will look</p>
                </div>
              </div>
              {!bannerPreview && (
                <p className="text-xs text-gray-500 mt-2">
                  Default Storevia banner shown. Upload your own banner to customize.
                </p>
              )}
            </div>
          )}

          {/* Logo Preview */}
          {id === 'store_logo' && logoPreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
              <div className="relative w-32 h-32">
                <Image
                  src={logoPreview}
                  alt="Store Logo Preview"
                  fill
                  className="object-cover rounded-md border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>
      );
    case 'checkbox':
      return (
        <div className="form-control">
          <div className="flex items-center">
            <input
              id={id}
              name={id}
              type="checkbox"
              className="h-4 w-4 text-yellow-400 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
              {text}
            </label>
          </div>
        </div>
      );
    default:
      // Handle password fields with eye icons
      if (type === 'password') {
        const isStorePassword = id === 'store_password';
        const isConfirmPassword = id === 'confirmPassword';
        const passwordVisible = isStorePassword
          ? showPassword
          : isConfirmPassword
          ? showConfirmPassword
          : false;
        const toggleFunction = isStorePassword
          ? onTogglePassword
          : isConfirmPassword
          ? onToggleConfirmPassword
          : undefined;

        return (
          <div className="form-control">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id={id}
                name={id}
                placeholder={placeholder}
                className="mt-1 block w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 placeholder-gray-400 placeholder:font-normal"
              />
              {toggleFunction && (
                <button
                  type="button"
                  onClick={toggleFunction}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {passwordVisible ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        );
      }

      // Default input field
      return (
        <div className="form-control">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            id={id}
            name={id}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 placeholder-gray-400 placeholder:font-normal"
          />
        </div>
      );
  }
};

export default SellerRegistration;
