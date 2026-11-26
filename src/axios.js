import axios from "axios";
import config from "./config";
import { store } from "./ReduxManager/store";
import Swal from "sweetalert2";
import { logoutUser } from "./ReduxManager/action";

const axiosInstance = axios.create({
  baseURL: config.serverUrl,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "ngrok-skip-browser-warning": true,
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().user.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Expiry Handler
axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const errorMsg = error?.message || "An error occurred";
    Swal.fire({
      title: errorMsg,
      icon: "error",
      text: error?.response?.data?.message || "",
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      Swal.fire({
        title: "Session Expired",
        icon: "warning",
        text: "Your session has expired. Please login again",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          store.dispatch(logoutUser());
          window.location.href = "/login";
        }
      });
    }
  },
);

export default axiosInstance;
