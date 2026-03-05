import { StyleSheet, Text, View } from "react-native";

const colors = {
  surface: "#1C2440",
  border: "#2A3352",
  income: "#2ECC71",
  incomeBg: "#1A3D2B",
  expense: "#E74C3C",
  expenseBg: "#3D1A1A",
  textPrimary: "#FFFFFF",
  textSecondary: "#8A94A6",
  textMuted: "#4A5568",
};

export default function Card({ type, amount }) {
  const isIncome = type === "income";
  const accentColor = isIncome ? colors.income : colors.expense;
  const accentBg    = isIncome ? colors.incomeBg : colors.expenseBg;

  const formatted = Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View style={[styles.card, { borderColor: accentBg }]}>

      {/* Decorative top bar */}
      <View style={[styles.topBar, { backgroundColor: accentColor }]} />

      {/* Icon bubble */}
      <View style={[styles.iconBubble, { backgroundColor: accentBg }]}>
        <Text style={[styles.icon, { color: accentColor }]}>
          {isIncome ? "↑" : "↓"}
        </Text>
      </View>

      {/* Label */}
      <Text style={styles.label}>
        {isIncome ? "Income" : "Expense"}
      </Text>

      {/* Amount */}
      <Text style={[styles.amount, { color: accentColor }]}>
        {isIncome ? "+" : "−"}
        {formatted}
      </Text>

      {/* Currency tag */}
      <View style={[styles.currencyTag, { backgroundColor: accentBg }]}>
        <Text style={[styles.currencyText, { color: accentColor }]}>THB</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
    alignItems: "center",
    overflow: "hidden",
    minWidth: 140,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  // Colored top accent bar
  topBar: {
    height: 3,
    width: "100%",
    marginBottom: 14,
    borderRadius: 99,
    opacity: 0.8,
  },

  // Icon
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  icon: {
    fontSize: 18,
    fontWeight: "800",
  },

  // Label
  label: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
    fontWeight: "600",
  },

  // Amount
  amount: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 10,
  },

  // Currency tag
  currencyTag: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  currencyText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});