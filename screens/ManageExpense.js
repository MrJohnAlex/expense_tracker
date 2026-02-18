import { useContext, useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/ui/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/ui/Button";
import { ExpenseContext } from "../context/expense-context";

export default function ManageExpense({ route, navigation }) {
  const editExpenseId = route.params?.expenseId;
  const isEditing = !!editExpenseId;
  const expenseCtx = useContext(ExpenseContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  function confirmHandler() {
    if (isEditing) {
      expenseCtx.updateExpense(editExpenseId, {
        description: "Test updated",
        amount: 500,
        date: new Date("2026-02-18"),
      });
    } else {
      expenseCtx.addExpense({
        description: "Test",
        amount: 100,
        date: new Date("2025-02-15"),
      });
    }
    navigation.goBack();
  }
  function cancelHandler() {
    navigation.goBack();
  }
  function deleteHandler() {
    expenseCtx.removeExpense(editExpenseId);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.deleteContainer}>
        <View style={styles.buttonsContainer}>
          <Button
            mode="flat"
            onPress={cancelHandler}
            style={styles.buttonStyle}
          >
            Cancel
          </Button>
          <Button onPress={confirmHandler} style={styles.buttonStyle}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </View>
        {isEditing && (
          <IconButton
            icon="trash"
            size={36}
            color={GlobalStyles.colors.error500}
            onPress={deleteHandler}
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyle: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
