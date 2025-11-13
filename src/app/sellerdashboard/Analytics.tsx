/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { motion } from "framer-motion";
import { DollarSign, Users, Package, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/Components/Ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/Components/Ui/tabs";
import { Button } from "@/app/Components/Ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/Components/Ui/table";
import dynamic from "next/dynamic";

// Dynamically import react-apexcharts
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Color palette matching Reports.tsx
const COLORS = {
  primary: "#FFC107", // Yellow
  secondary: "#FFD54F", // Light yellow
  accent1: "#FF9800", // Orange-yellow
  accent2: "#FF5722", // Coral
  accent3: "#8C52FF", // Purple
  accent4: "#5CE1E6", // Teal
  grey1: "#F9FAFB",
  grey2: "#F3F4F6",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
};

// Pie chart colors
const PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent1,
  COLORS.accent2,
  COLORS.accent3,
  COLORS.accent4,
];

// Background gradient
const BG_GRADIENT = "linear-gradient(to right bottom, #F9FAFB, #FFF9C4, #FFFFFF)";

// Animation variants
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

export default function AnalyticsPage() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex relative overflow-hidden font-poppins"
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
      <motion.div variants={fadeIn} className="flex-1 p-6 lg:p-8 z-10 w-full">
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
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                <span className="text-yellow-500">Analytics</span>
              </h1>
              <p className="text-gray-500">Insights and trends for your business</p>
            </div>
          </motion.div>
          <motion.div
            className="flex items-center space-x-4 mt-4 md:mt-0"
            variants={itemVariants}
          >
            <motion.button
              className="flex items-center px-5 py-2.5 rounded-lg shadow hover:shadow-md transition-all text-white"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-semibold">Date Range</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Overview Cards */}
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            variants={itemVariants}
          >
            {[
              { title: "Total Revenue", value: "$24,389.50", change: "+12.5%", positive: true, color: COLORS.primary, icon: DollarSign },
              { title: "Total Orders", value: "1,453", change: "+8.2%", positive: true, color: COLORS.secondary, icon: Package },
              { title: "Average Order Value", value: "$78.34", change: "+3.7%", positive: true, color: COLORS.accent1, icon: DollarSign },
              { title: "Conversion Rate", value: "3.42%", change: "-0.5%", positive: false, color: COLORS.accent3, icon: TrendingUp },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-bl-full"
                  style={{ backgroundColor: card.color }}
                />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}20`, color: card.color }}
                  >
                    <card.icon className="h-5 w-5" />
                  </motion.div>
                </div>
                <div className="flex flex-col">
                  <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <div className={`flex items-center text-sm ${card.positive ? "text-green-500" : "text-red-500"}`}>
                    {card.positive ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span>{card.change} from last month</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Sales Trends Section */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: COLORS.primary }} />
                  Sales Trends
                </h3>
              </div>
              <Tabs defaultValue="daily" className="bg-gray-100 p-1 rounded-lg">
                <TabsList>
                  {["daily", "weekly", "monthly"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        tab === "daily" ? "bg-yellow-400 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="h-[300px]">
              <Chart
                options={{
                  chart: { toolbar: { show: false }, zoom: { enabled: false } },
                  dataLabels: { enabled: false },
                  stroke: { width: 3, curve: "smooth" },
                  fill: { type: "gradient", gradient: { opacityFrom: 0.7, opacityTo: 0.3 } },
                  xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
                  yaxis: { labels: { formatter: (val: number) => `$${val}` } },
                  tooltip: { y: { formatter: (val: number) => `$${val.toFixed(2)}` } },
                  colors: [COLORS.primary],
                }}
                series={[{ name: "Sales", data: [1500, 1800, 2200, 1900, 2400, 2800, 3200, 3800, 3500, 4000, 4200, 4500] }]}
                type="area"
                height={300}
              />
            </div>
          </motion.div>

          {/* Customer Analytics and Product Performance */}
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={itemVariants}
          >
            {/* Customer Analytics */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: COLORS.primary }} />
                  Customer Analytics
                </h3>
              </div>
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium mb-3">New vs Returning Customers</h4>
                  <Chart
                    options={{
                      labels: ["New Customers", "Returning Customers"],
                      legend: { position: "bottom", labels: { colors: COLORS.textPrimary } },
                      colors: [COLORS.primary, COLORS.accent1],
                    }}
                    series={[65, 35]}
                    type="pie"
                    height={200}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3">Average Order Value Trend</h4>
                  <Chart
                    options={{
                      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
                      colors: [COLORS.accent1],
                      stroke: { curve: "smooth", width: 3 },
                      yaxis: { labels: { formatter: (val: number) => `$${val}` } },
                      tooltip: { y: { formatter: (val: number) => `$${val.toFixed(2)}` } },
                    }}
                    series={[{ name: "AOV", data: [65, 68, 72, 75, 78, 82] }]}
                    type="line"
                    height={200}
                  />
                </div>
              </div>
            </motion.div>

            {/* Product Performance */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5" style={{ color: COLORS.primary }} />
                  Product Performance
                </h3>
              </div>
              <Tabs defaultValue="best-selling">
                <TabsList className="mb-4 bg-gray-100 p-1 rounded-lg">
                  {["best-selling", "least-selling", "inventory"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        tab === "best-selling" ? "bg-yellow-400 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tab
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="best-selling">
                  <ProductTable best />
                </TabsContent>
                <TabsContent value="least-selling">
                  <ProductTable />
                </TabsContent>
                <TabsContent value="inventory">
                  <Chart
                    options={{
                      plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
                      xaxis: { categories: ["Phone Case", "Wireless Earbuds", "Smart Watch", "Bluetooth Speaker", "Premium Headphones"] },
                      colors: [COLORS.primary],
                      yaxis: { labels: { formatter: (val: number) => `${val}` } },
                      tooltip: { y: { formatter: (val: number) => `${val}` } },
                    }}
                    series={[{ name: "Turnover Rate", data: [4.5, 3.8, 3.2, 2.7, 2.1] }]}
                    type="bar"
                    height={300}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>

          {/* Revenue Insights */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5" style={{ color: COLORS.primary }} />
                Revenue Insights
              </h3>
            </div>
            <Chart
              options={{
                plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
                xaxis: { categories: ["Electronics", "Accessories", "Wearables", "Audio", "Smart Home"] },
                legend: { position: "top", labels: { colors: COLORS.textPrimary } },
                colors: PIE_COLORS,
                yaxis: { labels: { formatter: (val: number) => `$${val.toLocaleString()}` } },
                tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
              }}
              series={[
                { name: "Q1", data: [44000, 25000, 35000, 32000, 22000] },
                { name: "Q2", data: [53000, 32000, 41000, 37000, 28000] },
                { name: "Q3", data: [61000, 36000, 45000, 42000, 33000] },
              ]}
              type="bar"
              height={400}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductTable({ best = false }: { best?: boolean }) {
  const products = best
    ? [
        ["Premium Headphones", 245, "$24,500"],
        ["Wireless Earbuds", 189, "$18,900"],
        ["Smart Watch", 156, "$15,600"],
        ["Bluetooth Speaker", 132, "$13,200"],
        ["Phone Case", 128, "$3,840"],
      ]
    : [
        ["USB-C Cable", 12, "$240"],
        ["Screen Protector", 15, "$300"],
        ["Laptop Stand", 18, "$720"],
        ["Wireless Charger", 22, "$880"],
        ["Power Bank", 25, "$1,250"],
      ];

  return (
    <div>
      
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Units Sold</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(([name, sold, revenue], idx) => (
          <TableRow key={idx} className="hover:bg-gray-50 transition-colors">
            <TableCell className="font-medium">{name}</TableCell>
            <TableCell className="text-right">{sold}</TableCell>
            <TableCell className="text-right">{revenue}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}