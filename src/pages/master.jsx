import { useState, useEffect } from "react";
import { FaPlus, FaBox, FaMoneyBill, FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  fetchItems,
  fetchExpenses,
  addItem,
  addExpense,
  updateItem,
  updateExpense,
  deleteItem,
  deleteExpense,
} from "../services/authservice";

const MySwal = withReactContent(Swal);

function Master() {
  const [activeTab, setActiveTab] = useState("item");
  const [items, setItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    loadItems();
    loadExpenses();
  }, []);

  const loadItems = async () => {
    const data = await fetchItems();
    setItems(data);
  };

  const loadExpenses = async () => {
    const data = await fetchExpenses();
    setExpenses(data);
  };

  const openModal = (type, data = {}) => {
    setActiveTab(type);
    setFormData(data);
    setEditing(
      (type === "item" && data.itemId) ||
      (type === "expense" && data.expenseId)
    );
    setShowModal(true);
  };

  const openViewModal = (data) => {
    setViewData(data);
  };

  const closeViewModal = () => {
    setViewData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const uid = JSON.parse(localStorage.getItem("user")).userid;
      if (activeTab === "item") {
        editing ? await updateItem(formData) : await addItem(formData, uid);
        toast.success(`Item ${editing ? "updated" : "added"} successfully!`);
        loadItems();
      } else {
        editing ? await updateExpense(formData) : await addExpense(formData, uid);
        toast.success(
          `Expense ${editing ? "updated" : "added"} successfully!`
        );
        loadExpenses();
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Failed to save data.");
    }
    setShowModal(false);
    setFormData({});
    setEditing(false);
  };

  const handleDeleteRequest = (id, type) => {
    MySwal.fire({
      title: `Delete ${type}?`,
      text: `Are you sure you want to delete this ${type}?`,
      icon: "warning",
      width: "400px",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (type === "item") {
            await deleteItem(id);
            loadItems();
            toast.success("Item deleted successfully");
          } else {
            await deleteExpense(id);
            loadExpenses();
            toast.success("Expense deleted successfully");
          }
        } catch (err) {
          console.error("Delete Error:", err);
          toast.error(`Failed to delete ${type}.`);
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-green-100 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] bg-repeat flex flex-col items-center">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Master</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold ${
            activeTab === "item"
              ? "bg-green-600 text-white"
              : "bg-white shadow text-green-700"
          }`}
          onClick={() => setActiveTab("item")}
        >
          <FaBox /> Item
        </button>
        <button
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold ${
            activeTab === "expense"
              ? "bg-green-600 text-white"
              : "bg-white shadow text-green-700"
          }`}
          onClick={() => setActiveTab("expense")}
        >
          <FaMoneyBill /> Expense
        </button>
      </div>

      <div className="w-full max-w-4xl">
        <button
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
          onClick={() => openModal(activeTab)}
        >
          <FaPlus /> Add {activeTab === "item" ? "Item" : "Expense"}
        </button>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(activeTab === "item" ? items : expenses).map((data) => (
            <div
              key={activeTab === "item" ? data.itemId : data.expenseId}
              className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg relative"
              onClick={() => openViewModal(data)}
            >
              <h4 className="text-lg font-semibold text-green-700">
                {activeTab === "item" ? data.itemName : data.expenseName}
              </h4>
              <div
                className="absolute top-2 right-2 flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="p-2 text-blue-600 hover:bg-green-100 rounded"
                  onClick={() => openModal(activeTab, data)}
                >
                  <FaEdit />
                </button>
                <button
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                  onClick={() =>
                    handleDeleteRequest(
                      activeTab === "item" ? data.itemId : data.expenseId,
                      activeTab
                    )
                  }
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 shadow-lg">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              {editing ? "Edit" : "Add"}{" "}
              {activeTab === "item" ? "Item" : "Expense"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  value={
                    activeTab === "item"
                      ? formData.itemName || ""
                      : formData.expenseName || ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [activeTab === "item"
                        ? "itemName"
                        : "expenseName"]: e.target.value,
                    })
                  }
                  required
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {(activeTab === "item" || activeTab === "expense") && (
                <div>
                  <label className="block font-semibold text-gray-700">
                    UOM
                  </label>
                  <select
                    value={formData.uom || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, uom: e.target.value })
                    }
                    required
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select</option>
                    <option value="Kg">Kg</option>
                    <option value="Ltr">Ltr</option>
                    <option value="Nos">Nos</option>
                    <option value="Grm">Grm</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editing ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 shadow-lg">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              View {activeTab === "item" ? "Item" : "Expense"}
            </h3>
            <p className="mb-2">
              <strong>Name : </strong>{" "}
              {activeTab === "item" ? viewData.itemName : viewData.expenseName}
            </p>
            {(activeTab === "item" || activeTab === "expense") && (
              <p className="mb-2">
                <strong>UOM : </strong> {viewData.uom}
              </p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-center" autoClose={1000} style={{ bottom: "50px", padding: "10px" }}
      />
    </div>
  );
}

export default Master;
