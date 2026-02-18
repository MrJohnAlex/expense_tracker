import { useContext } from "react";

import ExpensesOutput from "../components/Expenses/ExpensesOutput";
import { ExpenseContext } from "../context/expense-context";
import { getDateMinutesDays } from "../utils/date";

export default function RecentExpense() {
  const expensesCtx = useContext(ExpenseContext);
  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinutesDays(today, 7);
    return expense.date > date7DaysAgo;
  });
  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText="There is no recent expenses within last 7 days."
    />
  );
}
