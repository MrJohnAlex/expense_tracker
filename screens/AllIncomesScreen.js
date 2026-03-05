import { useContext } from "react";
import ExpensesOutput from "../components/Expenses/ExpensesOutput";
import { ExpenseContext } from "../context/expense-context";

export default function AllIncomesScreen() {
  const expensesCtx = useContext(ExpenseContext);

  console.log(expensesCtx.incomes)
  return (
    <ExpensesOutput
      expenses={expensesCtx.incomes}
      expensesPeriod="Total"
      fallbackText="No income registered yet!"
      type="income"
    />
  );
}