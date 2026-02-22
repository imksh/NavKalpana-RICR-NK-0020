import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../../config/api";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../../store/useAuthStore";
import CloseButton from "../../CloseButton";
import { FiCamera } from "react-icons/fi";
import useUiStore from "../../../store/useUiStore";

const _MotionRef = motion;

const StudentEditProfileModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const { setIsModal } = useUiStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
  });

  const [preview, setPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  /* ===== Handle body lock properly ===== */
  useEffect(() => {
    if (isOpen) {
      setIsModal(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setIsModal(false);
    }

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, [isOpen]);

  /* ===== Prefill ===== */
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        phone: user.phone || "",
      });

      setPreview(user?.photo?.url || null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);

      const res = await api.patch("/auth/update-profile", {
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone,
      });

      setUser(res.data);
      toast.success(t("studentModals.editProfile.profileUpdated"));
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t("studentModals.editProfile.updateFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    try {
      setPhotoLoading(true);

      const data = new FormData();
      data.append("image", photoFile);

      const res = await api.put("/auth/change-photo", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      toast.success(t("studentModals.editProfile.photoUpdated"));
      setPhotoFile(null);
    } catch {
      toast.error(t("studentModals.editProfile.photoFailed"));
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 flex items-center justify-center px-4 z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-(--card-bg) w-full max-w-lg rounded-3xl relative border border-(--border-color) flex flex-col max-h-[90vh]"
        >
          {/* ===== HEADER + CLOSE ===== */}
          <div className="p-6 border-b border-(--border-color) relative">
            <h2 className="text-2xl font-semibold">
              {t("studentModals.editProfile.title")}
            </h2>

            <div className="absolute top-4 right-4">
              <CloseButton onClose={onClose} />
            </div>
          </div>

          {/* ===== SCROLLABLE FORM AREA ===== */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 hide-scrollbar">
            <div className="flex flex-col items-center ">
              <div className="relative w-28 h-28">
                <img
                  src={
                    preview || "https://ui-avatars.com/api/?name=" + user?.name
                  }
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-(--border-color)"
                />

                <label className="absolute bottom-0 right-0 bg-(--color-primary) p-2 rounded-full cursor-pointer shadow-md">
                  <FiCamera className="text-white" size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>

              {photoFile && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handlePhotoUpload}
                  disabled={photoLoading}
                  className="mt-4 px-4 py-2 text-sm rounded-xl bg-(--color-primary) text-white hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {photoLoading
                    ? t("studentModals.editProfile.uploading")
                    : t("studentModals.editProfile.updatePhoto")}
                </motion.button>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm mb-1">
                {t("studentModals.editProfile.nameLabel")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-(--border-color) bg-(--bg-main)"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1">
                {t("studentModals.editProfile.emailLabel")}
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full p-3 rounded-xl border border-(--border-color) bg-(--bg-muted)"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-1">
                {t("studentModals.editProfile.phoneLabel")}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-(--border-color) bg-(--bg-main)"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm mb-1">
                {t("studentModals.editProfile.bioLabel")}
              </label>
              <textarea
                rows="4"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-(--border-color) bg-(--bg-main)"
              />
            </div>
          </div>

          {/* ===== FIXED FOOTER ===== */}
          <div className="p-6 border-t border-(--border-color) flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-(--bg-muted)"
            >
              {t("studentModals.editProfile.cancelButton")}
            </button>

            <button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-(--color-primary) text-white hover:opacity-90"
            >
              {loading
                ? t("studentModals.editProfile.saving")
                : t("studentModals.editProfile.saveButton")}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentEditProfileModal;
