import { StyleSheet, View } from "react-native";
import { GlobalStyles } from "../constants/styles";
import Dashboard from "../components/Home/Dashboard";

export default function HomeScreen() {

  return (
    <View style={styles.container}>
      <Dashboard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.surface,
    paddingBottom: 0,
  },
});
