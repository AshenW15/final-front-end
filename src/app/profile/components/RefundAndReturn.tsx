/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from "react";
import { RefreshCcw, XCircle, Search } from "lucide-react";

type RefundStatus = "Pending" | "Approved" | "Rejected";

interface RefundItem {
  id: string;
  product: string;
  date: string;
  amount: string;
  status: RefundStatus;
  image: string;
  type: "Refund" | "Return";
}

const sampleRefunds: RefundItem[] = [
  {
    id: "R-1001",
    product: "Wireless Earbuds",
    date: "2025-08-20",
  amount: "Rs 2,500.00",
    status: "Pending",
    image: "https://images.unsplash.com/photo-1516321310766-66f0d8c93b92?w=100&q=80",
    type: "Refund",
  },
  {
    id: "R-1002",
    product: "Smart Watch",
    date: "2025-08-15",
  amount: "Rs 7,200.00",
    status: "Approved",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&q=80",
    type: "Return",
  },
  {
    id: "R-1003",
    product: "Bluetooth Speaker",
    date: "2025-08-10",
  amount: "Rs 3,100.00",
    status: "Rejected",
    image: "https://images.unsplash.com/photo-1586952513609-37338b32a40d?w=100&q=80",
    type: "Refund",
  },
];

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const typeColor = {
  Refund: "bg-blue-100 text-blue-700",
  Return: "bg-purple-100 text-purple-700",
};

const RefundAndReturn: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "Refund" | "Return">("all");

  const filteredRefunds = sampleRefunds.filter(
    (item) =>
      (activeTab === "all" || item.type === activeTab) &&
      item.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabCounts = {
    all: sampleRefunds.length,
    Refund: sampleRefunds.filter((item) => item.type === "Refund").length,
    Return: sampleRefunds.filter((item) => item.type === "Return").length,
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 min-h-screen">
      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mr-4">
            <RefreshCcw className="w-7 h-7 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">Refund and Return</h1>
            <p className="text-sm text-gray-500">Manage your refunds and returns here.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center mb-6 border-b border-gray-200 overflow-x-auto">
          {[
            { key: "all", label: "All" },
            { key: "Refund", label: "Refunds" },
            { key: "Return", label: "Returns" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 whitespace-nowrap font-medium transition-colors text-sm sm:text-base ${
                activeTab === tab.key
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-black hover:text-red-600'
              }`}
            >
              {tab.label}
              <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tabCounts[tab.key as keyof typeof tabCounts] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 flex relative w-full mb-6">
          <input
            type="text"
            placeholder="Search in refund/return"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 px-4 py-2 pl-10 w-full text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex flex-col flex-1">
          {filteredRefunds.length > 0 ? (
            filteredRefunds.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row bg-white border rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-full md:w-32 h-32 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.product}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow p-4 flex flex-col justify-between">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-black">{item.product}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[item.type]}`}>
                              {item.type}
                            </span>
                            <span className="text-gray-500 text-xs">{item.date}</span>
                          </div>
                        </div>
                        <div
                          className={`flex items-center ${
                            item.status === 'Pending'
                              ? 'text-yellow-500 bg-yellow-100'
                              : item.status === 'Approved'
                              ? 'text-green-500 bg-green-100'
                              : item.status === 'Rejected'
                              ? 'text-red-500 bg-red-100'
                              : ''
                          } px-2 py-1 rounded-md text-xs font-medium`}
                        >
                          {item.status === "Rejected" && (
                            <XCircle className="w-4 h-4 mr-1 text-red-500" />
                          )}
                          <span className="capitalize">{item.status}</span>
                        </div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-gray-500 text-sm">
                          Amount: <span className="font-semibold text-black">{item.amount}</span>
                        </p>
                        <p className="text-gray-500 text-sm">
                          Request ID: <span className="font-mono">{item.id}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 border border-gray-200 shadow-md">
              <div className="w-16 h-16 mb-4 text-gray-400">
                <Search className="w-16 h-16" />
              </div>
              <p className="text-gray-500 text-center mb-4">
                No refund or return requests found matching your search.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 border border-gray-200 shadow-md">
              <div className="w-16 h-16 mb-4 text-gray-400">
                <RefreshCcw className="w-16 h-16" />
              </div>
              <p className="text-gray-500 text-center">
                No refund or return requests at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundAndReturn;