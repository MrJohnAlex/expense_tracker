import { Text, TextInput, View, StyleSheet } from "react-native";

const colors = {
  surface: "#1C2440",
  border: "#2A3352",
  primary: "#4F8EF7",
  expense: "#E74C3C",
  expenseBg: "#3D1A1A",
  textPrimary: "#FFFFFF",
  textSecondary: "#8A94A6",
  textMuted: "#4A5568",
};

export default function Input({ label, style, textInputConfig, inValid, icon }) {
  const isMultiline = textInputConfig?.multiline;

  return (
    <View style={[styles.inputContainer, style]}>

      {/* Label row */}
      <View style={styles.labelRow}>
        {icon && <Text style={styles.labelIcon}>{icon}</Text>}
        <Text style={[styles.label, inValid && styles.invalidLabel]}>
          {label}
        </Text>
      </View>

      {/* Input wrapper */}
      <View style={[
        styles.inputWrapper,
        isMultiline && styles.inputWrapperMultiline,
        inValid && styles.inputWrapperInvalid,
      ]}>
        <TextInput
          {...textInputConfig}
          style={[styles.input, isMultiline && styles.inputMultiline]}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* Inline error */}
      {inValid && (
        <Text style={styles.errorMsg}>This field is required</Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },

  // Label
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 7,
  },
  labelIcon: {
    fontSize: 13,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  invalidLabel: {
    color: colors.expense,
  },

  // Input wrapper (acts as styled border box)
  inputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  inputWrapperMultiline: {
    paddingVertical: 10,
    minHeight: 110,
  },
  inputWrapperInvalid: {
    borderColor: colors.expense,
    backgroundColor: "#2A1A1A",
  },

  // TextInput itself
  input: {
    color: colors.textPrimary,
    fontSize: 15,
    paddingVertical: 10,
  },
  inputMultiline: {
    textAlignVertical: "top",
    minHeight: 90,
  },

  // Inline error message
  errorMsg: {
    color: colors.expense,
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
});
