import { useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/ui/IconButton";
import { GlobalStyles } from "../constants/styles";
import { ExpenseContext } from "../context/expense-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../utils/http";
import LoadingOverLay from "../components/ui/LoadingOverLay";
import ErrorOverLay from "../components/ui/ErrorOverLay";
import { UserContext } from "../context/user-context";

export default function ManageExpense({ route, navigation }) {
  const editExpenseId = route.params?.expenseId;
  const isEditing = !!editExpenseId;
  const expenseCtx = useContext(ExpenseContext);
  const [isSubmittinig, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  const editAbleExpense = expenseCtx.expenses?.find(
    (expense) => expense.id === editExpenseId,
  );

  const userCtx = useContext(UserContext);

  async function confirmHandler(expenseObj) {
    try {
      setIsSubmitting(true);
      if (isEditing) {
        await updateExpense(editExpenseId, expenseObj);
        expenseCtx.updateExpense(editExpenseId, expenseObj);
      } else {
        const id = await storeExpense(expenseObj, userCtx.token);
        expenseCtx.addExpense({ ...expenseObj, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError(
        "Sorry! You cann't not perform at this time - Please try again later.",
      );
      isSubmittinig(false);
      console.log(isSubmittinig);
    }
  }
  async function cancelHandler() {
    navigation.goBack();
  }
  async function deleteHandler() {
    try {
      setIsSubmitting(true);
      await deleteExpense(editExpenseId);
      expenseCtx.removeExpense(editExpenseId);
      navigation.goBack();
    } catch (error) {
      setError(
        "Sorry! You cann't delete at this time - Please try again later.",
      );
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmittinig) {
    return <ErrorOverLay message={error} />;
  }

  if (isSubmittinig) {
    return <LoadingOverLay />;
  }

  return (
    <View style={styles.container}>
      <View>
        <ExpenseForm
          submitButtonLabel={isEditing ? "Update" : "Add"}
          onCancelHandler={cancelHandler}
          onConfirmHandler={confirmHandler}
          defaultValues={editAbleExpense}
        />
      </View>
      <View style={styles.deleteContainer}>
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
});
