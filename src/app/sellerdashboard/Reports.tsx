/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
  Area,
} from "recharts";

// Data for LineChart (Deals, Revenue, and Customers over different time periods)
const rawData = {
  Day: [
    { day: "1", Deals: 50, Revenue: 100, Customers: 25 },
    { day: "2", Deals: 60, Revenue: 120, Customers: 35 },
    { day: "3", Deals: 55, Revenue: 110, Customers: 30 },
    { day: "4", Deals: 75, Revenue: 150, Customers: 45 },
    { day: "5", Deals: 85, Revenue: 170, Customers: 55 },
  ],
  Week: [
    { week: "W1", Deals: 200, Revenue: 400, Customers: 120 },
    { week: "W2", Deals: 250, Revenue: 500, Customers: 150 },
    { week: "W3", Deals: 220, Revenue: 450, Customers: 130 },
    { week: "W4", Deals: 270, Revenue: 480, Customers: 160 },
  ],
  Month: [
    { month: "Jan", Deals: 500, Revenue: 1000, Customers: 300 },
    { month: "Feb", Deals: 1000, Revenue: 800, Customers: 560 },
    { month: "Mar", Deals: 800, Revenue: 1200, Customers: 420 },
    { month: "Apr", Deals: 1200, Revenue: 1000, Customers: 650 },
    { month: "May", Deals: 1500, Revenue: 900, Customers: 800 },
    { month: "Jun", Deals: 1000, Revenue: 1100, Customers: 540 },
  ],
  Year: [
    { year: "2023", Deals: 3000, Revenue: 3500, Customers: 1500 },
    { year: "2024", Deals: 3200, Revenue: 3800, Customers: 1700 },
    { year: "2025", Deals: 3500, Revenue: 4000, Customers: 2000 },
  ],
};

// Data for PieChart (lead sources)
const pieChartData = [
  { name: "Website", value: 400 },
  { name: "Referrals", value: 300 },
  { name: "Social Media", value: 250 },
  { name: "Ads", value: 200 },
  { name: "Partners", value: 150 },
  { name: "Others", value: 100 },
];

// Updated color palette with yellow theme
const COLORS = {
  primary: "#FFC107", // Yellow (matching your sidebar)
  secondary: "#FFD54F", // Light yellow
  accent1: "#FF9800", // Orange-yellow
  accent2: "#FF5722", // Coral (complementary to yellow)
  accent3: "#8C52FF", // Purple (unchanged, for contrast)
  accent4: "#5CE1E6", // Teal (unchanged, for contrast)
  grey1: "#F9FAFB",
  grey2: "#F3F4F6",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
};

// Pie chart colors with yellow tones
const PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent1,
  COLORS.accent2,
  COLORS.accent3,
  COLORS.accent4,
];

// Background gradient with a hint of yellow
const BG_GRADIENT = "linear-gradient(to right bottom, #F9FAFB, #FFF9C4, #FFFFFF)";

// Custom Tooltip for LineChart
const CustomLineTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { [key: string]: string | number } }[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const xKey = Object.keys(data).find(
      (key) => key !== "Deals" && key !== "Revenue" && key !== "Customers"
    ) || "month";
    return (
      <div
        style={{
          backgroundColor: COLORS.grey1,
          border: `1px solid ${COLORS.grey2}`,
          borderRadius: "12px",
          padding: "12px",
          fontSize: "14px",
          color: COLORS.textPrimary,
          boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ marginBottom: "8px", fontWeight: "bold" }}>{data[xKey]}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                background: PIE_COLORS[index % PIE_COLORS.length],
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            <span>
              {entry.name}:{" "}
              {entry.name === "Revenue"
                ? `$${Number(entry.value).toLocaleString()}`
                : Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Label for PieChart
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-sm font-semibold"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

// Progress Ring Component for Stats Cards
const ProgressRing = ({
  percentage,
  color = COLORS.accent1,
  size = 42,
}: {
  percentage: number;
  color?: string;
  size?: number;
}) => {
  const radius = size / 2;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle
        stroke={COLORS.grey2}
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <motion.circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1, delay: 0.2 }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fill={COLORS.textPrimary}
        className="text-xs font-semibold transform rotate-90"
      >
        {percentage}%
      </text>
    </svg>
  );
};

// Progress Bar Component for Table
const ProgressBar = ({ value, max, color }: { value: number; max: number; color: string }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="h-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

// LineChart Component
const LineChart = ({
  data,
  xDataKey,
}: {
  data: Array<{ [key: string]: string | number }>;
  xDataKey: string;
}) => (
  <div className="h-72 bg-white rounded-xl p-6 shadow-sm">
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grey2} />
        <XAxis
          dataKey={xDataKey}
          stroke={COLORS.textSecondary}
          tick={{ fontSize: 12, fill: COLORS.textSecondary }}
        />
        <YAxis
          stroke={COLORS.textSecondary}
          tickFormatter={(value) => Number(value).toLocaleString()}
          tick={{ fontSize: 12, fill: COLORS.textSecondary }}
        />
        <Tooltip content={<CustomLineTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: "12px", fontSize: "14px", color: COLORS.textPrimary }}
        />
        <Line
          type="monotone"
          dataKey="Deals"
          stroke={COLORS.primary}
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="Revenue"
          stroke={COLORS.accent1}
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="Customers"
          stroke={COLORS.accent3}
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          animationDuration={1500}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
);

