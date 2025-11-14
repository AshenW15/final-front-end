'use client';

import { useState, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Animation variants from the original Header
const searchButtonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
};

interface searchHistory {
  search_keyword_name: string;
  search_id: number;
}

export default function DesktopSearchBar() {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isSearchHistoryOpen, setIsSearchHistoryOpen] = useState(false);
  const [history] = useState<searchHistory[]>([]);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle search functionality (from original Header)
  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (localSearchQuery.trim()) {
        router.push(`/search?query=${encodeURIComponent(localSearchQuery)}`);
        setIsSearchHistoryOpen(false);
      }
    },
    [localSearchQuery, router]
  );

  // Handle input change (from original Header)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (setLocalSearchQuery) {
      setLocalSearchQuery(value);
    }
  };

  // Handle click outside to close dropdown
  // const handleClickOutside = useCallback((event: MouseEvent) => {
  //   if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
  //     setIsSearchHistoryOpen(false);
  //   }
  // }, []);

  return (
    <div className="lg:hidden bg-yellow-500 px-4 py-3 sticky top-0 z-50">
      <div className="relative w-full" ref={searchBarRef}>
        <form onSubmit={handleSearch}>
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-1.5 bg-white hover:shadow-sm transition-all duration-200">
            <input
              type="text"
              placeholder="Search in Storevia"
              value={localSearchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsSearchHistoryOpen(true)}
              className="bg-transparent outline-none text-gray-700 w-full placeholder-gray-400 text-sm"
            />

            {localSearchQuery && (
              <motion.button
                onClick={() => setLocalSearchQuery('')}
                type="button"
                whileHover="hover"
                whileTap="tap"
                className="rounded-full p-1 hover:bg-gray-200 transition"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-600" />
              </motion.button>
            )}

            <motion.button
              type="submit"
              variants={searchButtonVariants}
              whileHover="hover"
              whileTap="tap"
              className="p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </form>

        {/* Search History Dropdown */}
        <AnimatePresence>
          {isSearchHistoryOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Search className="w-4 h-4 text-yellow-500" /> Search History
                </h3>
                <button
                  onClick={() => setIsSearchHistoryOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {history.length > 0 ? (
                <div className="max-h-48 overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item.search_id}
                      onClick={() => {
                        setLocalSearchQuery(item.search_keyword_name);
                        handleSearch();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      {item.search_keyword_name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">No search history available</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
