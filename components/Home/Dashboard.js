import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useContext, useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";

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

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

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

// ── Filter items to selected month/year ──────────────────────
function filterByMonth(arr = [], year, month) {
  return arr.filter((item) => {
    const d = item.date instanceof Date ? item.date : new Date(item.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export default function Dashboard() {
  const expenseCtx = useContext(ExpenseContext);

  // ── Selected month state (defaults to current month) ────────
  const now = new Date();
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed

  const isCurrentMonth =
    selectedYear  === now.getFullYear() &&
    selectedMonth === now.getMonth();

  // ── Navigate months ──────────────────────────────────────────
  function goPrev() {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  }

  function goNext() {
    // Don't allow going beyond current month
    if (isCurrentMonth) return;
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  }

  function goToday() {
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  }

  // ── Filtered data ────────────────────────────────────────────
  const expenses = useMemo(
    () => filterByMonth(expenseCtx.expenses ?? [], selectedYear, selectedMonth),
    [expenseCtx.expenses, selectedYear, selectedMonth]
  );

  const incomes = useMemo(
    () => filterByMonth(expenseCtx.incomes ?? [], selectedYear, selectedMonth),
    [expenseCtx.incomes, selectedYear, selectedMonth]
  );

  const totalIncome  = sumAmount(incomes);
  const totalExpense = sumAmount(expenses);
  const balance      = totalIncome - totalExpense;
  const savingsRate  = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;
  const savingsPct   = Math.min(Math.max(savingsRate, 0), 100);

  // ── Flat list data ───────────────────────────────────────────
  const listData = [
    { _type: "section_header", _key: "income_header",  color: colors.income,  title: "Income",   count: incomes.length  },
    ...(incomes.length > 0
      ? incomes.map((i)  => ({ ...i, _type: "item", _key: `income_${i.id}`  }))
      : [{ _type: "empty", _key: "income_empty",  kind: "income"  }]),
    { _type: "section_header", _key: "expense_header", color: colors.expense, title: "Expenses", count: expenses.length },
    ...(expenses.length > 0
      ? expenses.map((e) => ({ ...e, _type: "item", _key: `expense_${e.id}` }))
      : [{ _type: "empty", _key: "expense_empty", kind: "expense" }]),
  ];

  // ── Header ───────────────────────────────────────────────────
  function ListHeader() {
    return (
      <View>
        {/* Page title */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSub}>Overview</Text>
            <Text style={styles.headerTitle}>
              {MONTH_NAMES[selectedMonth]}{" "}
              <Text style={styles.headerYear}>{selectedYear}</Text>
            </Text>
          </View>

          {/* ── Month navigator ── */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={goPrev} style={styles.navBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={18} color={colors.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={isCurrentMonth ? undefined : goToday}
              activeOpacity={isCurrentMonth ? 1 : 0.7}
              style={[styles.monthBadge, isCurrentMonth && styles.monthBadgeActive]}
            >
              <Text style={[styles.monthBadgeText, isCurrentMonth && styles.monthBadgeTextActive]}>
                {isCurrentMonth ? "This Month" : "Go to Now"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goNext}
              style={[styles.navBtn, isCurrentMonth && styles.navBtnDisabled]}
              activeOpacity={isCurrentMonth ? 1 : 0.7}
              disabled={isCurrentMonth}
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color={isCurrentMonth ? colors.textMuted : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceCardCircle} />
          <Text style={styles.balanceLabel}>NET BALANCE</Text>
          <Text style={[
            styles.balanceAmount,
            { color: balance >= 0 ? colors.success : colors.expense }
          ]}>
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
    if (item._type === "section_header") {
      return (
        <View style={[styles.sectionWrapper, index > 0 && { marginTop: 24 }]}>
          <SectionHeader color={item.color} title={item.title} count={item.count} />
        </View>
      );
    }
    if (item._type === "empty") {
      return (
        <View style={styles.listCardSingle}>
          <EmptyState type={item.kind} />
        </View>
      );
    }
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

  // Month navigator
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  monthBadge: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  monthBadgeActive: {
    backgroundColor: "rgba(79,142,247,0.12)",
    borderColor: "rgba(79,142,247,0.3)",
  },
  monthBadgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  monthBadgeTextActive: {
    color: colors.primary,
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
    letterSpacing: -1,
    lineHeight: 46,
    marginBottom: 18,
  },
  balanceCurrency: {
    fontSize: 18,
    fontWeight: "400",
    opacity: 0.5,
    color: colors.textPrimary,
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
    justifyContent: "center",
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

  // Item wrapper
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