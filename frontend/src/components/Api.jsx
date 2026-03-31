import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // the backend server URL
  withCredentials: true, // to send cookies if needed
});

let updateAccessTokenCallback = null; // will be set by AuthContext

// this function to set the access token in the default headers for all requests can be used if you didnt manually set header in each
// export const setAccessToken = (token) => {
//   api.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
// };

export const setUpdateAccessTokenCallback = (cb) => {
  updateAccessTokenCallback = cb;
};

// Response interceptor to handle 401 errors and attempt token refresh incase access token has expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop by checking if the request is already a token refresh attempt
    if (originalRequest.url.includes("/api/users/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Interceptor caught 401, attempting token refresh...");
        const res = await api.post("/api/users/refresh");

        const newAccessTokenWithUser = res.data;

        localStorage.setItem("user", JSON.stringify(newAccessTokenWithUser));

        // Update AuthContext state via callback
        if (updateAccessTokenCallback)
          updateAccessTokenCallback(newAccessTokenWithUser.accessToken);

        // update axios default header
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessTokenWithUser.accessToken}`;

        // update original request header
        originalRequest.headers["Authorization"] =
          `Bearer ${newAccessTokenWithUser.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Clear invalid tokens
        localStorage.removeItem("user");
        console.log("Refresh token expired");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
