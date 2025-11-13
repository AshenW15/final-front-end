import React from 'react';
import Spinner from '../ui/spinner';
import LoadingButton from '../ui/loading-button';
import LoadingOverlay from '../ui/loading-overlay';
import { useLoading } from '@/hooks/useLoading';

const LoadingExamples: React.FC = () => {
  const { isLoading, withLoading } = useLoading();
  const [buttonLoading, setButtonLoading] = React.useState(false);

  const handleAsyncAction = async () => {
    await withLoading(async () => {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
  };

  const handleButtonClick = async () => {
    setButtonLoading(true);
    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Loading Components Examples</h2>
      
      {/* Basic Spinners */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Basic Spinners</h3>
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center space-y-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-600">Small</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Spinner size="md" />
            <span className="text-sm text-gray-600">Medium</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Spinner size="lg" />
            <span className="text-sm text-gray-600">Large</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Spinner size="xl" />
            <span className="text-sm text-gray-600">Extra Large</span>
          </div>
        </div>
      </section>

      {/* Spinner Colors */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Spinner Colors</h3>
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-center space-y-2">
            <Spinner color="primary" />
            <span className="text-sm text-gray-600">Primary</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Spinner color="secondary" />
            <span className="text-sm text-gray-600">Secondary</span>
          </div>
          <div className="flex flex-col items-center space-y-2 bg-gray-800 p-3 rounded">
            <Spinner color="white" />
            <span className="text-sm text-white">White</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Spinner color="gray" />
            <span className="text-sm text-gray-600">Gray</span>
          </div>
        </div>
      </section>

      {/* Loading Buttons */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Loading Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <LoadingButton 
            loading={buttonLoading} 
            onClick={handleButtonClick}
            loadingText="Processing..."
          >
            Click Me
          </LoadingButton>
          
          <LoadingButton 
            loading={buttonLoading} 
            onClick={handleButtonClick}
            variant="destructive"
            loadingText="Deleting..."
          >
            Delete Item
          </LoadingButton>
          
          <LoadingButton 
            loading={buttonLoading} 
            onClick={handleButtonClick}
            variant="outline"
            size="sm"
          >
            Small Button
          </LoadingButton>
          
          <LoadingButton 
            loading={buttonLoading} 
            onClick={handleButtonClick}
            variant="secondary"
            size="lg"
          >
            Large Button
          </LoadingButton>
        </div>
      </section>

      {/* Loading Overlay */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Loading Overlay</h3>
        <div className="space-y-4">
          <button
            onClick={handleAsyncAction}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Trigger Loading Overlay
          </button>
          
          <LoadingOverlay isLoading={isLoading} text="Processing your request...">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-48">
              <h4 className="font-semibold text-gray-900 mb-2">Content Area</h4>
              <p className="text-gray-600">
                This content will be overlaid with a loading spinner when the async action is triggered.
                The overlay prevents user interaction while loading.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded">Item 1</div>
                <div className="bg-gray-100 p-3 rounded">Item 2</div>
                <div className="bg-gray-100 p-3 rounded">Item 3</div>
                <div className="bg-gray-100 p-3 rounded">Item 4</div>
              </div>
            </div>
          </LoadingOverlay>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Usage Examples</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Code Examples:</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p><code className="bg-white px-2 py-1 rounded">{'<Spinner size="md" color="primary" />'}</code></p>
            <p><code className="bg-white px-2 py-1 rounded">{'<LoadingButton loading={isLoading} onClick={handleClick}>Save</LoadingButton>'}</code></p>
            <p><code className="bg-white px-2 py-1 rounded">{'<LoadingOverlay isLoading={isLoading}>Content</LoadingOverlay>'}</code></p>
            <p><code className="bg-white px-2 py-1 rounded">{'const { isLoading, withLoading } = useLoading();'}</code></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingExamples;
