import { createContext, useContext, useEffect, useReducer } from "react";
import { getAllExpenses } from "../utils/http";
import { UserContext } from "./user-context";

export const ExpenseContext = createContext({
  expenses: [],
  setExpenses: (expenses) => {},
  addExpense: ({ description, amount, date }) => {},
  removeExpense: ({ expenseId }) => {},
  updateExpense: ({ expenseId, description, amount, date }) => {},
});

function expenseReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "SET":
      const invertedArr = action.payload.reverse();
      return invertedArr;
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
  const userCtx = useContext(UserContext);
  const [expensesState, dispatch] = useReducer(expenseReducer, []);

  function setExpenses(expenses) {
    dispatch({ type: "SET", payload: expenses });
  }
  function addExpense(expenseObj) {
    dispatch({ type: "ADD", payload: expenseObj });
  }
  function removeExpense(expenseId) {
    dispatch({ type: "REMOVE", payload: expenseId });
  }
  function updateExpense(expenseId, expenseObj) {
    dispatch({ type: "UPDATE", payload: { expenseId, data: expenseObj } });
  }
  useEffect(() => {
    async function loadExpenses() {
      if (!userCtx.token) {
        dispatch({ type: "SET", payload: [] }); // clear on logout
        return;
      }

      try {
        const expenses = await getAllExpenses(userCtx.token);
        setExpenses(expenses);
      } catch (error) {
        console.log(`Token: ${userCtx.token}`);
        console.log(`Error: ${error}`);
      }
    }

    loadExpenses();
  }, [userCtx.token]);
  const value = {
    expenses: expensesState,
    setExpenses,
    addExpense,
    removeExpense,
    updateExpense,
  };
  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}
