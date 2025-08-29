// lib/auth.ts
import { api } from "./api";
import Cookies from "js-cookie";

export type RegisterPayload = {
  full_name: string;
  email: string;
  phone_number: string;
  profile_picture?: string;
  date_of_birth?: string;
  country?: string;
  password: string;
};
export async function registerUser(payload: RegisterPayload) {
  const res = await api.post("/api/v1/auth/register", payload);
  return res.data;
}

export type LoginPayload = { email: string; password: string };
export async function loginUser(payload: LoginPayload) {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", payload.email);
  formData.append("password", payload.password);

  const res = await api.post("/api/v1/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data; 
}

export function setAuth(data: { access_token: string; token_type?: string }) {
  const { access_token, token_type = "Bearer" } = data || {};
  if (!access_token) return;
  Cookies.set("access_token", access_token, { path: "/", sameSite: "lax", expires: 7 });
  Cookies.set("token_type", token_type, { path: "/", sameSite: "lax", expires: 7 });
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("token_type", token_type);
}

export async function fetchProfile<T = any>() {
  const res = await api.get("/api/v1/auth/profile", { headers: { Accept: "application/json" } });
  const raw = res.data;
  if (typeof raw === "string") {
    try { return JSON.parse(raw) as T; } catch { return raw as T; }
  }
  return raw as T;
}

export function logout() {
  Cookies.remove("access_token", { path: "/" });
  Cookies.remove("token_type", { path: "/" });
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
  if (typeof window !== "undefined") window.location.href = "/login";
}
