import { Suspense } from 'react';
import SellerDashboard from '@/app/sellerdashboard/SellerDashboard';

// Loading fallback component
function SellerDashboardLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-lg">Loading Seller Dashboard...</span>
    </div>
  );
}

// Wrapper component with Suspense boundary
function SellerDashboardPage() {
  return (
    <Suspense fallback={<SellerDashboardLoadingFallback />}>
      <SellerDashboard />
    </Suspense>
  );
}

export default SellerDashboardPage;