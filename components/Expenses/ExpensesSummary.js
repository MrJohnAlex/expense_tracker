import { View, Text, StyleSheet } from "react-native";

const colors = {
  background: "#0F1628",
  surface: "#1C2440",
  border: "#2A3352",
  primary: "#4F8EF7",
  income: "#2ECC71",
  incomeBg: "#1A3D2B",
  expense: "#E74C3C",
  expenseBg: "#3D1A1A",
  textPrimary: "#FFFFFF",
  textSecondary: "#8A94A6",
  textMuted: "#4A5568",
  success: "#00D4AA",
};

export default function ExpensesSummary({ period, expenses, type = "expense" }) {
  const isIncome = type === "income";

  const total = expenses.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const count = expenses.length;
  const avg = count > 0 ? total / count : 0;

  const accentColor = isIncome ? colors.income : colors.expense;
  const accentBg = isIncome ? colors.incomeBg : colors.expenseBg;

  return (
    <View style={[styles.card, { borderColor: accentBg }]}>

      {/* Decorative circle */}
      <View style={[styles.circle, { backgroundColor: accentBg }]} />

      {/* Top row — period + badge */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.periodLabel}>PERIOD</Text>
          <Text style={styles.periodValue}>{period}</Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: accentBg }]}>
          <Text style={[styles.typeBadgeText, { color: accentColor }]}>
            {isIncome ? "↑ Income" : "↓ Expenses"}
          </Text>
        </View>
      </View>

      {/* Total */}
      <Text style={styles.totalLabel}>TOTAL</Text>
      <Text style={[styles.totalAmount, { color: accentColor }]}>
        {isIncome ? "+" : "−"}
        {total.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        <Text style={styles.currency}>THB</Text>
      </Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{count}</Text>
          <Text style={styles.statLabel}>Entries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {avg.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
          <Text style={styles.statLabel}>Avg / entry</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: accentColor }]}>
            {isIncome ? "▲" : "▼"}
          </Text>
          <Text style={styles.statLabel}>
            {isIncome ? "Inflow" : "Outflow"}
          </Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  circle: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    top: -60,
    right: -50,
    opacity: 0.6,
  },

  // Top row
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  periodLabel: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  periodValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  typeBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Total
  totalLabel: {
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 44,
    marginBottom: 16,
  },
  currency: {
    fontSize: 16,
    fontWeight: "400",
    opacity: 0.6,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
});
