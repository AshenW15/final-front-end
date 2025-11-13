"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Color scheme
const COLORS = {
  primary: "#FFC107",
  secondary: "#FFD54F",
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",
};

// Toast configurations
const toastConfig = {
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700',
    icon: Check,
    progressColor: COLORS.success,
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700',
    icon: AlertCircle,
    progressColor: COLORS.error,
  },
  warning: {
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    titleColor: 'text-orange-800',
    messageColor: 'text-orange-700',
    icon: AlertTriangle,
    progressColor: COLORS.warning,
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700',
    icon: Info,
    progressColor: COLORS.info,
  },
};

// Animation variants
const toastVariants = {
  hidden: { 
    opacity: 0, 
    x: 300, 
    scale: 0.9,
    rotateY: -15,
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 400,
    }
  },
  exit: { 
    opacity: 0, 
    x: 300, 
    scale: 0.9,
    rotateY: 15,
    transition: {
      duration: 0.2,
    }
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -90 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
      delay: 0.1,
    }
  },
};

// Individual Toast Component
const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ 
  toast, 
  onRemove 
}) => {
  const config = toastConfig[toast.type];
  const IconComponent = config.icon;
  const duration = toast.duration || 5000;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, duration, onRemove]);

  return (
    <motion.div
      className={`
        relative w-full max-w-sm p-4 rounded-xl shadow-lg border-l-4 
        ${config.bgColor} ${config.borderColor} backdrop-blur-sm
      `}
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-bl-xl"
          style={{ backgroundColor: config.progressColor }}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <motion.div
          className={`flex-shrink-0 ${config.iconColor}`}
          variants={iconVariants}
          initial="hidden"
          animate="visible"
        >
          <IconComponent className="w-5 h-5" />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.h4
            className={`text-sm font-semibold ${config.titleColor}`}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {toast.title}
          </motion.h4>
          
          {toast.message && (
            <motion.p
              className={`mt-1 text-xs ${config.messageColor}`}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              {toast.message}
            </motion.p>
          )}

          {/* Action button */}
          {toast.action && (
            <motion.button
              onClick={toast.action.onClick}
              className={`
                mt-2 text-xs font-medium px-2 py-1 rounded 
                ${config.titleColor} hover:underline
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {toast.action.label}
            </motion.button>
          )}
        </div>

        {/* Close button */}
        <motion.button
          onClick={() => onRemove(toast.id)}
          className={`flex-shrink-0 p-1 rounded-full hover:bg-white/50 ${config.iconColor}`}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ 
  toasts, 
  onRemove 
}) => {
  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };
    
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Convenience hook for toast notifications
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: 'success', title, message, ...options });
    },
    error: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: 'error', title, message, ...options });
    },
    warning: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: 'warning', title, message, ...options });
    },
    info: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({ type: 'info', title, message, ...options });
    },
  };
};

export default ToastProvider;
