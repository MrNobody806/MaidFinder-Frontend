import axiosInstance from "@/networkServices/api/backendApi";
import { useAuthStore } from "@/store/auth";

const MAX_RETRIES = 2;
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/refresh",
  "/maids/list",
  "/maids/details",
  "/auth/register",
];

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Token parsing error:", error);
    return true;
  }
};

const setupInterceptors = () => {
  // Request Interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      const authStore = useAuthStore();

      if (PUBLIC_ENDPOINTS.some((endpoint) => config.url.includes(endpoint))) {
        return config;
      }

      if (authStore.accessToken && isTokenExpired(authStore.accessToken)) {
        try {
          const response = await axiosInstance.post("/auth/refresh", null, {
            headers: {
              Authorization: `Bearer ${authStore.refreshToken}`,
            },
          });

          authStore.setTokens(
            response.data.accessToken,
            response.data.refreshToken
          );
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        } catch (error) {
          authStore.logout();
          window.location.href = "/login?sessionExpired=true";
          return Promise.reject(error);
        }
      } else if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      if (process.env.NODE_ENV === "development") {
        console.log("API Success:", response.config.url);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const authStore = useAuthStore();

      if (
        PUBLIC_ENDPOINTS.some((endpoint) =>
          originalRequest.url.includes(endpoint)
        )
      ) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = originalRequest._retry || 0;

        if (originalRequest._retry < MAX_RETRIES) {
          originalRequest._retry += 1;

          try {
            const response = await axiosInstance.post("/auth/refresh", null, {
              headers: {
                Authorization: `Bearer ${authStore.refreshToken}`,
              },
            });

            authStore.setTokens(
              response.data.accessToken,
              response.data.refreshToken
            );
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            authStore.logout();
            window.location.href = "/login?sessionExpired=true";
            return Promise.reject(refreshError);
          }
        }
      }

      if (error.response) {
        switch (error.response.status) {
          case 403:
            error.message = "You don't have permission for this action";
            break;
          case 404:
            error.message = "Resource not found";
            break;
          case 500:
            error.message = "Server error occurred";
            break;
          default:
            error.message = error.response.data?.message || "Request failed";
        }
      } else if (error.request) {
        error.message = "No response from server - network error";
      }

      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
