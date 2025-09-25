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
  getExpenseWiseSales,
  getSalesTransactions,
  getExpenseTransactions,
  getSalesTransactionDetails,
  getExpenseTransactionDetails,
} from "../services/authservice";
import NoDataSVG from "../components/nodataSVG";
import { toast, ToastContainer } from "react-toastify";

const COLORS = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6", "#14B8A6"];

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-4">
    <h2 className="font-semibold text-gray-800 mb-3">{title}</h2>
    {children}
  </div>
);

export default function Report() {
  const [overallSales, setOverallSales] = useState([]);
  const [itemWiseSales, setItemWiseSales] = useState([]);
  const [expenseWiseSales, setExpenseWiseSales] = useState([]);

  // Separate transaction states
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [expenseTransactions, setExpenseTransactions] = useState([]);

  // Date filters
  const date = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(date);
  const [toDate, setToDate] = useState(date);

  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionItems, setTransactionItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle state for charts
  const [activeReport, setActiveReport] = useState("item");

  // Toggle for transactions
  const [activeTransactionType, setActiveTransactionType] = useState("sales");

  // Load charts when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      if (new Date(fromDate) > new Date(toDate)) {
        toast.error(" Invalid Date Range!");
        setOverallSales([]);
        setItemWiseSales([]);
        setExpenseWiseSales([]);
        setSalesTransactions([]);
        setExpenseTransactions([]);
        return;
      }
    }
    loadReports(fromDate, toDate);
    fetchSalesTransactions(fromDate, toDate);
    fetchExpenseTransactions(fromDate, toDate);
  }, [fromDate, toDate]);

  const loadReports = async (from, to) => {
    try {
      const [overall, itemWise, expenseWise] = await Promise.all([
        getOverallSales(from, to),
        getItemWiseSales(from, to),
        getExpenseWiseSales(from, to),
      ]);
      setOverallSales(overall || []);
      setItemWiseSales(itemWise || []);
      setExpenseWiseSales(expenseWise || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchSalesTransactions = async (from, to) => {
    try {
      const sales = await getSalesTransactions(from, to);
      setSalesTransactions(sales || []);
    } catch (error) {
      console.error("Error fetching sales transactions:", error);
    }
  };

  const fetchExpenseTransactions = async (from, to) => {
    try {
      const expenses = await getExpenseTransactions(from, to);
      setExpenseTransactions(expenses || []);
    } catch (error) {
      console.error("Error fetching expense transactions:", error);
    }
  };

  // Handle row click depending on transaction type
  const handleRowClick = async (tx) => {
    try {
      let details = [];
      if (activeTransactionType === "sales") {
        details = await getSalesTransactionDetails(tx.id);
      } else {
        details = await getExpenseTransactionDetails(tx.id);
      }
      setSelectedTransaction(tx);
      setTransactionItems(details || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

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

  const displayedTransactions =
    activeTransactionType === "sales" ? salesTransactions : expenseTransactions;

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📊 Reports Dashboard
      </h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-6 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium">From Date:</label>
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
          ) : (
            <div className="flex justify-center items-center h-[250px]">
              <NoDataSVG />
            </div>
          )}
        </Card>

        {/* Item/Expense Wise Sales */}
        <Card title="Sales Chart">
          <div className="flex gap-4 justify-center mb-3">
            <button
              className={`px-3 py-1 rounded-lg ${activeReport === "item" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveReport("item")}
            >
              Item Wise
            </button>
            <button
              className={`px-3 py-1 rounded-lg ${activeReport === "expense" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveReport("expense")}
            >
              Expense Wise
            </button>
          </div>

          {activeReport === "item" && itemWiseSales.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={itemWiseSales} dataKey="value" nameKey="item" outerRadius={85}>
                    {itemWiseSales.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {renderLegend(itemWiseSales)}
            </div>
          ) : activeReport === "expense" && expenseWiseSales.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={expenseWiseSales} dataKey="value" nameKey="expense" outerRadius={85}>
                    {expenseWiseSales.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {renderLegend(expenseWiseSales)}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[250px]">
              <NoDataSVG />
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-4">
              <button
                className={`px-3 py-1 rounded-lg ${activeTransactionType === "sales" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTransactionType("sales")}
              >
                Sales
              </button>
              <button
                className={`px-3 py-1 rounded-lg ${activeTransactionType === "expense" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                onClick={() => setActiveTransactionType("expense")}
              >
                Expense
              </button>
            </div>
            <button
              onClick={() => {
                activeTransactionType === "sales" ? fetchSalesTransactions(fromDate, toDate) : fetchExpenseTransactions(fromDate, toDate);
              }}
              className="px-5 py-1 text-white rounded-lg"
            >
              🔄
            </button>
          </div>

          {displayedTransactions.length > 0 ? (
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
                  {displayedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 cursor-pointer text-center" onClick={() => handleRowClick(tx)}>
                      <td className="border p-2">{tx.id}</td>
                      <td className="border p-2">{tx.date}</td>
                      <td className="border p-2">{tx.items}</td>
                      {activeTransactionType === "sales" ? 
                      <td className="border p-2 font-medium text-green-600">
                        ₹{tx.amount.toLocaleString("en-IN")}
                      </td>
                      : 
                      <td className="border p-2 font-medium text-red-600">
                          ₹{tx.amount.toLocaleString("en-IN")}
                        </td>
                      }
                      
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

      {/* Transaction Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-3 shadow-lg">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">
            <h2 className={`text-lg font-bold mb-4 ${
                activeTransactionType === "sales" ? "text-green-600" : "text-red-600"
              }`}> Transaction # {selectedTransaction.id}
            </h2>

            {transactionItems.length > 0 ? (
              <table className="w-full text-sm border border-gray-300 rounded-lg text">
                <thead className={`text-gray-700 font-semibold text-center ${
                    activeTransactionType === "sales" ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <tr>
                    <th className="border p-2"> {activeTransactionType === "sales" ? "Item" : "Expense"}</th>
                    <th className="border p-2">Qty</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
               <tbody>
                  {transactionItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 text-center">
                      <td className="border p-2">
                        {activeTransactionType === "sales" ? item.itemName : item.expenseName}
                      </td>
                      <td className="border p-2">{item.qty}</td>
                      <td className="border p-2">₹{item.price.toLocaleString("en-IN")}</td>
                      <td className="border p-2 font-semibold">
                        ₹{item.total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}

                  {/* Summary row outside map */}
                  <tr className="text-center bg-gray-100">
                    {activeTransactionType === "sales" ? (
                      <>
                        <td className="border p-2 font-semibold text-red-600" colSpan={3}>Commission</td>
                        <td className="border p-2 font-bold text-red-600">
                          ₹{selectedTransaction.commTotal.toLocaleString("en-IN")}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border p-2" colSpan={3}></td>
                        <td className="border p-2"></td>
                      </>
                    )}
                  </tr>


                  <tr className="text-center bg-gray-100">
                    <td className={`border p-2 font-semibold ${
                        activeTransactionType === "sales" ? "text-green-600" : "text-red-600"
                      }`}
                      colSpan={3}> Total
                    </td>
                    {activeTransactionType === "sales" ? (
                      <>
                        <td className="border p-2 font-bold text-green-600">₹{selectedTransaction.amount.toLocaleString("en-IN")}</td>
                      </>
                    ) : (
                      <td className="border p-2 font-bold text-red-600">
                        ₹{selectedTransaction.amount.toLocaleString("en-IN")}
                      </td>
                    )}
                  </tr>
                </tbody>

              </table>
            ) : (
              <p>No items found</p>
            )}

            <div className="flex justify-end mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-center" autoClose={1000} style={{ bottom: "50px", padding: "10px" }} />
    </div>
  );
}
