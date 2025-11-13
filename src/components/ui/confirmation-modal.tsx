"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Check, Trash2, Save, Eye, EyeOff } from 'lucide-react';

// Confirmation types
export type ConfirmationType = 'delete' | 'save' | 'warning' | 'info' | 'custom';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  type?: ConfirmationType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  requirePassword?: boolean;
  onPasswordSubmit?: (password: string) => void;
  showIcon?: boolean;
  customIcon?: React.ReactNode;
  destructive?: boolean;
  loading?: boolean;
}

// Color scheme
const COLORS = {
  primary: "#FFC107",
  secondary: "#FFD54F",
  accent1: "#FF9800",
  accent2: "#FF5722",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",
  grey1: "#FFFFFF",
  grey2: "#F5F5F5",
  textPrimary: "#212121",
  textSecondary: "#616161",
};

// Configuration for different confirmation types
const confirmationConfig = {
  delete: {
    bgColor: COLORS.error,
    bgGradient: `linear-gradient(135deg, ${COLORS.error}, #EF5350)`,
    icon: Trash2,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    confirmColor: 'bg-red-600 hover:bg-red-700',
    cancelColor: 'bg-gray-300 hover:bg-gray-400',
  },
  save: {
    bgColor: COLORS.success,
    bgGradient: `linear-gradient(135deg, ${COLORS.success}, #66BB6A)`,
    icon: Save,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    confirmColor: 'bg-green-600 hover:bg-green-700',
    cancelColor: 'bg-gray-300 hover:bg-gray-400',
  },
  warning: {
    bgColor: COLORS.warning,
    bgGradient: `linear-gradient(135deg, ${COLORS.warning}, #FFB74D)`,
    icon: AlertTriangle,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
    confirmColor: 'bg-orange-600 hover:bg-orange-700',
    cancelColor: 'bg-gray-300 hover:bg-gray-400',
  },
  info: {
    bgColor: COLORS.info,
    bgGradient: `linear-gradient(135deg, ${COLORS.info}, #42A5F5)`,
    icon: Check,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    confirmColor: 'bg-blue-600 hover:bg-blue-700',
    cancelColor: 'bg-gray-300 hover:bg-gray-400',
  },
  custom: {
    bgColor: COLORS.primary,
    bgGradient: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    icon: Check,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    confirmColor: 'bg-yellow-600 hover:bg-yellow-700',
    cancelColor: 'bg-gray-300 hover:bg-gray-400',
  },
};

// Animation variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 400,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: {
      duration: 0.2,
    }
  },
};

const iconBounceVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 300,
      delay: 0.1,
    }
  },
};

const buttonVariants = {
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.95 },
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  type = 'info',
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  requirePassword = false,
  onPasswordSubmit,
  showIcon = true,
  customIcon,
  destructive = false,
  loading = false,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const config = confirmationConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    if (requirePassword && onPasswordSubmit) {
      if (!password.trim()) {
        setPasswordError('Password is required');
        return;
      }
      onPasswordSubmit(password);
    } else {
      onConfirm();
    }
  };

  const handleCancel = () => {
    setPassword('');
    setPasswordError('');
    if (onCancel) onCancel();
    onClose();
  };

  const handleClose = () => {
    setPassword('');
    setPasswordError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-6 border-b border-gray-100">
            {/* Close button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>

            {/* Icon and title */}
            <div className="flex items-center space-x-4 pr-12">
              {showIcon && (
                <motion.div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full
                    ${config.iconBg} ${destructive ? 'bg-red-100' : ''}
                  `}
                  variants={iconBounceVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {customIcon || (
                    <IconComponent 
                      className={`w-6 h-6 ${destructive ? 'text-red-600' : config.iconColor}`} 
                    />
                  )}
                </motion.div>
              )}
              
              <div>
                <motion.h3
                  className="text-lg font-bold text-gray-900"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <motion.div
            className="px-6 py-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-gray-700 leading-relaxed mb-4">
              {message}
            </p>

            {/* Password input */}
            {requirePassword && (
              <motion.div
                className="mb-4 space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Enter your password to continue
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 
                      focus:border-yellow-500 outline-none transition-colors pr-10
                      ${passwordError ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    `}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <motion.p
                    className="text-red-600 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {passwordError}
                  </motion.p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            className="px-6 py-4 bg-gray-50 flex space-x-3 justify-end"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {cancelText}
            </motion.button>
            
            <motion.button
              onClick={handleConfirm}
              disabled={loading}
              className={`
                px-4 py-2 text-white rounded-lg font-medium transition-all duration-200
                ${destructive || type === 'delete' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-yellow-600 hover:bg-yellow-700'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                flex items-center space-x-2
              `}
              variants={buttonVariants}
              whileHover={!loading ? "hover" : {}}
              whileTap={!loading ? "tap" : {}}
            >
              {loading && (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <span>{confirmText}</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
