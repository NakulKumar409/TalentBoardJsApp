// App.js
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./core/auth/AuthContext";
import AuthNavigator from "./navigation/AuthNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AuthNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
