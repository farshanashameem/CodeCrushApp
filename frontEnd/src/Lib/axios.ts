import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  ? import.meta.env.VITE_BACKEND_URL
  : "http://localhost:4000/api/v1";

// Extend config
interface CustomAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Logout handler
let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (
  handler: () => void
) => {
  logoutHandler = handler;
};

// Axios instance
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Refresh state
let isRefreshing = false;

let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

// Queue processor
const processQueue = (
  error: unknown
) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    return config;
  },

  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as CustomAxiosRequestConfig;

    if (
      !error.response ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    // Routes that should NEVER trigger refresh
    const excludedRoutes = [
      "/auth/refresh",
      "/auth/parent/login",
      "/auth/parent/register",
      "/admin/login",
      "/auth/parent/verify-otp",
      "/auth/parent/resend-otp",
     "/auth/parent/forgot-password",
     "/auth/admin/login",
    ];

    const shouldSkipRefresh =
      excludedRoutes.some((route) =>
        originalRequest.url?.includes(route)
      );

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      // if already refreshing -> queue requests
      if (isRefreshing) {
        return new Promise(
          (resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
            });
          }
        ).then(() => {
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // backend sets fresh cookies
        await api.post("/auth/refresh");

        processQueue(null);

        // retry original request
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);

        if (logoutHandler) {
          logoutHandler();
        }

        return Promise.reject(
          refreshError
        );

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;