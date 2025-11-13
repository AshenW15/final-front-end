/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Picker, { Theme } from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import useAlerts from '@/hooks/useAlerts';


interface Category {
  category_id: string;
  category_name: string;
  category_icon: string;
}

const Categories = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('📦');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Initialize alert system
  const {
    error: showError,
    success: showSuccess,
    confirmDelete,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/fetch_categories.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const text = await response.text();
      console.log('Raw response:', text);

      const data = JSON.parse(text);
      if (data.categories) {
        setCategories(data.categories);
      } else {
        console.warn('No categories found');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  },[fetchCategories]);// change

  const handleAddCategory = async () => {
    try {
      const response = await fetch(`${baseUrl}/add_category.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryName,
          icon: categoryIcon,
        }),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Category Added', 'Category added successfully!');
        setCategoryName('');
        setCategoryIcon('📦');
        setShowModal(false);
        fetchCategories();
      } else {
        showError('Add Failed', `Failed to add category: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showError('Add Error', 'Error adding category.');
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;
    
    try {
      const response = await fetch(`${baseUrl}/update_category.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: editingCategory.category_id,
          name: categoryName,
          icon: categoryIcon,
        }),
      });

      const data = await response.json();
      if (data.success) {
        showSuccess('Category Updated', 'Category updated successfully!');
        setShowEditModal(false);
        setEditingCategory(null);
        setCategoryName('');
        setCategoryIcon('📦');
        fetchCategories();
      } else {
        showError('Update Failed', `Failed to update category: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showError('Update Error', 'Error updating category.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await confirmDelete(
        'Delete Category',
        'Are you sure you want to delete this category? This action cannot be undone.',
        async () => {
          const response = await fetch(`${baseUrl}/delete_category.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category_id: categoryId,
            }),
          });

          const data = await response.json();
          if (data.success) {
            showSuccess('Category Deleted', 'Category deleted successfully!');
            fetchCategories();
          } else {
            showError('Delete Failed', `Failed to delete category: ${data.message}`);
          }
        }
      );
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('Error', 'Error deleting category.');
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.category_name);
    setCategoryIcon(category.category_icon);
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCategoryName('');
    setCategoryIcon('📦');
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryIcon('📦');
  };

  const onEmojiClick = (emojiData: any) => {
    setCategoryIcon(emojiData.emoji); // Set single emoji
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Categories</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Category List</h2>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.category_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 text-black">
                  {cat.category_icon.startsWith('/images/') ? (
                    <Image
                      src={`http://localhost/storevia${cat.category_icon}`}
                      alt={cat.category_name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-xl">{cat.category_icon}</span>
                  )}
                  <span className="font-medium">{cat.category_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => openEditModal(cat)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit Category"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteCategory(cat.category_id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete Category"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <motion.button
          onClick={() => setShowModal(true)}
          className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Add New Category
        </motion.button>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Category</h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:rotate-90 transform"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-black"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Icon</label>
                    <div className="mt-1">
                      <span className="text-4xl" role="img" aria-label="Selected emoji">
                        {categoryIcon}
                      </span>
                      <Picker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={true}
                        skinTonesDisabled={true}
                        searchPlaceholder="Search emoji"
                        theme={Theme.LIGHT}
                        width="100%"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-6 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Add Category
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleEditClose}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Edit Category</h3>
                  <button
                    onClick={handleEditClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:rotate-90 transform"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-black"
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category Icon</label>
                    <div className="mt-1">
                      <span className="text-4xl" role="img" aria-label="Selected emoji">
                        {categoryIcon}
                      </span>
                      <Picker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={true}
                        skinTonesDisabled={true}
                        searchPlaceholder="Search emoji"
                        theme={Theme.LIGHT}
                        width="100%"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleEditClose}
                  className="px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCategory}
                  className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                >
                  Update Category
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert and Confirmation Modals */}
      {AlertModalComponent}
      {ConfirmationModalComponent}
    </div>
  );
};

export default Categories;
