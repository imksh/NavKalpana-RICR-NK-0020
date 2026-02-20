import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <div className="min-h-[90dvh] flex items-center justify-center bg-[var(--bg-main)] px-3 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[var(--card-bg)] shadow-lg rounded-3xl p-10 border border-[var(--border-color)]"
      >
        <h2 className="text-3xl font-semibold text-center mb-6">
          {t("login.title")}
        </h2>

        <p className="text-center text-(--text-secondary) mb-8">
          {t("login.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-(--text-secondary)">
              {t("login.email")}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2 text-(--text-secondary)">
              {t("login.password")}
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="text-right text-sm mt-1">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-(--color-primary) cursor-pointer hover:underline"
              >
                {t("login.forgotPassword")}
              </span>
            </div>
          </div>

          {/* Forgot Password */}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-60"
          >
            {isLoading ? t("login.loading") : t("login.button")}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          {t("login.noAccount")}
          <span
            onClick={() => navigate("/register")}
            className="text-[var(--color-primary)] cursor-pointer hover:underline"
          >
            {t("login.register")}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
