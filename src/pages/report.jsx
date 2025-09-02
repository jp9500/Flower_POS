import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import {
  getOverallSales,
  getItemWiseSales,
  getDateWiseSales,
  getRecentTransactions,
} from "../services/authservice";
import NoDataSVG from "../components/nodataSVG";

// Clean modern color palette
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

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
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const months = [
    { value: 1, label: "JAN" },
    { value: 2, label: "FEB" },
    { value: 3, label: "MAR" },
    { value: 4, label: "APR" },
    { value: 5, label: "MAY" },
    { value: 6, label: "JUN" },
    { value: 7, label: "JUL" },
    { value: 8, label: "AUG" },
    { value: 9, label: "SEP" },
    { value: 10, label: "OCT" },
    { value: 11, label: "NOV" },
    { value: 12, label: "DEC" },
  ];

  useEffect(() => {
    loadReports(selectedMonth);
  }, [selectedMonth]);

  const loadReports = async (month) => {
    try {
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

  // Custom legend below charts
  const renderLegend = (data, labelKey = "label") => (
    <div className="flex flex-wrap justify-center gap-4 mt-3">
      {data.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm font-medium">
          <span
            className="w-3 h-3 inline-block rounded"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
          ></span>
          <span className="text-gray-700">
            {entry[labelKey]} ({entry.value.toLocaleString()})
          </span>
        </div>
      ))}
    </div>
  );

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
              <option key={m.value} value={m.value}>
                {m.label}
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
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={overallSales}
                    dataKey="value"
                    nameKey="label"
                    outerRadius={85}
                    label={false} // removed inside labels
                  >
                    {overallSales.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {renderLegend(overallSales)}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[250px]">
              <NoDataSVG />
            </div>
          )}
        </Card>

        {/* Item Wise Sales */}
        <Card title="Item Wise Sales">
          {itemWiseSales.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={itemWiseSales}
                    dataKey="value"
                    nameKey="item"
                    outerRadius={85}
                    label={false} // removed inside labels
                  >
                    {itemWiseSales.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {renderLegend(itemWiseSales, "item")}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[250px]">
              <NoDataSVG />
            </div>
          )}
        </Card>

        {/* Date Wise Sales */}
        <Card title="Date Wise Sales">
          {dateWiseSales.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dateWiseSales}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3B82F6" }}
                  >
                    <LabelList dataKey="value" position="top" />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-3 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 inline-block rounded bg-blue-600"></span>
                  <span className="text-gray-700">Sales Value</span>
                </div>
              </div>
            </div>
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
              <table className="w-full text-sm border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="border p-2">{tx.id}</td>
                      <td className="border p-2">{tx.date}</td>
                      <td className="border p-2">{tx.item}</td>
                      <td className="border p-2 font-medium text-green-600">
                        ${tx.amount.toLocaleString()}
                      </td>
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
