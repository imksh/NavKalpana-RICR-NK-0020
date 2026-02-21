import { create } from "zustand";
import api from "../config/api";

export const useStudentStore = create((set, get) => ({
  stats: {},
  loading: false,
  leaderboard: [],
  events: [],
  upcommingEvents: [],
  init: async () => {
    try {
      set({ loading: true });
      await Promise.all([
        get().fetchStats(),
        get().fetchLeaderboard(),
        get().fetchEvents(),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  fetchStats: async () => {
    try {
      const res = await api.get("/student/stats");
      set({
        stats: res.data,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  },
  fetchLeaderboard: async () => {
    try {
      const res = await api.get("/student/leaderboard");
      set({
        leaderboard: res.data,
      });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  },
  fetchEvents: async () => {
    try {
      const res = await api.get("/student/events/upcoming");
      const res2 = await api.get("/student/events");
      set({
        upcommingEvents: res.data,
        events: res2.data,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  },
}));