// PieChart Component
const PieChart = () => (
  <div className="h-72 bg-white rounded-xl p-6 shadow-sm">
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1500}
        >
          {pieChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
              style={{ transition: "transform 0.3s ease" }}
              onMouseEnter={(e: any) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e: any) => (e.target.style.transform = "scale(1)")}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => Number(value).toLocaleString("en-US")}
          wrapperStyle={{ color: COLORS.textPrimary, fontSize: "14px" }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ paddingLeft: "20px", fontSize: "14px", color: COLORS.textPrimary }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  </div>
);

// Bar Chart Component for Sales Insights
const SalesBarChart = ({ data }: { data: Array<{ [key: string]: string | number }> }) => (
  <div className="h-72 bg-white rounded-xl p-6 shadow-sm">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grey2} />
        <XAxis
          dataKey="month"
          stroke={COLORS.textSecondary}
          tick={{ fontSize: 12, fill: COLORS.textSecondary }}
        />
        <YAxis
          stroke={COLORS.textSecondary}
          tickFormatter={(value) => Number(value).toLocaleString()}
          tick={{ fontSize: 12, fill: COLORS.textSecondary }}
        />
        <Tooltip
          formatter={(value) => Number(value).toLocaleString("en-US")}
          wrapperStyle={{ color: COLORS.textPrimary }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "12px", fontSize: "14px", color: COLORS.textPrimary }}
        />
        <Bar
          dataKey="Deals"
          fill={COLORS.primary}
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        />
        <Area
          type="monotone"
          dataKey="Customers"
          fill={COLORS.accent4}
          stroke={COLORS.accent3}
          fillOpacity={0.3}
          animationDuration={1500}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

// Animated Counter Component
const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  duration = 1.5,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="font-bold">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Pulse Animation for notification dot
const PulseNotification = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent2"></span>
  </span>
);

