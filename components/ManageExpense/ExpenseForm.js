import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import Input from "./Input";
import Button from "../ui/Button";
import { GlobalStyles } from "../../constants/styles";

export default function ExpenseForm({
  submitButtonLabel,
  onCancelHandler,
  onConfirmHandler,
  defaultValues,
}) {
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: defaultValues ? new Date(defaultValues.date) : new Date(),
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true,
    },
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const today = new Date();

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 2);

  function dateChangeHandler() {
    setShowDatePicker(true);
  }
  function onDateChangeHandler(event, selectedDate) {
    setShowDatePicker(false);

    if (event.type === "set" && selectedDate) {
      inputChangeHandler("date", selectedDate);
    }
  }
  function formatDate(date) {
    if (!(date instanceof Date)) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function inputChangeHandler(inputModifier, enteredValue) {
    setInputs((currInput) => {
      return {
        ...currInput,
        [inputModifier]: {
          ...currInput[inputModifier],
          value: enteredValue,
          isValid: true,
        },
      };
    });
  }
  function onSubmitHandler() {
    const expenseDate = {
      amount: +inputs.amount.value,
      description: inputs.description.value,
      date: formatDate(inputs.date.value),
    };

    const amountIsValid = !isNaN(expenseDate.amount) && expenseDate.amount > 0;
    const dateIsValid = expenseDate.date.toString() !== "Invalid Date";
    const descrptionIsValid = expenseDate.description.trim().length > 0;
    if (!amountIsValid || !dateIsValid || !descrptionIsValid) {
      setInputs((currInputs) => {
        return {
          amount: { value: currInputs.amount.value, isValid: amountIsValid },
          date: { value: currInputs.date.value, isValid: dateIsValid },
          description: {
            value: currInputs.description.value,
            isValid: descrptionIsValid,
          },
        };
      });
      return;
    }

    onConfirmHandler(expenseDate);
  }
  const formIsValid =
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid;
  return (
    <View style={styles.form}>
      <Text style={styles.title}> Your Expense</Text>
      <View style={styles.amtDateContainer}>
        <Input
          style={styles.inputsRow}
          label="Amount"
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangeHandler.bind(this, "amount"),
            value: inputs.amount.value,
          }}
          inValid={!inputs.amount.isValid}
        />
        <Pressable onPress={dateChangeHandler}>
          <View pointerEvents="none" style={styles.inputsRow}>
            <Input
              label="Date"
              textInputConfig={{
                placeholder: "YYYY-MM-DD",
                editable: false,
                value: formatDate(inputs.date.value),
              }}
              inValid={!inputs.date.isValid}
            />
          </View>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={inputs.date.value}
            onChange={onDateChangeHandler}
            mode="date"
            minimumDate={threeDaysAgo}
          />
        )}
      </View>
      <Input
        label="Description"
        textInputConfig={{
          multiline: true,
          onChangeText: (text) => inputChangeHandler("description", text),
          value: inputs.description.value,
          valid: inputs.description.isValid,
        }}
        inValid={!inputs.description.isValid}
      />
      {formIsValid && (
        <Text style={styles.errorText}>
          Invalid inputs - please check your input
        </Text>
      )}
      <View style={styles.buttonsContainer}>
        <Button
          mode="flat"
          onPress={onCancelHandler}
          style={styles.buttonStyle}
        >
          Cancel
        </Button>
        <Button onPress={onSubmitHandler} style={styles.buttonStyle}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  amtDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputsRow: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
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
