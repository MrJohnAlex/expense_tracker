import { StyleSheet, Text, View } from "react-native";

import ExpensesList from "./ExpensesList";
import ExpensesSumary from "./ExpensesSummary";
import { GlobalStyles } from "../../constants/styles";

export default function ExpensesOutput({
  expenses,
  expensesPeriod,
  fallbackText,
}) {
  let content = <Text style={styles.infoText}>{fallbackText}</Text>;
  if (expenses.length > 0) {
    content = <ExpensesList expenses={expenses} />;
  }
  return (
    <View style={styles.container}>
      <ExpensesSumary period={expensesPeriod} expenses={expenses} />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary500,
  },
  infoText: {
    fontSize: 16,
    color: "white",
    marginTop: 32,
    textAlign: "center",
  },
});
