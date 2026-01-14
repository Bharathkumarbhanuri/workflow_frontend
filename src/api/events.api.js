import { http } from "./http";

export const EventsAPI = {
  eventTypes: () => http.get("/api/event-types"),
};
