import { useContext, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ExpenseContext } from "../context/expense-context";
import { UserContext } from "../context/UserContext";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import {
  storeExpense, updateExpense, deleteExpense,
  storeIncome,  updateIncome,  deleteIncome,
} from "../utils/http";

const colors = {
  background: "#0F1628",
  surface:    "#1C2440",
  border:     "#2A3352",
  primary:    "#4F8EF7",
  income:     "#2ECC71",
  incomeBg:   "#1A3D2B",
  expense:    "#E74C3C",
  expenseBg:  "#3D1A1A",
  textPrimary:   "#FFFFFF",
  textSecondary: "#8A94A6",
  textMuted:     "#4A5568",
};

export default function ManageExpense({ route, navigation }) {
  // ── Route params ─────────────────────────────────────────
  // Pass expenseId + type ("income"|"expense") when navigating to edit
  // e.g. navigation.navigate("ManageExpense", { expenseId: id, type: "income" })
  const editExpenseId = route.params?.expenseId;
  const routeType     = route.params?.type ?? "expense"; // default to expense
  const isEditing     = !!editExpenseId;

  const expenseCtx = useContext(ExpenseContext);
  const userCtx    = useContext(UserContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState(null);

  // ── Find the item being edited ───────────────────────────
  const editableItem = isEditing
    ? routeType === "income"
      ? expenseCtx.incomes?.find((i) => i.id === editExpenseId)
      : expenseCtx.expenses?.find((e) => e.id === editExpenseId)
    : undefined;

  const isIncome    = isEditing ? editableItem?.type === "income" : routeType === "income";
  const accentColor = isIncome ? colors.income  : colors.expense;
  const accentBg    = isIncome ? colors.incomeBg : colors.expenseBg;

  // ── Dynamic header title ─────────────────────────────────
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing
        ? `Edit ${isIncome ? "Income" : "Expense"}`
        : `Add ${isIncome ? "Income" : "Expense"}`,
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.textPrimary,
    });
  }, [navigation, isEditing, isIncome]);

  // ── Confirm (add or update) ──────────────────────────────
  async function confirmHandler(expenseObj) {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEditing) {
        // Update
        if (isIncome) {
          await updateIncome(editExpenseId, expenseObj);
          expenseCtx.updateIncome(editExpenseId, expenseObj);
        } else {
          await updateExpense(editExpenseId, expenseObj);
          expenseCtx.updateExpense(editExpenseId, expenseObj);
        }
      } else {
        // Add new
        if (isIncome) {
          const id = await storeIncome(expenseObj);
          expenseCtx.addIncome({ ...expenseObj, id });
        } else {
          const id = await storeExpense(expenseObj);
          expenseCtx.addExpense({ ...expenseObj, id });
        }
      }
      navigation.goBack();
    } catch (err) {
      setError("Could not save. Please try again.");
      setIsSubmitting(false);
    }
  }

  // ── Delete ───────────────────────────────────────────────
  async function deleteHandler() {
    setIsSubmitting(true);
    setError(null);
    try {
      if (isIncome) {
        await deleteIncome(editExpenseId, userCtx.token);
        expenseCtx.removeIncome(editExpenseId);
      } else {
        await deleteExpense(editExpenseId, userCtx.token);
        expenseCtx.removeExpense(editExpenseId);
      }
      navigation.goBack();
    } catch (err) {
      setError("Could not delete. Please try again.");
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  // ── Loading overlay ──────────────────────────────────────
  if (isSubmitting) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={styles.loadingText}>
          {isEditing ? "Saving changes..." : "Adding entry..."}
        </Text>
      </View>
    );
  }

  // ── Error overlay ────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.centered}>
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle" size={40} color={colors.expense} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMsg}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => setError(null)}
            activeOpacity={0.8}
          >
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Main form ────────────────────────────────────────────
  return (
    <View style={styles.container}>

      {/* Form — pass formType to lock the toggle */}
      <ExpenseForm
  submitButtonLabel={isEditing ? "Update" : "Add"}
  onCancelHandler={cancelHandler}
  onConfirmHandler={confirmHandler}
  defaultValues={editableItem}
  formType={isEditing ? editableItem?.type : routeType}  // ✅ use actual item type when editing
/>

      {/* Delete button — only when editing */}
      {isEditing && (
        <View style={styles.deleteContainer}>
          <View style={[styles.deleteDivider, { backgroundColor: accentBg }]} />
          <TouchableOpacity
            style={[styles.deleteBtn, { borderColor: colors.expenseBg, backgroundColor: colors.expenseBg }]}
            onPress={deleteHandler}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={colors.expense} />
            <Text style={styles.deleteBtnText}>
              Delete {isIncome ? "Income" : "Expense"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },

  // Loading / Error
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.expenseBg,
    width: "100%",
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  errorMsg: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  retryBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  // Delete section
  deleteContainer: {
    marginTop: 8,
    alignItems: "center",
    gap: 14,
  },
  deleteDivider: {
    height: 2,
    width: "100%",
    borderRadius: 99,
    opacity: 0.3,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 14,
    borderWidth: 1,
  },
  deleteBtnText: {
    color: colors.expense,
    fontSize: 14,
    fontWeight: "600",
  },
});