import React, { useState } from "react";
import { fetchItem, saveTransaction } from "../services/authservice";
import { ToastContainer,toast } from "react-toastify";

const Transaction = () => {
  const [rows, setRows] = useState([
    { itemId: null, name: "", price: 0, quantity: 0, total: 0 }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [commission, setCommission] = useState(10);

  // Fetch suggestions from API
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await fetchItem(query);
      setSuggestions(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Handle row changes
  const handleInputChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    if (field === "quantity" || field === "price") {
      const price = parseFloat(updated[index].price) || 0;
      const quantity = parseFloat(updated[index].quantity) || 0;
      updated[index].total = price * quantity;
    }

    setRows(updated);
  };

  // Add new row
  const addRow = () => {
    setRows([
      ...rows,
      { itemId: null, name: "", price: 0, quantity: 0, total: 0 }
    ]);
  };

  // Remove row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = async () => {
    try {
      const uid = JSON.parse(localStorage.getItem("user")).userid;
      const payload = {
        smry: rows,
        userid: uid,
        subtotal: subTotal,
        comm_perc: commission,
        commission_total: commissionTotal,
        grand_total: grandTotal
      };
      let res = await saveTransaction(payload);
      if(res.ok){
        toast.success("Transaction saved successfully!");
      }
      else{
        toast.error("Failed to save transaction.");
        return;
      }
      setRows([{ itemId: null, name: "", price: 0, quantity: 0, total: 0 }]);
    } catch (err) {
      console.error("Error saving transaction:", err);
      toast.error("Failed to save transaction.");
    }
  };

  // Calculations
  const subTotal = rows.reduce(
    (sum, row) =>
      sum + (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 0),
    0
  );
  const commissionTotal = subTotal * (commission / 100);
  const grandTotal = subTotal - commissionTotal;

  return (
    <div className="max-w-5xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Transaction</h1>

      {/* Add Row */}
      <button
        onClick={addRow}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        + Add Row
      </button>

      {/* Commission dropdown */}
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

      {/* Transaction Rows */}
      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-2 items-center mb-3 shadow rounded-lg p-3"
        >
          {/* Item Name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Name"
              value={row.name}
              onChange={(e) => {
                handleInputChange(index, "name", e.target.value);
                fetchSuggestions(e.target.value);
                setActiveRow(index);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {activeRow === index && suggestions.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-40 overflow-y-auto z-10">
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
                    className="px-3 py-1 hover:bg-green-100 cursor-pointer"
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
              placeholder="Quantity"
              value={row.quantity}
              onChange={(e) =>
                handleInputChange(index, "quantity", e.target.value)
              }
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Price */}
          <div>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={row.price}
              onChange={(e) =>
                handleInputChange(index, "price", e.target.value)
              }
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Total */}
          <div className="font-medium text-gray-700">
            ₹{row.total.toFixed(2)}
          </div>

          {/* Remove */}
          <div>
            <button
              onClick={() => removeRow(index)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      {/* Totals */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-end text-gray-700">
          <span className="mr-4">Sub Total:</span>
          <span className="font-medium">₹{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-end text-gray-700">
          <span className="mr-4">Commission ({commission}%):</span>
          <span className="font-medium">₹{commissionTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-end font-bold text-lg text-green-600">
          <span className="mr-4">Grand Total:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Submit
      </button>

       <ToastContainer
              position="bottom-center"
              autoClose={1000}
              style={{ bottom: "20px" }}
            />
    </div>
  );
};

export default Transaction;
