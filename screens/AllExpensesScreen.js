import { useContext } from "react";

import ExpensesOutput from "../components/Expenses/ExpensesOutput";
import { ExpenseContext } from "../context/expense-context";

export default function AllExpensesScreen() {
  const expensesCtx = useContext(ExpenseContext);
  const expenses = expensesCtx.expenses;
  return (
    <ExpensesOutput
      expenses={expenses}
      expensesPeriod="Total"
      fallbackText="No expenses registered yet!"
    />
  );
}
