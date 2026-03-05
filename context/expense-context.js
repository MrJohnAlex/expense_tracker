import { createContext, useContext, useEffect, useReducer } from "react";
import { getAllExpenses, getAllIncomes } from "../utils/http";   // ← import both
import { UserContext } from "./UserContext";

export const ExpenseContext = createContext({
  expenses: [],
  incomes: [],
  setExpenses: (expenses) => {},
  setIncomes: (incomes) => {},
  addExpense: (expenseObj) => {},
  addIncome: (incomeObj) => {},
  removeExpense: (expenseId) => {},
  removeIncome: (incomeId) => {},
  updateExpense: (expenseId, expenseObj) => {},
  updateIncome: (incomeId, incomeObj) => {},
});

// ── Shared reducer ───────────────────────────────────────────
function itemReducer(state, action) {
  switch (action.type) {
    case "SET":
      return [...action.payload].reverse();
    case "ADD":
      return [action.payload, ...state];
    case "UPDATE":
      const idx = state.findIndex((item) => item.id === action.payload.id);
      if (idx === -1) return state;
      const updated = [...state];
      updated[idx] = { ...updated[idx], ...action.payload.data };
      return updated;
    case "REMOVE":
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
}

export default function ExpenseProvider({ children }) {
  const userCtx = useContext(UserContext);

  const [expensesState, dispatchExpenses] = useReducer(itemReducer, []);
  const [incomesState,  dispatchIncomes]  = useReducer(itemReducer, []);

  // ── Expenses ─────────────────────────────────────────────
  function setExpenses(expenses) {
    dispatchExpenses({ type: "SET", payload: expenses });
  }
  function addExpense(expenseObj) {
    dispatchExpenses({ type: "ADD", payload: { ...expenseObj, type: "expense" } });
  }
  function updateExpense(expenseId, expenseObj) {
    dispatchExpenses({ type: "UPDATE", payload: { id: expenseId, data: expenseObj } });
  }
  function removeExpense(expenseId) {
    dispatchExpenses({ type: "REMOVE", payload: expenseId });
  }

  // ── Incomes ──────────────────────────────────────────────
  function setIncomes(incomes) {
    dispatchIncomes({ type: "SET", payload: incomes });
  }
  function addIncome(incomeObj) {
    dispatchIncomes({ type: "ADD", payload: { ...incomeObj, type: "income" } });
  }
  function updateIncome(incomeId, incomeObj) {
    dispatchIncomes({ type: "UPDATE", payload: { id: incomeId, data: incomeObj } });
  }
  function removeIncome(incomeId) {
    dispatchIncomes({ type: "REMOVE", payload: incomeId });
  }

  // ── Load on login / clear on logout ─────────────────────
  useEffect(() => {
    async function loadData() {
      if (!userCtx.token) {
        dispatchExpenses({ type: "SET", payload: [] });
        dispatchIncomes({ type: "SET", payload: [] });
        return;
      }

      try {
        // Fetch both in parallel from their separate Firebase nodes
        const [expenses, incomes] = await Promise.all([
          getAllExpenses(userCtx.token),
          getAllIncomes(userCtx.token),
        ]);

        setExpenses(expenses);
        setIncomes(incomes);
      } catch (error) {
        console.log(`Token: ${userCtx.token}`);
        console.log(`Error loading data: ${error}`);
      }
    }

    loadData();
  }, [userCtx.token]);

  const value = {
    expenses: expensesState,
    incomes:  incomesState,
    setExpenses,
    setIncomes,
    addExpense,
    addIncome,
    removeExpense,
    removeIncome,
    updateExpense,
    updateIncome,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}