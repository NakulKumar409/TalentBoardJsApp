import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth, AuthProvider } from "../core/auth/AuthContext";
import { View, ActivityIndicator, Text } from "react-native";
import LoginScreen from "../app/LoginScreen";
import SignupScreen from "../app/SignupScreen";
import EmployerDashboard from "../app/EmployerDashboard";
import UserDashboard from "../app/UserDashboard";

const Stack = createNativeStackNavigator();

function AppContent() {
  const { user, loading } = useAuth();

  console.log("🔄 AuthNavigator - User:", user);
  console.log("🔄 AuthNavigator - User Role:", user?.role);
  console.log("🔄 AuthNavigator - Loading:", loading);

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

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : user.role === "employer" ? (
        <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} />
      ) : (
        <Stack.Screen name="UserDashboard" component={UserDashboard} />
      )}
    </Stack.Navigator>
  );
}

export default function AuthNavigator() {
  console.log("📱 AuthNavigator - Rendering");
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
