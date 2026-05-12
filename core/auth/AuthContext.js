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

const generateObjectId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const machineId = Math.floor(Math.random() * 16777216).toString(16);
  const processId = Math.floor(Math.random() * 65536).toString(16);
  const counter = Math.floor(Math.random() * 16777216).toString(16);

  const paddedTimestamp = timestamp.padStart(8, "0");
  const paddedMachineId = machineId.padStart(6, "0");
  const paddedProcessId = processId.padStart(4, "0");
  const paddedCounter = counter.padStart(6, "0");

  return (
    paddedTimestamp +
    paddedMachineId +
    paddedProcessId +
    paddedCounter
  ).slice(0, 24);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (userData && userData !== "undefined" && token) {
        const parsedUser = JSON.parse(userData);
        console.log("✅ Session - Role:", parsedUser?.role);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await apiClient.post(
        "/auth/login",
        { email, password },
        false
      );

      console.log("📦 Login Response:", JSON.stringify(result, null, 2));

      let token = result?.token || result?.data?.token;
      let userData = result?.user || result?.data?.user;

      if (!token || !userData) {
        return { success: false, error: "Invalid response from server" };
      }

      // ✅ Get role from backend
      const role = userData.role || "user";
      const userId = userData._id || userData.id || generateObjectId();

      const userWithId = {
        _id: userId,
        id: userId,
        name: userData.name,
        email: userData.email,
        role: role,
      };

      console.log("✅ Storing user with role:", role);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(userWithId));
      setUser(userWithId);

      return {
        success: true,
        role: role,
        user: userWithId,
      };
    } catch (error) {
      console.log("Login Error:", error);
      return { success: false, error: "Login failed" };
    }
  };

  const signup = async (userData) => {
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        role: userData.role || "user",
      };

      const registerResult = await apiClient.post(
        "/auth/register",
        payload,
        false
      );

      if (!registerResult.success) {
        return {
          success: false,
          error: registerResult.error || "Registration failed",
        };
      }

      const loginResult = await apiClient.post(
        "/auth/login",
        {
          email: userData.email,
          password: userData.password,
        },
        false
      );

      if (loginResult.success) {
        let token = loginResult?.token || loginResult?.data?.token;
        let user = loginResult?.user || loginResult?.data?.user;

        if (!token) {
          return { success: false, error: "Failed to get token" };
        }

        let userId = user?._id || user?.id || generateObjectId();
        let role = userData.role || user?.role || "user";

        const userWithId = {
          _id: userId,
          id: userId,
          name: user?.name || userData.name,
          email: user?.email || userData.email,
          role: role,
        };

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(userWithId));
        setUser(userWithId);

        return { success: true, role: role, user: userWithId };
      }

      return {
        success: false,
        error: loginResult.error || "Auto login failed",
      };
    } catch (error) {
      return { success: false, error: "Something went wrong" };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      setUser(null);
      return true;
    } catch (error) {
      setUser(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      return false;
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const currentUser = user;
      const newUser = { ...currentUser, ...updatedData };
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: "Failed to update user" };
    }
  };

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch (error) {
      return null;
    }
  };

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
