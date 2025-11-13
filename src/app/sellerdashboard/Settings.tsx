'use client';
import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Settings</h1>
      <p className="text-gray-600">Content for Settings coming soon!</p>
    </motion.div>
  );
};

export default Settings;