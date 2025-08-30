import React, { useState } from "react";
import "../CSS/transaction.css";
import { fetchItem, saveTransaction } from "../services/authservice";
import { toast } from "react-toastify";

const Transaction = () => {
  const [rows, setRows] = useState([
    { itemId: null, name: "", price: 0, quantity: 0, total: 0 }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [commission, setCommission] = useState(10); // ✅ common commission

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

  // Handle submit to backend
  const handleSubmit = async () => {
    try {
      const uid = JSON.parse(localStorage.getItem('user')).userid;
      const payload = {
        smry: rows,
        userid : uid,
        subtotal : subTotal,
        comm_perc : commission,          // ✅ save common commission
        commission_total  :commissionTotal,
        grand_total : grandTotal
      };
      await saveTransaction(payload);
      alert("Transaction saved successfully!");
      setRows([{ itemId: null, name: "", price: 0, quantity: 0, total: 0 }]);
    } catch (err) {
      console.error("Error saving transaction:", err);
      alert("Failed to save transaction.");
    }
  };

  // Calculations
  const subTotal = rows.reduce(
    (sum, row) =>
      sum + (parseFloat(row.price) || 0) * (parseFloat(row.quantity) || 0),
    0
  );
  const commissionTotal = subTotal * (commission / 100); // ✅ common
  const grandTotal = subTotal - commissionTotal;

  return (
    <div className="transaction-container">
      <h1>Transaction</h1>
      <button className="add-btn" onClick={addRow}>
        + Add Row
      </button>

      {/* Commission dropdown - common for all rows */}
      <div className="col-md-3">
        <label className="commission-label">Commission : </label>
        <select
        className="commission-select"
          value={commission}
          onChange={(e) => setCommission(parseFloat(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((val) => (
            <option key={val} value={val}>
              {val}%
            </option>
          ))}
        </select>
      </div>

      {rows.map((row, index) => (
        <div key={index} className="transaction-grid">
          {/* Item Name with Suggestions */}
          <div
            className="grid-item-name"
            style={{ position: "relative", display: "inline-block" }}
          >
            <input
              className="adjust-Widh"
              type="text"
              placeholder="Name"
              value={row.name}
              onChange={(e) => {
                handleInputChange(index, "name", e.target.value);
                fetchSuggestions(e.target.value);
                setActiveRow(index);
              }}
            />

            {activeRow === index && suggestions.length > 0 && (
              <ul className="suggestions-list">
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
                  >
                    {s.itemName} ({s.uom})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* quantity */}
          <div className="grid-item">
            <input
              type="number"
              step="0.01"
              placeholder="quantity"
              value={row.quantity}
              onChange={(e) =>
                handleInputChange(index, "quantity", e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {/* Price */}
          <div className="grid-item">
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={row.price}
              onChange={(e) =>
                handleInputChange(index, "price", e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {/* Total */}
          <div className="grid-item total-cell">₹{row.total.toFixed(2)}</div>

          {/* Remove Row */}
          <div className="grid-item">
            <button
              className="remove-btn"
              onClick={() => removeRow(index)}
            >
              ❌
            </button>
          </div>
        </div>
      ))}

      {/* Totals */}
      <div className="transaction-grid total-row">
        <div
          className="grid-item"
          style={{ gridColumn: "1 / span 4", textAlign: "right" }}
        >
          Sub Total:
        </div>
        <div className="grid-item total-cell">₹{subTotal.toFixed(2)}</div>
      </div>

      <div className="transaction-grid total-row">
        <div
          className="grid-item"
          style={{ gridColumn: "1 / span 4", textAlign: "right" }}
        >
          Commission ({commission}%):
        </div>
        <div className="grid-item total-cell">
          ₹{commissionTotal.toFixed(2)}
        </div>
      </div>

      <div className="transaction-grid total-row">
        <div
          className="grid-item"
          style={{
            gridColumn: "1 / span 4",
            textAlign: "right",
            fontWeight: "bold"
          }}
        >
          Grand Total:
        </div>
        <div
          className="grid-item total-cell"
          style={{ fontWeight: "bold" }}
        >
          ₹{grandTotal.toFixed(2)}
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Transaction;
