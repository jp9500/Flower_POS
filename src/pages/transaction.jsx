import React, { useState, useRef, useEffect } from "react";
import { fetchItem, saveTransaction, fetchExpense } from "../services/authservice";
import { ToastContainer, toast } from "react-toastify";
import { FaMoneyBill, FaBox } from "react-icons/fa";

const Transaction = () => {
  const [activeTab, setActiveTab] = useState("item"); // 👈 NEW (item | expense)

  // separate states
  const [itemRows, setItemRows] = useState([
    { itemId: null, name: "", price: 0, quantity: 0, total: 0 }
  ]);
  const [expenseRows, setExpenseRows] = useState([
    { expenseId: null, name: "", price: 0, quantity: 0, total: 0 }
  ]);

  const itemRefs = useRef([]);
  const expenseRefs = useRef([]);

  const [suggestions, setSuggestions] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [commission, setCommission] = useState(10);
  const [addedRow, setAddedRow] = useState(false); // 👈 track row addition

  const rows = activeTab === "item" ? itemRows : expenseRows;
  const setRows = activeTab === "item" ? setItemRows : setExpenseRows;

  // Fetch suggestions
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      let data = [];
      if (activeTab === "item") {
        data = await fetchItem(query);
      } else {
        data = await fetchExpense(query);
      }
      setSuggestions(data || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Handle row changes
  const handleInputChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    if ((activeTab === "item" || activeTab === "expense") && (field === "quantity" || field === "price")) {
      const price = parseFloat(updated[index].price) || 0;
      const quantity = parseFloat(updated[index].quantity) || 0;
      updated[index].total = price * quantity;
    }

    setRows(updated);
  };

  // Focus only when new row is added
  useEffect(() => {
    if (activeTab === "item" && itemRows.length > 0 && addedRow) {
      const lastIndex = itemRows.length - 1;
      itemRefs.current[lastIndex]?.focus();
      setAddedRow(false); // reset after focusing
    }
  }, [itemRows]);

  useEffect(() => {
    if (activeTab === "expense" && expenseRows.length > 0 && addedRow) {
      const lastIndex = expenseRows.length - 1;
      expenseRefs.current[lastIndex]?.focus();
      setAddedRow(false); // reset after focusing
    }
  }, [expenseRows]);

  // Add new row
  const addRow = () => {
    if (activeTab === "item") {
      setItemRows((prev) => [
        ...prev,
        { itemId: null, name: "", price: 0, quantity: 0, total: 0 }
      ]);
    } else {
      setExpenseRows((prev) => [
        ...prev,
        { expenseId: null, name: "", price: 0, quantity: 0, total: 0 }
      ]);
    }
    setAddedRow(true); // 👈 trigger focus only after adding
  };

  // Remove row
  const removeRow = (index) => {
    if (activeTab === "item") {
      setItemRows(itemRows.filter((_, i) => i !== index));
    } else {
      setExpenseRows(expenseRows.filter((_, i) => i !== index));
    }
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const uid = JSON.parse(localStorage.getItem("user")).userid;
      const payload = {
        type: activeTab, // 👈 to know whether it's Item or Expense
        smry: rows,
        userid: uid,
        subtotal: subTotal,
        comm_perc: commission,
        commission_total: commissionTotal,
        grand_total: grandTotal,
      };
      let res = await saveTransaction(payload);
      if (res.ok) {
        toast.success("Transaction saved successfully!");
      } else {
        toast.error("Failed to save transaction.");
        return;
      }
      // reset rows
      setRows([
        activeTab === "item"
          ? { itemId: null, name: "", price: 0, quantity: 0, total: 0 }
          : { expenseId: null, name: "", price: 0, quantity: 0, total: 0 }
      ]);
    } catch (err) {
      console.error("Error saving transaction:", err);
      toast.error("Failed to save transaction.");
    }
  };

  // Calculations
  const subTotal = rows.reduce(
    (sum, row) => sum + (parseFloat(row.total) || 0),
    0
  );
  const commissionTotal = activeTab === "item" ? subTotal * (commission / 100) : 0;
  const grandTotal = activeTab === "item" ? subTotal - commissionTotal : subTotal;

  return (
    <div className="max-w-5xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Transaction</h1>

      {/* 👇 Switch Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("item")}
          className={`px-6 rounded-lg flex items-center gap-5 ${activeTab === "item" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          <FaBox /> Items
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`px-6 py-2 rounded-lg flex items-center gap-5 ${activeTab === "expense" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          <FaMoneyBill /> Expenses
        </button>
      </div>

      {/* Add Row */}
      <button
        onClick={addRow}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        + Add Row
      </button>

      {/* Commission only for Items */}
      {activeTab === "item" && (
        <div className="mb-4">
          <label className="font-medium text-gray-700 mr-2">Commission :</label>
          <select
            value={commission}
            onChange={(e) => setCommission(parseFloat(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {[10, 20, 30, 40, 50].map((val) => (
              <option key={val} value={val}>
                {val}%
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Transaction Rows */}
      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-2 items-center mb-3 shadow rounded-lg p-2"
        >
          {/* Item / Expense Input */}
          {activeTab === "item" ? (
            <>
              {/* Name (with suggestions) */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={row.name}
                  onChange={(e) => {
                    handleInputChange(index, "name", e.target.value);
                    fetchSuggestions(e.target.value);
                    setActiveRow(index);
                  }}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className="w-full border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {activeRow === index && suggestions.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto z-10">
                    {suggestions.map((s) => (
                      <li
                        key={s.itemId}
                        onClick={() => {
                          const updated = [...rows];
                          updated[index].itemId = s.itemId;
                          updated[index].name = s.itemName + " ~ " + s.uom;
                          setRows(updated);
                          setSuggestions([]);
                        }}
                        className="py-1 hover:bg-green-100 cursor-pointer"
                      >
                        {s.itemName} ({s.uom})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Quantity */}
              <div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Qty"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Price */}
              <div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={row.price}
                  onChange={(e) => handleInputChange(index, "price", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Total */}
              <div className="font-medium text-gray-700">₹{row.total}</div>
            </>
          ) : (
            <>
              {/* Expense Name (with suggestions) */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Expense Name"
                  value={row.name}
                  onChange={(e) => {
                    handleInputChange(index, "name", e.target.value);
                    fetchSuggestions(e.target.value);
                    setActiveRow(index);
                  }}
                  ref={(el) => (expenseRefs.current[index] = el)}
                  className="w-full border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {activeRow === index && suggestions.length > 0 && (
                  <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto z-10">
                    {suggestions.map((s) => (
                      <li
                        key={s.expenseId}
                        onClick={() => {
                          const updated = [...rows];
                          updated[index].expenseId = s.expenseId;
                          updated[index].name = s.expenseName + " ~ " + s.uom;
                          setRows(updated);
                          setSuggestions([]);
                        }}
                        className="py-1 hover:bg-green-100 cursor-pointer"
                      >
                        {s.expenseName} ({s.uom})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Qty */}
              <div>
                <input
                  type="text"
                  placeholder="Qty"
                  value={row.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Amount */}
              <div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={row.price}
                  onChange={(e) => handleInputChange(index, "price", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Total */}
              <div className="font-medium text-gray-700">₹{row.total}</div>
            </>
          )}

          {/* Remove Button */}
          <div>
            <button
              onClick={() => removeRow(index)}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      {/* Totals */}
      {activeTab === "item" && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-end text-gray-700">
            <span className="mr-4">Sub Total:</span>
            <span className="font-medium">
              ₹{subTotal.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          </div>
        </div>
      )}

      <div className="mt-2 space-y-2">
        {activeTab === "item" && (
          <div className="flex justify-end text-gray-700">
            <span className="mr-4">Commission ({commission}%):</span>
            <span className="font-medium">
              ₹{commissionTotal.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          </div>
        )}

        <div className="flex justify-end font-bold text-lg text-green-600">
          <span className="mr-4">Grand Total:</span>
          <span>
            ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Submit
      </button>

      <ToastContainer position="bottom-center" autoClose={1000} style={{ bottom: "50px" }} />
    </div>
  );
};

export default Transaction;
