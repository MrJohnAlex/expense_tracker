import { View, Text, StyleSheet } from "react-native";
import ExpensesList from "./ExpensesList";
import ExpensesSummary from "./ExpensesSummary";

const colors = {
  background: "#0F1628",
  surface: "#1C2440",
  border: "#2A3352",
  income: "#2ECC71",
  incomeBg: "#1A3D2B",
  expense: "#E74C3C",
  expenseBg: "#3D1A1A",
  textPrimary: "#FFFFFF",
  textMuted: "#4A5568",
};

export default function ExpensesOutput({
  expenses,
  expensesPeriod,
  fallbackText,
  type = "expense",
}) {
  const isIncome = type === "income";
  const accentColor = isIncome ? colors.income : colors.expense;

  return (
    <View style={styles.container}>

      {/* Summary card */}
      <ExpensesSummary
        period={expensesPeriod}
        expenses={expenses}
        type={type}
      />

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: accentColor }]} />
        <Text style={styles.sectionTitle}>
          {isIncome ? "Income" : "Expenses"}
        </Text>
        <Text style={styles.sectionCount}>
          {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
        </Text>
      </View>

      {/* List or empty state */}
      {expenses.length > 0 ? (
        <View style={styles.listCard}>
          <ExpensesList expenses={expenses} />
        </View>
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackIcon}>
            {isIncome ? "💰" : "🧾"}
          </Text>
          <Text style={styles.fallbackText}>{fallbackText}</Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.background,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  sectionCount: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // List card wrapper
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    paddingHorizontal: 4,
  },

  // Empty fallback
  fallback: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 10,
  },
  fallbackIcon: {
    fontSize: 36,
  },
  fallbackText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
});
