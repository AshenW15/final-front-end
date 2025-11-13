"use client";

import React from 'react';
import { motion } from 'framer-motion';
import useAlerts, { ToastProvider } from '../../hooks/useAlerts';

// Example component showing how to use the alert system
const AlertExampleComponent: React.FC = () => {
  const {
    success,
    error,
    warning,
    info,
    loading,
    confirm,
    confirmDelete,
    confirmSave,
    confirmWithPassword,
    toast,
    hideAlert,
    AlertModalComponent,
    ConfirmationModalComponent,
  } = useAlerts();

  const handleSuccess = () => {
    success('Success!', 'Your action was completed successfully.');
  };

  const handleError = () => {
    error('Error Occurred', 'Something went wrong. Please try again.');
  };

  const handleWarning = () => {
    warning('Warning', 'Please review your input before proceeding.');
  };

  const handleInfo = () => {
    info('Information', 'Here is some important information for you.');
  };

  const handleLoading = () => {
    loading('Processing...', 'Please wait while we process your request.');
    // Simulate async operation
    setTimeout(() => {
      hideAlert();
      success('Complete!', 'Operation finished successfully.');
    }, 3000);
  };

  const handleConfirm = () => {
    confirm(
      'Confirm Action',
      'Are you sure you want to proceed with this action?',
      () => {
        toast.success('Confirmed!', 'Your action has been confirmed.');
      }
    );
  };

  const handleDelete = () => {
    confirmDelete(
      'Delete Item',
      'This action cannot be undone. Are you sure you want to delete this item?',
      () => {
        toast.success('Deleted!', 'Item has been deleted successfully.');
      }
    );
  };

  const handleSave = () => {
    confirmSave(
      'Save Changes',
      'Do you want to save your changes before leaving?',
      () => {
        toast.success('Saved!', 'Your changes have been saved.');
      }
    );
  };

  const handlePasswordConfirm = () => {
    confirmWithPassword(
      'Confirm with Password',
      'Please enter your password to confirm this sensitive action.',
      (password: string) => {
        toast.success('Authenticated!', `Password confirmed: ${password.length} characters`);
      }
    );
  };

  const handleToastSuccess = () => {
    toast.success('Toast Success!', 'This is a success toast notification.');
  };

  const handleToastError = () => {
    toast.error('Toast Error!', 'This is an error toast notification.');
  };

  const handleToastWarning = () => {
    toast.warning('Toast Warning!', 'This is a warning toast notification.');
  };

  const handleToastInfo = () => {
    toast.info('Toast Info!', 'This is an info toast notification.');
  };

  const buttonClass = `
    px-4 py-2 rounded-lg font-medium text-white transition-all duration-200
    hover:scale-105 active:scale-95 shadow-lg
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🎨 Storevia Alert System Demo
          </h1>

          {/* Alert Modals Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Alert Modals</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <motion.button
                onClick={handleSuccess}
                className={`${buttonClass} bg-green-500 hover:bg-green-600`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Success
              </motion.button>
              <motion.button
                onClick={handleError}
                className={`${buttonClass} bg-red-500 hover:bg-red-600`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Error
              </motion.button>
              <motion.button
                onClick={handleWarning}
                className={`${buttonClass} bg-orange-500 hover:bg-orange-600`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Warning
              </motion.button>
              <motion.button
                onClick={handleInfo}
                className={`${buttonClass} bg-blue-500 hover:bg-blue-600`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Info
              </motion.button>
              <motion.button
                onClick={handleLoading}
                className={`${buttonClass} bg-yellow-500 hover:bg-yellow-600`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Loading
              </motion.button>
            </div>
          </div>

          {/* Confirmation Modals Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmation Modals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                onClick={handleConfirm}
                className={`${buttonClass} bg-purple-500 hover:bg-purple-600`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirm
              </motion.button>
              <motion.button
                onClick={handleDelete}
                className={`${buttonClass} bg-red-600 hover:bg-red-700`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
              <motion.button
                onClick={handleSave}
                className={`${buttonClass} bg-green-600 hover:bg-green-700`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
              <motion.button
                onClick={handlePasswordConfirm}
                className={`${buttonClass} bg-indigo-600 hover:bg-indigo-700`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Password
              </motion.button>
            </div>
          </div>

          {/* Toast Notifications Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Toast Notifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.button
                onClick={handleToastSuccess}
                className={`${buttonClass} bg-green-400 hover:bg-green-500`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Toast Success
              </motion.button>
              <motion.button
                onClick={handleToastError}
                className={`${buttonClass} bg-red-400 hover:bg-red-500`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Toast Error
              </motion.button>
              <motion.button
                onClick={handleToastWarning}
                className={`${buttonClass} bg-orange-400 hover:bg-orange-500`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Toast Warning
              </motion.button>
              <motion.button
                onClick={handleToastInfo}
                className={`${buttonClass} bg-blue-400 hover:bg-blue-500`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Toast Info
              </motion.button>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 How to Use</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>1. Wrap your app with ToastProvider:</strong> Import and use ToastProvider at the root level</p>
              <p><strong>2. Use the useAlerts hook:</strong> Import useAlerts in any component</p>
              <p><strong>3. Call alert functions:</strong> Use success(), error(), warning(), info(), loading()</p>
              <p><strong>4. Use confirmations:</strong> Use confirm(), confirmDelete(), confirmSave(), confirmWithPassword()</p>
              <p><strong>5. Use toasts:</strong> Use toast.success(), toast.error(), etc. for lightweight notifications</p>
              <p><strong>6. Render components:</strong> Include AlertModalComponent and ConfirmationModalComponent in your JSX</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Render the modal components */}
      {AlertModalComponent}
      {ConfirmationModalComponent}
    </div>
  );
};

// Main component with provider
const AlertDemo: React.FC = () => {
  return (
    <ToastProvider>
      <AlertExampleComponent />
    </ToastProvider>
  );
};

export default AlertDemo;
