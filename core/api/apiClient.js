// core/api/apiClient.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.31.114:3004/api";

const apiClient = {
  getToken: async () => {
    return await AsyncStorage.getItem("token");
  },

  request: async (method, endpoint, data = null, requiresAuth = true) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = { "Content-Type": "application/json" };

    if (requiresAuth) {
      const token = await apiClient.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const config = { method, headers };
    if (data) config.body = JSON.stringify(data);

    try {
      const response = await fetch(url, config);
      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || "Request failed",
        };
      }

      return { success: true, data: responseData };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  },

  get: (endpoint, requiresAuth = true) =>
    apiClient.request("GET", endpoint, null, requiresAuth),
  post: (endpoint, data, requiresAuth = true) =>
    apiClient.request("POST", endpoint, data, requiresAuth),
  put: (endpoint, data, requiresAuth = true) =>
    apiClient.request("PUT", endpoint, data, requiresAuth),
  delete: (endpoint, requiresAuth = true) =>
    apiClient.request("DELETE", endpoint, null, requiresAuth),
};

export default apiClient;
