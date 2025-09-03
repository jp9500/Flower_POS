import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  getOverallSales,
  getItemWiseSales,
  getRecentTransactions,
  getTransactionDetails, // ✅ new service
} from "../services/authservice";
import NoDataSVG from "../components/nodataSVG";
import { toast,ToastContainer } from "react-toastify";


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
  const [recentTransactions, setRecentTransactions] = useState([]);
  // const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // 🔹 Date filters
  const date = new Date().toISOString().split("T")[0] ; // YYYY-MM-DD
  const [fromDate, setFromDate] = useState(date);
  const [toDate, setToDate] = useState(date);

  // 🔹 Modal states
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionItems, setTransactionItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // const months = [
  //   { value: 1, label: "JAN" },
  //   { value: 2, label: "FEB" },
  //   { value: 3, label: "MAR" },
  //   { value: 4, label: "APR" },
  //   { value: 5, label: "MAY" },
  //   { value: 6, label: "JUN" },
  //   { value: 7, label: "JUL" },
  //   { value: 8, label: "AUG" },
  //   { value: 9, label: "SEP" },
  //   { value: 10, label: "OCT" },
  //   { value: 11, label: "NOV" },
  //   { value: 12, label: "DEC" },
  // ];

  useEffect(() => {
     if (fromDate && toDate) {
        if (new Date(fromDate) > new Date(toDate)) {
          toast.error(" Invalid Date Range!");
           setOverallSales([]);
           setItemWiseSales([]);
           setRecentTransactions([]);
          return;
        }
      }
    loadReports(fromDate, toDate);
  }, [fromDate, toDate]);

  const loadReports = async (from, to) => {
    try {
      const [overall, itemWise, transactions] = await Promise.all([
        getOverallSales(from , to),
        getItemWiseSales(from , to),
        getRecentTransactions(from , to), // ✅ pass dates
      ]);
      setOverallSales(overall || []);
      setItemWiseSales(itemWise || []);
      setRecentTransactions(transactions || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // 🔹 Row click handler
  const handleRowClick = async (tx) => {
    try {
      const details = await getTransactionDetails(tx.id); // API call for items
      setSelectedTransaction(tx);
      setTransactionItems(details || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  // Custom legend
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
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📊 Reports Dashboard
      </h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-6 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium bg-none">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-1 rounded"
          />
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Overall Sales */}
        <Card title="Overall Sales">
          {overallSales.length > 0 ? (
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={overallSales} barCategoryGap="25%">
                  <XAxis dataKey="label" stroke="#555" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {overallSales.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    <LabelList dataKey="value" position="top" fill="#333" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
                  >
                    {itemWiseSales.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {renderLegend(itemWiseSales)}
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
                <thead className="bg-gray-100 text-gray-700 font-semibold text-center">
                  <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Items</th>
                    <th className="border p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 cursor-pointer text-center"
                      onClick={() => handleRowClick(tx)}
                    >
                      <td className="border p-2">{tx.id}</td>
                      <td className="border p-2">{tx.date}</td>
                      <td className="border p-2">{tx.items}</td>
                      <td className="border p-2 font-medium text-green-600">
                        ₹{tx.amount.toLocaleString("en-IN")}
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

      {/* 🔹 Transaction Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">
            <h2 className="text-lg font-bold mb-4 text-green-600">
              Transaction #{selectedTransaction.id}
            </h2>

            {transactionItems.length > 0 ? (
              <table className="w-full text-sm border border-gray-300 rounded-lg text">
                <thead className="bg-green-200 text-gray-700 font-semibold text-center">
                  <tr>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 text-center">
                      <td className="border p-2">{item.itemName}</td>
                      <td className="border p-2">{item.qty}</td>
                      <td className="border p-2">
                        ₹{item.price.toLocaleString("en-IN")}
                      </td>
                      <td className="border p-2 font-semibold">
                        ₹{item.total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="">
                  <tr>
                    <td colSpan={2} className="border p-3 text-right font-semibold">Commission :</td>      
                    <td colSpan={2} className="border p-2 text-right font-semibold text-red-600">
                       ₹{selectedTransaction.commTotal.toLocaleString("en-IN")}.00
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}  className="border p-3 text-right font-semibold">Total :</td>
                    <td colSpan={2} className="border p-2 text-right font-semibold text-green-600">
                      ₹{selectedTransaction.amount.toLocaleString("en-IN")}.00
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p>No items found</p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

       <ToastContainer position="bottom-center"  autoClose={1000}  style={{ bottom: "20px" }}  />
    </div>
  );
}
