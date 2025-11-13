"use client"

import { type FC, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Store, ArrowRight, TrendingUp } from 'lucide-react'
import Link from "next/link"

const Banner: FC = () => {
  // Mobile carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Mobile banner slides
  const mobileSlides = [
    {
      id: 1,
      title: "SMART TECH TRENDS",
      subtitle: "ALL IN ONE PAGE",
      discount: "UP TO 70% OFF",
      buttonText: "SHOP NOW",
      bgColor: "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800",
      image: "/placeholder-tech.png"
    },
    {
      id: 2,
      title: "ELECTRONIC DEALS",
      subtitle: "BEST PRICES GUARANTEED",
      discount: "UP TO 60% OFF",
      buttonText: "EXPLORE",
      bgColor: "bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700",
      image: "/placeholder-electronics.png"
    },
    {
      id: 3,
      title: "GADGET PARADISE",
      subtitle: "LATEST TECHNOLOGY",
      discount: "UP TO 50% OFF",
      buttonText: "DISCOVER",
      bgColor: "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700",
      image: "/placeholder-gadgets.png"
    }
  ];

  // Auto-slide functionality for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mobileSlides.length);
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
    <section className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 w-full">
      {/* Mobile Banner */}
      <div className="lg:hidden">
        <div className="relative h-[180px] overflow-hidden">
          {/* Mobile Slides */}
          <div className="relative h-full">
            {mobileSlides.map((slide, index) => (
              <motion.div
                key={slide.id}
                className={`absolute inset-0 ${slide.bgColor} flex items-center px-4`}
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
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block">
                      {slide.discount}
                    </div>
                    <h2 className="text-white font-bold text-lg leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-white/90 text-sm mb-3">
                      {slide.subtitle}
                    </p>
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                      {slide.buttonText}
                    </button>
                  </div>
                  
                  {/* Right Content - Tech devices illustration */}
                  <div className="flex-shrink-0 ml-4 relative">
                    <div className="relative">
                      {/* Main tech device container */}
                      <div className="w-28 h-20 relative">
                        {/* Smartphone */}
                        <div className="absolute top-0 right-0 w-8 h-12 bg-white/20 rounded-lg border border-white/30 flex items-center justify-center">
                          <div className="w-6 h-8 bg-white/40 rounded"></div>
                        </div>
                        
                        {/* Laptop */}
                        <div className="absolute bottom-0 left-0 w-16 h-10 bg-white/20 rounded border border-white/30">
                          <div className="w-full h-2 bg-white/30 rounded-t"></div>
                        </div>
                        
                        {/* Smart watch */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-white/25 rounded-full border border-white/40 flex items-center justify-center">
                          <div className="w-4 h-4 bg-white/40 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {mobileSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-6 h-1 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Banner - Keep Original */}
      <div className="hidden lg:block">
        {/* Hero carousel container */}
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Main hero content */}
          <div className="relative z-10 flex items-center h-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left side - Text content */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center lg:text-left space-y-6"
                >
                  {/* Discount badge */}
                  <motion.div 
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 bg-red-500 text-white font-bold px-6 py-2 rounded-full text-lg shadow-lg"
                  >
                    <span>UP TO 70% OFF</span>
                  </motion.div>
                  
                  {/* Main heading */}
                  <motion.div variants={itemVariants}>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                      Mega Sale Event
                      <span className="block text-yellow-200">
                        Best Deals Here!
                      </span>
                    </h1>
                  </motion.div>
                  
                  {/* CTA Buttons */}
                  <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link href="/shop">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-yellow-600 px-8 py-4 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center"
                      >
                        <Store className="w-6 h-6" />
                        Shop Now
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </Link>
                    
                    <Link href="/seller">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold backdrop-blur-sm bg-white/10 hover:bg-white/20 flex items-center gap-2 justify-center transition-all"
                      >
                        <TrendingUp className="w-6 h-6" />
                        Start Selling
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>
                
                {/* Right side - Product showcase */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Product showcase cards */}
                  <div className="relative">
                    {/* Main product card */}
                    <motion.div
                      className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/40 max-w-sm"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="text-center space-y-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                          <Store className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Featured Products</h3>
                        <div className="text-2xl font-bold text-yellow-600">Best Prices</div>
                        <p className="text-gray-600">Amazing deals await you</p>
                      </div>
                    </motion.div>
                    
                    {/* Floating discount badges */}
                    <motion.div
                      className="absolute -top-4 -left-4 bg-red-500 text-white rounded-xl p-3 shadow-lg"
                      animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">50%</div>
                        <div className="text-xs">OFF</div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      className="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-xl p-3 shadow-lg"
                      animate={{ y: [0, 6, 0], rotate: [0, -2, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">FREE</div>
                        <div className="text-xs">SHIP</div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 60" className="w-full h-8 md:h-12">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1"/>
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path
            d="M0,30 C240,45 480,15 720,30 C960,45 1200,15 1440,30 L1440,60 L0,60 Z"
            fill="url(#waveGradient)"
          />
        </svg>
      </div>
    </section>
  )
}

export default Banner