import { View, Text, StyleSheet, FlatList } from "react-native";
import { useContext, useEffect, useState } from "react";

import { ExpenseContext } from "../../context/expense-context";
import Card from "../../components/ui/Card";
import Item from "./Item";

const colors = {
  background: "#0F1628",
  surface: "#1C2440",
  border: "#2A3352",
  primary: "#4F8EF7",
  accent: "#7C5CBF",
  income: "#2ECC71",
  incomeBg: "#1A3D2B",
  expense: "#E74C3C",
  expenseBg: "#3D1A1A",
  textPrimary: "#FFFFFF",
  textSecondary: "#8A94A6",
  textMuted: "#4A5568",
  success: "#00D4AA",
  warning: "#F6A623",
};

function sumAmount(arr = []) {
  return arr.reduce((acc, item) => acc + (item.amount ?? 0), 0);
}

function SectionHeader({ color, title, count }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={[styles.sectionDot, { backgroundColor: color }]} />
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>{count} entries</Text>
    </View>
  );
}

function EmptyState({ type }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{type === "income" ? "💰" : "🧾"}</Text>
      <Text style={styles.emptyText}>No {type} entries yet</Text>
    </View>
  );
}

export default function Dashboard() {
  const expenseCtx = useContext(ExpenseContext);

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    setExpenses(expenseCtx.expenses ?? []);
    setIncomes(expenseCtx.incomes ?? []);
  }, [expenseCtx.expenses, expenseCtx.incomes]);

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear  = new Date().getFullYear();

  const totalIncome  = sumAmount(incomes);
  const totalExpense = sumAmount(expenses);
  const balance      = totalIncome - totalExpense;
  const savingsRate  = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  const savingsPct   = Math.min(Math.max(savingsRate, 0), 100);

  // ── Build a single flat data array for the one FlatList ──
  // Each item has a `_type` key so renderItem knows what to render
  const listData = [
    // income section header
    { _type: "section_header", _key: "income_header", color: colors.income, title: "Income", count: incomes.length },
    // income items or empty
    ...(incomes.length > 0
      ? incomes.map((i) => ({ ...i, _type: "item", _key: `income_${i.id}` }))
      : [{ _type: "empty", _key: "income_empty", kind: "income" }]),
    // expense section header
    { _type: "section_header", _key: "expense_header", color: colors.expense, title: "Expenses", count: expenses.length },
    // expense items or empty
    ...(expenses.length > 0
      ? expenses.map((e) => ({ ...e, _type: "item", _key: `expense_${e.id}` }))
      : [{ _type: "empty", _key: "expense_empty", kind: "expense" }]),
  ];

  // ── Header — everything above the lists ─────────────────
  function ListHeader() {
    return (
      <View>
        {/* Page title */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Overview</Text>
            <Text style={styles.headerTitle}>
              {currentMonth}{" "}
              <Text style={styles.headerYear}>{currentYear}</Text>
            </Text>
          </View>
          <View style={styles.monthBadge}>
            <Text style={styles.monthBadgeText}>This Month</Text>
          </View>
        </View>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceCardCircle} />
          <Text style={styles.balanceLabel}>NET BALANCE</Text>
          <Text style={styles.balanceAmount}>
            {balance < 0 ? "−" : "+"}
            {Math.abs(balance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <Text style={styles.balanceCurrency}> THB</Text>
          </Text>

          <View style={styles.pillRow}>
            <View style={[styles.pill, { backgroundColor: colors.incomeBg }]}>
              <Text style={[styles.pillTag, { color: colors.income }]}>↑ Income</Text>
              <Text style={styles.pillAmount}>
                {totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={[styles.pill, { backgroundColor: colors.expenseBg }]}>
              <Text style={[styles.pillTag, { color: colors.expense }]}>↓ Expense</Text>
              <Text style={styles.pillAmount}>
                {totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          <View style={styles.savingsRow}>
            <Text style={styles.savingsLabel}>Savings rate</Text>
            <Text style={styles.savingsValue}>{savingsPct}%</Text>
          </View>
          <View style={styles.savingsTrack}>
            <View style={[styles.savingsFill, { width: `${savingsPct}%` }]} />
          </View>
        </View>

        {/* Card row */}
        <View style={styles.cardRow}>
          <Card type="income"  amount={totalIncome}  />
          <Card type="expense" amount={totalExpense} />
        </View>
      </View>
    );
  }

  function renderItem({ item, index }) {
    // Section header row
    if (item._type === "section_header") {
      return (
        <View style={[styles.sectionWrapper, index > 0 && { marginTop: 24 }]}>
          <SectionHeader color={item.color} title={item.title} count={item.count} />
          <View style={styles.listCard} />
        </View>
      );
    }
    // Empty state
    if (item._type === "empty") {
      return (
        <View style={styles.listCardSingle}>
          <EmptyState type={item.kind} />
        </View>
      );
    }
    // Regular item — detect if last in its group to handle border
    return (
      <View style={styles.itemWrapper}>
        <Item data={item} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.root}
      contentContainerStyle={styles.rootContent}
      showsVerticalScrollIndicator={false}
      data={listData}
      keyExtractor={(item) => item._key}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={<View style={{ height: 40 }} />}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rootContent: {
    padding: 20,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerYear: {
    color: colors.textMuted,
    fontWeight: "400",
  },
  monthBadge: {
    backgroundColor: "rgba(79,142,247,0.12)",
    borderWidth: 1,
    borderColor: "rgba(79,142,247,0.3)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  monthBadgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },

  // Balance card
  balanceCard: {
    backgroundColor: "#1C2E5A",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(79,142,247,0.15)",
    overflow: "hidden",
    position: "relative",
  },
  balanceCardCircle: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(79,142,247,0.07)",
  },
  balanceLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 18,
  },
  balanceCurrency: {
    fontSize: 18,
    fontWeight: "400",
    opacity: 0.5,
  },
  pillRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  pill: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
  },
  pillTag: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 3,
  },
  pillAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  savingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  savingsLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  savingsValue: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.success,
  },
  savingsTrack: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 99,
    overflow: "hidden",
  },
  savingsFill: {
    height: "100%",
    backgroundColor: colors.success,
    borderRadius: 99,
  },

  // Card row
  cardRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
    justifyContent: "center"
  },

  // Section
  sectionWrapper: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    marginTop: 16,
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

  // Item wrapper — acts as the listCard container per item
  itemWrapper: {
    backgroundColor: colors.surface,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },

  // Single card for empty state
  listCardSingle: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});