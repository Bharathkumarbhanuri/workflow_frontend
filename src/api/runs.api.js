import { http } from "./http";

export const RunsAPI = {
  list: () => http.get("/api/workflow-runs"),
  get: (id) => http.get(`/api/workflow-runs/${id}`),
  steps: (id) => http.get(`/api/workflow-runs/${id}/steps`),
};
