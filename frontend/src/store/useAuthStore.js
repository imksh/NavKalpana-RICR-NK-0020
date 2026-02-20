import { create } from "zustand";
import api from "../config/api";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  user: null,
  isRegistering: false,
  isLogging: false,
  isCheckingAuth: false,

  setUser: (val) => {
    set({ user: val });
  },
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await api.get("/auth/check");
      console.log(res.data);
      
      set({ user: res.data });
    } catch (error) {
      set({ user: null });
      console.log("error in checkAuth :", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isRegistering: true });
    try {
      const res = await api.post("/auth/register", data);
      set({ user: res.data.data });
      toast.success("Account created successfully");
    } catch (error) {
      console.log("error in Register :", error);
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      set({ isRegistering: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");

      set({
        user: null,
        isLogging: false,
        isRegistering: false,
        isCheckingAuth: false,
      });

      toast.success("Logged out successfully");
      window.location.replace("/login");
    } catch (error) {
      console.log("error in logout :", error);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  },

  login: async (data) => {
    set({ isLogging: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ user: res.data.data });
      toast.success("Logged in successfully");
      return res.data.data;
    } catch (error) {
      console.log("error in login :", error);
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      set({ isLogging: false });
    }
  },
}));
