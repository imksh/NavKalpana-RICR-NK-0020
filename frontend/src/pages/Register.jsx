import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";

const Register = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(form);
  };

  return (
    <div className="min-h-[90dvh] flex items-center justify-center bg-(--bg-main) px-3 md:px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-(--card-bg) shadow-lg rounded-3xl p-10 border border-(--border-color)"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          {t("register.title")}
        </h2>

        <p className="text-center text-(--text-secondary) mb-8">
          {t("register.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <InputField
            label={t("register.fullName")}
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <InputField
            label={t("register.email")}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <InputField
            label={t("register.phone")}
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <InputField
            label={t("register.password")}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Role Select */}
          {/* <div>
            <label className="block text-sm mb-2 text-[var(--text-secondary)]">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div> */}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-60"
          >
            {isLoading ? t("register.loading") : t("register.button")}
          </button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          {t("register.haveAccount")}
          <span
            onClick={() => navigate("/login")}
            className="text-[var(--color-primary)] cursor-pointer hover:underline"
          >
            {" "}{t("register.login")}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-2 text-[var(--text-secondary)]">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
    />
  </div>
);

export default Register;
