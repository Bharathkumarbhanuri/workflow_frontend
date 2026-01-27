import { http } from "./http";

export const NotificationsAPI = {
  list: (params = {}) => http.get("/api/notifications", { params }),
  markRead: (id) => http.patch(`/api/notifications/${id}/read`),
};
