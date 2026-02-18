import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Register = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "student"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-6 py-20" >

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-[var(--card-bg)] shadow-lg rounded-3xl p-10 border border-[var(--border-color)]"
      >
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create Your Account
        </h2>

        <p className="text-center text-[var(--text-secondary)] mb-8">
          Join Gradify and start learning smarter today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <InputField
            label="Full Name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Phone */}
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {/* Role Select */}
          <div>
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
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-60"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[var(--color-primary)] cursor-pointer hover:underline"
          >
            Login
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