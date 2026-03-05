import { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "./Input";

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

export default function ExpenseForm({
  submitButtonLabel,
  onCancelHandler,
  onConfirmHandler,
  defaultValues,   // populated when editing
  formType,        // "income" | "expense" — locks the toggle
}) {
  const isEditing = !!defaultValues;

  // ── Type — priority: formType prop > defaultValues.type > "expense" ──
  const resolvedType = formType ?? defaultValues?.type ?? "expense";
  const [type, setType] = useState(resolvedType);

  const isIncome    = type === "income";
  const accentColor = isIncome ? colors.income  : colors.expense;
  const accentBg    = isIncome ? colors.incomeBg : colors.expenseBg;

  // ── Inputs — pre-filled when editing ────────────────────
  const [inputs, setInputs] = useState({
    amount: {
      value:   defaultValues ? String(defaultValues.amount) : "",
      isValid: true,
    },
    date: {
      // defaultValues.date may be a Date object or a string — normalise to Date
      value:   defaultValues
        ? defaultValues.date instanceof Date
          ? defaultValues.date
          : new Date(defaultValues.date)
        : new Date(),
      isValid: true,
    },
    description: {
      value:   defaultValues?.description ?? "",
      isValid: true,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Allow dates up to 30 days in the past
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const year  = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day   = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function inputChangeHandler(field, value) {
    setInputs((cur) => ({
      ...cur,
      [field]: { ...cur[field], value, isValid: true },
    }));
  }

  function onDateChangeHandler(event, selectedDate) {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      inputChangeHandler("date", selectedDate);
    }
  }

  function onSubmitHandler() {
    const data = {
      type,
      amount:      +inputs.amount.value,
      description:  inputs.description.value.trim(),
      date:         formatDate(inputs.date.value),
    };

    const amountIsValid      = !isNaN(data.amount) && data.amount > 0;
    const dateIsValid        = data.date !== "" && data.date !== "Invalid Date";
    const descriptionIsValid = data.description.length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      setInputs((cur) => ({
        amount:      { value: cur.amount.value,      isValid: amountIsValid },
        date:        { value: cur.date.value,         isValid: dateIsValid },
        description: { value: cur.description.value, isValid: descriptionIsValid },
      }));
      return;
    }

    onConfirmHandler(data);
  }

  const formIsInvalid =
    !inputs.amount.isValid ||
    !inputs.date.isValid   ||
    !inputs.description.isValid;

  return (
    <View style={styles.form}>

      {/* ── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={[styles.headerIconBubble, { backgroundColor: accentBg }]}>
          <Text style={[styles.headerIcon, { color: accentColor }]}>
            {isIncome ? "↑" : "↓"}
          </Text>
        </View>
        <View>
          <Text style={styles.headerAction}>
            {isEditing ? "Edit" : "Add"}
          </Text>
          <Text style={styles.title}>
            {isIncome ? "Income" : "Expense"}
          </Text>
        </View>
      </View>

      {/* ── Type toggle — hidden when formType is locked ── */}
      {!formType && (
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              type === "income" && {
                backgroundColor: colors.incomeBg,
                borderColor: colors.income,
              },
            ]}
            onPress={() => setType("income")}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.toggleBtnText,
              type === "income" && { color: colors.income },
            ]}>
              ↑ Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              type === "expense" && {
                backgroundColor: colors.expenseBg,
                borderColor: colors.expense,
              },
            ]}
            onPress={() => setType("expense")}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.toggleBtnText,
              type === "expense" && { color: colors.expense },
            ]}>
              ↓ Expense
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Amount + Date ────────────────────────────────── */}
      <View style={styles.row}>
        <Input
          style={styles.rowInput}
          label="Amount"
          icon="💰"
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: (v) => inputChangeHandler("amount", v),
            value: inputs.amount.value,
            placeholder: "0.00",
          }}
          inValid={!inputs.amount.isValid}
        />

        <Pressable style={styles.rowInput} onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <Input
              label="Date"
              icon="📅"
              textInputConfig={{
                placeholder: "YYYY-MM-DD",
                editable: false,
                value: formatDate(inputs.date.value),
              }}
              inValid={!inputs.date.isValid}
            />
          </View>
        </Pressable>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={inputs.date.value instanceof Date ? inputs.date.value : new Date()}
          onChange={onDateChangeHandler}
          mode="date"
          minimumDate={thirtyDaysAgo}
          maximumDate={new Date()}
        />
      )}

      {/* ── Description ─────────────────────────────────── */}
      <Input
        label="Description"
        icon="📝"
        textInputConfig={{
          multiline: true,
          onChangeText: (v) => inputChangeHandler("description", v),
          value: inputs.description.value,
          placeholder: "What was this for?",
        }}
        inValid={!inputs.description.isValid}
      />

      {/* ── Error banner ─────────────────────────────────── */}
      {formIsInvalid && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            ⚠️  Please fix the highlighted fields
          </Text>
        </View>
      )}

      {/* ── Divider ──────────────────────────────────────── */}
      <View style={[styles.divider, { backgroundColor: accentBg }]} />

      {/* ── Buttons ──────────────────────────────────────── */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onCancelHandler}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: accentColor }]}
          onPress={onSubmitHandler}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>{submitButtonLabel}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 16,
    paddingHorizontal: 4,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  headerIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIcon: {
    fontSize: 24,
    fontWeight: "800",
  },
  headerAction: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },

  // Toggle
  toggle: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMuted,
  },

  // Row
  row: {
    flexDirection: "row",
    gap: 8,
  },
  rowInput: {
    flex: 1,
  },

  // Error
  errorBanner: {
    backgroundColor: "#2A1010",
    borderWidth: 1,
    borderColor: colors.expense,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    alignItems: "center",
  },
  errorBannerText: {
    color: colors.expense,
    fontSize: 13,
    fontWeight: "600",
  },

  // Divider
  divider: {
    height: 2,
    borderRadius: 99,
    marginVertical: 20,
    opacity: 0.4,
  },

  // Buttons
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});