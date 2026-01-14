import { http } from "./http";

export const AuthAPI = {
  register: (email, password) => http.post("/api/auth/register", { email, password }),
  login: (email, password) => http.post("/api/auth/login", { email, password }),
};
