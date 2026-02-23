import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import IncomeScreen from "./screens/IncomeScreen";
import ManageExpense from "./screens/ManageExpense";
import AllExpensesScreen from "./screens/AllExpensesScreen";
import { GlobalStyles } from "./constants/styles";
import IconButton from "./components/ui/IconButton";
import UserProfileScreen from "./screens/UserProfileScreen";
import ExpenseProvider from "./context/expense-context";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import UserProvider, { UserContext } from "./context/user-context";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function ExpensesOverview() {
  const userCtx = useContext(UserContext);
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation, route }) => {
        return {
          headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          headerTintColor: "white",
          tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
          tabBarActiveTintColor: GlobalStyles.colors.accent500,
          headerRight: ({ tintColor }) => {
            if (route.name === "UserProfile") {
              return (
                <IconButton
                  icon="exit"
                  size={28}
                  color={tintColor}
                  onPress={() => {
                    Alert.alert(
                      "Accout Logout",
                      "Are you sure want to logout?",
                      [
                        {
                          text: "Cancel",
                          onPress: () => {},
                        },
                        {
                          text: "Ok",
                          onPress: () => userCtx.logout(),
                        },
                      ],
                    );
                  }}
                />
              );
            }

            return (
              <IconButton
                icon="add"
                size={28}
                color={tintColor}
                onPress={() => navigation.navigate("ManageExpense")}
              />
            );
          },
        };
      }}
    >
      <BottomTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <BottomTabs.Screen
        name="Income"
        component={IncomeScreen}
        options={{
          title: "Income",
          tabBarLabel: "Income",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-sport-sharp" size={size} color={color} />
          ),
        }}
      />

      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpensesScreen}
        options={{
          title: "Expenses",
          tabBarLabel: "Expenses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: "Profile",
          tabBarLabel: "User Profile",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="person" size={size} color={color} />;
          },
        }}
      />
    </BottomTabs.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: GlobalStyles.colors.primary500 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="ExpensesOverview"
        component={ExpensesOverview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ManageExpense"
        component={ManageExpense}
        options={{
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const userCtx = useContext(UserContext);
  return (
    <NavigationContainer>
      {!userCtx.isAuthenticated && <AuthStack />}
      {userCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <UserProvider>
        <ExpenseProvider>
          <Navigation />
        </ExpenseProvider>
      </UserProvider>
    </>
  );
}
