/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import useAlerts from '@/hooks/useAlerts';
import ExportModal from '@/components/ui/export-modal';
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Define Feature type for colors, sizes, and other features
type Feature = {
  type: 'color' | 'size' | 'other';
  category?: 'apparel' | 'storage' | 'custom';
  values: Array<{
    name: string;
    image?: File | string | null;
    measurements?: { chest: string; waist: string; length: string };
  }>;
};

// Define Product type
type Product = {
  product_rating: number;
  product_price: string;
  product_discount: number;
  product_name: string | undefined;
  product_image: any;
  product_id: number;
  product_stock: number
  codPrice: string;
  id: string;
  name: string;
  price: string;
  stock: number;
  description: string;
  image: string;
  discount: string;
  sale_discount: string;
  features: Feature[];
};

// Color palette (light theme only)
const COLORS = {
  primary: '#FFC107',
  secondary: '#FFF8E1',
  accent1: '#FFCA28',
  accent2: '#FF8A65',
  accent3: '#AB47BC',
  accent4: '#4DD0E1',
  grey1: '#FFFFFF',
  grey2: '#F5F5F5',
  textPrimary: '#212121',
  textSecondary: '#616161',
  border: '#E5E7EB',
  error: '#EF4444',
};

// Background gradient (light theme)
const BG_GRADIENT = 'linear-gradient(to right bottom, #FFFFFF, #FFFDE7, #FFFFFF)';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } };
const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};
const modalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.2, ease: 'easeIn' } },
};
const imagePreviewVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};
const chipVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

import React from 'react';

// Utility CSS to prevent mouse wheel changing number input values
const preventWheelChange = (e: React.WheelEvent<HTMLInputElement>) => {
  (e.target as HTMLInputElement).blur();
};

