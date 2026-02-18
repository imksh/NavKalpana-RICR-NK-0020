import { motion, AnimatePresence } from "motion/react";
import { FiX, FiMail, FiLock, FiHash } from "react-icons/fi";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../config/api";

const ResetPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-80 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3 }}
        className="fixed z-90 inset-0 flex items-center justify-center px-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>

          {/* HEADER */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <p className="text-sm text-gray-500">
              Secure your admin account
            </p>
          </div>

          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border rounded-xl p-3">
                <FiMail className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="grow outline-none"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-(--primary) text-white"
              >
                {loading ? (
                  <FiLoader className="animate-spin mx-auto" />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border rounded-xl p-3">
                <FiHash className="text-gray-400" />
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className="grow outline-none"
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-(--primary) text-white"
              >
                {loading ? (
                  <FiLoader className="animate-spin mx-auto" />
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>
          )}

          {/* STEP 3: PASSWORDS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border rounded-xl p-3">
                <FiLock className="text-gray-400" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="grow outline-none"
                />
              </div>

              <div className="flex items-center gap-3 border rounded-xl p-3">
                <FiLock className="text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="grow outline-none"
                />
              </div>

              <button
                onClick={changePassword}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-(--primary) text-white cursor-pointer"
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