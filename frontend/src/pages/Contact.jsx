import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    // later connect to backend
  };

  return (
    <div className="bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 px-6 md:px-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Get in Touch
        </motion.h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--text-secondary)]">
          Have questions, suggestions, or partnership ideas? We'd love to hear
          from you.
        </p>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="px-6 md:px-20 pb-24">
        <div className="grid md:grid-cols-2 gap-16">
          {/* ===== Contact Form ===== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[var(--card-bg)] p-10 rounded-3xl shadow-lg border border-[var(--border-color)] order-1 md:order-2 "
          >
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-[var(--text-secondary)]">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-muted)] border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] transition-all"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* ===== Contact Info ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8 order-2 md:order-1 "
          >
            <InfoItem
              icon={<FiMail size={22} />}
              title="Email"
              desc="support@gradify.com"
            />

            <InfoItem
              icon={<FiPhone size={22} />}
              title="Phone"
              desc="+91 98765 43210"
            />

            <InfoItem
              icon={<FiMapPin size={22} />}
              title="Location"
              desc="India"
            />

            <div className="bg-[var(--bg-muted)] rounded-2xl h-40 flex items-center justify-center text-[var(--text-muted)]">
              Map Preview
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const InfoItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="text-[var(--color-primary)] mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-[var(--text-secondary)]">{desc}</p>
    </div>
  </div>
);

export default Contact;
