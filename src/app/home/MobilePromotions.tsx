 
"use client";

import { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  Gift, 
  Sparkles, 
  ShoppingBag, 
  Crown, 
  Smartphone, 
  Zap, 
  Star, 
  TrendingUp 
} from 'lucide-react';

const MobilePromotions: FC = () => {
  const mobilePromotionVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      transition: { duration: 0.2 }
    }
  };

  const categories = [
    { icon: Gift, label: "Gifts", color: "bg-pink-500", href: "#gifts" },
    { icon: Sparkles, label: "Beauty", color: "bg-purple-500", href: "#beauty" },
    { icon: ShoppingBag, label: "Buy & Save More", color: "bg-green-500", href: "#buy-save" },
    { icon: Crown, label: "New Arrivals", color: "bg-yellow-500", href: "#new" },
    { icon: Smartphone, label: "Affiliate Program", color: "bg-blue-500", href: "#affiliate" },
    { icon: Zap, label: "Buy More & Save More", color: "bg-red-500", href: "#flash" },
    { icon: Star, label: "Free Delivery", color: "bg-indigo-500", href: "#top-rated" },
    { icon: TrendingUp, label: "Storevia Cares", color: "bg-orange-500", href: "#trending" },
  ];

  return (
    <div className="lg:hidden bg-white px-4 py-5">
      {/* Categories Grid - 2 rows of 4 */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-6">
        {categories.map((category, index) => (
          <motion.a
            key={index}
            variants={mobilePromotionVariants}
            whileHover="hover"
            href={category.href}
            className="flex flex-col items-center text-gray-900 group"
          >
            <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mb-2 shadow-md transition-all duration-200 group-hover:shadow-lg`}>
              <category.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-medium text-center text-gray-700 leading-tight max-w-[55px] line-clamp-2">
              {category.label}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default MobilePromotions;