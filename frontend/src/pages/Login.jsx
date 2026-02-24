import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiShield,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import ResetPasswordModal from "../components/modals/ResetPasswordModal";

const _MotionRef = motion;

const Login = () => {
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  // Demo stats for visual appeal
  const stats = [
    {
      icon: FiUsers,
      label: "10,000+",
      sublabel: t("login.stats.activeStudents"),
    },
    {
      icon: FiCheckCircle,
      label: "95%",
      sublabel: t("login.stats.successRate"),
    },
    {
      icon: FiShield,
      label: t("login.stats.secure"),
      sublabel: t("login.stats.dataProtection"),
    },
  ];

  return (
    <>
      <div className="min-h-[90dvh] bg-(--bg-main) relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-(--color-primary)/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-(--color-secondary)/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative flex items-center justify-center min-h-[90dvh] px-3 md:px-6 py-12">
          <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Branding & Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden md:block"
            >
              <div className="space-y-6">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-2 bg-(--card-bg) border border-(--border-color) rounded-full mb-6"
                  >
                    <span className="text-sm text-(--color-primary) font-medium">
                      {t("login.hero.badge")}
                    </span>
                  </motion.div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {t("login.hero.title1")}{" "}
                    <span className="text-(--color-primary)">
                      {t("login.hero.title2")}
                    </span>
                  </h1>
                  <p className="text-lg text-(--text-secondary) mb-8">
                    {t("login.hero.description")}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 text-center"
                    >
                      <div className="w-10 h-10 bg-(--color-primary)/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <stat.icon
                          className="text-(--color-primary)"
                          size={20}
                        />
                      </div>
                      <p className="font-bold text-lg">{stat.label}</p>
                      <p className="text-xs text-(--text-secondary)">
                        {stat.sublabel}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4 pt-6"
                >
                  <div className="flex items-center gap-2">
                    <FiShield className="text-(--color-success)" size={20} />
                    <span className="text-sm text-(--text-secondary)">
                      {t("login.trust.sslSecured")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle
                      className="text-(--color-success)"
                      size={20}
                    />
                    <span className="text-sm text-(--text-secondary)">
                      {t("login.trust.verifiedPlatform")}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="bg-(--card-bg) shadow-2xl rounded-3xl p-8 md:p-10 border border-(--border-color)">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">
                    {t("login.title")}
                  </h2>
                  <p className="text-(--text-secondary)">
                    {t("login.subtitle")}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                      {t("login.email")}
                    </label>
                    <div className="relative">
                      <FiMail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                        size={18}
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t("login.emailPlaceholder")}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                      {t("login.password")}
                    </label>
                    <div className="relative">
                      <FiLock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                        size={18}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder={t("login.passwordPlaceholder")}
                        required
                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) transition"
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
                      />
                      <span className="text-sm text-(--text-secondary)">
                        {t("login.rememberMe")}
                      </span>
                    </label>
                    <span
                      onClick={() => setIsResetPasswordModalOpen(true)}
                      className="text-sm text-(--color-primary) cursor-pointer hover:underline font-medium"
                    >
                      {t("login.forgotPassword")}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-xl bg-(--color-primary) text-white font-semibold hover:bg-(--color-primary-hover) transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-(--color-primary)/20"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t("login.loading")}
                      </span>
                    ) : (
                      t("login.button")
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-(--border-color)"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-(--card-bg) text-(--text-muted)">
                      {t("login.orContinueWith")}
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                {/* <div className="grid grid-cols-3 gap-3 mb-6">
                  <button
                    type="button"
                    className="py-2.5 px-4 border border-(--border-color) rounded-lg hover:bg-(--bg-muted) transition flex items-center justify-center"
                    title="Login with Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="py-2.5 px-4 border border-(--border-color) rounded-lg hover:bg-(--bg-muted) transition flex items-center justify-center"
                    title="Login with GitHub"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="py-2.5 px-4 border border-(--border-color) rounded-lg hover:bg-(--bg-muted) transition flex items-center justify-center"
                    title="Login with Microsoft"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#f25022" d="M1 1h10v10H1z" />
                      <path fill="#00a4ef" d="M13 1h10v10H13z" />
                      <path fill="#7fba00" d="M1 13h10v10H1z" />
                      <path fill="#ffb900" d="M13 13h10v10H13z" />
                    </svg>
                  </button>
                </div> */}

                {/* Register Link */}
                <p className="text-center text-sm text-(--text-muted)">
                  {t("login.noAccount")}{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className="text-(--color-primary) cursor-pointer hover:underline font-medium"
                  >
                    {t("login.register")}
                  </span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          onClose={() => setIsResetPasswordModalOpen(false)}
          isOpen={isResetPasswordModalOpen}
        />
      )}
    </>
  );
};

export default Login;
