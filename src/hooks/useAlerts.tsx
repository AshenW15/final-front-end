"use client";

import { useState, useCallback } from 'react';
import AlertModal, { AlertModalProps, AlertType } from '../components/ui/alert-modal';
import ConfirmationModal, { ConfirmationModalProps, ConfirmationType } from '../components/ui/confirmation-modal';
import { useToastHelpers } from '../components/ui/toast';

// Main alert hook that provides all alert functionality
export const useAlerts = () => {
  const [alertModal, setAlertModal] = useState<Partial<AlertModalProps> & { isOpen: boolean }>({
    isOpen: false,
  });
  
  const [confirmationModal, setConfirmationModal] = useState<Partial<ConfirmationModalProps> & { isOpen: boolean }>({
    isOpen: false,
  });

  const toastHelpers = useToastHelpers();

  // Alert modal functions
  const showAlert = useCallback((props: Omit<AlertModalProps, 'isOpen' | 'onClose'>) => {
    setAlertModal({
      ...props,
      isOpen: true,
      onClose: () => setAlertModal((prev) => ({ ...prev, isOpen: false })),
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Confirmation modal functions
  const showConfirmation = useCallback((props: Omit<ConfirmationModalProps, 'isOpen' | 'onClose'>) => {
    setConfirmationModal({
      ...props,
      isOpen: true,
      onClose: () => setConfirmationModal((prev) => ({ ...prev, isOpen: false })),
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Convenience functions for common alert types
  const success = useCallback((title: string, message: string, options?: Partial<AlertModalProps>) => {
    showAlert({
      type: 'success' as AlertType,
      title,
      message,
      duration: 3000,
      ...options,
    });
  }, [showAlert]);

  const error = useCallback((title: string, message: string, options?: Partial<AlertModalProps>) => {
    showAlert({
      type: 'error' as AlertType,
      title,
      message,
      duration: 5000,
      ...options,
    });
  }, [showAlert]);

  const warning = useCallback((title: string, message: string, options?: Partial<AlertModalProps>) => {
    showAlert({
      type: 'warning' as AlertType,
      title,
      message,
      duration: 4000,
      ...options,
    });
  }, [showAlert]);

  const info = useCallback((title: string, message: string, options?: Partial<AlertModalProps>) => {
    showAlert({
      type: 'info' as AlertType,
      title,
      message,
      duration: 3000,
      ...options,
    });
  }, [showAlert]);

  const loading = useCallback((title: string, message: string, options?: Partial<AlertModalProps>) => {
    showAlert({
      type: 'loading' as AlertType,
      title,
      message,
      duration: 0, // No auto-close for loading
      showCloseButton: false,
      ...options,
    });
  }, [showAlert]);

  // Convenience functions for confirmations
  const confirm = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void,
    options?: Partial<ConfirmationModalProps>
  ) => {
    showConfirmation({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        hideConfirmation();
      },
      type: 'info' as ConfirmationType,
      ...options,
    });
  }, [showConfirmation, hideConfirmation]);

  const confirmDelete = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void,
    options?: Partial<ConfirmationModalProps>
  ) => {
    showConfirmation({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        hideConfirmation();
      },
      type: 'delete' as ConfirmationType,
      destructive: true,
      confirmText: 'Delete',
      ...options,
    });
  }, [showConfirmation, hideConfirmation]);

  const confirmSave = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void,
    options?: Partial<ConfirmationModalProps>
  ) => {
    showConfirmation({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        hideConfirmation();
      },
      type: 'save' as ConfirmationType,
      confirmText: 'Save',
      ...options,
    });
  }, [showConfirmation, hideConfirmation]);

  const confirmWithPassword = useCallback((
    title: string, 
    message: string, 
    onConfirm: (password: string) => void,
    options?: Partial<ConfirmationModalProps>
  ) => {
    showConfirmation({
      title,
      message,
      requirePassword: true,
      onPasswordSubmit: (password: string) => {
        onConfirm(password);
        hideConfirmation();
      },
      onConfirm: () => {}, // Required but not used when requirePassword is true
      ...options,
    });
  }, [showConfirmation, hideConfirmation]);

  // Toast convenience functions (re-export for consistency)
  const toast = toastHelpers;

  return {
    // Alert modals
    showAlert,
    hideAlert,
    success,
    error,
    warning,
    info,
    loading,
    
    // Confirmation modals
    showConfirmation,
    hideConfirmation,
    confirm,
    confirmDelete,
    confirmSave,
    confirmWithPassword,
    
    // Toasts
    toast,
    
    // Modal components (for rendering)
    AlertModalComponent: alertModal.isOpen ? (
      <AlertModal {...(alertModal as AlertModalProps)} />
    ) : null,
    
    ConfirmationModalComponent: confirmationModal.isOpen ? (
      <ConfirmationModal {...(confirmationModal as ConfirmationModalProps)} />
    ) : null,
  };
};

// Provider component that wraps the app
export { ToastProvider } from '../components/ui/toast';

export default useAlerts;