const Reports = () => {
  const [timeFilter, setTimeFilter] = useState("Month");
  const [showSalesInsights, setShowSalesInsights] = useState(false);

  // Dynamically select chart data based on timeFilter
  const chartSettings = (() => {
    switch (timeFilter) {
      case "Day":
        return { data: rawData.Day, xDataKey: "day" };
      case "Week":
        return { data: rawData.Week, xDataKey: "week" };
      case "Month":
        return { data: rawData.Month, xDataKey: "month" };
      case "Year":
        return { data: rawData.Year, xDataKey: "year" };
      default:
        return { data: rawData.Month, xDataKey: "month" };
    }
  })();

  // Animated container variants
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
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex relative overflow-hidden"
      style={{ background: BG_GRADIENT }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: COLORS.primary }}
        animate={{
          x: ["-5%", "5%", "-5%"],
          y: ["-5%", "5%", "-5%"],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-52 h-52 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: COLORS.secondary }}
        animate={{
          x: ["5%", "-5%", "5%"],
          y: ["5%", "-5%", "5%"],
        }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-20 blur-xl"
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Reports
              </h1>
              <p className="text-gray-500">Analytics and insights for your business</p>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center space-x-4 mt-4 md:mt-0"
            variants={itemVariants}
          >
            <motion.button
              className="flex items-center px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-5 w-5 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="font-semibold text-white">Export Report</span>
            </motion.button>
            <motion.button
              className="bg-white text-gray-900 px-5 py-2.5 rounded-lg flex items-center shadow hover:shadow-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: COLORS.primary }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-semibold">Add Widgets</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={itemVariants}
        >
          {[
            {
              title: "Total Revenue",
              value: 10862,
              prefix: "$",
              change: 21.5,
              icon: "💰",
              bgColor: "bg-white",
              color: COLORS.primary,
              trend: "up",
            },
            {
              title: "New Customers",
              value: 1810,
              change: 15.8,
              icon: "👥",
              bgColor: "bg-white",
              color: COLORS.secondary,
              trend: "up",
            },
            {
              title: "Conversion Rate",
              value: 64.2,
              suffix: "%",
              change: -3.6,
              icon: "📈",
              bgColor: "bg-white",
              color: COLORS.accent1,
              trend: "down",
            },
            {
              title: "Active Deals",
              value: 2107,
              change: 20.1,
              icon: "📊",
              bgColor: "bg-white",
              color: COLORS.accent3,
              trend: "up",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
              className={`${stat.bgColor} p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
                style={{ backgroundColor: stat.color }}
              />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl`}
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                >
                  <span>{stat.icon}</span>
                </motion.div>
              </div>
              <div className="flex flex-col">
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix || ""}
                    suffix={stat.suffix || ""}
                  />
                </p>
                <div className="flex items-center text-sm">
                  {stat.trend === "up" ? (
                    <svg
                      className="h-5 w-5 mr-1 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 mr-1 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  )}
                  <span className={stat.change > 0 ? "text-green-500" : "text-red-500"}>
                    {stat.change > 0 ? "+" : ""}
                    {stat.change}% from last month
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <ProgressRing percentage={Math.abs(stat.change) * 3} color={stat.color} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Line Chart Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-900">Performance Analytics</h3>
              <div className="ml-4 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                <span className="mr-1">⬆</span> 18.6% growth
              </div>
            </div>
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              {["Day", "Week", "Month", "Year"].map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeFilter === filter
                      ? `shadow-sm text-white`
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                  style={timeFilter === filter ? { backgroundColor: COLORS.primary } : {}}
                >
                  {filter}
                </motion.button>
              ))}
            </div>
          </div>
          <LineChart data={chartSettings.data} xDataKey={chartSettings.xDataKey} />
        </motion.div>

        {/* Toggle Sales Insights Button */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <motion.button
            onClick={() => setShowSalesInsights(!showSalesInsights)}
            className="flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent1}, ${COLORS.accent2})`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{showSalesInsights ? "Hide" : "Show"} Sales Insights</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={showSalesInsights ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </motion.button>
        </motion.div>

        {/* Additional Charts (Conditional) */}
        <AnimatePresence>
          {showSalesInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={itemVariants}>
                <motion.div
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
                  variants={itemVariants}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Sales vs Customers</h3>
                    <div className="flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                      <PulseNotification />
                      <span className="ml-2">Real-time data</span>
                    </div>
                  </div>
                  <SalesBarChart data={rawData.Month} />
                </motion.div>
                <motion.div
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
                  variants={itemVariants}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Lead Source Analysis
                  </h3>
                  <PieChart />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Performers Table */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Top Performing Sales Representatives
          </h3>
          <div className="space-y-4">
            {[
              {
                id: "#45321",
                name: "John Doe",
                platform: "Instagram",
                sales: "$24,000",
                progress: 40,
                color: COLORS.primary,
              },
              {
                id: "#45320",
                name: "Jane Smith",
                platform: "Facebook",
                sales: "$22,500",
                progress: 20,
                color: COLORS.secondary,
              },
              {
                id: "#45319",
                name: "Alex Johnson",
                platform: "Twitter",
                sales: "$19,800",
                progress: 90,
                color: COLORS.accent1,
              },
            ].map((rep, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-opacity-20`}
                    style={{ backgroundColor: rep.color, color: rep.color }}
                  >
                    <span className="text-sm">
                      {rep.platform === "Instagram"
                        ? "📸"
                        : rep.platform === "Facebook"
                        ? "📘"
                        : "🐦"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{rep.name}</p>
                    <ProgressBar value={rep.progress} max={100} color={rep.color} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{rep.sales}</p>
                  <p className="text-xs text-gray-500">{rep.progress}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Reports;