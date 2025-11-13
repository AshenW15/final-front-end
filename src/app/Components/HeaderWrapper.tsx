/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../home/Header";
import Footer from "../home/Footer";
import SellerHeader from "./SellerHeader";
import MobileBottomNav from "./MobileBottomNav";

// Routes where the Header should NOT be shown
const NO_HEADER_ROUTES = ["/cart", "/cart/checkout"];

// Routes where the Header should be shown
const SHOW_HEADER_ROUTES = ["/", "/superdeals", "/store"];

// Routes where SellerHeader should be shown
const SELLER_HEADER_ROUTES = [ 
  "/seller/shops", 
  "/seller/categories", 
  "/seller/shoplogin", 
  "/sellerdashboard"
];

export default function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSellerRegistration, setShowSellerRegistration] = useState(false);

  const handleBecomeSellerClick = () => {
    setShowSellerRegistration(true);
    // You can handle navigation here if needed, or pass this to the Header
  };

  // Determine if the Header should be shown based on the current route
  const showHeader = (SHOW_HEADER_ROUTES.includes(pathname) || pathname.startsWith('/store')) && !NO_HEADER_ROUTES.includes(pathname);
  const showSellerHeader = SELLER_HEADER_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showHeader && (
        <Header
          onBecomeSellerClick={handleBecomeSellerClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      {showSellerHeader && <SellerHeader />}
      <main className="flex-grow pb-16 lg:pb-0">{children}</main>
      <Footer />
      {/* Mobile Bottom Navigation - Only show on main routes */}
      {showHeader && <MobileBottomNav />}
    </div>
  );
}