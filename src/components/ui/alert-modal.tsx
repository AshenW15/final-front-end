"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, Info, AlertCircle, Sparkles } from 'lucide-react';

// Alert types
export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
  duration?: number; // Auto-close duration in ms (0 = no auto-close)
  showIcon?: boolean;
  showCloseButton?: boolean;
  customIcon?: React.ReactNode;
  onAction?: () => void;
  actionText?: string;
}

// Color scheme based on your yellow theme
const COLORS = {
  primary: "#FFC107", // Yellow
  secondary: "#FFD54F", // Light yellow
  accent1: "#FF9800", // Orange-yellow
  accent2: "#FF5722", // Coral
  accent3: "#8C52FF", // Purple
  accent4: "#4DD0E1", // Teal
  success: "#4CAF50", // Green
  error: "#F44336", // Red
  warning: "#FF9800", // Orange
  info: "#2196F3", // Blue
  grey1: "#FFFFFF",
  grey2: "#F5F5F5",
  textPrimary: "#212121",
  textSecondary: "#616161",
};

// Alert configurations
const alertConfig = {
  success: {
    bgColor: COLORS.success,
    bgGradient: `linear-gradient(135deg, ${COLORS.success}, #66BB6A)`,
    icon: Check,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200',
    glowColor: 'shadow-green-200',
  },
  error: {
    bgColor: COLORS.error,
    bgGradient: `linear-gradient(135deg, ${COLORS.error}, #EF5350)`,
    icon: AlertCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200',
    glowColor: 'shadow-red-200',
  },
  warning: {
    bgColor: COLORS.warning,
    bgGradient: `linear-gradient(135deg, ${COLORS.warning}, #FFB74D)`,
    icon: AlertTriangle,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200',
    glowColor: 'shadow-orange-200',
  },
  info: {
    bgColor: COLORS.info,
    bgGradient: `linear-gradient(135deg, ${COLORS.info}, #42A5F5)`,
    icon: Info,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    glowColor: 'shadow-blue-200',
  },
  loading: {
    bgColor: COLORS.primary,
    bgGradient: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
    icon: Sparkles,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-200',
    glowColor: 'shadow-yellow-200',
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
    scale: 0.8, 
    y: 50,
    rotateX: -15 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
      duration: 0.4,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8, 
    y: 50,
    rotateX: 15,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
      delay: 0.2,
    }
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  },
};

const sparkleVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }
};

// Loading spinner component
const LoadingSpinner = () => (
  <motion.div
    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  />
);

// Floating particles animation
const FloatingParticles = ({ type }: { type: AlertType }) => {
  const config = alertConfig[type];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full opacity-30"
          style={{ backgroundColor: config.bgColor }}
          initial={{
            x: Math.random() * 400,
            y: Math.random() * 300,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [-20, -40, -20],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  duration = 0,
  showIcon = true,
  showCloseButton = true,
  customIcon,
  onAction,
  actionText,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const config = alertConfig[type];
  const IconComponent = config.icon;

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, duration, handleClose]);

  const handleAction = () => {
    if (onAction) onAction();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className={`
              relative w-full max-w-md bg-white rounded-2xl shadow-2xl 
              border-2 ${config.borderColor} overflow-hidden
              ${config.glowColor} shadow-xl
            `}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating particles */}
            <FloatingParticles type={type} />

            {/* Header with gradient */}
            <motion.div
              className="relative px-6 py-4 text-white overflow-hidden"
              style={{ background: config.bgGradient }}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" 
                     style={{
                       backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                       radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                                       radial-gradient(circle at 40% 80%, white 1px, transparent 1px)`,
                       backgroundSize: '50px 50px, 30px 30px, 40px 40px'
                     }}
                />
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {showIcon && (
                    <motion.div
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm"
                      variants={iconVariants}
                      initial="hidden"
                      animate={type === 'loading' ? 'pulse' : 'visible'}
                    >
                      {type === 'loading' ? (
                        <LoadingSpinner />
                      ) : customIcon ? (
                        customIcon
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </motion.div>
                  )}
                  <motion.h3
                    className="text-lg font-bold"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {title}
                  </motion.h3>
                </div>

                {showCloseButton && (
                  <motion.button
                    onClick={handleClose}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Sparkle effects for special alerts */}
              {(type === 'success' || type === 'loading') && (
                <motion.div
                  className="absolute top-2 right-20 text-white/50"
                  variants={sparkleVariants}
                  animate="animate"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              className="px-6 py-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-700 leading-relaxed text-sm">
                {message}
              </p>

              {/* Action button */}
              {actionText && onAction && (
                <motion.button
                  onClick={handleAction}
                  className="mt-4 w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg"
                  style={{ background: config.bgGradient }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 8px 25px ${config.bgColor}40`,
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {actionText}
                </motion.button>
              )}

              {/* Auto-close progress bar */}
              {duration > 0 && (
                <motion.div
                  className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: config.bgColor }}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;
