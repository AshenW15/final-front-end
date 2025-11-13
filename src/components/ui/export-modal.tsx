'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  exportType: string;
  isExporting: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  exportType,
  isExporting,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
        onClick={onClose}
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
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
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
            className="relative px-6 py-4 bg-gradient-to-r from-green-500 to-green-600"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center">
              <motion.div
                className="w-8 h-8 mr-3 rounded-full bg-white/20 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </motion.div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Export {exportType}</h3>
                  <p className="text-sm text-gray-500">CSV format</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg
                    className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
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
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Export Details:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>File format: CSV (Comma Separated Values)</li>
                      <li>Includes all visible data fields</li>
                      <li>Compatible with Excel and Google Sheets</li>
                      <li>Download will start automatically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex items-center justify-end space-x-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isExporting}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className={`px-6 py-2 rounded-lg font-medium text-white transition-all ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
                }`}
                whileHover={!isExporting ? { scale: 1.05 } : {}}
                whileTap={!isExporting ? { scale: 0.95 } : {}}
                disabled={isExporting}
              >
                {isExporting ? (
                  <div className="flex items-center">
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Exporting...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-2"
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
                    Export Now
                  </div>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportModal;
