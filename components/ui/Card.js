import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

export default function Card({ type, amount }) {
  return (
    <View style={styles.card}>
      <Text style={styles.item}>
        {type === "income" ? "+" : "-"}
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: GlobalStyles.colors.primary800,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: GlobalStyles.colors.accent500,
    elevation: 4,
    marginVertical: 8,
    minHeight: 50,
    maxWidth: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    fontSize: 18,
    color: "white",
  },
});
