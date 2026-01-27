import { http } from "./http";

export const EmailsAPI = {
  list: (params = {}) => http.get("/api/emails", { params }),
  get: (id) => http.get(`/api/emails/${id}`),
};
