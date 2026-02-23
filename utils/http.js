import axios from "axios";

const URL =
  "https://expense-tracker-fd3a5-default-rtdb.asia-southeast1.firebasedatabase.app/";

export const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: URL,
    params: {
      auth: token,
    },
  });
};

export const storeExpense = async (expenseData, token) => {
  const axiosInstance = createAxiosInstance(token);
  const response = await axiosInstance.post("expenses.json", expenseData);
  return response.data.name;
};

export const getAllExpenses = async (token) => {
  const axiosInstance = createAxiosInstance(token);
  const response = await axiosInstance.get("expenses.json");
  const expenses = [];
  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }
  return expenses;
};

export function updateExpense(id, expenseData, token) {
  const axiosInstance = createAxiosInstance(token);
  return axiosInstance.put(`expenses/${id}.json`, expenseData);
}
export function deleteExpense(id, token) {
  const axiosInstance = createAxiosInstance(token);
  return axiosInstance.delete(`expenses/${id}.json`);
}
