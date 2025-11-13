import { FC, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  PackageCheck,
  CreditCard,
  Truck,
  User,
  Undo2,
  Headset,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
} from "lucide-react";

const helpTopics = [
  {
    icon: <PackageCheck className="w-6 h-6 text-yellow-500" />,
    title: "Track Your Orders",
    desc: "Track or manage your orders.",
    steps: [
      "Go to your Orders page.",
      "Find the order you want to track.",
      "Click 'Track Shipment'.",
      "View detailed tracking status.",
    ],
  },
  {
    icon: <CreditCard className="w-6 h-6 text-yellow-500" />,
    title: "Payment Issues",
    desc: "Payment methods & issues.",
    steps: [
      "Go to Payment settings.",
      "Select a payment method.",
      "Add or remove cards as needed.",
      "Check billing history if issues occur.",
    ],
  },
  {
    icon: <Truck className="w-6 h-6 text-yellow-500" />,
    title: "Shipping Updates",
    desc: "Delivery updates & logistics.",
    steps: [
      "Check estimated delivery time on Orders page.",
      "Contact support if delivery is delayed.",
      "Ensure address is updated correctly.",
    ],
  },
  {
    icon: <User className="w-6 h-6 text-yellow-500" />,
    title: "Account Security",
    desc: "Manage login & security.",
    steps: [
      "Go to Account Settings.",
      "Update your password regularly.",
      "Enable two-factor authentication for security.",
    ],
  },
  {
    icon: <Undo2 className="w-6 h-6 text-yellow-500" />,
    title: "Refund Request",
    desc: "Request or track refunds.",
    steps: [
      "Go to Orders page.",
      "Select the item and click 'Request Refund'.",
      "Follow the steps shown.",
      "Track refund status under Refunds section.",
    ],
  },
  {
    icon: <Headset className="w-6 h-6 text-yellow-500" />,
    title: "Customer Support",
    desc: "Need help? Contact our team.",
    steps: [
      "Use the chat icon on bottom-right.",
      "Choose a support category.",
      "Wait for an available agent to respond.",
    ],
  },
];

const faqData = [
  {
    question: "How can I track my order?",
    answer: "Go to the Orders section, select the order and click on 'Track Shipment'.",
  },
  {
    question: "What payment methods are available?",
    answer: "We accept credit/debit cards, PayPal, and AliPay.",
  },
  {
    question: "How can I request a refund?",
    answer: "Visit the Refunds page, select the order and follow the steps provided.",
  },
];

const HelpCenter: FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [expandedTopicIndex, setExpandedTopicIndex] = useState<number | null>(null);

  const toggleTopic = (index: number) => {
    setExpandedTopicIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-gray-900">Hi, what can we help you with?</h1>
        <p className="text-gray-600 mt-2 font-semibold text-sm">
          Get answers, explore topics, or contact support.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search help articles..."
            className="w-full py-3 pl-4 pr-4 rounded-xl shadow-md bg-white text-gray-800 placeholder-gray-500 focus:ring-0 focus:outline-none text-sm font-semibold transition-all duration-300"
          />
          <button className="bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Help Topics (No Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {helpTopics.map((topic, index) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group rounded-2xl bg-gradient-to-br from-white to-yellow-50 shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-4 shadow-inner ring-2 ring-yellow-300 group-hover:scale-105 transform transition">
              {topic.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-1">
              {topic.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{topic.desc}</p>
            <button
              onClick={() => toggleTopic(index)}
              className="inline-flex items-center text-sm text-yellow-600 font-medium hover:underline transition"
            >
              {expandedTopicIndex === index ? "Hide solution" : "Show solution"}
              {expandedTopicIndex === index ? (
                <ChevronUp className="ml-1 w-4 h-4" />
              ) : (
                <ChevronDown className="ml-1 w-4 h-4" />
              )}
            </button>

            {expandedTopicIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 text-sm text-gray-800 bg-yellow-50/60 rounded-lg p-4 space-y-2"
              >
                <ol className="list-decimal list-inside space-y-1">
                  {topic.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </motion.div>
            )}

            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-yellow-400 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition" />
          </motion.div>
        ))}
      </div>

      {/* FAQ Accordion (No Borders) */}
      <div className="max-w-2xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl bg-white shadow-md hover:shadow-lg p-5 transition duration-300"
            >
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-gray-800 hover:text-yellow-600 transition">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="text-yellow-500" />
                ) : (
                  <ChevronDown className="text-yellow-500" />
                )}
              </button>
              {openFAQ === index && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-sm text-gray-600 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Support (No Borders) */}
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Still need help?</h3>
          <p className="text-sm font-semibold text-gray-600">Reach out to our support team 24/7.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold transition">
            <Mail className="w-4 h-4" />
            Email Us
          </button>
          <button className="flex items-center gap-2 text-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-100 transition">
            <Phone className="w-4 h-4" />
            Call Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
