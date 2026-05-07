import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  // ✅ CHECK SAVED SESSION
  const checkSession = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      console.log("🔍 CheckSession - UserData:", userData);
      console.log("🔍 CheckSession - Token:", token);

      if (userData && userData !== "undefined" && token) {
        const parsedUser = JSON.parse(userData);
        console.log("✅ Session found - User:", parsedUser);
        setUser(parsedUser);
      } else {
        console.log("❌ No session found");
      }
    } catch (error) {
      console.log("SESSION ERROR:", error);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      const result = await apiClient.post(
        "/auth/login",
        { email, password },
        false
      );

      console.log("LOGIN RESULT:", result);

      if (result.success) {
        const { token, user } = result.data;

        console.log("✅ Saving user:", user);
        console.log("✅ Saving token:", token);

        // ✅ SAVE TOKEN
        await AsyncStorage.setItem("token", token);

        // ✅ SAVE USER
        await AsyncStorage.setItem("user", JSON.stringify(user));

        // ✅ UPDATE CONTEXT - Force state update
        setUser({ ...user }); // Create new object to force re-render

        return {
          success: true,
          role: user?.role || "user",
        };
      }

      return {
        success: false,
        error: result.error,
      };
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      return {
        success: false,
        error: "Something went wrong",
      };
    }
  };

  // ✅ SIGNUP
  const signup = async (userData) => {
    try {
      // STEP 1 REGISTER
      const registerResult = await apiClient.post(
        "/auth/register",
        userData,
        false
      );

      console.log("REGISTER RESULT:", registerResult);

      if (!registerResult.success) {
        return {
          success: false,
          error: registerResult.error,
        };
      }

      // STEP 2 AUTO LOGIN
      const loginResult = await apiClient.post(
        "/auth/login",
        {
          email: userData.email,
          password: userData.password,
        },
        false
      );

      console.log("AUTO LOGIN RESULT:", loginResult);

      if (loginResult.success) {
        const { token, user } = loginResult.data;

        console.log("✅ Saving user after signup:", user);
        console.log("✅ Saving token after signup:", token);

        // SAVE TOKEN
        await AsyncStorage.setItem("token", token);

        // SAVE USER
        await AsyncStorage.setItem("user", JSON.stringify(user));

        // UPDATE CONTEXT - Force state update
        setUser({ ...user }); // Create new object to force re-render

        return {
          success: true,
          role: user?.role || "user",
        };
      }

      return {
        success: false,
        error: loginResult.error,
      };
    } catch (error) {
      console.log("SIGNUP ERROR:", error);

      return {
        success: false,
        error: "Something went wrong",
      };
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
