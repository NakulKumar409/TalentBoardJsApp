import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://talentboard-x-api-with-mongo-db.onrender.com/api";

const apiClient = {
  getToken: async () => {
    return await AsyncStorage.getItem("token");
  },

  request: async (
    method,
    endpoint,
    data = null,
    requiresAuth = true,
    isFormData = false
  ) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (requiresAuth) {
      const token = await apiClient.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    let body = null;
    if (data) {
      if (isFormData) {
        body = data;
      } else {
        body = JSON.stringify(data);
      }
    }

    const config = { method, headers, body };

    try {
      const response = await fetch(url, config);
      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: responseData.message || "Request failed",
          ...responseData,
        };
      }

      return { success: true, data: responseData };
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, error: "Network error" };
    }
  },

  get: (endpoint, requiresAuth = true) =>
    apiClient.request("GET", endpoint, null, requiresAuth, false),

  post: (endpoint, data, requiresAuth = true, isFormData = false) =>
    apiClient.request("POST", endpoint, data, requiresAuth, isFormData),

  put: (endpoint, data, requiresAuth = true, isFormData = false) =>
    apiClient.request("PUT", endpoint, data, requiresAuth, isFormData),

  delete: (endpoint, requiresAuth = true) =>
    apiClient.request("DELETE", endpoint, null, requiresAuth, false),
};

export default apiClient;
