import { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { formatPriceLKR, parsePriceToNumber } from '@/lib/utils';
import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface Product {
  product_discount: number;
  product_image: any;
  product_name: string;
  product_description: string;
  product_price: string;
  product_rating: number;
  id: number;
  name: string;
  price: string;
  category: string;
  originalPrice: string;
  image: string;
  soldRanking?: string | null;
  soldDescription: string;
  rating: number;
  stock?: string;
  description: string;
  tags: string[];
  sale_end_date: string;
  discount: string;
  sale: boolean;
}

const TodayDeals: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Calculate discount percentage (same as ProductListings)
  const calculateDiscountPercentage = (originalPrice: string, currentPrice: string): number => {
    const original = parsePriceToNumber(originalPrice);
    const current = parsePriceToNumber(currentPrice);

    if (original && current && original > current) {
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      // try {
      //   const response = await fetch(`${baseUrl}/fetch_sale_products.php`);
      //   const data = await response.json();

      //   if (data.products) {
      //     const productsData: Product[] = data.products;
      //     setProducts(productsData.slice(0, 8)); // Show only first 8 products
      //   }
      // } catch (err) {
      //   console.log('Error fetching products.');
      //   console.error(err);
      // }
      try {
        axios.get(`http://127.0.0.1:8000/api/product`).then((response) => {
          console.log(response.data);
          const products = response.data;
          const onSaleProducts = products.filter((p: any) => p.is_on_sale);

          console.log(onSaleProducts);
          const productsData: Product[] = onSaleProducts;
          setProducts(productsData.slice(0, 8));
        });
      } catch (error) {}
    };

    fetchProducts();
  }, []);

  const router = useRouter();
  const handleItemView = (productId: number, sale: boolean) => {
    router.push(
      `/item?productId=${encodeURIComponent(productId)}&sale=${encodeURIComponent(sale)}`
    );
  };

  const calculateDiscountPrice = (originalPrice: string, discount: number): string => {
    const p = parsePriceToNumber(originalPrice);
    if (p == null || p <= 0 || discount <= 0) return formatPriceLKR(p || 0);

    const discountedPrice = p - (p * discount) / 100;
    return formatPriceLKR(discountedPrice);
  };

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header section matching Daraz Flash Sale */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white px-3 py-1 rounded-md font-bold text-sm">
              Flash Sale
            </div>
            <h2 className="text-2xl font-bold text-gray-900">On Sale Now</h2>
          </div>
          <button
            onClick={() => router.push('/superdeals')}
            className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1"
          >
            Shop More
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              onClick={() => handleItemView(product.id, product.sale)}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-square">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={`${baseUrl}/${product.product_image}`}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 space-y-2">
                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                  {product.product_name}
                </h3>
                <h3 className="text-sm font-light text-gray-600 line-clamp-2 leading-tight">
                  {product.product_description}
                </h3>

                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-light text-gray-400 line-clamp-2 leading-tight line-through">
                    Rs.{Number(product.product_price).toFixed(2)}
                  </h3>
                  {/* Discount Percentage next to price */}
                  {product.product_discount !== 0 &&
                    (() => {
                      return (
                        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          -{product.product_discount}%
                        </span>
                      );
                    })()}
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-orange-500">
                    {calculateDiscountPrice(product.product_price, product.product_discount)}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {/* Mobile: 1 star, Desktop: 5 stars */}
                    {Array.from({ length: 1 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs md:hidden ${
                          i < Math.floor(product.product_rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs hidden md:inline ${
                          i < Math.floor(product.product_rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.product_rating})</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shop All Button */}
        <div className="text-center mt-8">
          <motion.button
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/superdeals')}
          >
            SHOP ALL PRODUCTS
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TodayDeals;
