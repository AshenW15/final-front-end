/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Category {
  category_id: number;
  category_name: string;
  category_icon: string | null;
  width?: 'normal' | 'wide';
}

const ShopByCategory: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/fetch_categories.php`);
        const data = await response.json();
        setCategories(data.categories.slice(0, 16)); // Show max 16 categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading categories...</div>
        ) : (
          <>
            {/* Mobile Categories Layout - Horizontal scroll with larger items */}
            <div className="lg:hidden">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                {categories.slice(0, 8).map((category, index) => (
                  <motion.div
                    key={category.category_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex-shrink-0 w-20 flex flex-col items-center cursor-pointer group"
                  >
                    {/* Category Icon - Rectangular card */}
                    <div className="w-20 h-16 flex items-center justify-center mb-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                      {category.category_icon && category.category_icon.startsWith('/images/') ? (
                        <img
                          src={`${baseUrl}${category.category_icon}`}
                          alt={category.category_name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <span className="text-xl">{category.category_icon || '📦'}</span>
                      )}
                    </div>

                    {/* Category Name */}
                    <p className="text-xs font-medium text-gray-700 text-center leading-tight max-w-[70px] group-hover:text-orange-500 transition-colors">
                      {category.category_name}
                    </p>
                  </motion.div>
                ))}
                
                {/* View More Button for Mobile */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex-shrink-0 w-20 flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-20 h-16 flex items-center justify-center mb-2 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                    <span className="text-xl text-gray-400">+</span>
                  </div>
                  <p className="text-xs font-medium text-gray-400 text-center leading-tight">
                    View More
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Desktop Categories Grid - Keep original layout */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.category_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all cursor-pointer border border-gray-100"
                  >
                    {/* Category Icon */}
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2 bg-gray-100 rounded-lg">
                      {category.category_icon && category.category_icon.startsWith('/images/') ? (
                        <img
                          src={`${baseUrl}${category.category_icon}`}
                          alt={category.category_name}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />
                      ) : (
                        <span className="text-2xl md:text-3xl">{category.category_icon || '📦'}</span>
                      )}
                    </div>

                    {/* Category Name */}
                    <p className="text-xs md:text-sm font-medium text-gray-700 text-center leading-tight">
                      {category.category_name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopByCategory;
