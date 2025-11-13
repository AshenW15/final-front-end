/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";

const ToBeReviewed: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [activeTab, setActiveTab] = useState("awaiting");
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [orders] = useState([
    { id: "123456789", item: "Wireless Earbuds", seller: "TechGadgets", date: "April 28, 2025", price: "$49.99", image: "/api/placeholder/60/60" },
    { id: "987654321", item: "Phone Case", seller: "MobileAccessories", date: "May 2, 2025", price: "$19.99", image: "/api/placeholder/60/60" },
    { id: "456789123", item: "Smart Watch Band", seller: "WearableTech", date: "May 4, 2025", price: "$24.99", image: "/api/placeholder/60/60" },
  ]);

  const handleRatingClick = (orderId: string, rating: number) => {
    setSelectedRatings({
      ...selectedRatings,
      [orderId]: rating
    });
  };

  const handleFeedbackChange = (orderId: string, text: string) => {
    setFeedbackText({
      ...feedbackText,
      [orderId]: text
    });
  };

  const handleSubmitFeedback = (orderId: string) => {
    alert(`Feedback submitted for order ${orderId} with rating: ${selectedRatings[orderId] || 0}`);
    // In a real app, you would send this to your API
  };

  const filteredOrders = orders.filter(order => 
    order.id.includes(searchQuery) || 
    order.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StarRating = ({ orderId }: { orderId: string }) => {
    const rating = selectedRatings[orderId] || 0;
    
    return (
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(orderId, star)}
            className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Orders To Be Reviewed</h1>
        <a href="#" className="text-black font-semibold hover:underline">View My Feedback Profile</a>
      </div>

      {/* Guidelines Box */}
      {showGuidelines && (
        <div className="border border-yellow-400 bg-yellow-50 p-4 mb-6 relative">
          <button 
            className="absolute right-4 top-4 text-gray-500 hover:text-black"
            onClick={() => setShowGuidelines(false)}
          >
            ×
          </button>
          <h2 className="font-bold text-black mb-2">Guidelines</h2>
          <ol className="list-decimal pl-5 text-black">
            <li>You can leave feedback for sellers within 30 days in &quot;Orders Awaiting My Feedback&quot;.</li>
            <li>Feedback will be published when both you and the seller have left feedback, or at the end of the 30 days.</li>
            <li>
              <a href="#" className="text-black font-semibold hover:underline">Learn more about our Feedback Rating Policies</a>
            </li>
          </ol>
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button 
          className={`py-2 px-4 ${activeTab === 'awaiting' ? 'bg-yellow-400 text-black font-medium' : 'text-black hover:bg-gray-100'}`}
          onClick={() => setActiveTab('awaiting')}
        >
          Orders Awaiting My Feedback ({filteredOrders.length})
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'about' ? 'bg-yellow-400 text-black font-medium' : 'text-black hover:bg-gray-100'}`}
          onClick={() => setActiveTab('about')}
        >
          Reviews About You
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'by' ? 'bg-yellow-400 text-black font-medium' : 'text-black hover:bg-gray-100'}`}
          onClick={() => setActiveTab('by')}
        >
          Reviews By You
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row">
        <div className="flex mb-2 sm:mb-0 flex-1">
          <input
            type="text"
            placeholder="Search by Order ID, Item, or Seller"
            className="p-2 border border-gray-300 mr-2 flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2">
            Search
          </button>
        </div>
      </div>

      {activeTab === 'awaiting' && (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 bg-gray-100 p-4 font-medium text-black">
            <div>Order Details</div>
            <div>Feedback</div>
            <div>Action</div>
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className="grid grid-cols-1 md:grid-cols-3 border-b p-4 text-black">
                <div className="flex mb-4 md:mb-0">
                  <div className="mr-4">
                    <img src={order.image} alt={order.item} className="w-16 h-16 object-cover border border-gray-200" />
                  </div>
                  <div>
                    <p className="font-semibold">{order.item}</p>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-600">Date: {order.date}</p>
                    <p className="text-sm text-gray-600">Seller: {order.seller}</p>
                    <p className="text-sm font-semibold">{order.price}</p>
                  </div>
                </div>
                <div className="mb-4 md:mb-0">
                  <p className="mb-2 font-medium">Rate your experience:</p>
                  <StarRating orderId={order.id} />
                  <textarea
                    placeholder="Share your experience with this seller (optional)"
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                    rows={3}
                    value={feedbackText[order.id] || ''}
                    onChange={(e) => handleFeedbackChange(order.id, e.target.value)}
                  ></textarea>
                </div>
                <div className="flex items-start">
                  <button 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleSubmitFeedback(order.id)}
                    disabled={!selectedRatings[order.id]}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 border-b">
              <p className="mb-2 text-lg">No orders waiting for feedback</p>
              <p>When you place orders, they will appear here for you to review</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'about' && (
        <div className="p-8 text-center text-gray-500 border-b">
          <p className="mb-2 text-lg">No reviews about you yet</p>
          <p>Reviews from sellers will appear here</p>
        </div>
      )}

      {activeTab === 'by' && (
        <div className="p-8 text-center text-gray-500 border-b">
          <p className="mb-2 text-lg">No reviews by you yet</p>
          <p>Your submitted reviews will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ToBeReviewed;