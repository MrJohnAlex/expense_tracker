import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen        from "./screens/HomeScreen";
import AllIncomesScreen  from "./screens/AllIncomesScreen";
import AllExpensesScreen from "./screens/AllExpensesScreen";
import ManageExpense     from "./screens/ManageExpense";
import UserProfileScreen from "./screens/UserProfileScreen";
import LoginScreen       from "./screens/LoginScreen";
import SignUpScreen      from "./screens/SignUpScreen";

import ExpenseProvider          from "./context/expense-context";
import UserProvider, { UserContext } from "./context/UserContext";

const Stack      = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

const colors = {
  background:    "#0F1628",
  surface:       "#1C2440",
  border:        "#2A3352",
  primary:       "#4F8EF7",
  income:        "#2ECC71",
  expense:       "#E74C3C",
  textPrimary:   "#FFFFFF",
  textSecondary: "#8A94A6",
  textMuted:     "#4A5568",
};

// ── Map tab name → transaction type ─────────────────────────
// Income tab   → open form as "income"
// All others   → open form as "expense"
function getTypeFromRoute(routeName) {
  if (routeName === "Income") return "income";
  return "expense";
}

// ── Bottom tab navigator ─────────────────────────────────────
function ExpensesOverview() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation, route }) => {
        // Derive the type from which tab is currently active
        const transactionType = getTypeFromRoute(route.name);

        return {
          // ── Header ──────────────────────────────────────
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: "700", fontSize: 17 },

          // ── Tab bar ─────────────────────────────────────
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 62,
            paddingBottom: 10,
            paddingTop: 6,
          },
          tabBarActiveTintColor:   colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },

          // ── "+" button — passes type based on current tab ──
          headerRight: () => (
            <Ionicons
              name="add-circle"
              size={28}
              color={colors.primary}
              style={{ marginRight: 16 }}
              onPress={() =>
                navigation.navigate("ManageExpense", {
                  type: transactionType,   // ← "income" or "expense"
                })
              }
            />
          ),
        };
      }}
    >
      {/* Home / Dashboard — "+" opens expense form by default */}
      <BottomTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
          headerRight: null
        }}
      />

      {/* Income — "+" opens income form */}
      <BottomTabs.Screen
        name="Income"
        component={AllIncomesScreen}
        options={{
          title: "Income",
          tabBarLabel: "Income",
          tabBarActiveTintColor: colors.income,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Expenses — "+" opens expense form */}
      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpensesScreen}
        options={{
          title: "Expenses",
          tabBarLabel: "Expenses",
          tabBarActiveTintColor: colors.expense,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-down-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile — no "+" button */}
      <BottomTabs.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: "My Profile",
          tabBarLabel: "Profile",
          headerRight: () => null,        // hide "+" on profile tab
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

// ── Auth stack ───────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{ title: "Create Account" }}
      />
    </Stack.Navigator>
  );
}

// ── Authenticated stack ──────────────────────────────────────
function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowColor: "transparent",
        },
        headerTintColor: colors.textPrimary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="ExpensesOverview"
        component={ExpensesOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageExpense"
        component={ManageExpense}
        options={{
          presentation: "modal",
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          // Title is set dynamically inside ManageExpense via useLayoutEffect
        }}
      />
    </Stack.Navigator>
  );
}

// ── Root navigation ──────────────────────────────────────────
function Navigation() {
  const userCtx = useContext(UserContext);
  return (
    <NavigationContainer>
      {userCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// ── App root ─────────────────────────────────────────────────
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