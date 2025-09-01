import axios from "axios";

const API_BASE = "https://localhost:8443" ;

// --- Auth ---
export const signupUser = async (data) => {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
   body: JSON.stringify(data),
  });

  const body = await res.json(); 
  return { ok: res.ok, data: body };
};

// --- Item CRUD ---
export const fetchItems = async () => {
  try {
    const response = await fetch(`${API_BASE}/getAllItems`);
    if (!response.ok) {
      console.error("Failed to fetch items");
      return [];
    }
    
    const result = await response.json();
    return result.data || [];  // Return only data array
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

export const addItem = async (item, userid) => {
  await fetch(`${API_BASE}/saveItem/${userid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
};

export const updateItem = async (item) => {
  await fetch(`${API_BASE}/updateItem/${item.itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
};

export const deleteItem = async (id) => {
  await fetch(`${API_BASE}/deleteItem/${id}`, {
    method: 'DELETE'
  });
};

// --- Expense CRUD ---
export const fetchExpenses = async () => {
  try {
    const response = await fetch(`${API_BASE}/getAllExpenses`);
    if (!response.ok) {
      return [];
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    return [];
  }
};

export const addExpense = async (expense) => {
  await fetch(`${API_BASE}/saveExpense`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense)
  });
};

export const updateExpense = async (expense) => {
  await fetch(`${API_BASE}/updateExpense/${expense.expenseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense)
  });
};

export const deleteExpense = async (id) => {
  await fetch(`${API_BASE}/deleteExpense/${id}`, {
    method: 'DELETE'
  });
};

// --- Transaction ---
export const saveTransaction = async (rows) => {
  try {
    const res = await fetch(`${API_BASE}/saveTransaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows),
    });

    if (!res.ok) {
      return { ok: false };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    console.error("Error saving transaction:", error);
    return { ok: false, error };
  }
};

// export const fetchItem = async (query) => {
//   try {
//     const response = await fetch(`${API_BASE}/getItemBySearch?input=${query}`);
//     if (!response.ok) {
//       return [];
//     }
//     const result = await response.json();
//     return result.data || [];
//   } catch (error) {
//     return [];
//   }
// };

export const fetchItem = async (query) => {
  try {
    const res= await fetch(`${API_BASE}/getItemBySearch?input=${query}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
    if (!res.ok) {
      return [];
    }
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.log("error fetch search item"+error);
  }
};

// export const saveTransaction = async (transaction) => {
//   const response = await axios.post(API_URL, transaction);
//   return response.data;
// };



//    -- Reports --


// ✅ Fetch overall sales summary
export const getOverallSales = () => fetch(`${API_BASE}/overallSales`);

// ✅ Fetch item-wise sales
export const getItemWiseSales = () => fetch(`${API_BASE}/itemwiseSales`);

// ✅ Fetch date-wise sales
export const getDateWiseSales = () => fetch(`${API_BASE}/datewiseSales`);

// ✅ Fetch recent transactions
export const getRecentTransactions = () => fetch(`${API_BASE}/recentTransactions`);