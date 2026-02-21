import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLock, FiLoader } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../config/api";
import useUiStore from "../../store/useUiStore";
import { useEffect } from "react";
import CloseButton from "../CloseButton";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { setIsModal } = useUiStore();

  useEffect(() => {
    setIsModal(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, []);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = form;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      await api.put("/users/change-password", {
        oldPassword,
        newPassword,
      });

      toast.success("Password updated successfully");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
      );
    } finally {
      setLoading(false);
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
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 flex items-center justify-center px-4 z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-(--card-bg) border border-(--border-color) rounded-3xl p-8 relative shadow-lg"
        >
          {/* Close */}
          <div className="absolute top-4 right-4">
            <CloseButton onClose={onClose} />
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">Change Password</h2>
            <p className="text-sm text-(--text-secondary)">
              Keep your account secure
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
              <div
                key={field}
                className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main)"
              >
                <FiLock className="text-(--text-muted)" />

                <input
                  type="password"
                  name={field}
                  placeholder={
                    field === "oldPassword"
                      ? "Current Password"
                      : field === "newPassword"
                        ? "New Password"
                        : "Confirm New Password"
                  }
                  value={form[field]}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            ))}
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 transition"
          >
            {loading ? (
              <FiLoader className="animate-spin mx-auto" />
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordModal;
