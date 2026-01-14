import { http } from "./http";

export const StepsAPI = {
  list: (workflowId) => http.get(`/api/workflows/${workflowId}/steps`),
  replaceAll: (workflowId, steps) =>
    http.put(`/api/workflows/${workflowId}/steps`, steps),
};