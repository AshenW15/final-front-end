"use client";

import Banner from "./home/Banner";
import TodayDeals from "./home/TodayDeals";
import ShopByCategory from "./home/ShopByCategory";
import ProductListings from "./home/ProductListings";
import MobilePromotions from "./home/MobilePromotions";
import DesktopSearchBar from "./home/DesktopSearchBar";

export default function Home() {
  return (
    <main className="flex-grow">
      {/* Desktop Search Bar - Only visible on mobile */}
      <DesktopSearchBar />


      {/* Categories - Different layouts for mobile/desktop */}
      <ShopByCategory />
      
      {/* Banner with mobile and desktop versions */}
      <Banner />
      
      {/* Mobile Circular Categories - Only visible on mobile */}
      <MobilePromotions />
      
      {/* Today's Deals - Visible on all devices */}
      <TodayDeals />
      
      
      
      {/* Product Listings - Visible on all devices */}
      <ProductListings />
    </main>
  );
}