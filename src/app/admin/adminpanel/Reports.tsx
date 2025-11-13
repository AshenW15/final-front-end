import React, { useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type Order = {
  id: string;
  user_id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: string;
};

const Reports = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [reportType, setReportType] = useState("User Report");
  const [loading, setLoading] = useState(false);

const fetchAndDownloadCSV = async (
  url: string,
  filename: string,
  dataKey: "orders" | "users"
) => {
  setLoading(true);
  try {
    const response = await fetch(url, { method: "POST" });
    const data = await response.json();
    let reportData: User[] | Order[] = [];

    if (dataKey === "users") {
      if (!data || data.length === 0) {
        alert("No user data found");
        return;
      }
      reportData = data;
    }
    else if (dataKey === "orders") {
      if (!data || !data.orders || data.orders.length === 0) {
        alert("No order data found");
        return;
      }
      reportData = data.orders;
    }

    if (reportData.length === 0) {
      alert("No data available to generate the report");
      return;
    }

    const headers = Object.keys(reportData[0]).join(",");
    const rows = reportData.map((row) =>
      Object.values(row)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const urlObject = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlObject;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
  } finally {
    setLoading(false);
  }
};


  const handleGenerateReport = () => {
    if (reportType === "User Report") {
      fetchAndDownloadCSV(`${baseUrl}/get_users.php`, "user_report.csv", "users");
    } else if (reportType === "Order Report") {
      fetchAndDownloadCSV(`${baseUrl}/getAllOrders.php`, "order_report.csv", "orders");
    } else {
      alert("Sales Report not implemented yet.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Reports</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Generate Report</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            >
              {/* Sales Report and Date Range are commented for future implementation */}
              {/* <option>Sales Report</option> */}
              <option>User Report</option>
              <option>Order Report</option>
            </select>
          </div>
          {/* <div>
            <label className="block text-gray-700">Date Range</label>
            <input type="date" className="mt-1 p-2 border rounded w-full" disabled />
          </div> */}
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
