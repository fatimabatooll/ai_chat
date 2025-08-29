// lib/api.ts
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token =
    Cookies.get("access_token") ||
    (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);

  const tokenType =
    Cookies.get("token_type") ||
    (typeof window !== "undefined" ? localStorage.getItem("token_type") : "Bearer");

  if (token) config.headers.Authorization = `${tokenType || "Bearer"} ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("token_type", { path: "/" });
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
