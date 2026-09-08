import { fetchApi } from "../lib/fetch";

export async function loginApi(email: string) {
  return fetchApi("/auth/login", {
    method: "POST",
    data: { email },
  });
}

export async function signupApi(email: string, firstName: string, lastName: string, country: string) {
  return fetchApi("/auth/signup", {
    method: "POST",
    data: { email, firstName, lastName, country },
  });
}

export async function verifyOtpApi(email: string, code: string) {
  return fetchApi("/auth/verify-otp", {
    method: "POST",
    data: { email, code },
  });
}

export async function getMeApi() {
  return fetchApi("/auth/me", {
    method: "GET",
  });
}

export async function logoutApi() {
  return fetchApi("/auth/logout", {
    method: "POST",
  });
}
