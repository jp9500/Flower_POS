import React, { useEffect, useState } from "react";
import { getOverallSales, getItemWiseSales, getDateWiseSales, getRecentTransactions } from "../services/authservice";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import NoDataSVG from "../components/nodataSVG";

// Colors for charts
const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#F44336", "#9C27B0"];

// SVG Component for No Data
const NoData = () => (
  <div className="flex flex-col items-center justify-center h-40 text-gray-400">
      <NoDataSVG />
  </div>
);

const Report = () => {
  const [overallSales, setOverallSales] = useState([]);
  const [itemWiseSales, setItemWiseSales] = useState([]);
  const [dateWiseSales, setDateWiseSales] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    getOverallSales().then(setOverallSales).catch(() => setOverallSales([]));
    getItemWiseSales().then(setItemWiseSales).catch(() => setItemWiseSales([]));
    getDateWiseSales().then(setDateWiseSales).catch(() => setDateWiseSales([]));
    getRecentTransactions().then(setRecentTransactions).catch(() => setRecentTransactions([]));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header */}
      <h1 className="text-2xl font-bold text-gray-700">📊 Reports Dashboard</h1>

      {/* Overall Sales */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Overall Sales</h2>
        <ResponsiveContainer width="100%" height={250}>
          {overallSales && overallSales.length > 0 ? (
            <PieChart>
              <Pie
                data={overallSales}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#4CAF50"
                label
              >
                {overallSales.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <NoData />
          )}
        </ResponsiveContainer>
      </div>

      {/* Item Wise Sales */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Item Wise Sales</h2>
        <ResponsiveContainer width="100%" height={250}>
          {itemWiseSales && itemWiseSales.length > 0 ? (
            <BarChart data={itemWiseSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#2196F3" />
            </BarChart>
          ) : (
            <NoData />
          )}
        </ResponsiveContainer>
      </div>

      {/* Date Wise Sales */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Date Wise Sales</h2>
        <ResponsiveContainer width="100%" height={250}>
          {dateWiseSales && dateWiseSales.length > 0 ? (
            <BarChart data={dateWiseSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#FF9800" />
            </BarChart>
          ) : (
            <NoData />
          )}
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        {recentTransactions && recentTransactions.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-green-100">
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Item</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="border p-2">{tx.id}</td>
                  <td className="border p-2">{tx.date}</td>
                  <td className="border p-2">{tx.item}</td>
                  <td className="border p-2">{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
};

export default Report;
