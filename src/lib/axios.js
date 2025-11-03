import axios from "axios";
import { baseURL } from "../constants";
import { Navigate } from "react-router-dom";
import { getUserId } from "../utils";

export const instance = axios.create({
  baseURL: baseURL,
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

export const authInstance = axios.create({
  baseURL: baseURL,
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// Request intercepter. Explain: If token is not exist on browser -> reject request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      const userId = getUserId();
      console.log("userId in axios", userId);
      if (userId) {
        config.headers.userId = userId;
      } else {
        // đã đổi token nên ko lấy đc userId
        Navigate("/login");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response intercepter.
instance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      error.response.status === "401" ||
      error.response.status === 403 ||
      error.response.status === "403"
    ) {
      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Navigate("/login");
    }
    return Promise.reject(error);
  }
);

authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response intercepter.
authInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      error.response.status === "401"
    ) {
      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Navigate("/login");
    }
    return Promise.reject(error);
  }
);
