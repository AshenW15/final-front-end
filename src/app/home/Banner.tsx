"use client"

import { type FC, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, ArrowRight } from 'lucide-react' 
import Link from "next/link"

const Banner: FC = () => {
  // Mobile carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- REVISED STYLE CONSTANTS (Fashion Accent - Red/Pink - matching the image) ---
  const PRIMARY_COLOR = "bg-red-600"; // Primary accent color (Reddish-Pink for discount)
  const TEXT_COLOR = "text-gray-900"; // Dark text
  const ACCENT_COLOR = "text-red-600"; // Red accent for titles/prices
  const BUTTON_HOVER = "hover:bg-red-700"; // Red hover
  const BACKGROUND_COLOR = "bg-white"; // Clean white background

  // Mobile banner slides (Updated for Fashion/Accessories theme)
  const mobileSlides = [
    {
      id: 1,
      title: "SUMMER FASHION",
      subtitle: "LATEST TRENDS",
      discount: "50% OFF",
      buttonText: "SHOP WOMEN",
      bgColor: "bg-white border-b border-gray-100",
      image: "/placeholder-fashion-1.png" 
    },
    {
      id: 2,
      title: "ACCESSORIES SALE",
      subtitle: "SUNGLASSES & BAGS",
      discount: "EXTRA 20% OFF",
      buttonText: "EXPLORE ACCESSORIES",
      bgColor: "bg-white border-b border-gray-100",
      image: "/placeholder-accessories-2.png" 
    },
    {
      id: 3,
      title: "MENSWEAR NEW ARRIVAL",
      subtitle: "FORMAL & CASUAL",
      discount: "UP TO 40% OFF",
      buttonText: "SHOP MEN",
      bgColor: "bg-white border-b border-gray-100",
      image: "/placeholder-menswear-3.png" 
    }
  ];

  // Auto-slide functionality for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % mobileSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [mobileSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    // Base container: white background, clean border
    <section className={`relative overflow-hidden ${BACKGROUND_COLOR} w-full border-b border-gray-200`}>
      
      {/* Mobile Banner (Red/Pink Accent) */}
      <div className="lg:hidden">
        <div className="relative h-[180px] overflow-hidden">
          {/* Mobile Slides */}
          <div className="relative h-full">
            {mobileSlides.map((slide, index) => (
              <motion.div
                key={slide.id}
                className={`absolute inset-0 ${slide.bgColor} flex items-center px-4 ${TEXT_COLOR}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: currentSlide === index ? 1 : 0,
                  x: currentSlide === index ? 0 : currentSlide < index ? 100 : -100,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Content Container */}
                <div className="flex items-center justify-between w-full">
                  {/* Left Content */}
                  <div className="flex-1 space-y-2">
                    {/* Discount badge - Solid Red/Pink, rounded-md */}
                    <div className={`${PRIMARY_COLOR} text-white text-xs font-bold px-3 py-1 rounded-md inline-block uppercase tracking-wider`}>
                      {slide.discount}
                    </div>
                    <h2 className={`font-bold text-lg leading-tight ${TEXT_COLOR}`}>
                      {slide.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-3">
                      {slide.subtitle}
                    </p>
                    {/* Button with Red/Pink primary color, rounded-md */}
                    <button className={`${PRIMARY_COLOR} text-white px-4 py-2 rounded-md text-sm font-bold transition-colors ${BUTTON_HOVER} shadow-sm`}>
                      {slide.buttonText}
                    </button>
                  </div>
                  
                  {/* Right Content - Generic fashion/bag placeholder */}
                  <div className="flex-shrink-0 ml-4 relative">
                    <ShoppingBag className={`w-16 h-16 ${ACCENT_COLOR} opacity-50`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots Indicator - Use primary color on light background */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {mobileSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index ? `${PRIMARY_COLOR} w-6` : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Banner - REVISED for Fashion Banner Layout (Solid Color Backgrounds) */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
            
            {/* 1. Main Fashion Hero Banner (Left 2/3) - Now uses solid color background */}
            <div className="relative h-[450px] overflow-hidden rounded-lg shadow-sm">
              {/* Background Color: Light Beige/Peach for the main hero */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                // Using a light color instead of an image
                style={{ backgroundColor: '#f8f0e5' }} 
              >
              </div>
              
              {/* Content Overlay */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 p-8 flex flex-col justify-start h-full text-left"
              >
                {/* Main 50% OFF Badge - High contrast style */}
                <motion.div variants={itemVariants} className="mb-8">
                  <h1 className="text-8xl font-extrabold tracking-tighter drop-shadow-lg">
                    {/* LIMITED STOCK text is now RED on white background */}
                    <span className="bg-white text-red-600 px-3 py-1 text-4xl inline-block mr-2 rounded-sm font-bold">LIMITED STOCK</span>
                    {/* 50% OFF text is white on red background */}
                    <span className={`${PRIMARY_COLOR} text-white px-4 py-2 rounded-sm text-5xl inline-block font-bold mt-2 shadow-2xl`}>50% OFF</span>
                  </h1>
                </motion.div>
                
                {/* Text and Button (near the bottom left) */}
                <motion.div variants={itemVariants}>
                    {/* Text changed to dark text for light background */}
                    <p className="text-gray-800 text-lg font-semibold bg-white bg-opacity-70 p-2 inline-block rounded-md">
                        Explore new arrivals in women's fashion.
                    </p>
                </motion.div>
                <div className="mt-auto pt-4">
                    <Link href="/women">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            // Button is white background with dark text
                            className={`bg-white ${TEXT_COLOR} px-8 py-3 rounded-md text-lg font-bold shadow-xl transition-all flex items-center gap-2 justify-center hover:bg-gray-100`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Shop Now
                        </motion.button>
                    </Link>
                </div>
              </motion.div>
            </div>
            
            {/* 2. Secondary Accessories Banner (Right 1/3) - Light theme with Red accent */}
            <div className="grid grid-rows-2 gap-4">
              
              {/* Top Right: Exclusive Offer Banner - Now uses solid color background */}
              <div className="relative h-[220px] overflow-hidden rounded-lg shadow-sm">
                {/* Background Color: Light Lavender/Pink for the secondary banner */}
                <div 
                  className="absolute inset-0 bg-cover bg-right"
                  // Using a light color instead of an image
                  style={{ backgroundColor: '#f0e5f8' }} 
                >
                </div>
                
                {/* Content Overlay */}
                <div className="relative z-10 p-4 flex flex-col h-full justify-start items-start text-left">
                    {/* Accent badge is red */}
                    <span className={`text-xs font-bold uppercase tracking-widest ${PRIMARY_COLOR} text-white px-2 py-1 rounded-sm`}>EXCLUSIVE OFFER</span>
                    {/* Heading text is dark */}
                    <h3 className={`text-2xl font-bold mt-2 drop-shadow-md ${TEXT_COLOR}`}>
                        BROWSE
                        <span className={`block ${ACCENT_COLOR}`}>ACCESSORIES</span>
                    </h3>
                    
                    <Link href="/accessories" className="mt-auto">
                        <button className={`bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors hover:bg-gray-800 flex items-center gap-1`}>
                            Explore Now <ArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
              </div>
              
              {/* Bottom Right: Single Item Promo (Sunglasses) - Light theme with Red accent */}
              <div className="relative h-[220px] overflow-hidden rounded-lg bg-gray-100 shadow-sm flex items-center justify-center p-4">
                <div className="flex items-center space-x-4 w-full">
                    {/* Icon for Sunglasses - Replaced dummy div with a red shopping bag icon */}
                    <div className="w-1/2 h-full flex items-center justify-center">
                        <ShoppingBag className={`w-16 h-16 ${ACCENT_COLOR} opacity-70`} />
                    </div>
                    {/* Text content for sunglasses */}
                    <div className="w-1/2 space-y-1">
                        <p className={`text-sm font-semibold ${TEXT_COLOR}`}>Classic Shades</p>
                        <p className="text-xs text-gray-500">Starting at</p>
                        {/* Price accent is red */}
                        <p className={`text-xl font-bold ${ACCENT_COLOR}`}>$49.99</p>
                        <Link href="/sunglasses">
                            <button className={`text-xs font-semibold ${ACCENT_COLOR} hover:underline flex items-center mt-2`}>
                                View Item <ArrowRight className="w-3 h-3 ml-1" />
                            </button>
                        </Link>
                    </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Clean separation border */}
      <div className="border-t border-gray-200 w-full"></div>

    </section>
  )
}

export default Banner