import { create } from "zustand";
import api from "../config/api";

export const useStudentStore = create((set, get) => ({
  stats: {},
  loading: false,
  fetchStats: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/student/stats");
      set({
        stats: res.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      set({ loading: false });
    }
  },
}));
