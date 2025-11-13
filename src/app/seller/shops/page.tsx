/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */ 
'use client';

import React, { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Type definitions
interface ShopType {
  store_id: number;
  slug:string;
  store_name: string;
  store_logo: string;
  store_description: string;
}

const Shops: FC = () => {
  const router = useRouter();
  const [shops, setShops] = React.useState<ShopType[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [sellerId, setSellerId] = useState<string | null>(null);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

useEffect(() => {
  const userRole = sessionStorage.getItem('userRole');
  console.log("Role:", userRole);

  if (userRole === 'seller' || userRole === 'admin') {
    const id = localStorage.getItem('seller_id');
    setSellerId(id);
    console.log('Logged in seller:', id);

    if (id) {
      const fetchShops = async () => {
        try {
          const formData = new FormData();
          formData.append('seller_id', id);

          const response = await fetch(`${baseUrl}/fetch_stores.php`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to fetch shops');
          }

          const data = await response.json();
          console.log('Fetched data:', data);

          if (Array.isArray(data.stores)) {
            setShops(data.stores);
          } else {
            console.error('Data.stores is not an array', data);
            setShops([]);
          }
        } catch (error) {
          console.error('Error fetching shops:', error);
        }
      };
      fetchShops();
    }
  } else {
    router.push('/unauthorizePage');
  }
}, []);


  const handleShopSelect = (shop: ShopType): void => {
    const redirectUrl = `/seller/shoplogin?shopId=${shop.slug}&shopName=${encodeURIComponent(
      shop.store_name
    )}`;
    router.push(redirectUrl);
  };

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      localStorage.removeItem('seller_id');
      sessionStorage.setItem('userRole', 'guest');
      router.replace('/seller');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-black">Select Your Shop</h1>
        <p className="text-gray-600 text-center mb-8">Choose a shop to proceed with login</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shops.length === 0 && (
            <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center text-gray-500">
              No shops available. Please register a store.
              <div className="mt-5 ">
                <a
                  href="/seller/categories"
                  className=" bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 font-bold px-6 py-3 rounded-full text-sm sm:text-lg hover:bg-gray-800 transition"
                >
                  Register Store
                </a>
              </div>
            </div>
          )}
          {shops.map((shop) => (
            <motion.div
              key={shop.store_id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:border-yellow-400 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShopSelect(shop)}
            >
              <div className="p-6 flex flex-col items-center text-center">
                <motion.div
                  className="mb-4"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <>
                    {shop.store_logo ? (
                      <img
                        src={`${baseUrl}/${shop.store_logo}`}
                        alt={`${shop.store_name} logo`}
                        className="w-16 h-16 object-contain rounded-full border-2 border-yellow-400 p-1"
                      />
                    ) : (
                      <img
                        src={`${baseUrl}/storelogos/default_store.jpg`}
                        alt={`${shop.store_name} logo`}
                        className="w-16 h-16 object-contain rounded-full border-2 border-yellow-400 p-1"
                      />
                    )}
                  </>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2 text-black">{shop.store_name}</h3>
                <p className="text-gray-600 text-sm">{shop.store_description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shops;
