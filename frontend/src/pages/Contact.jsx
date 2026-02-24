import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiClock,
  FiHelpCircle,
  FiCheckCircle,
} from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const _MotionRef = motion;

const Contact = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");

  const maxMessageLength = 500;

  const contactTopics = [
    { id: "general", label: t("contact.topics.general"), icon: FiHelpCircle },
    {
      id: "support",
      label: t("contact.topics.support"),
      icon: FiMessageSquare,
    },
    {
      id: "enrollment",
      label: t("contact.topics.enrollment"),
      icon: FiCheckCircle,
    },
    { id: "partnership", label: t("contact.topics.partnership"), icon: FiUser },
  ];

  const faqs = [
    {
      question: t("contact.faqs.q1"),
      answer: t("contact.faqs.a1"),
    },
    {
      question: t("contact.faqs.q2"),
      answer: t("contact.faqs.a2"),
    },
    {
      question: t("contact.faqs.q3"),
      answer: t("contact.faqs.a3"),
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, url: "#", label: "Facebook", color: "#1877F2" },
    { icon: FaTwitter, url: "#", label: "Twitter", color: "#1DA1F2" },
    { icon: FaLinkedin, url: "#", label: "LinkedIn", color: "#0A66C2" },
    { icon: FaInstagram, url: "#", label: "Instagram", color: "#E4405F" },
    { icon: FaYoutube, url: "#", label: "YouTube", color: "#FF0000" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(t("contact.successMessage"));
      setForm({ name: "", email: "", subject: "", message: "" });
      setSelectedTopic("");
    } catch {
      toast.error(t("contact.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-(--bg-main) text-(--text-primary) min-h-screen">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-(--color-primary)/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-(--color-secondary)/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 px-6 md:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 bg-(--card-bg) border border-(--border-color) rounded-full mb-6"
        >
          <span className="text-sm text-(--color-primary) font-medium">
            💬 Get in Touch
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold"
        >
          {t("contact.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-(--text-secondary)"
        >
          {t("contact.subtitle")}
        </motion.p>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="relative px-6 md:px-20 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* ===== Contact Info Column ===== */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              <InfoCard
                icon={<FiMail size={24} />}
                title={t("contact.emailTitle")}
                desc="support@gradify.com"
                subdesc={t("contact.emailSubdesc")}
              />

              <InfoCard
                icon={<FiPhone size={24} />}
                title={t("contact.phoneTitle")}
                desc="+91 98765 43210"
                subdesc={t("contact.phoneSubdesc")}
              />

              <InfoCard
                icon={<FiMapPin size={24} />}
                title={t("contact.locationTitle")}
                desc="Mumbai, India"
                subdesc={t("contact.locationSubdesc")}
              />
            </div>

            {/* Office Hours */}
            <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-(--color-primary)/10 rounded-lg flex items-center justify-center">
                  <FiClock className="text-(--color-primary)" size={20} />
                </div>
                <h3 className="font-semibold text-lg">
                  {t("contact.officeHoursTitle")}
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-(--text-secondary)">
                    {t("contact.officeHours.weekdays")}
                  </span>
                  <span className="font-medium">
                    {t("contact.officeHours.weekdaysTimes")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--text-secondary)">
                    {t("contact.officeHours.saturday")}
                  </span>
                  <span className="font-medium">
                    {t("contact.officeHours.saturdayTimes")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--text-secondary)">
                    {t("contact.officeHours.sunday")}
                  </span>
                  <span className="font-medium">
                    {t("contact.officeHours.closed")}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4">
                {t("contact.followUs")}
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-lg bg-(--bg-muted) hover:bg-(--color-primary)/10 border border-(--border-color) flex items-center justify-center transition-colors"
                    title={social.label}
                  >
                    <social.icon className="text-(--text-primary)" size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl h-48 overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14661.164942506253!2d77.45872335!3d23.268865150000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c6967f58e0dbf%3A0x65d0724cf8368e2d!2sRICR%20-%20Raj%20Institute%20of%20Coding%20%26%20Robotics%20%7C%20Best%20Java%20Coding%20Classes%20In%20Bhopal!5e0!3m2!1sen!2sin!4v1771940241153!5m2!1sen!2sin" className="w-full h-full" />
            </div>
          </motion.div>

          {/* ===== Contact Form Column ===== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-(--card-bg) p-8 md:p-10 rounded-3xl shadow-xl border border-(--border-color)"
          >
            <h2 className="text-2xl font-semibold mb-6">
              {t("contact.sendMessage")}
            </h2>

            {/* Topic Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-(--text-secondary)">
                {t("contact.topicLabel")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {contactTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedTopic === topic.id
                        ? "border-(--color-primary) bg-(--color-primary)/10"
                        : "border-(--border-color) hover:border-(--color-primary)/50"
                    }`}
                  >
                    <topic.icon
                      className={
                        selectedTopic === topic.id
                          ? "text-(--color-primary)"
                          : "text-(--text-muted)"
                      }
                      size={18}
                    />
                    <p className="text-sm font-medium mt-1">{topic.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                  {t("contact.fullName")}
                </label>
                <div className="relative">
                  <FiUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t("contact.namePlaceholder")}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                  {t("contact.email")}
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t("contact.emailPlaceholder")}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                  {t("contact.subject")}
                </label>
                <div className="relative">
                  <FiMessageSquare
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)"
                    size={18}
                  />
                  <input
                    type="text"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder={t("contact.subjectPlaceholder")}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2 text-(--text-secondary)">
                  {t("contact.message")}
                </label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t("contact.messagePlaceholder")}
                  maxLength={maxMessageLength}
                  className="w-full px-4 py-3 rounded-xl bg-(--bg-muted) border border-(--border-color) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition resize-none"
                />
                <div className="flex justify-between mt-1 text-xs text-(--text-muted)">
                  <span>{t("contact.messageHint")}</span>
                  <span>
                    {form.message.length}/{maxMessageLength}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-(--color-primary) text-white font-semibold hover:bg-(--color-primary-hover) transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-(--color-primary)/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("contact.sending")}
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    {t("contact.sendButton")}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
      {/* ================= FAQ SECTION ================= */}
      <section className="relative px-6 md:px-20 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("contact.faqTitle")}</h2>
            <p className="text-(--text-secondary)">
              {t("contact.faqSubtitle")}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-(--color-primary)/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <FiHelpCircle
                      className="text-(--color-primary)"
                      size={16}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-(--text-secondary) text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const InfoCard = ({ icon, title, desc, subdesc }) => (
  <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-(--color-primary)/10 rounded-lg flex items-center justify-center shrink-0">
        <div className="text-(--color-primary)">{icon}</div>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-(--text-primary) font-medium">{desc}</p>
        {subdesc && (
          <p className="text-sm text-(--text-secondary) mt-1">{subdesc}</p>
        )}
      </div>
    </div>
  </div>
);

export default Contact;
