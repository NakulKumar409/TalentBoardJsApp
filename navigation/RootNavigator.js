import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}
