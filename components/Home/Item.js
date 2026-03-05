import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { getFormattedDate } from "../../utils/date";

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
  warning: "#F6A623",
};

export default function Item({ data }) {
  const isIncome = data.type === "income" || (!data.type && data.amount > 0);
  const absAmount = Math.abs(data.amount);

  const accentColor = isIncome ? colors.income : colors.expense;
  const accentBg    = isIncome ? colors.incomeBg : colors.expenseBg;
  const icon        = isIncome ? "💰" : "🧾";

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.row}>

      {/* Icon bubble */}
      <View style={[styles.iconBubble, { backgroundColor: accentBg }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      {/* Description + date */}
      <View style={styles.info}>
        <Text style={styles.description} numberOfLines={1}>
          {data.description}
        </Text>
        <Text style={styles.date}>{getFormattedDate(data.date)}</Text>
      </View>

      {/* Amount + badge */}
      <View style={styles.amountCol}>
        <Text style={[styles.amount, { color: accentColor }]}>
          {isIncome ? "+" : "−"}
          {absAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
        <View style={[styles.badge, { backgroundColor: accentBg }]}>
          <Text style={[styles.badgeText, { color: accentColor }]}>
            {isIncome ? "Income" : "Expense"}
          </Text>
        </View>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    letterSpacing: 0.1,
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
  },
  amountCol: {
    alignItems: "flex-end",
    gap: 4,
    flexShrink: 0,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});