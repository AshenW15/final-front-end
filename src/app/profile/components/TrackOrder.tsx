import { useState, useEffect } from "react";

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  date: string;
  time: string;
  description?: string;
  isCurrent?: boolean;
}

interface TrackOrderProps {
  orderId: string;
  onClose: () => void;
}

const TrackOrder = ({ orderId, onClose }: TrackOrderProps) => {
  const [trackingData, setTrackingData] = useState<{
    orderNumber: string;
    estimatedDelivery: string;
    carrier: string;
    status: "processing" | "shipped" | "out-for-delivery" | "delivered";
    events: TrackingEvent[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const sampleData = {
          orderNumber: orderId,
          estimatedDelivery: "2025-06-15",
          carrier: "Lightning Express",
          status: "shipped" as "processing" | "shipped" | "out-for-delivery" | "delivered",
          events: [
            {
              id: "1",
              status: "Order Confirmed",
              location: "Digital Store",
              date: "2025-06-08",
              time: "10:30 AM",
              description: "Your order has been confirmed and payment processed.",
              isCurrent: false
            },
            {
              id: "2",
              status: "Processing",
              location: "Fulfillment Center",
              date: "2025-06-09",
              time: "02:15 PM",
              description: "Items are being prepared for shipment.",
              isCurrent: false
            },
            {
              id: "3",
              status: "Shipped",
              location: "Distribution Hub",
              date: "2025-06-10",
              time: "09:45 AM",
              description: "Package is on its way to you.",
              isCurrent: true
            },
            {
              id: "4",
              status: "Out for Delivery",
              location: "Local Facility",
              date: "2025-06-14",
              time: "08:00 AM"
            },
            {
              id: "5",
              status: "Delivered",
              location: "Your Address",
              date: "2025-06-15",
              time: "03:30 PM"
            }
          ]
        };
        setTrackingData(sampleData);
      } catch (error) {
        console.error("Error fetching tracking data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(onClose, 300);
  };

  const getStatusColor = (status: string, isCurrent?: boolean) => {
    if (isCurrent) return "bg-yellow-500 text-white shadow-lg";
    
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "out for delivery":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "out for delivery":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "shipped":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case "processing":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        showModal ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out ${
          showModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Track Your Order</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:rotate-90 transform"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 animate-pulse">Loading tracking information...</p>
            </div>
          ) : trackingData ? (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">{trackingData.orderNumber}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Delivery Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Carrier</p>
                    <p className="font-semibold text-gray-900">{trackingData.carrier}</p>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className={`flex items-center justify-between p-4 rounded-lg ${getStatusColor(trackingData.status, true)} transform hover:scale-105 transition-transform duration-200`}>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(trackingData.status)}
                  <span className="font-medium capitalize">{trackingData.status.replace(/-/g, ' ')}</span>
                </div>
                <button className="text-sm font-medium hover:underline">
                  Share Status
                </button>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-4">
                  {trackingData.events.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative transform transition-all duration-500 hover:translate-x-2 ${
                        index <= 2 ? 'opacity-100' : 'opacity-50'
                      }`}
                      style={{ 
                        animationDelay: `${index * 150}ms`,
                        animation: showModal ? 'slideIn 0.6s ease-out forwards' : 'none'
                      }}
                    >
                      <div className={`absolute left-0 w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center ${
                        event.isCurrent 
                          ? 'bg-yellow-500 animate-pulse scale-110' 
                          : index <= 2 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                      }`}>
                        {event.isCurrent && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>

                      <div className={`ml-10 bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 ${
                        event.isCurrent ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{event.status}</h4>
                          <div className="text-right text-sm">
                            <p className="font-medium text-gray-900">{event.date}</p>
                            <p className="text-gray-500">{event.time}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                        {event.description && (
                          <p className="text-sm text-gray-500">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load tracking information</h3>
              <p className="text-gray-600">We couldn&apos;t find tracking details for this order.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-200 shadow-md"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200">
            Contact Support
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TrackOrder;