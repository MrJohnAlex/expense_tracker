import { useContext, useEffect, useState } from "react";

import ExpensesOutput from "../components/Expenses/ExpensesOutput";
import { ExpenseContext } from "../context/expense-context";
import { getDateMinutesDays } from "../utils/date";
import { getAllExpenses } from "../utils/http";
import LoadingOverLay from "../components/ui/LoadingOverLay";
import ErrorOverLay from "../components/ui/ErrorOverLay";
import { UserContext } from "../context/user-context";

export default function IncomeScreen() {
  const expensesCtx = useContext(ExpenseContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const uesrCtx = useContext(UserContext);

  useEffect(() => {
    async function getExpenses() {
      setIsLoading(true);
      try {
        const expenses = await getAllExpenses(uesrCtx.token);
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Couldn't fetch expenses.");
      }
      setIsLoading(false);
    }
    getExpenses();
  }, []);

  function onErrorConfirmHandler() {
    setError(null);
  }
  if (error && !isLoading) {
    return <ErrorOverLay message={error} onPress={onErrorConfirmHandler} />;
  }

  if (isLoading) {
    return <LoadingOverLay />;
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinutesDays(today, 7);
    return new Date(expense.date) > date7DaysAgo;
  });
  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText="There is no recent expenses within last 7 days."
    />
  );
}
