import axios from "axios";
import { auth } from "../context/UserContext";

const URL = "https://expense-tracker-fd3a5-default-rtdb.asia-southeast1.firebasedatabase.app/";

export const createAxiosInstance = () => {
  const instance = axios.create({ baseURL: URL });

  instance.interceptors.request.use(async (config) => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      config.params = { ...config.params, auth: token };
    }
    return config;
  });

  return instance;
};

// ── Helper ───────────────────────────────────────────────────
function getUid() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User not authenticated");
  return uid;
}

function parseFirebaseResponse(data, type) {
  if (!data) return [];
  return Object.entries(data).map(([key, val]) => ({
    id:          key,
    amount:      val.amount,
    date:        new Date(val.date),
    description: val.description,
    type,
  }));
}

// ════════════════════════════════════════════════════════════
// EXPENSES
// ════════════════════════════════════════════════════════════

export async function storeExpense(expenseData) {
  const uid = getUid();
  const instance = createAxiosInstance();
  const response = await instance.post(`expenses/${uid}.json`, {
    ...expenseData,
    type: "expense",
  });
  return response.data.name;
}

export async function getAllExpenses() {
  const uid = getUid();
  const instance = createAxiosInstance();
  const response = await instance.get(`expenses/${uid}.json`);
  return parseFirebaseResponse(response.data, "expense");
}

export async function updateExpense(id, expenseData) {
  const uid = getUid();
  const instance = createAxiosInstance();
  return instance.put(`expenses/${uid}/${id}.json`, {
    ...expenseData,
    type: "expense",
  });
}

export async function deleteExpense(id) {
  const uid = getUid();
  const instance = createAxiosInstance();
  return instance.delete(`expenses/${uid}/${id}.json`);
}

// ════════════════════════════════════════════════════════════
// INCOMES
// ════════════════════════════════════════════════════════════

export async function storeIncome(incomeData) {
  const uid = getUid();
  const instance = createAxiosInstance();
  const response = await instance.post(`incomes/${uid}.json`, {
    ...incomeData,
    type: "income",
  });
  return response.data.name;
}

export async function getAllIncomes() {
  const uid = getUid();
  const instance = createAxiosInstance();
  const response = await instance.get(`incomes/${uid}.json`);
  return parseFirebaseResponse(response.data, "income");
}

export async function updateIncome(id, incomeData) {
  const uid = getUid();
  const instance = createAxiosInstance();
  return instance.put(`incomes/${uid}/${id}.json`, {
    ...incomeData,
    type: "income",
  });
}

export async function deleteIncome(id) {
  const uid = getUid();
  const instance = createAxiosInstance();
  return instance.delete(`incomes/${uid}/${id}.json`);
}