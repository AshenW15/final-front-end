/* eslint-disable @next/next/no-img-element */
import { FC } from "react";

const Shipped: FC = () => {
  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      {/* Main content area with padding */}
      <div className="p-6">
        {/* Tabs */}
        <div className="flex items-center mb-6 border-b">
          <button className="px-3 py-2 text-black font-medium">View all</button>
          <button className="px-3 py-2 text-black font-medium">To pay</button>
          <button className="px-3 py-2 text-black font-medium">To ship</button>
          <button className="px-3 py-2 text-red-600 font-medium border-b-2 border-red-600">Shipped</button>
          <button className="px-3 py-2 text-black font-medium">Processed</button>
          <div className="flex-grow"></div>
          <button className="px-3 py-2 text-black font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Deleted orders
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 flex">
            <div className="relative">
              <select className="appearance-none border border-gray-200 rounded-l px-4 py-2 bg-white text-black">
                <option>Order</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <input
              type="text"
              placeholder="Order ID, product or store name"
              className="border-t border-b border-gray-200 px-4 py-2 flex-grow text-black"
            />
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-r">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <select className="appearance-none border border-gray-200 rounded px-4 py-2 bg-white text-black pr-8">
              <option>All / Last year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* No Orders Message */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 flex-1 min-h-64">
          <div className="w-16 h-16 mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">
            No orders yet Please <a href="#" className="text-black font-medium">switch account</a> or <a href="#" className="text-black font-medium">feedback</a>
          </p>
        </div>
      </div>

      {/* Need Help Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-yellow-500 rounded-full shadow-lg flex items-center">
          <div className="flex items-center p-2">
            <img src="/api/placeholder/40/40" alt="Help assistant" className="w-10 h-10 rounded-full" />
            <span className="ml-2 mr-4 text-black font-medium">Need help?</span>
          </div>
        </button>
      </div>
    </div>
  );
};
export default Shipped;