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

      console.log("LOGIN RESULT:", JSON.stringify(result, null, 2));

      if (result.success) {
        let token = null;
        let userData = null;

        // Handle different response structures
        if (result.data) {
          token = result.data.token;
          userData = result.data.user;

          // If user object is not present, create from role
          if (!userData && result.data.role) {
            userData = {
              email: email,
              role: result.data.role,
            };
          }
        }

        // Direct response structure
        if (!token && result.token) {
          token = result.token;
          userData = result.user;
        }

        console.log("✅ Extracted token:", token);
        console.log("✅ Extracted user:", userData);
        console.log("✅ User role:", userData?.role);

        if (!token || !userData) {
          console.error("❌ Could not extract user data");
          return {
            success: false,
            error: "Invalid server response",
          };
        }

        // SAVE TOKEN
        await AsyncStorage.setItem("token", token);

        // SAVE USER
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // UPDATE CONTEXT
        setUser({ ...userData });

        return {
          success: true,
          role: userData?.role || "user",
        };
      }

      return {
        success: false,
        error: result.error || "Login failed",
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
      // Prepare payload for backend
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        role: userData.role || "user",
      };

      console.log("📤 SIGNUP PAYLOAD:", payload);

      // STEP 1: REGISTER
      const registerResult = await apiClient.post(
        "/auth/register",
        payload,
        false
      );

      console.log("REGISTER RESULT:", registerResult);

      if (!registerResult.success) {
        return {
          success: false,
          error: registerResult.error || "Registration failed",
        };
      }

      // STEP 2: AUTO LOGIN
      const loginResult = await apiClient.post(
        "/auth/login",
        {
          email: userData.email,
          password: userData.password,
        },
        false
      );

      console.log("AUTO LOGIN RESULT:", JSON.stringify(loginResult, null, 2));

      if (loginResult.success) {
        let token = null;
        let user = null;

        // Extract token and user from response
        if (loginResult.data) {
          token = loginResult.data.token;
          user = loginResult.data.user;

          if (!user && loginResult.data.role) {
            user = {
              email: userData.email,
              name: userData.name,
              role: loginResult.data.role,
            };
          }
        }

        if (!token && loginResult.token) {
          token = loginResult.token;
          user = loginResult.user;
        }

        console.log("✅ User after signup:", user);
        console.log("✅ User role after signup:", user?.role);

        if (!user) {
          return {
            success: false,
            error: "Invalid server response",
          };
        }

        // SAVE TOKEN
        if (token) {
          await AsyncStorage.setItem("token", token);
        }

        // SAVE USER
        await AsyncStorage.setItem("user", JSON.stringify(user));

        // UPDATE CONTEXT
        setUser({ ...user });

        return {
          success: true,
          role: user?.role || "user",
        };
      }

      return {
        success: false,
        error: loginResult.error || "Auto login failed",
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
    try {
      // Clear storage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      // Clear state
      setUser(null);

      console.log("✅ Logged out successfully");
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    }
  };

  // ✅ UPDATE USER (for profile updates)
  const updateUser = async (updatedData) => {
    try {
      const currentUser = user;
      const newUser = { ...currentUser, ...updatedData };

      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);

      console.log("✅ User updated:", newUser);

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.log("UPDATE USER ERROR:", error);
      return {
        success: false,
        error: "Failed to update user",
      };
    }
  };

  // ✅ GET TOKEN
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (error) {
      console.log("GET TOKEN ERROR:", error);
      return null;
    }
  };

  // ✅ IS AUTHENTICATED
  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        getToken,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
