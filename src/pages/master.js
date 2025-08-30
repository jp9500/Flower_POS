import { useState, useEffect } from 'react';
import '../CSS/master.css';
import { FaPlus, FaBox, FaMoneyBill, FaEdit, FaTrash } from 'react-icons/fa'; // Removed FaEye
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
  fetchItems,
  fetchExpenses,
  addItem,
  addExpense,
  updateItem,
  updateExpense,
  deleteItem,
  deleteExpense
} from '../services/authservice';

const MySwal = withReactContent(Swal);

function Master() {
  const [activeTab, setActiveTab] = useState('item');
  const [items, setItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [viewData, setViewData] = useState(null); // For view modal

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
    setEditing((type === 'item' && data.itemId) || (type === 'expense' && data.expenseId));
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
      if (activeTab === 'item') {
        const uid = JSON.parse(localStorage.getItem('user')).userid;
        editing ? await updateItem(formData) : await addItem(formData, uid);
        toast.success(`Item ${editing ? 'updated' : 'added'} successfully!`);
        loadItems();
      } else {
        editing ? await updateExpense(formData) : await addExpense(formData);
        toast.success(`Expense ${editing ? 'updated' : 'added'} successfully!`);
        loadExpenses();
      }
    } catch (err) {
      console.error('Submit Error:', err);
      toast.error('Failed to save data.');
    }
    setShowModal(false);
    setFormData({});
    setEditing(false);
  };

  const handleDeleteRequest = (id, type) => {
    MySwal.fire({
      title: `Delete ${type}?`,
      text: `Are you sure you want to delete this ${type}?`,
      icon: 'warning',
      width: '400px',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (type === 'item') {
            await deleteItem(id);
            loadItems();
            toast.success('Item deleted successfully');
          } else {
            await deleteExpense(id);
            loadExpenses();
            toast.success('Expense deleted successfully');
          }
        } catch (err) {
          console.error('Delete Error:', err);
          toast.error(`Failed to delete ${type}.`);
        }
      }
    });
  };

  return (
    <div className="master-container">
      <h2>Master</h2>

      <div className="tab-buttons">
        <button className={activeTab === 'item' ? 'active' : ''} onClick={() => setActiveTab('item')}>
          <FaBox /> Item
        </button>
        <button className={activeTab === 'expense' ? 'active' : ''} onClick={() => setActiveTab('expense')}>
          <FaMoneyBill /> Expense
        </button>
      </div>

      <div className="master-content">
        <button className="add-btn" onClick={() => openModal(activeTab)}>
          <FaPlus /> Add {activeTab === 'item' ? 'Item' : 'Expense'}
        </button>

        <div className="card-grid">
          {(activeTab === 'item' ? items : expenses).map(data => (
            <div
              className="inventory-card"
              key={activeTab === 'item' ? data.itemId : data.expenseId}
              onClick={() => openViewModal(data)}
            >
              <div className="card-header">
                <h4>{activeTab === 'item' ? data.itemName : data.expenseName}</h4>
              </div>
              <div
                className="card-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="icon-btn edit-btn"
                  onClick={() => openModal(activeTab, data)}
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() =>
                    handleDeleteRequest(
                      activeTab === 'item' ? data.itemId : data.expenseId,
                      activeTab
                    )
                  }
                  title="Delete"
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editing ? 'Edit' : 'Add'} {activeTab === 'item' ? 'Item' : 'Expense'}</h3>
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                value={activeTab === 'item' ? formData.itemName || '' : formData.expenseName || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [activeTab === 'item' ? 'itemName' : 'expenseName']: e.target.value
                  })
                }
                required
              />
              <label>UOM</label>
              <select
                value={formData.uom || ''}
                onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
                required
              >
                <option value="">Select</option>
                <option value="Kg">Kg</option>
                <option value="Ltr">Ltr</option>
                <option value="Nos">Nos</option>
                <option value="Grm">Grm</option>
              </select>
              <div className="form-actions">
                <button type="submit">{editing ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(false); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>View {activeTab === 'item' ? 'Item' : 'Expense'}</h3>
            <p><strong>Name:</strong> {activeTab === 'item' ? viewData.itemName : viewData.expenseName}</p>
            {activeTab === 'item' && <p><strong>UOM:</strong> {viewData.uom}</p>}
            <button className='close-view-btn' onClick={closeViewModal}>Close</button>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2000} style={{ top: '50px' }} />
    </div>
  );
}

export default Master;
