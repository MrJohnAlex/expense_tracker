import { Text, TextInput, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";

export default function Input({ label, style, textInputConfig, inValid }) {
  let inputStyles = [styles.input];
  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }
  if (inValid) {
    inputStyles.push(styles.invalidInputBg);
  }
  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label, inValid && styles.inValidLabel]}>
        {label}
      </Text>
      <TextInput {...textInputConfig} style={inputStyles} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  label: {
    color: GlobalStyles.colors.primary100,
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: GlobalStyles.colors.primary100,
    color: GlobalStyles.colors.primary700,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inValidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInputBg: {
    backgroundColor: GlobalStyles.colors.error50,
  },
});
