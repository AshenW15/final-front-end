"use client";

import { FC } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileBottomNav: FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      active: pathname === '/'
    },
    {
      icon: Search,
      label: 'Categories',
      href: '/categories',
      active: pathname === '/categories'
    },
    {
      icon: ShoppingCart,
      label: 'Cart',
      href: '/cart',
      active: pathname === '/cart'
    },
    {
      icon: User,
      label: 'Account',
      href: '/profile',
      active: pathname === '/profile'
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                item.active
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-orange-500'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${
                item.active ? 'text-orange-500' : 'text-gray-500'
              }`} />
              <span className={`text-xs font-medium ${
                item.active ? 'text-orange-500' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
