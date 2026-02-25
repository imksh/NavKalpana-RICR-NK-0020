import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import SEO from "../components/SEO";

const _MotionRef = motion;

const Register = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
  });

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    const password = form.password;
    if (!password) return { strength: 0, label: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const labels = [
      t("register.passwordStrength.veryWeak"),
      t("register.passwordStrength.weak"),
      t("register.passwordStrength.fair"),
      t("register.passwordStrength.good"),
      t("register.passwordStrength.strong"),
      t("register.passwordStrength.veryStrong"),
    ];
    return { strength, label: labels[strength] || "" };
  }, [form.password, t]);

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 1) return "bg-(--color-danger)";
    if (strength <= 2) return "bg-(--color-warning)";
    if (strength <= 3) return "bg-(--color-primary)";
    return "bg-(--color-success)";
  };

  // Demo stats for visual appeal
  const stats = [
    {
      icon: FiUsers,
      label: "10,000+",
      sublabel: t("register.stats.studentsEnrolled"),
    },
    {
      icon: FiAward,
      label: "500+",
      sublabel: t("register.stats.expertInstructors"),
    },
    {
      icon: FiCheckCircle,
      label: "95%",
      sublabel: t("register.stats.successRate"),
    },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(form);
  };

  return (
    <div className="min-h-[90dvh] bg-(--bg-main) relative overflow-hidden">
      <SEO
        title="Register | Create Your Gradify Account"
        description="Create your Gradify account and start learning with structured courses, quizzes, assignments, and personalized AI guidance."
        keywords="Gradify signup, create student account, online learning registration, LMS registration"
        canonical="https://gradify.in/register"
      />
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
                    {t("register.hero.badge")}
                  </span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {t("register.hero.title1")}{" "}
                  <span className="text-(--color-primary)">
                    {t("register.hero.title2")}
                  </span>{" "}
                  {t("register.hero.title3")}
                </h1>
                <p className="text-lg text-(--text-secondary) mb-8">
                  {t("register.hero.description")}
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
                      <stat.icon className="text-(--color-primary)" size={20} />
                    </div>
                    <p className="font-bold text-lg">{stat.label}</p>
                    <p className="text-xs text-(--text-secondary)">
                      {stat.sublabel}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3 pt-6"
              >
                {[
                  t("register.features.courses"),
                  t("register.features.experts"),
                  t("register.features.certified"),
                  t("register.features.lifetime"),
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-(--color-success)/10 rounded-full flex items-center justify-center shrink-0">
                      <FiCheckCircle
                        className="text-(--color-success)"
                        size={14}
                      />
                    </div>
                    <span className="text-(--text-secondary)">{feature}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Registration Form */}
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
                  {t("register.title")}
                </h2>
                <p className="text-(--text-secondary)">
                  {t("register.subtitle")}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                    {t("register.fullName")}
                  </label>
                  <div className="relative">
                    <FiUser
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t("register.namePlaceholder")}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                    {t("register.email")}
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
                      placeholder={t("register.emailPlaceholder")}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                    {t("register.phone")}
                  </label>
                  <div className="relative">
                    <FiPhone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t("register.phonePlaceholder")}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                    {t("register.password")}
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
                      placeholder={t("register.passwordPlaceholder")}
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

                  {/* Password Strength Indicator */}
                  {form.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[...Array(5)].map((_, index) => (
                          <div
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              index < passwordStrength.strength
                                ? getPasswordStrengthColor(
                                    passwordStrength.strength,
                                  )
                                : "bg-(--bg-muted)"
                            }`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs text-(--text-secondary)">
                        {t("register.passwordStrength.label")}{" "}
                        <span className="font-medium">
                          {passwordStrength.label}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Role Select */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                    {t("register.roleLabel")}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "student" })}
                      className={`py-3 px-4 rounded-xl border-2 transition-all ${
                        form.role === "student"
                          ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                          : "border-(--border-color) hover:border-(--color-primary)/50"
                      }`}
                    >
                      <FiUsers className="mx-auto mb-1" size={20} />
                      <span className="text-sm font-medium">
                        {t("register.student")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, role: "instructor" })}
                      className={`py-3 px-4 rounded-xl border-2 transition-all ${
                        form.role === "instructor"
                          ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                          : "border-(--border-color) hover:border-(--color-primary)/50"
                      }`}
                    >
                      <FiAward className="mx-auto mb-1" size={20} />
                      <span className="text-sm font-medium">
                        {t("register.instructor")}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 rounded border-gray-300 text-(--color-primary) focus:ring-(--color-primary)"
                      required
                    />
                    <span className="text-sm text-(--text-secondary)">
                      {t("register.terms.text")}{" "}
                      <span className="text-(--color-primary) hover:underline cursor-pointer">
                        {t("register.terms.service")}
                      </span>{" "}
                      {t("register.terms.and")}{" "}
                      <span className="text-(--color-primary) hover:underline cursor-pointer">
                        {t("register.terms.privacy")}
                      </span>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !agreeToTerms}
                  className="w-full py-3.5 rounded-xl bg-(--color-primary) text-white font-semibold hover:bg-(--color-primary-hover) transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-(--color-primary)/20"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t("register.loading")}
                    </span>
                  ) : (
                    t("register.button")
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
                    {t("register.orSignUpWith")}
                  </span>
                </div>
              </div>

              {/* Social Signup Buttons */}
              {/* <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  className="py-2.5 px-4 border border-(--border-color) rounded-lg hover:bg-(--bg-muted) transition flex items-center justify-center"
                  title="Sign up with Google"
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
                  title="Sign up with GitHub"
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
                  title="Sign up with Microsoft"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#f25022" d="M1 1h10v10H1z" />
                    <path fill="#00a4ef" d="M13 1h10v10H13z" />
                    <path fill="#7fba00" d="M1 13h10v10H1z" />
                    <path fill="#ffb900" d="M13 13h10v10H13z" />
                  </svg>
                </button>
              </div> */}

              {/* Login Link */}
              <p className="text-center text-sm text-(--text-muted)">
                {t("register.haveAccount")}{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-(--color-primary) cursor-pointer hover:underline font-medium"
                >
                  {t("register.login")}
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