const Products = () => {
  // Remove number input spinners (scrolling) for all browsers
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Chrome, Safari, Edge, Opera */
      input[type=number]::-webkit-inner-spin-button, 
      input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      /* Firefox */
      input[type=number] {
        -moz-appearance: textfield;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [products, setProducts] = useState<Product[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const storeId = searchParams.get('shopId'); //slug

  // Initialize alert system
  const {
    error: showError,
    success: showSuccess,
    warning: showWarning,
    confirm,
    confirmDelete,
    toast,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

  useEffect(() => {
    const storedSellerId = localStorage.getItem('seller_id');
    setSellerId(storedSellerId);
  }, []);

  // const fetchProducts = useCallback(async (): Promise<void> => {
  //   if (!storeId || !sellerId) {
  //     showError(
  //       'Missing Information',
  //       'Store ID or Seller ID is missing. Please try logging in again.'
  //     );
  //     return;
  //   }
  //   try {
  //     const response = await fetch(`${baseUrl}/getProducts.php`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ seller_id: sellerId, store_id: storeId }),
  //     });
  //     const data = await response.json();
  //     if (Array.isArray(data) && data.length > 0) {
  //       // Normalize description in case backend returns `product_description`
  //       const normalized = (data as any[]).map((p: any) => ({
  //         ...p,
  //         description: p?.description ?? p?.product_description ?? '',
  //       }));
  //       setProducts(normalized as unknown as Product[]);
  //     } else {
  //       setProducts([]);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //     showError('Failed to Load Products', 'Failed to fetch products. Please try again later.');
  //   }
  // }, [storeId, sellerId, showError]);


  const fetchProducts = useCallback(async (): Promise<void> => {
  if (!sellerId) {
    showError(
      'Missing Information',
      'Seller ID is missing. Please try logging in again.'
    );
    return;
  }

  try {
    // Fetch products using sellerId
    const response = await axios.get(`http://127.0.0.1:8000/api/seller/${sellerId}/products`);

    // Handle response data
    const productsData: Product[] = response.data;
    console.log('Fetched products:', productsData);
    if (Array.isArray(productsData) && productsData.length > 0) {
      // Normalize product description
      const normalized = productsData.map((p: any) => ({
        ...p,
        description: p?.description ?? p?.product_description ?? '',
      }));
      setProducts(normalized);  // Update only the products
    } else {
      setProducts([]);  // No products, clear the list
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    showError('Failed to Load Products', 'Failed to fetch products. Please try again later.');
    setProducts([]);  // In case of error, clear the products list
  }
}, [sellerId, showError]);

  useEffect(() => {
    if (storeId && sellerId) {
      fetchProducts();
    }
  }, [storeId, sellerId, fetchProducts]);

  const [newProduct, setNewProduct] = useState<{
    codPrice: string;
    name: string;
    price: string;
    description: string;
    stock: string;
    images: (File | string | null)[];
    thumbnail: File | string | null;
    discount: string;
    saleDiscount: string;
    features: Feature[];
    sale: string;
    tags: string[];
  }>({
    codPrice: '',
    name: '',
    price: '',
    description: '',
    stock: '',
    images: [],
    thumbnail: null,
    discount: '',
    saleDiscount: '',
    features: [],
    tags: [],
    sale: '',
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailError, setThumbnailError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [summaryStatsData, setSummaryStatsData] = useState({
    total_products: 0,
    out_of_stock: 0,
    discounted_products: 0,
    total_stock_value: 0,
  });
  const [imageError, setImageError] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tagError, setTagError] = useState<string>('');

  const fetchSummaryStats = useCallback(async () => {
    if (!storeId || !sellerId) return;
    try {
      const response = await fetch(`${baseUrl}/getProductStats.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: sellerId, store_id: storeId }),
      });
      const data = await response.json();
      console.log('Summary data:', data);
      setSummaryStatsData(data);
    } catch (error) {
      console.error('Error fetching summary stats:', error);
    }
  }, [storeId, sellerId]);

  useEffect(() => {
    if (storeId && sellerId) {
      fetchSummaryStats();
    }
  }, [storeId, sellerId, fetchSummaryStats]);

  const summaryStats = [
    {
      title: 'Total Products',
      value: summaryStatsData.total_products,
      change: 5.0,
      icon: '🛍️',
      color: COLORS.primary,
      trend: 'up',
    },
    {
      title: 'Out of Stock',
      value: summaryStatsData.out_of_stock,
      change: -3.2,
      icon: '⚠️',
      color: COLORS.secondary,
      trend: 'down',
    },
    {
      title: 'Discounted Products',
      value: summaryStatsData.discounted_products,
      change: 2.5,
      icon: '🏷️',
      color: COLORS.accent1,
      trend: 'up',
    },
    {
      title: 'Total Stock Value',
      value: summaryStatsData.total_stock_value,
      prefix: 'Rs. ',
      change: 10.0,
      icon: '💰',
      color: COLORS.accent3,
      trend: 'up',
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;

    if (name === 'images' && files) {
      const newFiles = Array.from(files);

      if (newProduct.images.length + newFiles.length > 5) {
        setImageError('You can upload a maximum of 5 images.');
        return;
      }

      setImageError('');

      // Create file paths for new images (without base URL)
      const newImages = [...newProduct.images, ...newFiles];

      // Create previews (blob URLs) for new images
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setNewProduct((prev) => ({
        ...prev,
        images: newImages,
      }));

      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else if (name === 'thumbnail' && files && files[0]) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setThumbnailError('Please select a valid image file.');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setThumbnailError('Thumbnail image must be less than 5MB.');
        return;
      }

      setThumbnailError('');

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      setNewProduct((prev) => ({
        ...prev,
        thumbnail: file,
      }));

      setThumbnailPreview(previewUrl);
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewProduct((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleRemoveThumbnail = () => {
    setNewProduct((prev) => ({
      ...prev,
      thumbnail: null,
    }));
    setThumbnailPreview('');
    setThumbnailError('');
  };

  const handleAddTag = () => {
    if (newProduct.tags.length >= 5) {
      setTagError('You can add a maximum of 5 tags.');
      return;
    }
    if (!tagInput.trim()) return;
    setNewProduct((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput('');
    setTagError('');
  };

  const handleRemoveTag = (index: number) => {
    setNewProduct((prev) => {
      const newTags = [...prev.tags];
      newTags.splice(index, 1);
      return { ...prev, tags: newTags };
    });
    setTagError('');
  };

  // Feature handling
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [lockedSizeCategory, setLockedSizeCategory] = useState<
    'apparel' | 'storage' | 'custom' | null
  >(null);
  const [newFeatureValue, setNewFeatureValue] = useState({
    name: '',
    image: null as File | string | null,
    measurements: { chest: '', waist: '', length: '' },
  });
  const [featureImagePreview, setFeatureImagePreview] = useState<string | null>(null);
  const [selectedSizeCategory, setSelectedSizeCategory] = useState<
    'apparel' | 'storage' | 'custom'
  >('apparel');
  const [isManualStorage, setIsManualStorage] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const apparelSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const storageSizes = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const [saleEndDate, setSaleEndDate] = useState<string | undefined>(undefined);

  const handleSelectFeature = (type: 'color' | 'size' | 'other', valueIndex?: number) => {
    const existingFeature = newProduct.features.find((f) => f.type === type);
    if (existingFeature) {
      setSelectedFeature(existingFeature);
      if (
        valueIndex !== undefined &&
        valueIndex >= 0 &&
        valueIndex < existingFeature.values.length
      ) {
        const selectedValue = existingFeature.values[valueIndex];
        setNewFeatureValue({
          name: selectedValue.name,
          image: selectedValue.image || null,
          measurements: selectedValue.measurements || { chest: '', waist: '', length: '' },
        });
        setFeatureImagePreview(
          selectedValue.image
            ? typeof selectedValue.image === 'string'
              ? selectedValue.image
              : URL.createObjectURL(selectedValue.image)
            : null
        );
        setEditingIndex(valueIndex);
      } else {
        setNewFeatureValue({
          name: '',
          image: null,
          measurements: { chest: '', waist: '', length: '' },
        });
        setFeatureImagePreview(null);
        setEditingIndex(null);
      }
    } else {
      const newFeature: Feature = {
        type,
        category: type === 'size' ? selectedSizeCategory : undefined,
        values: [],
      };
      setNewProduct((prev) => ({ ...prev, features: [...prev.features, newFeature] }));
      setSelectedFeature(newFeature);
      setNewFeatureValue({
        name: '',
        image: null,
        measurements: { chest: '', waist: '', length: '' },
      });
      setFeatureImagePreview(null);
      setEditingIndex(null);
    }
    if (type === 'size') setSelectedSizeCategory(lockedSizeCategory || 'apparel');
  };

  const handleAddFeatureValue = () => {
    if (!selectedFeature) return;
    if (!newFeatureValue.name && selectedFeature.type !== 'size') return;
    if (
      selectedFeature.type === 'size' &&
      selectedSizeCategory === 'apparel' &&
      (!newFeatureValue.measurements.chest ||
        !newFeatureValue.measurements.waist ||
        !newFeatureValue.measurements.length)
    )
      return;
    if (selectedFeature.type === 'size' && !newFeatureValue.name) return;

    setNewProduct((prev) => {
      const featureIndex = prev.features.findIndex((f) => f.type === selectedFeature.type);
      if (featureIndex >= 0) {
        const updatedFeatures = [...prev.features];
        if (
          editingIndex !== null &&
          editingIndex >= 0 &&
          editingIndex < updatedFeatures[featureIndex].values.length
        ) {
          updatedFeatures[featureIndex].values[editingIndex] = {
            name: newFeatureValue.name,
            image: selectedFeature.type === 'color' ? newFeatureValue.image : null,
            measurements:
              selectedFeature.type === 'size' && selectedSizeCategory === 'apparel'
                ? { ...newFeatureValue.measurements }
                : undefined,
          };
        } else {
          const existingValue = updatedFeatures[featureIndex].values.find(
            (v) => v.name === newFeatureValue.name
          );
          if (!existingValue) {
            updatedFeatures[featureIndex].values.push({
              name: newFeatureValue.name,
              image: selectedFeature.type === 'color' ? newFeatureValue.image || null : null,
              measurements:
                selectedFeature.type === 'size' && selectedSizeCategory === 'apparel'
                  ? { ...newFeatureValue.measurements }
                  : undefined,
            });
          }
        }
        updatedFeatures[featureIndex].category =
          selectedFeature.type === 'size' ? selectedSizeCategory : undefined;
        setSelectedFeature(updatedFeatures[featureIndex]);
        // Lock the size category after adding the first size
        if (selectedFeature.type === 'size' && !lockedSizeCategory) {
          setLockedSizeCategory(selectedSizeCategory);
        }
        return { ...prev, features: updatedFeatures };
      }
      return prev;
    });

    setNewFeatureValue({
      name: '',
      image: null,
      measurements: { chest: '', waist: '', length: '' },
    });
    setFeatureImagePreview(null);
    setEditingIndex(null);
  };

  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files[0]) {
      setNewFeatureValue((prev) => ({ ...prev, image: files[0] }));
      setFeatureImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleRemoveFeatureValue = (type: 'color' | 'size' | 'other', index: number): void => {
    setNewProduct((prev) => {
      const featureIndex = prev.features.findIndex((f) => f.type === type);
      if (featureIndex >= 0) {
        const updatedFeatures = [...prev.features];
        updatedFeatures[featureIndex].values.splice(index, 1);
        if (updatedFeatures[featureIndex].values.length === 0) {
          updatedFeatures.splice(featureIndex, 1);
          if (selectedFeature?.type === type) setSelectedFeature(null);
          // Unlock size category if all sizes are removed
          if (type === 'size') setLockedSizeCategory(null);
        } else if (selectedFeature?.type === type && index === editingIndex) {
          setSelectedFeature(updatedFeatures[featureIndex]);
          setEditingIndex(null);
        }
        return { ...prev, features: updatedFeatures };
      }
      return prev;
    });
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);
    formData.append('store_id', String(storeId));
    formData.append('seller_id', String(sellerId));

    if (newProduct.discount) formData.append('discount', newProduct.discount);

    // Add thumbnail image
    if (newProduct.thumbnail && newProduct.thumbnail instanceof File) {
      formData.append('thumbnail', newProduct.thumbnail);
    }

    newProduct.images.forEach((image) => {
      if (image instanceof File) formData.append('images[]', image);
    });

    formData.append('tags', JSON.stringify(newProduct.tags));
    console.log('Tags:', JSON.stringify(newProduct.tags));

    const features = newProduct.features.map((feature, featureIndex) => {
      return {
        type: feature.type,
        category: feature.category || null,
        values: feature.values.map((value, valueIndex) => {
          let imageKey = null;

          if (value.image instanceof File) {
            const imageKeyString = `feature_images[${featureIndex}][${valueIndex}]`;
            formData.append(imageKeyString, value.image);
            imageKey = imageKeyString;
          }

          return {
            name: value.name,
            image: imageKey,
          };
        }),
      };
    });
    console.log('Features:', features);

    formData.append('features', JSON.stringify(features));

    console.log('FormData Contents:');
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    formData.append('sales_state', saleState);
    formData.append('sale_end_date', saleEndDate ?? '');
    formData.append('sale_discount', newProduct.saleDiscount ?? '');
    formData.append('cod_price', newProduct.codPrice ? String(newProduct.codPrice) : '0');

    try {
      const response = await fetch(`${baseUrl}/AddProducts.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      resetForm();
      fetchProducts();
      fetchSummaryStats();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      showWarning(
        'Missing Required Fields',
        'Please fill in all required fields (Name, Price, Stock).'
      );
      return;
    }
    if (!storeId || !sellerId || !selectedProduct?.id) {
      showError('Missing Information', 'Missing store, seller ID, or product ID.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id', selectedProduct.id);
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('description', newProduct.description);
      formData.append('stock', newProduct.stock);
      formData.append('store_id', storeId);
      formData.append('seller_id', sellerId);
      formData.append('discount', newProduct.discount || '0');

      // Add thumbnail image if it's a new file
      if (newProduct.thumbnail && newProduct.thumbnail instanceof File) {
        formData.append('thumbnail', newProduct.thumbnail);
      }

      newProduct.images.forEach((image) => {
        if (image instanceof File) formData.append(`images[]`, image);
      });
      formData.append('tags', JSON.stringify(newProduct.tags));

      const features = newProduct.features.map((feature, featureIndex) => {
        return {
          type: feature.type,
          category: feature.category || null,
          values: feature.values.map((value, valueIndex) => {
            let imageKey = null;

            if (value.image instanceof File) {
              const imageKeyString = `feature_images[${featureIndex}][${valueIndex}]`;
              formData.append(imageKeyString, value.image);
              imageKey = imageKeyString;
            }

            return {
              name: value.name,
              image: imageKey,
            };
          }),
        };
      });
      console.log('Features:', features);
      console.log('sateValue :', saleState);

      formData.append('sales_state', saleState);
      formData.append('sale_end_date', saleEndDate ?? '');
      formData.append('sale_discount', newProduct.saleDiscount ?? '');

      formData.append('features', JSON.stringify(features));

      console.log(formData.getAll('images[]'));
      console.log(formData.getAll('tags[]'));

      const response = await fetch(`${baseUrl}/editProduct.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      console.log('Update', result);
      if (result.status === 'success') {
        showSuccess('Product Updated', 'Product updated successfully!');
        resetForm();
        fetchProducts();
        fetchSummaryStats();
      } else {
        showError('Update Failed', 'Failed to update product: ' + result.message);
      }
    } catch (error) {
      console.error('Error editing product:', error);
      showError('Update Error', 'An error occurred. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    confirmDelete(
      'Delete Product',
      'Are you sure you want to delete this product? This action cannot be undone.',
      async () => {
        try {
          const formData = new FormData();
          formData.append('id', id);
          const response = await fetch(`${baseUrl}/deleteProduct.php`, {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (result.status === 'success') {
            setProducts((prev) => prev.filter((product) => product.id !== id));
            toast.success('Product Deleted', 'Product deleted successfully.');
            fetchSummaryStats();
          } else {
            showError('Delete Failed', 'Failed to delete product: ' + result.message);
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          showError('Delete Error', 'An error occurred. Please try again.');
        }
      }
    );
  };

  const handleExportProducts = () => {
    if (!products.length) {
      showError('Export Error', 'No products available to export.');
      return;
    }
    setShowExportModal(true);
  };

  const performProductsExport = async () => {
    setIsExporting(true);

    try {
      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Define CSV headers
      const headers = [
        'Product ID',
        'Name',
        'Price',
        'Stock',
        'Discount (%)',
        'Sale Discount (%)',
        'Description',
        'Features',
      ];

      // Map products to CSV rows
      const rows = products.map((product) => [
        product.id,
        product.name,
        product.price,
        product.codPrice,
        product.stock,
        product.discount || '0',
        product.sale_discount || '0',
        product.description,
        product.features
          ?.map((feature) =>
            feature.values.map((value) => `${feature.type}: ${value.name}`).join('; ')
          )
          .join(' | ') || 'No features',
      ]);

      // Create CSV content
      const csvContent = [headers, ...rows]
        .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message
      showSuccess('Export Successful', 'Products exported successfully!');
      setShowExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
      showError('Export Failed', 'Failed to export products. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const fetchproductDetails = async (id: string): Promise<any | null> => {
    const formData = new FormData();
    formData.append('product_id', id);

    try {
      const response = await fetch(`${baseUrl}/getProductDetails.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.status === 'success' && result.data) {
        return result.data; // return product object with images
      } else {
        console.error('Fetch error:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      return null;
    }
  };

  const [existingTags, setExistingTags] = useState<string[]>([]);

  type ExistingFeature = {
    value: string;
    image_path: string;
    feature_type_id?: number;
    feature_name?: string;
    feature_value_id?: string;
  };
  const [existingFeatures, setExistingFeatures] = useState<ExistingFeature[]>([]);
  const [saleState, setSaleState] = useState<'1' | '0'>('0');

  const updateSaleState = (isOnSale: boolean) => {
    setSaleState(isOnSale ? '1' : '0');

    setNewProduct((prev) => ({
      ...prev,
      sale: isOnSale ? '1' : '0',
    }));

    console.log('Sale Status: ', isOnSale ? '1' : '0');
  };

  const handleSaleState = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSaleState(e.target.checked);
    console.log(e.target.checked); // true or false
  };
  const handleAddSaleEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaleEndDate(e.target.value);
  };

  const handleSaleDiscount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewProduct((prev) => ({ ...prev, saleDiscount: value }));
  };

  const handleEditClick = async (product: Product) => {
    console.log('Editing product:', product.id);
    const details = await fetchproductDetails(product.id);
    console.log('Product details inside handelEdit:', details);

    const imagesWithBaseUrl = details.images.map((img: { id: string; path: string }) => {
      const fullPath = img.path.startsWith('http') ? img.path : `${baseUrl}/${img.path}`;
      return { id: img.id, path: fullPath };
    });
    console.log('feature:', details.features);
    setSaleState(details.is_on_sale);
    setSelectedProduct(product);
    setExistingTags(details.tags);
    setExistingFeatures(details.features);
    setNewProduct({
      //codPrice: product.codPrice.replace('Rs. ', ''),
      name: product.name,
      //price: product.price.replace('Rs. ', ''),
      codPrice: product.codPrice ? product.codPrice.toString() : '',
      price: product.price ? product.price.toString() : '',

      description: product.description,
      stock: product.stock.toString(),
      images: details.images,
      thumbnail: details.thumbnail || null,
      discount: product.discount,
      saleDiscount: details.sale_discount,
      features: product.features || [],
      tags: [],
      sale: details.is_on_sale,
    });
    setImagePreviews(imagesWithBaseUrl);

    // Set thumbnail preview if exists
    if (details.thumbnail) {
      const thumbnailUrl = details.thumbnail.startsWith('http')
        ? details.thumbnail
        : `${baseUrl}/${details.thumbnail}`;
      setThumbnailPreview(thumbnailUrl);
    } else {
      setThumbnailPreview('');
    }

    console.log('Image previews:', imagesWithBaseUrl);
    handleAddTag();
    setIsEditMode(true);
    setIsModalOpen(true);
    // Set lockedSizeCategory based on existing size feature
    const sizeFeature = product.features.find((f) => f.type === 'size');
    if (sizeFeature && sizeFeature.category) {
      setLockedSizeCategory(sizeFeature.category as 'apparel' | 'storage' | 'custom');
      setSelectedSizeCategory(sizeFeature.category as 'apparel' | 'storage' | 'custom');
    }
  };

  const resetForm = () => {
    setNewProduct({
      codPrice: '',
      name: '',
      price: '',
      description: '',
      stock: '',
      images: [],
      thumbnail: null,
      discount: '',
      saleDiscount: '',
      features: [],
      tags: [],
      sale: '',
    });
    setImagePreviews([]);
    setThumbnailPreview('');
    setImageError('');
    setThumbnailError('');
    setTagInput('');
    setTagError('');
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedProduct(null);
    setFocusedField(null);
    setSelectedFeature(null);
    setNewFeatureValue({
      name: '',
      image: null,
      measurements: { chest: '', waist: '', length: '' },
    });
    setFeatureImagePreview(null);
    setSelectedSizeCategory('apparel');
    setIsManualStorage(false);
    setEditingIndex(null);
    setLockedSizeCategory(null); // Reset locked size category
  };

  const getImageName = (image: File | string | null) => {
    if (!image) return '';
    if (image instanceof File) return image.name;
    if (typeof image === 'string') {
      const segments = image.split('/');
      return segments[segments.length - 1] || 'image';
    }
    return '';
  };

  const removeImageFromDB = async (imageId: string) => {
    const formData = new FormData();
    formData.append('image_id', imageId);
    try {
      const response = await fetch(`${baseUrl}/removeImage.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        console.log('Image removed successfully:', imageId);
      } else {
        console.error('Failed to remove image:', result.message);
      }
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleRemoveFeatureById = (id: number | string) => {
    setExistingFeatures((prevFeatures) =>
      prevFeatures.filter((feature) => feature.feature_value_id !== id)
    );
  };

  const handleRemoveFeatureValueFromDB = async (value_id: string) => {
    const formData = new FormData();
    formData.append('fearue_value_id', value_id);
    try {
      const response = await fetch(`${baseUrl}/removeFeature.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 'success') {
        console.log('Feature removed successfully:', value_id);
        handleRemoveFeatureById(value_id);
      } else {
        console.error('Failed to remove feature:', result.message);
      }
    } catch (error) {
      console.error('Error removing feature:', error);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br flex relative overflow-hidden font-poppins"
      style={{ background: BG_GRADIENT }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={fadeIn} className="flex-1 p-6 lg:p-8 z-10">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center mb-8"
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-500">Manage your store&apos;s product catalog</p>
            </div>
          </motion.div>
          <motion.div className="flex items-center space-x-4 mt-4 md:mt-0" variants={itemVariants}>
            <motion.button
              onClick={handleExportProducts}
              className="flex items-center px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all bg-gradient-to-r from-green-500 to-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-5 w-5 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="font-semibold text-white">Export Products</span>
            </motion.button>
            <motion.button
              onClick={() => {
                setIsEditMode(false);
                setNewProduct({
                  codPrice: '',
                  name: '',
                  price: '',
                  description: '',
                  stock: '',
                  images: [],
                  thumbnail: null,
                  discount: '',
                  saleDiscount: '',
                  features: [],
                  tags: [],
                  sale: '',
                });
                setImagePreviews([]);
                setThumbnailPreview('');
                setIsModalOpen(true);
              }}
              className="flex items-center px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-5 w-5 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-semibold text-white">Add Product</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          {summaryStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
                style={{ backgroundColor: stat.color }}
              />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                >
                  <span>{stat.icon}</span>
                </motion.div>
              </div>
              <div className="flex flex-col">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.prefix || ''}
                  {stat.value.toLocaleString('en-US', {
                    minimumFractionDigits: stat.prefix ? 2 : 0,
                    maximumFractionDigits: stat.prefix ? 2 : 0,
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-900">Product List</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Discount (%)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                  {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Features
                  </th> */}
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.product_id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-yellow-50 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <Image
                          src={`${baseUrl}/${product.product_image}` || '/placeholder.svg'}
                          alt={product.product_name}
                          width={40}
                          height={40}
                          className="object-cover rounded"
                          priority={index < 3}
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-700">{product.product_name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="max-w-xs line-clamp-2">{product.description || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{product.product_price}</td>
                      <td className="px-6 py-4 text-gray-700">{product.product_discount || '-'}</td>
                      <td className="px-6 py-4 text-gray-700">{product.product_stock}</td>
                      {/* <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {product.features?.length > 0 ? (
                            product.features.map((feature, fIndex) =>
                              feature.values.map((value, vIndex) => (
                                <motion.div
                                  key={`${fIndex}-${vIndex}`}
                                  variants={chipVariants}
                                  className="flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-700 bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                  {feature.type === 'color' && (
                                    <span
                                      className="w-4 h-4 rounded-full mr-1 border border-gray-300"
                                      style={{
                                        background: value.image
                                          ? `url(${
                                              typeof value.image === 'string'
                                                ? value.image
                                                : URL.createObjectURL(value.image)
                                            })`
                                          : '#ccc',
                                        backgroundSize: 'cover',
                                      }}
                                    />
                                  )}
                                  {feature.type === 'size' && <span className="mr-1">📏</span>}
                                  {feature.type === 'other' && <span className="mr-1">⚙️</span>}
                                  {value.name}
                                  {feature.type === 'color' && value.image && (
                                    <span className="ml-1 text-gray-500 text-xs">
                                      (image: {getImageName(value.image)})
                                    </span>
                                  )}
                                  {feature.type === 'size' && value.measurements && (
                                    <span className="ml-1 text-gray-500">
                                      ({value.measurements.chest}cm, {value.measurements.waist}cm,{' '}
                                      {value.measurements.length}cm)
                                    </span>
                                  )}
                                </motion.div>
                              ))
                            )
                          ) : (
                            <span className="text-gray-500 text-xs">No features</span>
                          )}
                        </div>
                      </td> */}
                      <td className="px-6 py-4 flex space-x-2">
                        <motion.button
                          onClick={() => handleEditClick(product)}
                          className="text-yellow-500 hover:text-yellow-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 top-4 bottom-4 z-50 overflow-hidden flex items-center justify-center"
              onClick={() => resetForm()}
            >
              {/* Backdrop with blur effect */}
              <motion.div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Modal container */}
              <motion.div
                className="relative w-full h-[88vh] max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
                variants={{
                  hidden: { opacity: 0, y: 100, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: 100, scale: 0.95 },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 300,
                  duration: 0.3,
                }}
              >
                {/* Header with gradient background */}
                <motion.div
                  className="relative px-6 py-4 flex justify-between items-center border-b"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.accent1}30)`,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <motion.h2
                    className="text-2xl font-bold text-gray-900 flex items-center"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {isEditMode ? (
                      <motion.div className="flex items-center">
                        <motion.span
                          className="w-8 h-8 mr-3 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                          }}
                        >
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </motion.span>
                        Edit Product
                      </motion.div>
                    ) : (
                      <motion.div className="flex items-center">
                        <motion.span
                          className="w-8 h-8 mr-3 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                          }}
                        >
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </motion.span>
                        Add New Product
                      </motion.div>
                    )}
                  </motion.h2>

                  <motion.button
                    onClick={resetForm}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg
                      className="h-6 w-6 text-gray-500"
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
                  </motion.button>
                </motion.div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <form
                    onSubmit={isEditMode ? handleEditProduct : handleAddProduct}
                    className="space-y-8"
                  >
                    {/* Form sections with staggered animation */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.07,
                          },
                        },
                      }}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Basic Information Section */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 mb-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                            <svg
                              className="h-3 w-3 text-yellow-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </span>
                          Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Product Name *
                            </label>
                            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                              <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200"
                                placeholder="Enter product name"
                                required
                              />
                              <AnimatePresence>
                                {focusedField === 'name' && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute right-3 top-3 text-yellow-500"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                      />
                                    </svg>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Price *
                            </label>
                            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                              <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('price')}
                                onBlur={() => setFocusedField(null)}
                                step="0.01"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200 no-wheel"
                                placeholder="Enter price"
                                required
                                onWheel={preventWheelChange}
                              />
                              <AnimatePresence>
                                {focusedField === 'price' && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute right-3 top-3 text-yellow-500"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Cash on Delivary Price *
                            </label>
                            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                              <input
                                type="number"
                                name="codPrice"
                                value={newProduct.codPrice}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('codPrice')}
                                onBlur={() => setFocusedField(null)}
                                step="0.01"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200 no-wheel"
                                placeholder="Enter price"
                                required
                                onWheel={preventWheelChange}
                              />
                              <AnimatePresence>
                                {focusedField === 'codPrice' && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute right-3 top-3 text-yellow-500"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Discount (%)
                            </label>
                            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                              <input
                                type="number"
                                name="discount"
                                value={newProduct.discount}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('discount')}
                                onBlur={() => setFocusedField(null)}
                                min="0"
                                max="100"
                                step="1"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200 no-wheel"
                                placeholder="Enter discount"
                                onWheel={preventWheelChange}
                              />
                              <AnimatePresence>
                                {focusedField === 'discount' && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute right-3 top-3 text-yellow-500"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Stock *
                            </label>
                            <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                              <input
                                type="number"
                                name="stock"
                                value={newProduct.stock}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('stock')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200 no-wheel"
                                placeholder="Enter stock quantity"
                                required
                                onWheel={preventWheelChange}
                              />
                              <AnimatePresence>
                                {focusedField === 'stock' && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute right-3 top-3 text-yellow-500"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                      />
                                    </svg>
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>
                        </div>

                        <div className="mt-6 space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                            <textarea
                              name="description"
                              value={newProduct.description}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('description')}
                              onBlur={() => setFocusedField(null)}
                              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200"
                              rows={4}
                              placeholder="Enter product description"
                            />
                            <AnimatePresence>
                              {focusedField === 'description' && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="absolute right-3 top-3 text-yellow-500"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 6h16M4 12h16M4 18h7"
                                    />
                                  </svg>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mt-5">
                            Set Item to Super Deal
                          </label>

                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="is_on_sale"
                              id="sale-checkbox"
                              className="mr-3 mt-5"
                              checked={saleState === '1'}
                              onChange={handleSaleState}
                            />
                            <span className="text-lg font-medium text-gray-700">Put on Sale</span>
                          </label>
                        </div>

                        <motion.div whileFocus={{ scale: 1.01 }} className="relative mt-10">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Set Sale End Date
                          </label>
                          <input
                            type="datetime-local"
                            name="date_time"
                            value={saleEndDate}
                            onChange={handleAddSaleEndDate}
                            onFocus={() => setFocusedField('date_time')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              saleState === '1'
                                ? 'border-gray-200'
                                : 'border-gray-100 opacity-50 backdrop-blur-sm cursor-not-allowed'
                            } focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200`}
                            placeholder="Select date and time"
                            required={saleState === '1'}
                            disabled={saleState !== '1'}
                          />
                        </motion.div>
                        <div className="space-y-2 mt-10">
                          <label className="block text-sm font-medium text-gray-700">
                            Special Sale Discount (%)
                          </label>
                          <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                            <input
                              type="number"
                              name="saleDiscount"
                              value={newProduct.saleDiscount}
                              onChange={handleSaleDiscount}
                              onFocus={() => setFocusedField('saleDiscount')}
                              onBlur={() => setFocusedField(null)}
                              min="0"
                              max="100"
                              step="1"
                              className={`w-full px-4 py-3 rounded-lg border ${
                                saleState === '1'
                                  ? 'border-gray-200'
                                  : 'border-gray-100 opacity-50 backdrop-blur-sm cursor-not-allowed'
                              } focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200 no-wheel`}
                              placeholder="Enter sale discount"
                              required={saleState === '1'}
                              disabled={saleState !== '1'}
                              onWheel={preventWheelChange}
                            />
                            <AnimatePresence>
                              {focusedField === 'discount' && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="absolute right-3 top-3 text-yellow-500"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Thumbnail Section */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 mb-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                            <svg
                              className="h-3 w-3 text-indigo-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </span>
                          Product Thumbnail/Cover Image
                        </h3>

                        <div className="space-y-4">
                          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all hover:border-yellow-400">
                            <input
                              type="file"
                              name="thumbnail"
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('thumbnail')}
                              onBlur={() => setFocusedField(null)}
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="mt-1 text-sm text-gray-600">
                                Drag and drop a thumbnail image here, or click to select
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                PNG, JPG, GIF up to 5MB - This will be the main product image
                              </p>
                            </div>
                          </div>

                          {thumbnailError && (
                            <motion.p
                              className="text-red-500 text-sm"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {thumbnailError}
                            </motion.p>
                          )}

                          {/* Thumbnail Preview */}
                          <AnimatePresence>
                            {thumbnailPreview && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4"
                              >
                                <div className="relative inline-block">
                                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                                    <Image
                                      src={thumbnailPreview}
                                      alt="Thumbnail preview"
                                      fill
                                      className="object-cover"
                                      sizes="128px"
                                    />
                                    <motion.button
                                      type="button"
                                      onClick={handleRemoveThumbnail}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <svg
                                        className="h-3 w-3"
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
                                    </motion.button>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">Main product image</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Images Section */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 mb-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                            <svg
                              className="h-3 w-3 text-purple-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </span>
                          Product Images
                        </h3>

                        <div className="space-y-4">
                          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all hover:border-yellow-400">
                            <input
                              type="file"
                              name="images"
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('images')}
                              onBlur={() => setFocusedField(null)}
                              accept="image/*"
                              multiple
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="mt-1 text-sm text-gray-600">
                                Drag and drop images here, or click to select files
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                PNG, JPG, GIF up to 5 files
                              </p>
                            </div>
                          </div>

                          {imageError && (
                            <motion.p
                              className="text-red-500 text-sm"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {imageError}
                            </motion.p>
                          )}

                          <AnimatePresence>
                            {imagePreviews.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4"
                              >
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                                <motion.div
                                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                                  variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                      opacity: 1,
                                      transition: {
                                        staggerChildren: 0.05,
                                      },
                                    },
                                  }}
                                  initial="hidden"
                                  animate="visible"
                                >
                                  {imagePreviews.map((preview, index) => (
                                    <motion.div
                                      onClick={() => {
                                        const imagePreview = preview as any;
                                        if (imagePreview.id) {
                                          confirmDelete(
                                            'Delete Image',
                                            'Are you sure you want to delete this image?',
                                            () => removeImageFromDB(imagePreview.id)
                                          );
                                        } else {
                                          handleRemoveImage(index);
                                        }
                                      }}
                                      key={index}
                                      className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                                      variants={{
                                        hidden: { opacity: 0, scale: 0.8 },
                                        visible: { opacity: 1, scale: 1 },
                                      }}
                                      whileHover={{ scale: 1.05, rotate: 1 }}
                                    >
                                      <Image
                                        src={
                                          typeof preview === 'string'
                                            ? preview
                                            : (preview as any).path || preview
                                        }
                                        alt={`Preview ${index + 1}`}
                                        width={120}
                                        height={120}
                                        className="w-full h-24 object-cover"
                                      />
                                      <motion.div
                                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                      >
                                        <motion.button
                                          type="button"
                                          onClick={() => handleRemoveImage(index)}
                                          className="p-1 bg-red-500 text-white rounded-full"
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <svg
                                            className="h-4 w-4"
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
                                        </motion.button>
                                      </motion.div>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Tags Section */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 mb-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <svg
                              className="h-3 w-3 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </span>
                          Product Tags
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <motion.div whileFocus={{ scale: 1.01 }} className="relative flex-1">
                              <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                  }
                                }}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-gray-50 transition-all duration-200"
                                placeholder="Enter a tag and press Enter (max 5)"
                              />
                              <AnimatePresence>
                                {tagInput && (
                                  <motion.button
                                    type="button"
                                    onClick={() => setTagInput('')}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                  >
                                    <svg
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
                                  </motion.button>
                                )}
                              </AnimatePresence>
                            </motion.div>

                            <motion.button
                              type="button"
                              onClick={handleAddTag}
                              className="px-4 py-3 rounded-lg text-sm font-semibold text-white shadow-md flex items-center"
                              style={{
                                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                              }}
                              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              Add Tag
                            </motion.button>
                          </div>

                          {tagError && (
                            <motion.p
                              className="text-red-500 text-sm"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {tagError}
                            </motion.p>
                          )}

                          <AnimatePresence>
                            {(existingTags.length > 0 || newProduct.tags.length > 0) && (
                              <motion.div
                                className="flex flex-wrap gap-2 mt-3"
                                variants={{
                                  hidden: { opacity: 0 },
                                  visible: {
                                    opacity: 1,
                                    transition: {
                                      staggerChildren: 0.05,
                                    },
                                  },
                                }}
                                initial="hidden"
                                animate="visible"
                              >
                                {/* Existing tags - not removable */}
                                {existingTags.map((tag, index) => (
                                  <motion.div
                                    key={`old-${index}`}
                                    className="flex items-center bg-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-500 shadow-inner cursor-not-allowed"
                                    variants={{
                                      hidden: { opacity: 0, scale: 0.8, x: -20 },
                                      visible: { opacity: 1, scale: 1, x: 0 },
                                    }}
                                    layout
                                  >
                                    <span className="mr-1">#</span>
                                    {tag}
                                  </motion.div>
                                ))}

                                {/* New tags - removable */}
                                {newProduct.tags.map((tag, index) => (
                                  <motion.div
                                    key={`new-${index}`}
                                    className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-sm"
                                    variants={{
                                      hidden: { opacity: 0, scale: 0.8, x: -20 },
                                      visible: { opacity: 1, scale: 1, x: 0 },
                                    }}
                                    whileHover={{ scale: 1.05, backgroundColor: '#FFF8E1' }}
                                    layout
                                  >
                                    <span className="mr-1">#</span>
                                    {tag}
                                    <motion.button
                                      type="button"
                                      onClick={() => handleRemoveTag(index)}
                                      className="ml-2 text-red-500 hover:text-red-600 p-1"
                                      whileHover={{ scale: 1.1, rotate: 90 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <svg
                                        className="h-3 w-3"
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
                                    </motion.button>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Features Section */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 mb-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <svg
                              className="h-3 w-3 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                              />
                            </svg>
                          </span>
                          Product Features
                        </h3>

                        <div className="space-y-6">
                          {/* Colors Feature */}

                          <div className="p-4 bg-gray-50 rounded-lg">
                            {existingFeatures
                              .filter((feature) => feature.feature_name === 'color')
                              .map((feature, index) => (
                                <div className="flex gap-5 mb-8" key={index}>
                                  <div className="flex items-center bg-gray-200 p-4 px-3 py-1.5 rounded-full">
                                    <Image
                                      src={`${baseUrl}/${feature.image_path}`}
                                      alt={feature.value}
                                      width={36}
                                      height={36}
                                      className="w-9 mr-4"
                                    />
                                    <span className="text-gray-600">{feature.value}</span>
                                    <motion.button
                                      type="button"
                                      onClick={() => {
                                        if (feature.feature_value_id) {
                                          confirmDelete(
                                            'Remove Feature',
                                            'Do you want to remove this featured product?',
                                            () =>
                                              handleRemoveFeatureValueFromDB(
                                                feature.feature_value_id!
                                              )
                                          );
                                        }
                                      }}
                                      className="ml-2 text-red-500 hover:text-red-600 p-1"
                                      whileHover={{ scale: 1.1, rotate: 90 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <svg
                                        className="h-3 w-3"
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
                                    </motion.button>
                                  </div>
                                </div>
                              ))}

                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-medium text-gray-700">Colors</h4>
                              <motion.button
                                type="button"
                                onClick={() => handleSelectFeature('color')}
                                className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Add Color
                              </motion.button>
                            </div>

                            {selectedFeature?.type === 'color' && (
                              <motion.div
                                className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <div className="space-y-3">
                                  <div className="flex space-x-3">
                                    <input
                                      type="text"
                                      value={newFeatureValue.name}
                                      onChange={(e) =>
                                        setNewFeatureValue((prev) => ({
                                          ...prev,
                                          name: e.target.value,
                                        }))
                                      }
                                      placeholder="Color Name (e.g., Red)"
                                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                    />

                                    <motion.div className="relative" whileHover={{ scale: 1.02 }}>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFeatureImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                      />
                                      <div className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm flex items-center">
                                        <svg
                                          className="h-4 w-4 mr-1 text-gray-500"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                          />
                                        </svg>
                                        Upload
                                      </div>
                                    </motion.div>
                                  </div>

                                  <AnimatePresence>
                                    {featureImagePreview && (
                                      <motion.div
                                        className="flex justify-center"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                      >
                                        <div className="relative group">
                                          <Image
                                            src={featureImagePreview || '/placeholder.svg'}
                                            alt="Color Preview"
                                            width={60}
                                            height={60}
                                            className="object-cover rounded-lg shadow-md"
                                          />
                                          <motion.div
                                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                          >
                                            <motion.button
                                              type="button"
                                              onClick={() => {
                                                setNewFeatureValue((prev) => ({
                                                  ...prev,
                                                  image: null,
                                                }));
                                                setFeatureImagePreview(null);
                                              }}
                                              className="p-1 bg-red-500 text-white rounded-full"
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <svg
                                                className="h-3 w-3"
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
                                            </motion.button>
                                          </motion.div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>

                                  <motion.button
                                    type="button"
                                    onClick={handleAddFeatureValue}
                                    className="w-full px-3 py-2 rounded-lg text-sm font-medium text-white shadow-sm"
                                    style={{
                                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                                    }}
                                    whileHover={{
                                      scale: 1.02,
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {editingIndex !== null ? 'Update Color' : 'Add Color'}
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}

                            <AnimatePresence>
                              {(() => {
                                const colorFeature = newProduct.features.find(
                                  (f) => f.type === 'color'
                                );
                                return colorFeature &&
                                  colorFeature.values &&
                                  colorFeature.values.length > 0 ? (
                                  <motion.div
                                    className="flex flex-wrap gap-2 mt-3"
                                    variants={{
                                      hidden: { opacity: 0 },
                                      visible: {
                                        opacity: 1,
                                        transition: {
                                          staggerChildren: 0.05,
                                        },
                                      },
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    {colorFeature.values.map((value, index) => (
                                      <motion.div
                                        key={index}
                                        className="flex items-center bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-sm border border-gray-200"
                                        variants={{
                                          hidden: { opacity: 0, scale: 0.8 },
                                          visible: { opacity: 1, scale: 1 },
                                        }}
                                        whileHover={{
                                          scale: 1.05,
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                        layout
                                      >
                                        {value.image && (
                                          <span
                                            className="w-4 h-4 rounded-full mr-1.5 border border-gray-300"
                                            style={{
                                              background: value.image
                                                ? `url(${
                                                    typeof value.image === 'string'
                                                      ? value.image
                                                      : URL.createObjectURL(value.image)
                                                  })`
                                                : '#ccc',
                                              backgroundSize: 'cover',
                                            }}
                                          />
                                        )}
                                        {value.name}
                                        <motion.button
                                          type="button"
                                          onClick={() => handleRemoveFeatureValue('color', index)}
                                          className="ml-2 text-red-500 hover:text-red-600 p-1"
                                          whileHover={{ scale: 1.1, rotate: 90 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <svg
                                            className="h-3 w-3"
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
                                        </motion.button>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                ) : null;
                              })()}
                            </AnimatePresence>
                          </div>

                          {/* Sizes Feature */}
                          <div className="p-4 bg-gray-50 rounded-lg">
                            {existingFeatures
                              .filter((feature) => feature.feature_name === 'size')
                              .map((feature, index) => (
                                <div className="flex gap-5 mb-8" key={index}>
                                  <div className="flex items-center bg-gray-200 p-4 px-3 py-1.5 rounded-full">
                                    <Image
                                      src={`${baseUrl}/${feature.image_path}`}
                                      alt={feature.value}
                                      width={36}
                                      height={36}
                                      className="w-9 mr-4"
                                    />
                                    <span className="text-gray-600">{feature.value}</span>
                                    <motion.button
                                      type="button"
                                      onClick={() => {
                                        if (feature.feature_value_id) {
                                          confirmDelete(
                                            'Remove Feature',
                                            'Do you want to remove this featured product?',
                                            () =>
                                              handleRemoveFeatureValueFromDB(
                                                feature.feature_value_id!
                                              )
                                          );
                                        }
                                      }}
                                      className="ml-2 text-red-500 hover:text-red-600 p-1"
                                      whileHover={{ scale: 1.1, rotate: 90 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <svg
                                        className="h-3 w-3"
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
                                    </motion.button>
                                  </div>
                                </div>
                              ))}
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-medium text-gray-700">Sizes</h4>
                              <motion.button
                                type="button"
                                onClick={() => handleSelectFeature('size')}
                                className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Add Size
                              </motion.button>
                            </div>

                            {selectedFeature?.type === 'size' && (
                              <motion.div
                                className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <div className="space-y-3">
                                  <select
                                    value={selectedSizeCategory}
                                    onChange={(e) => {
                                      setSelectedSizeCategory(
                                        e.target.value as 'apparel' | 'storage' | 'custom'
                                      );
                                      setNewFeatureValue({
                                        name: '',
                                        image: null,
                                        measurements: { chest: '', waist: '', length: '' },
                                      });
                                      setIsManualStorage(false);
                                      const featureIndex = newProduct.features.findIndex(
                                        (f) => f.type === 'size'
                                      );
                                      if (featureIndex >= 0) {
                                        setNewProduct((prev) => {
                                          const updatedFeatures = [...prev.features];
                                          updatedFeatures[featureIndex].category = e.target
                                            .value as 'apparel' | 'storage' | 'custom';
                                          return { ...prev, features: updatedFeatures };
                                        });
                                      }
                                    }}
                                    disabled={!!lockedSizeCategory} // Disable if lockedSizeCategory is set
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                                  >
                                    <option value="apparel">Apparel (e.g., S, M, L)</option>
                                    <option value="storage">Storage (e.g., GB)</option>
                                    <option value="custom">Custom Size</option>
                                  </select>

                                  {selectedSizeCategory === 'apparel' ? (
                                    <div className="space-y-3">
                                      <select
                                        value={newFeatureValue.name}
                                        onChange={(e) =>
                                          setNewFeatureValue((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                          }))
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                      >
                                        <option value="">Select Apparel Size</option>
                                        {apparelSizes.map((size) => (
                                          <option key={size} value={size}>
                                            {size}
                                          </option>
                                        ))}
                                      </select>

                                      <AnimatePresence>
                                        {newFeatureValue.name && (
                                          <motion.div
                                            className="grid grid-cols-3 gap-2"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                          >
                                            <div className="space-y-1">
                                              <label className="text-xs text-gray-500">
                                                Chest (cm)
                                              </label>
                                              <input
                                                type="number"
                                                value={newFeatureValue.measurements.chest}
                                                onChange={(e) =>
                                                  setNewFeatureValue((prev) => ({
                                                    ...prev,
                                                    measurements: {
                                                      ...prev.measurements,
                                                      chest: e.target.value,
                                                    },
                                                  }))
                                                }
                                                placeholder="Chest"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-xs text-gray-500">
                                                Waist (cm)
                                              </label>
                                              <input
                                                type="number"
                                                value={newFeatureValue.measurements.waist}
                                                onChange={(e) =>
                                                  setNewFeatureValue((prev) => ({
                                                    ...prev,
                                                    measurements: {
                                                      ...prev.measurements,
                                                      waist: e.target.value,
                                                    },
                                                  }))
                                                }
                                                placeholder="Waist"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-xs text-gray-500">
                                                Length (cm)
                                              </label>
                                              <input
                                                type="number"
                                                value={newFeatureValue.measurements.length}
                                                onChange={(e) =>
                                                  setNewFeatureValue((prev) => ({
                                                    ...prev,
                                                    measurements: {
                                                      ...prev.measurements,
                                                      length: e.target.value,
                                                    },
                                                  }))
                                                }
                                                placeholder="Length"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                              />
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  ) : selectedSizeCategory === 'storage' ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-4">
                                        <label className="flex items-center text-sm text-gray-700">
                                          <input
                                            type="radio"
                                            checked={!isManualStorage}
                                            onChange={() => {
                                              setIsManualStorage(false);
                                              setNewFeatureValue((prev) => ({ ...prev, name: '' }));
                                            }}
                                            className="mr-2 h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded cursor-pointer"
                                          />
                                          Predefined
                                        </label>
                                        <label className="flex items-center text-sm text-gray-700">
                                          <input
                                            type="radio"
                                            checked={isManualStorage}
                                            onChange={() => {
                                              setIsManualStorage(true);
                                              setNewFeatureValue((prev) => ({ ...prev, name: '' }));
                                            }}
                                            className="mr-2 h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded cursor-pointer"
                                          />
                                          Manual
                                        </label>
                                      </div>

                                      {isManualStorage ? (
                                        <input
                                          type="text"
                                          value={newFeatureValue.name}
                                          onChange={(e) =>
                                            setNewFeatureValue((prev) => ({
                                              ...prev,
                                              name: e.target.value,
                                            }))
                                          }
                                          placeholder="Enter storage size (e.g., 1.5TB)"
                                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                        />
                                      ) : (
                                        <select
                                          value={newFeatureValue.name}
                                          onChange={(e) =>
                                            setNewFeatureValue((prev) => ({
                                              ...prev,
                                              name: e.target.value,
                                            }))
                                          }
                                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                        >
                                          <option value="">Select Storage Size</option>
                                          {storageSizes.map((size) => (
                                            <option key={size} value={size}>
                                              {size}
                                            </option>
                                          ))}
                                        </select>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={newFeatureValue.name}
                                      onChange={(e) =>
                                        setNewFeatureValue((prev) => ({
                                          ...prev,
                                          name: e.target.value,
                                        }))
                                      }
                                      placeholder="Enter Custom Size (e.g., 10x10 cm)"
                                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                    />
                                  )}

                                  <motion.button
                                    type="button"
                                    onClick={handleAddFeatureValue}
                                    className="w-full px-3 py-2 rounded-lg text-sm font-medium text-white shadow-sm"
                                    style={{
                                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                                    }}
                                    whileHover={{
                                      scale: 1.02,
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {editingIndex !== null ? 'Update Size' : 'Add Size'}
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}

                            <AnimatePresence>
                              {(() => {
                                const sizeFeature = newProduct.features.find(
                                  (f) => f.type === 'size'
                                );
                                return sizeFeature &&
                                  sizeFeature.values &&
                                  sizeFeature.values.length > 0 ? (
                                  <motion.div
                                    className="flex flex-wrap gap-2 mt-3"
                                    variants={{
                                      hidden: { opacity: 0 },
                                      visible: {
                                        opacity: 1,
                                        transition: {
                                          staggerChildren: 0.05,
                                        },
                                      },
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    {sizeFeature.values.map((value, index) => (
                                      <motion.div
                                        key={index}
                                        className="flex items-center bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-sm border border-gray-200"
                                        variants={{
                                          hidden: { opacity: 0, scale: 0.8 },
                                          visible: { opacity: 1, scale: 1 },
                                        }}
                                        whileHover={{
                                          scale: 1.05,
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                        layout
                                      >
                                        <span className="mr-1">📏</span>
                                        {value.name}
                                        {value.measurements && (
                                          <span className="ml-1 text-xs text-gray-500">
                                            ({value.measurements.chest}/{value.measurements.waist}/
                                            {value.measurements.length})
                                          </span>
                                        )}
                                        <motion.button
                                          type="button"
                                          onClick={() => handleRemoveFeatureValue('size', index)}
                                          className="ml-2 text-red-500 hover:text-red-600 p-1"
                                          whileHover={{ scale: 1.1, rotate: 90 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <svg
                                            className="h-3 w-3"
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
                                        </motion.button>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                ) : null;
                              })()}
                            </AnimatePresence>
                          </div>

                          {/* Other Features */}
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-medium text-gray-700">Other Features</h4>
                              <motion.button
                                type="button"
                                onClick={() => handleSelectFeature('other')}
                                className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Add Feature
                              </motion.button>
                            </div>

                            {selectedFeature?.type === 'other' && (
                              <motion.div
                                className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={newFeatureValue.name}
                                    onChange={(e) =>
                                      setNewFeatureValue((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                      }))
                                    }
                                    placeholder="Feature Name"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 text-gray-900 bg-white transition-all duration-200"
                                  />

                                  <motion.button
                                    type="button"
                                    onClick={handleAddFeatureValue}
                                    className="w-full px-3 py-2 rounded-lg text-sm font-medium text-white shadow-sm"
                                    style={{
                                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                                    }}
                                    whileHover={{
                                      scale: 1.02,
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {editingIndex !== null ? 'Update Feature' : 'Add Feature'}
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}

                            <AnimatePresence>
                              {(() => {
                                const otherFeature = newProduct.features.find(
                                  (f) => f.type === 'other'
                                );
                                return otherFeature &&
                                  otherFeature.values &&
                                  otherFeature.values.length > 0 ? (
                                  <motion.div
                                    className="flex flex-wrap gap-2 mt-3"
                                    variants={{
                                      hidden: { opacity: 0 },
                                      visible: {
                                        opacity: 1,
                                        transition: {
                                          staggerChildren: 0.05,
                                        },
                                      },
                                    }}
                                    initial="hidden"
                                    animate="visible"
                                  >
                                    {otherFeature.values.map((value, index) => (
                                      <motion.div
                                        key={index}
                                        className="flex items-center bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow-sm border border-gray-200"
                                        variants={{
                                          hidden: { opacity: 0, scale: 0.8 },
                                          visible: { opacity: 1, scale: 1 },
                                        }}
                                        whileHover={{
                                          scale: 1.05,
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}
                                        layout
                                      >
                                        <span className="mr-1">⚙️</span>
                                        {value.name}
                                        <motion.button
                                          type="button"
                                          onClick={() => handleRemoveFeatureValue('other', index)}
                                          className="ml-2 text-red-500 hover:text-red-600 p-1"
                                          whileHover={{ scale: 1.1, rotate: 90 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <svg
                                            className="h-3 w-3"
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
                                        </motion.button>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                ) : null;
                              })()}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      className="sticky bottom-0 pt-4 pb-2 bg-white border-t"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.button
                        type="submit"
                        className="w-full text-white px-6 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                          boxShadow: `0 10px 15px -3px ${COLORS.primary}40, 0 4px 6px -4px ${COLORS.primary}30`,
                        }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: `0 20px 25px -5px ${COLORS.primary}40, 0 8px 10px -6px ${COLORS.primary}30`,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <svg
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {isEditMode ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            )}
                          </svg>
                          <span className="text-lg">
                            {isEditMode ? 'Update Product' : 'Add Product'}
                          </span>
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alert Modal Components */}
        {AlertModalComponent}
        {ConfirmationModalComponent}

        {/* Export Modal */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onConfirm={performProductsExport}
          title="Export Products"
          description={`Export ${products.length} products to CSV format. This will include all product details such as names, prices, stock levels, discounts, descriptions, and features.`}
          exportType="Products"
          isExporting={isExporting}
        />
      </motion.div>
    </motion.div>
  );
};

export default Products;
