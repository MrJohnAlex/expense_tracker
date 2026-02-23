import { View, Text, StyleSheet, Button } from "react-native";
import { GlobalStyles } from "../../constants/styles";

export default function ErrorOverLay({ message }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>An error occur!</Text>
      <Text style={styles.text}> {message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    color: "white",
    fontSize: 12,
    marginBottom: 20,
  },
});
