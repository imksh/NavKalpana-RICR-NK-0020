import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMail,
  FiLock,
  FiHash,
  FiLoader,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiRefreshCw,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import api from "../../../config/api";
import useUiStore from "../../store/useUiStore";
import CloseButton from "../CloseButton";
import { useTranslation } from "react-i18next";

const _MotionRef = motion;

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { setIsModal } = useUiStore();
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [resendTimer, setResendTimer] = useState(0);
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsModal(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (step === 1) emailInputRef.current?.focus();
        if (step === 2) otpInputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.body.style.overflow = "auto";
      setIsModal(false);
    };
  }, [isOpen, step, setIsModal]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.email)
      return toast.error(t("resetPasswordModal.errors.emailRequired"));

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return toast.error(t("resetPasswordModal.errors.invalidEmail"));
    }

    try {
      setLoading(true);
      await api.post("/auth/gen-otp", { email: form.email });
      toast.success(t("resetPasswordModal.success.otpSent"));
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          t("resetPasswordModal.errors.otpFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    await sendOtp();
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" && !loading) action();
    if (e.key === "Escape") onClose();
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return t("resetPasswordModal.steps.email");
      case 2:
        return t("resetPasswordModal.steps.verify");
      case 3:
        return t("resetPasswordModal.steps.newPassword");
      default:
        return "";
    }
  };

  const verifyOtp = async () => {
    if (!form.otp)
      return toast.error(t("resetPasswordModal.errors.otpRequired"));

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      toast.success(t("resetPasswordModal.success.otpVerified"));
      setStep(3);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          t("resetPasswordModal.errors.invalidOtp"),
      );
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!form.newPassword || !form.confirmPassword) {
      return toast.error(t("resetPasswordModal.errors.allRequired"));
    }

    if (form.newPassword.length < 6) {
      return toast.error(t("resetPasswordModal.errors.minLength"));
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error(t("resetPasswordModal.errors.mismatch"));
    }

    try {
      setLoading(true);
      await api.put("/auth/reset-password", form);
      toast.success(t("resetPasswordModal.success.passwordChanged"));
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          t("resetPasswordModal.errors.changeFailed"),
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
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

          {/* Header with Back Button */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="p-2 hover:bg-(--bg-muted) rounded-lg transition-colors"
                  disabled={loading}
                >
                  <FiArrowLeft size={20} />
                </button>
              )}
              <div className={step === 1 ? "w-full" : "flex-1"}>
                <h2 className="text-2xl font-semibold text-center">
                  {t("resetPasswordModal.title")}
                </h2>
                <p className="text-sm text-(--text-secondary) text-center mt-1">
                  {getStepTitle()}
                </p>
              </div>
              {step > 1 && <div className="w-10" />}
            </div>

            {/* Step Indicator */}
            <div className="flex gap-2 justify-center">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    s <= step ? "bg-(--color-primary)" : "bg-(--bg-muted)"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1 - Email */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main) focus-within:border-(--color-primary) transition-colors">
                <FiMail className="text-(--text-muted)" />
                <input
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  placeholder={t("resetPasswordModal.placeholders.email")}
                  value={form.email}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, sendOtp)}
                  disabled={loading}
                  className="flex-1 bg-transparent outline-none"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading || !form.email}
                className="w-full py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-(--color-primary)/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" size={18} />
                    {t("resetPasswordModal.buttons.sending")}
                  </span>
                ) : (
                  t("resetPasswordModal.buttons.sendOtp")
                )}
              </button>
            </motion.div>
          )}

          {/* Step 2 - OTP */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main) focus-within:border-(--color-primary) transition-colors">
                <FiHash className="text-(--text-muted)" />
                <input
                  ref={otpInputRef}
                  type="text"
                  name="otp"
                  placeholder={t("resetPasswordModal.placeholders.otp")}
                  value={form.otp}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, verifyOtp)}
                  disabled={loading}
                  maxLength={6}
                  className="flex-1 bg-transparent outline-none tracking-wider text-center text-lg font-mono"
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading || !form.otp}
                className="w-full py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-(--color-primary)/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" size={18} />
                    {t("resetPasswordModal.buttons.verifying")}
                  </span>
                ) : (
                  t("resetPasswordModal.buttons.verifyOtp")
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  onClick={resendOtp}
                  disabled={resendTimer > 0}
                  className="text-sm text-(--color-primary) hover:underline disabled:text-(--text-muted) disabled:no-underline transition-colors"
                >
                  {resendTimer > 0 ? (
                    <span className="flex items-center justify-center gap-1">
                      {t("resetPasswordModal.resendIn")} {resendTimer}s
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <FiRefreshCw size={14} />
                      {t("resetPasswordModal.resendOtp")}
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 - New Password */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main) focus-within:border-(--color-primary) transition-colors">
                <FiLock className="text-(--text-muted)" />
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder={t("resetPasswordModal.placeholders.newPassword")}
                  value={form.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex-1 bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="text-(--text-muted) hover:text-(--text-primary) transition"
                  tabIndex={-1}
                >
                  {showPasswords.newPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main) focus-within:border-(--color-primary) transition-colors">
                <FiLock className="text-(--text-muted)" />
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder={t(
                    "resetPasswordModal.placeholders.confirmPassword",
                  )}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, changePassword)}
                  disabled={loading}
                  className="flex-1 bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="text-(--text-muted) hover:text-(--text-primary) transition"
                  tabIndex={-1}
                >
                  {showPasswords.confirmPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>

              <button
                onClick={changePassword}
                disabled={loading || !form.newPassword || !form.confirmPassword}
                className="w-full py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-(--color-primary)/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" size={18} />
                    {t("resetPasswordModal.buttons.changing")}
                  </span>
                ) : (
                  t("resetPasswordModal.buttons.changePassword")
                )}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResetPasswordModal;
