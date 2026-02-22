import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiLock,
  FiLoader,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import api from "../../config/api";
import useUiStore from "../../store/useUiStore";
import CloseButton from "../CloseButton";
import { useTranslation } from "react-i18next";

const _MotionRef = motion;

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { setIsModal } = useUiStore();
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [touched, setTouched] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsModal(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, [isOpen, setIsModal]);

  const passwordStrength = useMemo(() => {
    const pwd = form.newPassword;
    if (!pwd) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    const labels = ["veryWeak", "weak", "fair", "good", "strong", "veryStrong"];
    const colors = [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#3b82f6",
      "#10b981",
      "#059669",
    ];

    return {
      strength,
      label: t(`changePasswordModal.strength.${labels[strength]}`),
      color: colors[strength],
    };
  }, [form.newPassword, t]);

  const getFieldError = (field) => {
    if (!touched[field]) return null;
    if (!form[field]) return t("changePasswordModal.validation.required");
    if (field === "newPassword" && form[field].length < 6) {
      return t("changePasswordModal.errors.minLength");
    }
    if (field === "confirmPassword" && form[field] !== form.newPassword) {
      return t("changePasswordModal.errors.mismatch");
    }
    return null;
  };

  const isFormValid = () => {
    return (
      form.oldPassword &&
      form.newPassword &&
      form.confirmPassword &&
      form.newPassword.length >= 6 &&
      form.newPassword === form.confirmPassword
    );
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading && isFormValid()) {
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = form;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error(t("changePasswordModal.errors.allRequired"));
    }

    if (newPassword.length < 6) {
      return toast.error(t("changePasswordModal.errors.minLength"));
    }

    if (newPassword !== confirmPassword) {
      return toast.error(t("changePasswordModal.errors.mismatch"));
    }

    try {
      setLoading(true);

      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      toast.success(t("changePasswordModal.success"));

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          t("changePasswordModal.errors.failed"),
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
            <h2 className="text-2xl font-semibold mb-1">
              {t("changePasswordModal.title")}
            </h2>
            <p className="text-sm text-(--text-secondary)">
              {t("changePasswordModal.subtitle")}
            </p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {["oldPassword", "newPassword", "confirmPassword"].map(
              (field, index) => {
                const error = getFieldError(field);
                return (
                  <div key={field}>
                    <div
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-(--bg-main) transition-colors ${
                        error
                          ? "border-red-500"
                          : "border-(--border-color) focus-within:border-(--color-primary)"
                      }`}
                    >
                      <FiLock className="text-(--text-muted)" />
                      <input
                        ref={index === 0 ? firstInputRef : null}
                        type={showPasswords[field] ? "text" : "password"}
                        name={field}
                        placeholder={t(
                          `changePasswordModal.placeholders.${field}`,
                        )}
                        value={form[field]}
                        onChange={handleChange}
                        onBlur={() => handleBlur(field)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        className="flex-1 bg-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field)}
                        className="text-(--text-muted) hover:text-(--text-primary) transition"
                        tabIndex={-1}
                      >
                        {showPasswords[field] ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <FiAlertCircle size={12} />
                        {error}
                      </p>
                    )}
                  </div>
                );
              },
            )}
          </div>

          {/* Password Strength */}
          {form.newPassword && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-(--text-secondary)">
                  {t("changePasswordModal.strength.label")}
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        i < passwordStrength.strength
                          ? passwordStrength.color
                          : "var(--bg-muted)",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Helper Text */}
          <p className="text-xs text-(--text-muted) mt-2">
            {t("changePasswordModal.hint")}
          </p>

          {/* Button */}
          <motion.button
            whileHover={{ scale: loading || !isFormValid() ? 1 : 1.02 }}
            whileTap={{ scale: loading || !isFormValid() ? 1 : 0.95 }}
            onClick={handleSubmit}
            disabled={loading || !isFormValid()}
            className="w-full mt-6 py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-(--color-primary)/20"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" size={18} />
                <span>{t("changePasswordModal.updating")}</span>
              </>
            ) : (
              <>
                <FiCheck size={18} />
                <span>{t("changePasswordModal.button")}</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordModal;
