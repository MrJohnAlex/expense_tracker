import { createContext, useReducer } from "react";

const DUMMY_EXPENSESS = [
  {
    id: "e1",
    description: "A pair of shoes",
    amount: 300,
    date: new Date("2025-02-18"),
  },
  {
    id: "e2",
    description: "A pair of shirts",
    amount: 500,
    date: new Date("2025-02-16"),
  },
  {
    id: "e3",
    description: "A pair of Juice",
    amount: 60,
    date: new Date("2025-02-16"),
  },
  {
    id: "e4",
    description: "A pair of Juice",
    amount: 6000,
    date: new Date("2026-02-16"),
  },
  {
    id: "e5",
    description: "A pair of shoes",
    amount: 300,
    date: new Date("2026-02-18"),
  },
  {
    id: "e6",
    description: "A pair of shirts",
    amount: 500,
    date: new Date("2026-02-16"),
  },
  {
    id: "e7",
    description: "A pair of Juice",
    amount: 60,
    date: new Date("2026-02-16"),
  },
  {
    id: "e8",
    description: "A pair of Juice",
    amount: 6000,
    date: new Date("2026-02-16"),
  },
];

export const ExpenseContext = createContext({
  expenses: [],
  addExpense: ({ description, amount, date }) => {},
  removeExpense: ({ expenseId }) => {},
  updateExpense: ({ expenseId, description, amount, date }) => {},
});

function expenseReducer(state, action) {
  switch (action.type) {
    case "ADD":
      const id = new Date().toString() + Math.random().toString();
      return [{ ...action.payload, id: id }, ...state];
    case "UPDATE":
      const updateableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.expenseId,
      );
      const updateableExpense = state[updateableExpenseIndex];
      const updateItem = { ...updateableExpense, ...action.payload.data };
      const updatedExpenses = [...state];
      updatedExpenses[updateableExpenseIndex] = updateItem;
      return updatedExpenses;
    case "REMOVE":
      return state.filter((expense) => expense.id !== action.payload);
    default:
      return state;
  }
}

export default function ExpenseProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expenseReducer, DUMMY_EXPENSESS);
  function addExpense(expenseObj) {
    dispatch({ type: "ADD", payload: expenseObj });
  }
  function removeExpense(expenseId) {
    dispatch({ type: "REMOVE", payload: expenseId });
  }
  function updateExpense(expenseId, expenseObj) {
    dispatch({ type: "UPDATE", payload: { expenseId, data: expenseObj } });
  }
  const value = {
    expenses: expensesState,
    addExpense,
    removeExpense,
    updateExpense,
  };
  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}
