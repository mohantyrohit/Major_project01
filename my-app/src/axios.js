import axios from "axios";

// Load from .env: Must start with REACT_APP_ for create-react-app to recognize
const baseURL = process.env.REACT_APP_API_URL || "https://major-project01-1ukh.onrender.com/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Send cookies
});

// In-memory access token
let accessToken = null;

// Function to update token after login
export const setAccessToken = (token) => {
  accessToken = token;
};

// Attach access token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh token on 403 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Call refresh-token using same baseURL
        const res = await axiosInstance.post("/auth/refresh-token");
        const newToken = res.data.accessToken;
        setAccessToken(newToken); // Update token in memory
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
