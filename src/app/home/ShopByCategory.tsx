/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from "react";

interface Category {
  category_id: number;
  category_name: string;
}

const ShopByCategory: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [activeCategory, setActiveCategory] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  // refs for click outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const VISIBLE_COUNT = 8;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/fetch_categories.php`);
        const data = await response.json();
        setCategories(data.categories.slice(0, 16));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const visibleCategories = categories.slice(0, VISIBLE_COUNT);
  const hiddenCategories = categories.slice(VISIBLE_COUNT);

  // CLICK OUTSIDE HANDLER
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative bg-white py-3 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">

        {/* Category Row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">

          {/* All Categories tab */}
          <button
            ref={buttonRef}
            onClick={() => {
              setActiveCategory("All");
              setShowDropdown(!showDropdown);
            }}
            className={`pb-1 transition-all ${
              activeCategory === "All"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-700 hover:text-orange-500"
            }`}
          >
            All Categories ▾
          </button>

          {/* Show only 6 categories */}
          {visibleCategories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => {
                setActiveCategory(cat.category_name);
                setShowDropdown(false);
              }}
              className={`pb-1 transition-all ${
                activeCategory === cat.category_name
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {/* Dropdown */}
        {showDropdown && hiddenCategories.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute mt-2 bg-white shadow-lg border border-gray-200 rounded-md w-56 z-50"
          >
            {hiddenCategories.map((cat) => (
              <button
                key={cat.category_id}
                onClick={() => {
                  setActiveCategory(cat.category_name);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                {cat.category_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopByCategory;
