import { create } from "zustand";
import i18n from "../config/i18n";
import api from "../config/api";
import { toast } from "react-hot-toast";

const useUiStore = create((set, get) => ({
  mobileOpen: false,
  openLang: false,
  openProfile: false,
  loading: false,
  isUploading: false,
  newNotification: false,
  isModal: false,
  showSearch: false,

  lang: localStorage.getItem("lang") || "en",

  closeAll: () => {
    set({
      mobileOpen: false,
      openLang: false,
      openProfile: false,
      showSearch: false,
    });
  },

  setShowSearch: (val) => {
    set({ showSearch: val });
  },

  setIsModal: (val) => {
    set({ isModal: val });
  },

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
