import { create } from "zustand";
import i18n from "../utils/i18n";
import api from "../config/api";
import { toast } from "react-hot-toast";
import { imageConfig } from "../assets/data/imageConfig";

const useUiStore = create((set, get) => ({
  mobileOpen: false,
  openLang: false,
  openProfile: false,
  loading: false,
  isUploading: false,
  newNotification: false,

  lang: localStorage.getItem("lang") || "hi",
  

  setMobileOpen: (val) => {
    set({ mobileOpen: val });
  },

  setNewNotification: (val) => {
    set({ newNotification: val });
  },

  setOpenLang: (val) => {
    set({ openLang: val });
  },

  setOpenProfile: (val) => {
    set({ openProfile: val });
  },

  setLang: (val) => {
    set({ lang: val });
    i18n.changeLanguage(val);
    localStorage.setItem("lang", val);
  },
}));

export default useUiStore;
