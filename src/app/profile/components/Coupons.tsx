import { FC, useState } from "react";

const Coupons: FC = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState("all");
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample coupon data - expanded with more variety
  const coupons = [
    { id: 1, code: "SUMMER25", discount: "25% OFF", expiry: "2025-07-31", status: "active", category: "Seasonal" },
    { id: 2, code: "WELCOME10", discount: "10% OFF", expiry: "2025-06-15", status: "active", category: "New User" },
    { id: 3, code: "FLASH50", discount: "50% OFF", expiry: "2024-12-31", status: "expired", category: "Flash Sale" },
    { id: 4, code: "FREESHIP", discount: "Free Shipping", expiry: "2024-11-30", status: "expired", category: "Shipping" },
    { id: 5, code: "SAVE20", discount: "20% OFF", expiry: "2025-08-15", status: "active", category: "General" },
    { id: 6, code: "GIFT15", discount: "$15 OFF", expiry: "2025-09-01", status: "active", category: "Gift" }
  ];

  // Filter coupons based on active tab and search term
  const filteredCoupons = coupons.filter(coupon => {
    const matchesTab = activeTab === "all" || coupon.status === activeTab;
    const matchesSearch = searchTerm === "" || 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.discount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">

      {/* Main content area with padding */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total Coupons</p>
            <p className="text-2xl font-bold text-black">{coupons.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">{coupons.filter(c => c.status === "active").length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Expired</p>
            <p className="text-2xl font-bold text-red-600">{coupons.filter(c => c.status === "expired").length}</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 border border-gray-100">
          <div className="flex">
            <button 
              className={`py-4 px-6 flex-1 font-medium transition-colors ${
                activeTab === "all" 
                  ? "text-black border-b-2 border-yellow-400 bg-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Coupons
            </button>
            <button 
              className={`py-4 px-6 flex-1 font-medium transition-colors ${
                activeTab === "active" 
                  ? "text-black border-b-2 border-yellow-400 bg-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("active")}
            >
              Active
            </button>
            <button 
              className={`py-4 px-6 flex-1 font-medium transition-colors ${
                activeTab === "expired" 
                  ? "text-black border-b-2 border-yellow-400 bg-white" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("expired")}
            >
              Expired
            </button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search by code, discount or category..." 
              className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="w-full md:w-48">
            <select className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm appearance-none bg-white">
              <option>Sort by: Newest</option>
              <option>Sort by: Expiring soon</option>
              <option>Sort by: Highest discount</option>
            </select>
          </div>
        </div>
        
        {/* Coupon Cards */}
        <div className="space-y-4">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map(coupon => (
              <div 
                key={coupon.id}
                className={`border rounded-lg shadow-sm overflow-hidden ${
                  coupon.status === "expired" ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  {/* Left side - colored strip */}
                  <div className={`w-full md:w-2 h-2 md:h-full ${
                    coupon.status === "active" ? "bg-yellow-400" : "bg-red-200"
                  }`}></div>
                  
                  <div className="p-4 md:p-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Coupon info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 flex items-center justify-center rounded-full ${
                        coupon.status === "active" ? "bg-yellow-100" : "bg-gray-100"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${
                          coupon.status === "active" ? "text-yellow-600" : "text-gray-400"
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <div>
                        <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-600 mb-1">{coupon.category}</span>
                        <h3 className="font-bold text-xl text-black">{coupon.discount}</h3>
                        <p className="text-gray-500 text-sm">Code: <span className="font-mono font-medium bg-gray-100 px-2 py-0.5 rounded">{coupon.code}</span></p>
                      </div>
                    </div>
                    
                    {/* Status and expiry */}
                    <div className="flex flex-col items-start md:items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        coupon.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        <span className={`h-2 w-2 rounded-full mr-1.5 ${
                          coupon.status === "active" ? "bg-green-600" : "bg-red-600"
                        }`}></span>
                        {coupon.status === "active" ? "Active" : "Expired"}
                      </span>
                      <p className="text-gray-500 text-sm mt-1">Expires: {coupon.expiry}</p>
                    </div>
                    
                    {/* Action button */}
                    <button 
                      className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
                        coupon.status === "active" 
                          ? "bg-yellow-400 hover:bg-yellow-500 text-black" 
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={coupon.status === "expired"}
                    >
                      {coupon.status === "active" ? "Use Now" : "Expired"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-black mb-2">No coupons available</h3>
              <p className="text-gray-500 mb-6">Check back later for discounts!</p>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg transition-colors">
                Browse Products
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Need Help Button - Fixed position */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-6 py-3 flex items-center shadow-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Need help?
        </button>
      </div>
    </div>
  );
};

export default Coupons;