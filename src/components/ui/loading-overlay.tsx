import React from 'react';
import { cn } from '@/lib/utils';
import Spinner from './spinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  backdrop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Loading...',
  backdrop = true,
  className,
  children,
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center z-50',
          backdrop && 'bg-white/80 backdrop-blur-sm',
          className
        )}
      >
        <div className="flex flex-col items-center space-y-3">
          <Spinner size="lg" color="primary" />
          {text && (
            <p className="text-sm text-gray-600 font-medium">{text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
