import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiLock, FiHash, FiLoader } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../config/api";
import useUiStore from "../../store/useUiStore";
import { useEffect } from "react";
import CloseButton from "../CloseButton";

const ResetPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
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
    if (!form.email) return toast.error("Email is required");

    try {
      setLoading(true);
      await api.post("/auth/gen-otp", { email: form.email });
      toast.success("OTP sent");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!form.otp) return toast.error("Enter OTP");

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      toast.success("OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!form.newPassword || !form.confirmPassword) {
      return toast.error("All fields required");
    }

    if (form.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      await api.put("/auth/reset-password", form);
      toast.success("Password changed successfully");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password change failed");
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

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold mb-1">Reset Password</h2>
            <p className="text-sm text-(--text-secondary)">
              Secure your account
            </p>
          </div>

          {/* Step 1 - Email */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main)">
                <FiMail className="text-(--text-muted)" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90"
              >
                {loading ? (
                  <FiLoader className="animate-spin mx-auto" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}

          {/* Step 2 - OTP */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main)">
                <FiHash className="text-(--text-muted)" />
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none"
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90"
              >
                {loading ? (
                  <FiLoader className="animate-spin mx-auto" />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}

          {/* Step 3 - New Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main)">
                <FiLock className="text-(--text-muted)" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-3 border border-(--border-color) rounded-xl px-4 py-3 bg-(--bg-main)">
                <FiLock className="text-(--text-muted)" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none"
                />
              </div>

              <button
                onClick={changePassword}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90"
              >
                {loading ? (
                  <FiLoader className="animate-spin mx-auto" />
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResetPasswordModal;
