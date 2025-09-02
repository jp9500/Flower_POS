import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Tooltip, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import {
  getOverallSales,
  getItemWiseSales,
  getDateWiseSales,
  getRecentTransactions,
} from "../services/authservice";
import NoDataSVG from "../components/nodataSVG";

const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0"];

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-4">
    <h2 className="font-semibold text-gray-800 mb-3">{title}</h2>
    {children}
  </div>
);

export default function Report() {
  const [overallSales, setOverallSales] = useState([]);
  const [itemWiseSales, setItemWiseSales] = useState([]);
  const [dateWiseSales, setDateWiseSales] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // default current month

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    loadReports(selectedMonth);
  }, [selectedMonth]);

  const loadReports = async (month) => {
    try {
      // pass month as query param to backend API
      const [overall, itemWise, dateWise, transactions] = await Promise.all([
        getOverallSales(month),
        getItemWiseSales(month),
        getDateWiseSales(month),
        getRecentTransactions(month),
      ]);
      setOverallSales(overall || []);
      setItemWiseSales(itemWise || []);
      setDateWiseSales(dateWise || []);
      setRecentTransactions(transactions || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
        📊 Reports Dashboard
      </h1>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="font-medium mr-2">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border rounded p-1"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Overall Sales */}
        <Card title="Overall Sales">
          {overallSales.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={overallSales} dataKey="value" nameKey="label" outerRadius={80} label>
                  {overallSales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-[250px]">
              <NoDataSVG />
            </div>
          )}
        </Card>

        {/* Item Wise Sales */}
        <Card title="Item Wise Sales">
          {itemWiseSales.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={itemWiseSales} dataKey="value" nameKey="item" outerRadius={80} label>
                  {itemWiseSales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-[250px]">
              <NoDataSVG />
            </div>
          )}
        </Card>

        {/* Date Wise Sales */}
        <Card title="Date Wise Sales">
          {dateWiseSales.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dateWiseSales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2196F3" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-[250px]">
              <NoDataSVG />
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-100">
                      <td className="border p-2">{tx.id}</td>
                      <td className="border p-2">{tx.date}</td>
                      <td className="border p-2">{tx.item}</td>
                      <td className="border p-2">${tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[200px]">
              <NoDataSVG />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
