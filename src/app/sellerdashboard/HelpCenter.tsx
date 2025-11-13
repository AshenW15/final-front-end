'use client';
import { motion } from 'framer-motion';

// Data for FAQs and Support Options
const faqs = [
  {
    question: 'How do I add a new product to my store?',
    answer:
      "To add a new product, go to the Products tab in your dashboard, click on 'Add New Product,' and fill in the required details such as product name, price, and description. Make sure to upload high-quality images to attract more customers.",
  },
  {
    question: 'What should I do if an order is delayed?',
    answer:
      'If an order is delayed, first check the order status in the Orders tab. Contact the shipping provider for updates. If the issue persists, reach out to the customer through the messaging system to inform them of the delay and provide a resolution.',
  },
  {
    question: 'How can I update my store profile?',
    answer:
      'Navigate to the Store Profile tab in your dashboard. Here, you can update your store name, logo, description, and contact information. Save your changes to reflect the updates on your storefront.',
  },
];

const supportOptions = [
  {
    title: 'Contact Support',
    description: 'Reach out to our support team for immediate assistance.',
    action: 'Email Us',
    toMail: function () {
      const recipientEmail = 'storevialink2025@gmail.com'; // Predefined email address
      const subject = 'Support Request';
      const body = 'Hello, I need assistance with...'; // Placeholder body text
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;

      // This will open the default email client
      window.location.href = mailtoLink;
    },
  },
  // {
  //   title: "Live Chat",
  //   description: "Chat with a support agent in real-time for quick solutions.",
  //   action: "Start Chat",
  // },
  // {
  //   title: "Community Forum",
  //   description: "Join our seller community to share tips and get advice.",
  //   action: "Visit Forum",
  // },
];

// Color palette (same as Orders page)
const COLORS = {
  primary: '#FFC107', // Yellow (matching your sidebar)
  secondary: '#FFF8E1', // Very light yellow
  accent1: '#FFCA28', // Brighter orange-yellow
  accent2: '#FF8A65', // Softer coral
  accent3: '#AB47BC', // Lighter purple for contrast
  accent4: '#4DD0E1', // Lighter teal for contrast
  grey1: '#FFFFFF', // Pure white
  grey2: '#F5F5F5', // Very light gray
  textPrimary: '#212121', // Softer black for readability
  textSecondary: '#616161', // Lighter gray for secondary text
};

// Background gradient
const BG_GRADIENT = 'linear-gradient(to right bottom, #FFFFFF, #FFFDE7, #FFFFFF)';

const HelpCenter = () => {
  // Animated container variants (same as Orders)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
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
          x: ['-5%', '5%', '-5%'],
          y: ['-5%', '5%', '-5%'],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-52 h-52 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: COLORS.secondary }}
        animate={{
          x: ['5%', '-5%', '5%'],
          y: ['5%', '-5%', '5%'],
        }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: COLORS.accent1 }}
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Help Center</h1>
              <p className="text-gray-500">Find answers and get support for your store</p>
            </div>
          </motion.div>
        </motion.div>

        {/* FAQs Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border-b border-gray-100 pb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <p className="text-gray-700 mt-2">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Support Options */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Get Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-4 rounded-lg shadow-sm"
                whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-medium text-gray-900">{option.title}</h3>
                <p className="text-gray-700 mt-2">{option.description}</p>
                <motion.button
                  className="text-white px-4 py-2 mt-4 rounded-lg font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => option.toMail()}
                >
                  {option.action}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Resources</h2>
          <ul className="space-y-2">
            {[
              'Seller Guide: Getting Started with Storevia',
              'Best Practices for Increasing Sales',
              'How to Handle Customer Reviews',
            ].map((resource, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <a href="#" className="text-yellow-500 hover:underline">
                  {resource}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HelpCenter;
