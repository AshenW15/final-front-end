"use client";
import { motion } from "framer-motion";

// Data for Features
const features = [
  {
    title: "Easy Product Management",
    description: "Effortlessly add, edit, and manage your products with our intuitive dashboard.",
    icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  },
  {
    title: "Real-Time Analytics",
    description: "Track your sales, orders, and customer behavior with detailed analytics.",
    icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    title: "Secure Payments",
    description: "Ensure safe and secure transactions for you and your customers.",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  },
];

// Color palette (same as Orders page)
const COLORS = {
  primary: "#FFC107", // Yellow (matching your sidebar)
  secondary: "#FFF8E1", // Very light yellow
  accent1: "#FFCA28", // Brighter orange-yellow
  accent2: "#FF8A65", // Softer coral
  accent3: "#AB47BC", // Lighter purple for contrast
  accent4: "#4DD0E1", // Lighter teal for contrast
  grey1: "#FFFFFF", // Pure white
  grey2: "#F5F5F5", // Very light gray
  textPrimary: "#212121", // Softer black for readability
  textSecondary: "#616161", // Lighter gray for secondary text
};

// Background gradient
const BG_GRADIENT = "linear-gradient(to right bottom, #FFFFFF, #FFFDE7, #FFFFFF)";

const LearnAboutStorevia = () => {
  // Animated container variants (same as Orders)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br flex relative overflow-hidden font-poppins"
      style={{ background: BG_GRADIENT }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative Background Elements (same as Orders) */}
      <motion.div
        className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: COLORS.primary }}
        animate={{
          x: ["-5%", "5%", "-5%"],
          y: ["-5%", "5%", "-5%"],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-52 h-52 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: COLORS.secondary }}
        animate={{
          x: ["5%", "-5%", "5%"],
          y: ["5%", "-5%", "5%"],
        }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: COLORS.accent1 }}
        animate={{
          x: ["10%", "-10%", "10%"],
          y: ["10%", "-10%", "10%"],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />

      {/* Main Content */}
      <motion.div variants={fadeIn} className="flex-1 p-6 lg:p-8 z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-8"
          variants={itemVariants}
        >
          <motion.div className="flex items-center">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-primary to-accent1 flex items-center justify-center rounded-xl mr-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2zm0 2c-2.21 0-4 1.79-4 4v2h8v-2c0-2.21-1.79-4-4-4zm-7 4v2h2v-2H5zm14 0v2h-2v-2h2z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Learn About Storevia</h1>
              <p className="text-gray-500">Discover how Storevia can help your business grow</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Introduction Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What is Storevia?</h2>
          <p className="text-gray-700">
            Storevia is a leading e-commerce platform designed to help sellers like you grow their businesses online. With a focus on simplicity and efficiency, Storevia provides tools to manage products, track sales, and connect with customers—all in one place. Our mission is to empower small businesses by providing a seamless selling experience with robust support and insights.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Storevia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-sm"
                whileHover={{ scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-3">
                  <svg
                    className="h-6 w-6 text-yellow-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-700">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Started with Storevia</h2>
          <p className="text-gray-700 mb-4">
            Ready to take your store to the next level? Explore our features, connect with our community, and start growing your business today.
          </p>
          <motion.button
            className="text-white px-4 py-2 rounded-lg font-medium"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Dashboard
          </motion.button>
        </motion.div> */}
      </motion.div>
    </motion.div>
  );
};

export default LearnAboutStorevia;