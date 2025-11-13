/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Store {
  id: number;
  name: string;
  isFollowing: boolean;
  image: string;
  slug: string;
}

const Following = ({ defaultTab = "following" }) => {
  // State management
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState("");
  // const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("default");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const router = useRouter();
  
const fetchFollowedStores = async (userEmail: string) => {
  try {
    const response = await fetch(`${baseUrl}/get_followed_stores.php?user_email=${userEmail}`);
    const result = await response.json();

    // Log the result to check the response structure
    console.log('API Response:', result);

    if (result.success) {
      // Ensure followed_stores is an array before attempting to map
      const followedStores = Array.isArray(result.followed_stores)
        ? result.followed_stores.map((store: { store_id: number; store_name: string; store_logo: string; slug: string }) => ({
            id: store.store_id,
            name: store.store_name,
            isFollowing: true, // since it's from followed stores
            image: store.store_logo || 'default-image-placeholder-url',
            slug: store.slug, // Include slug here
          }))
        : [];

      setStores(followedStores);
    } else {
      console.error('Failed to fetch followed stores:', result.message);
    }
  } catch (error) {
    console.error('Error fetching followed stores:', error);
  }
};



useEffect(() => {
  if (user?.email) {
    fetchFollowedStores(user.email);
  }
}, [user?.email]); 
  
  // Extract unique categories for filter
  // const categories = [...new Set(stores.map(store => store.category))];

  // Update activeTab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
    // Reset filters when changing tabs
    setSearchQuery("");
    setSortBy("default");
    setSelectedCategories([]);
  }, [defaultTab]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortBy(e.target.value);
  };

 const toggleFollowStatus = async (store: Store) => {
  const userEmail = user?.email; // Assuming the `user` object is available

  if (!userEmail) {
    console.error("User email is not available.");
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("user_email", userEmail);
    formData.append("store_id", store.slug);
    formData.append("operation", "delete");
    console.log("email", userEmail);
    console.log("store id", store.slug);


    const response = await fetch(`${baseUrl}/follow_store.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData, // Sending the form data
    });

    const result = await response.json();

    if (result.status === "success") {
      // Successfully unfollowed, update the state
      setStores((prevStores) =>
        prevStores.map((s) =>
          s.id === store.id ? { ...s, isFollowing: false } : s
        )
      );
      console.log("Store unfollowed successfully.");
    } else {
      console.error("Failed to unfollow store:", result.message);
    }
  } catch (error) {
    console.error("Error while unfollowing store:", error);
  }
};



  // Toggle category selection in filter
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    setSortBy("default");
  };

  // Filter and sort stores
  const getFilteredAndSortedStores = () => {
    // First filter by tab
    let filteredStores = stores;
    
    if (activeTab === "following") {
      filteredStores = filteredStores.filter(store => store.isFollowing);
    }
    
    // Then filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filteredStores = filteredStores.filter(store => 
        store.name.toLowerCase().includes(query) 
        // store.category.toLowerCase().includes(query)
      );
    }

    
    // Then sort
    switch (sortBy) {
      case "name-asc":
        return [...filteredStores].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...filteredStores].sort((a, b) => b.name.localeCompare(a.name));
      // case "category":
      //   return [...filteredStores].sort((a, b) => a.category.localeCompare(b.category));
      default:
        return filteredStores;
    }
  };

  const filteredStores = getFilteredAndSortedStores();

  // Empty state message based on active tab
  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case "following":
        return selectedCategories.length > 0 || searchQuery
          ? "No matching stores found in your followed stores"
          : "No matching stores found in your followed stores";
      default:
        return "No stores available";
    }
  };

  // Render store card
  const renderStoreCard = (store: Store) => (
    <div key={store.id} className="flex flex-col md:flex-row bg-white border rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* <div className="relative w-full md:w-48 h-48 md:h-auto bg-gray-100 flex-shrink-0">
        <img src={`/api/placeholder/200/200`} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">
          {store.category}
        </div>
      </div> */}
      <div className="flex-grow p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-black">{store.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Store ID: #{store.id}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button 
            onClick={() => toggleFollowStatus(store)}
            className={`py-2 px-4 rounded-md transition-colors duration-200 flex items-center ${
              store.isFollowing 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-yellow-500 hover:bg-yellow-600 text-black"
            }`}
          >
            {store.isFollowing ? (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Following
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Follow
              </>
            )}
          </button>
          <button 
          onClick={() =>
                        router.push(`/store?id=${encodeURIComponent(store.slug)}`)
                      }
          className="border border-gray-300 hover:border-gray-400 text-black py-2 px-4 rounded-md transition-colors duration-200 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Visit Store
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      {/* Main content area with padding */}
      <div className="p-6">
        
        {/* Tabs */}
        <div className="flex items-center mb-6 border-b">
          {/* <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-2 text-black font-medium ${
              activeTab === "all" ? "border-b-2 border-yellow-500" : ""
            }`}
          >
            All <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{stores.length}</span>
          </button> */}
          <button
            onClick={() => setActiveTab("following")}
            className={`px-3 py-2 text-black font-medium ${
              activeTab === "following" ? "border-b-2 border-yellow-500" : ""
            }`}
          >
            Following <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{stores.filter(store => store.isFollowing).length}</span>
          </button>
          {/* <button
            onClick={() => setActiveTab("suggested")}
            className={`px-3 py-2 text-black font-medium ${
              activeTab === "suggested" ? "border-b-2 border-yellow-500" : ""
            }`}
          >
            Suggested <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{stores.filter(store => !store.isFollowing).length}</span>
          </button> */}
          <div className="flex-grow"></div>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex-1 flex">
            <input
              type="text"
              placeholder={`Search in ${activeTab === "all" ? "All Stores" : activeTab === "following" ? "Following" : "Suggested"}...`}
              className="border border-gray-200 px-4 py-2 flex-grow text-black rounded-l"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={sortBy} 
              onChange={handleSortChange}
              className="border border-gray-200 px-3 py-2 rounded text-black"
            >
              <option value="default">Sort by</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            {/* <button 
              onClick={() => setShowFilterModal(!showFilterModal)}
              className={`flex items-center px-3 py-2 rounded border ${showFilterModal ? 'bg-gray-100 border-gray-300' : 'border-gray-200'}`}
            >
              <Filter className="w-5 h-5 mr-1" />
              Filter
            </button> */}
          </div>
        </div>
        
        {/* Filter options */}
        {/* {showFilterModal && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium text-black mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category) 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-yellow-500'
                  }`}
                >
                  {category}
                </button>
              ))}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center"
                >
                  Clear
                  <X className="w-3 h-3 ml-1" />
                </button>
              )}
            </div>
          </div>
        )} */}
        
        {/* Active Filter Tags */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map(category => (
              <div key={category} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center">
                {category}
                <button 
                  onClick={() => toggleCategory(category)}
                  className="ml-1 text-yellow-800 hover:text-yellow-900"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button 
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
        
        {/* Content sections */}
        <div>
          {filteredStores.length > 0 ? (
            <div className="space-y-4">
              {filteredStores.map(store => renderStoreCard(store))}
            </div>
          ) : searchQuery || selectedCategories.length > 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 flex-1 min-h-64">
              <div className="w-16 h-16 mb-4 text-gray-400">
                <Search className="w-full h-full" />
              </div>
              <p className="text-gray-500 text-center">
                No stores found matching your search criteria.
              </p>
              {/* <button 
                onClick={clearFilters}
                className="mt-4 text-yellow-500 hover:text-yellow-600 font-medium"
              >
                Clear all filters
              </button> */}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 flex-1 min-h-64">
              <div className="w-16 h-16 mb-4 text-gray-400">
                {activeTab === "following" ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )}
              </div>
              <p className="text-gray-500 text-center">{getEmptyStateMessage()}</p>
              {/* {activeTab === "following" && filteredStores.length === 0 && !searchQuery && selectedCategories.length === 0 && (
                // <button 
                //   onClick={() => setActiveTab("suggested")}
                //   className="mt-4 text-yellow-500 hover:text-yellow-600 font-medium flex items-center"
                // >
                //   Discover Stores
                //   <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                //   </svg>
                // </button>
              )} */}
            </div>
          )}
        </div>
      </div>
      
      {/* Need Help Button */}
      {/* <div className="fixed bottom-8 right-8">
        <button className="bg-yellow-500 hover:bg-yellow-600 rounded-full shadow-lg flex items-center transition-colors duration-200">
          <div className="flex items-center p-2">
            <img src="/api/placeholder/40/40" alt="Help assistant" className="w-10 h-10 rounded-full" />
            <span className="ml-2 mr-4 text-black font-medium">Need help?</span>
          </div>
        </button>
      </div> */}

      {/* Back to top button - appears when scrolling */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 left-8 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors duration-200"
      >
        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default Following;
