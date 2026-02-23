import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../constants/styles";
import Card from "../components/ui/Card";

export default function HomeScreen() {
  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Monthly Incomes & Expenses -{" "}
        <Text style={styles.month}>{currentMonth}</Text>
      </Text>
      <View style={styles.innerContainer}>
        <View>
          <Text style={styles.subTitle}>Income Total</Text>
          <Card type="income" amount={5000} />
        </View>
        <View>
          <Text style={styles.subTitle}>Expense Total</Text>
          <Card type="expense" amount={100} />
        </View>
      </View>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary500,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
  },
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  title: {
    fontSize: 18,
    color: "white",
  },
  subTitle: {
    fontSize: 14,
    color: "white",
  },
  month: {
    color: GlobalStyles.colors.accent500,
  },
});
