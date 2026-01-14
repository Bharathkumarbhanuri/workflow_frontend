import { http } from "./http";

export const WorkflowsAPI = {
  list: () => http.get("/api/workflows"),
  get: (id) => http.get(`/api/workflows/${id}`),
  create: (data) => http.post("/api/workflows", data),
  update: (id, data) => http.put(`/api/workflows/${id}`, data),
  setActive: (id, active) =>
    http.patch(`/api/workflows/${id}/active?active=${active}`),
};
