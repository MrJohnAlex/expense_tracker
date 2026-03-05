import axios from "axios";

const URL =
  "https://expense-tracker-fd3a5-default-rtdb.asia-southeast1.firebasedatabase.app/";

// ── Axios instance factory ───────────────────────────────────
export const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: URL,
    params: { auth: token },
  });
};

// ── Helper: parse Firebase response into item array ──────────
function parseFirebaseResponse(data, type) {
  if (!data) return [];
  return Object.entries(data).map(([key, val]) => ({
    id:          key,
    amount:      val.amount,
    date:        new Date(val.date),
    description: val.description,
    type,                            // "expense" | "income"
  }));
}

// ════════════════════════════════════════════════════════════
// EXPENSES
// ════════════════════════════════════════════════════════════

export async function storeExpense(expenseData, token) {
  const instance = createAxiosInstance(token);
  const response = await instance.post("expenses.json", {
    ...expenseData,
    type: "expense",
  });
  return response.data.name; // Firebase-generated ID
}

export async function getAllExpenses(token) {
  const instance = createAxiosInstance(token);
  const response = await instance.get("expenses.json");
  return parseFirebaseResponse(response.data, "expense");
}

export async function updateExpense(id, expenseData, token) {
  const instance = createAxiosInstance(token);
  return instance.put(`expenses/${id}.json`, {
    ...expenseData,
    type: "expense",
  });
}

export async function deleteExpense(id, token) {
  const instance = createAxiosInstance(token);
  return instance.delete(`expenses/${id}.json`);
}

// ════════════════════════════════════════════════════════════
// INCOMES
// ════════════════════════════════════════════════════════════

export async function storeIncome(incomeData, token) {
  const instance = createAxiosInstance(token);
  const response = await instance.post("incomes.json", {
    ...incomeData,
    type: "income",
  });
  return response.data.name; // Firebase-generated ID
}

export async function getAllIncomes(token) {
  const instance = createAxiosInstance(token);
  const response = await instance.get("incomes.json");
  return parseFirebaseResponse(response.data, "income");
}

export async function updateIncome(id, incomeData, token) {
  const instance = createAxiosInstance(token);
  return instance.put(`incomes/${id}.json`, {
    ...incomeData,
    type: "income",
  });
}

export async function deleteIncome(id, token) {
  const instance = createAxiosInstance(token);
  return instance.delete(`incomes/${id}.json`);
}