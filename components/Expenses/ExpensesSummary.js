import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";

export default function ExpensesSumary({ period, expenses }) {
  const expenseTotal = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);
  return (
    <View style={styles.container}>
      <Text style={styles.period}>{period}</Text>
      <Text style={styles.sum}>{expenseTotal.toFixed(2)} THB</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: GlobalStyles.colors.primary50,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  period: {
    fontSize: 16,
    color: GlobalStyles.colors.primary400,
  },
  sum: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
  },
});
