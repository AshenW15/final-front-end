'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MessageCircle, 
  Mail, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Zap, 
  TrendingUp,
  Store,
  Clock
} from 'lucide-react';
import Header from '../../home/Header';

const LearnMorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleBecomeSellerClick = () => {
    // Handle seller registration navigation
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Zero Commission",
      description: "Keep 100% of your sales revenue",
      highlight: "No any platformy fee"
    },
    {
      icon: Users,
      title: "Ready Audience",
      description: "Access to potential customers from day one",
      highlight: "Growing user base"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get your store online in minutes",
      highlight: "Easy onboarding"
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Protected transactions and instant payouts",
      highlight: "100% secure"
    },
    {
      icon: TrendingUp,
      title: "Growth Tools",
      description: "Analytics and marketing tools included",
      highlight: "Boost your sales"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Get help whenever you need it",
      highlight: "Always here for you"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Create Account",
      description: "Sign up with your basic business information"
    },
    {
      step: "2",
      title: "Setup Store",
      description: "Add your products, descriptions, and pricing"
    },
    {
      step: "3",
      title: "Go Live",
      description: "Start selling and manage orders from your dashboard"
    }
  ];

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent("Hi! I'm interested in learning more about becoming a seller on Storevia. Can you help me get started?");
    const whatsappUrl = `https://wa.me/+94787041329?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent("Inquiry about Selling on Storevia");
    const body = encodeURIComponent("Hi,\n\nI'm interested in learning more about becoming a seller on Storevia. Could you please provide me with more information about:\n\n- How to get started\n- Commission structure\n- Support available\n- Any requirements\n\nThank you!");
    const emailUrl = `mailto:storevialink2025@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Only keep the main header. Remove any extra header above this line if present. */}
      <Header
        onBecomeSellerClick={handleBecomeSellerClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-4 rounded-full">
                <Store className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Your Business Into
              <span className="block bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
                Gold
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join Sri Lanka&apos;s newest and most seller-friendly marketplace. Get started with zero setup costs, 
              keep 100% of your earnings, and grow your business with our powerful tools.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Storevia?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-yellow-100 hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-3 rounded-xl flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 mb-2">{benefit.description}</p>
                      <span className="text-yellow-600 font-semibold text-sm">{benefit.highlight}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-amber-500 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-8">Join Our Growing Community</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold mb-2">NEW</div>
                  <div className="text-yellow-100">Platform</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">0%</div>
                  <div className="text-yellow-100">Setup Fees</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">Commission</div>
                  <div className="text-yellow-100">Free</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-yellow-100">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Ready to Get Started?
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Have questions? Our team is here to help you every step of the way. 
                Contact us through WhatsApp for instant support or email us for detailed information.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* WhatsApp Contact */}
                <motion.button
                  onClick={handleWhatsAppContact}
                  className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-semibold transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Chat on WhatsApp</span>
                </motion.button>

                {/* Email Contact */}
                <motion.button
                  onClick={handleEmailContact}
                  className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-2xl font-semibold transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="w-6 h-6" />
                  <span>Send Email</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Start Your Journey Today
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/seller/sellerregister">
                <motion.button
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(245, 158, 11, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Register as Seller
                </motion.button>
              </Link>
              <Link href="/seller">
                <motion.button
                  className="border-2 border-yellow-400 text-yellow-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Login
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LearnMorePage;
