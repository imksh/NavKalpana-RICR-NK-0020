import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[var(--card-bg)] shadow-lg rounded-3xl p-10 border border-[var(--border-color)]"
      >
        <h2 className="text-3xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        <p className="text-center text-[var(--text-secondary)] mb-8">
          Login to continue your learning journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-[var(--text-secondary)]">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2 text-[var(--text-secondary)]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-[var(--color-primary)] cursor-pointer hover:underline"
            >
              Forgot Password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[var(--color-primary)] cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;