// navigation/AuthNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../app/LoginScreen";
import SignupScreen from "../app/SignupScreen";
import { AuthProvider, useAuth } from "../core/auth/AuthContext";
import EmployerDashboard from "../features/employerJobs/screens/EmployerDashboard";
import UserDashboard from "../features/jobSeeker/screens/UserDashboard";

const Stack = createNativeStackNavigator();

function AppContent() {
  const { user, loading } = useAuth();

  console.log("🔄 AuthNavigator - User:", user);
  console.log("🔄 AuthNavigator - User Role:", user?.role);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0A0A0F",
        }}>
        <ActivityIndicator size="large" color="#00B4D8" />
      </View>
    );
  }

  // ✅ FIX: Check for BOTH "employer" AND "admin"
  const showEmployerDashboard =
    user?.role === "employer" || user?.role === "admin";

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : showEmployerDashboard ? (
        <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} />
      ) : (
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
      )}
    </Stack.Navigator>
  );
}

export default function AuthNavigator() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
