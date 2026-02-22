import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscriptionStatus("success");
      setEmail("");
      setTimeout(() => setSubscriptionStatus(null), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-(--bg-surface) border-t border-(--border-color)">
      {/* Newsletter Section */}
      <div className="bg-(--bg-main) border-b border-(--border-color)">
        <div className="max-w-6xl mx-auto px-6 md:px-20 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Newsletter CTA */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-(--text-primary) mb-3">
                {t("footer.newsletter.title")}
              </h3>
              <p className="text-lg text-(--text-secondary) max-w-md">
                {t("footer.newsletter.subtitle")}
              </p>
            </div>

            {/* Newsletter Form */}
            <motion.form
              onSubmit={handleNewsletterSubscribe}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.newsletter.placeholder")}
                className="flex-1 px-4 py-4 bg-(--card-bg) border border-(--border-color) rounded-xl focus:outline-none focus:border-(--color-primary) text-(--text-primary)"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-4 bg-(--color-primary) text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <FiSend size={18} />
                {t("footer.newsletter.button")}
              </motion.button>
              {subscriptionStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-0 mt-20 sm:mt-0 px-4 py-3 bg-(--color-success) text-white rounded-lg flex items-center gap-2"
                >
                  <FiCheck size={18} />
                  {t("footer.newsletter.success")}
                </motion.div>
              )}
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-(--color-primary) mb-2">
                Gradify
              </h3>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                {t("footer.brandDesc")}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-(--card-bg) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) transition-all"
              >
                <FiGithub size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-(--card-bg) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) transition-all"
              >
                <FiLinkedin size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="mailto:support@gradify.com"
                className="w-10 h-10 rounded-lg bg-(--card-bg) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) transition-all"
              >
                <FiMail size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-(--text-primary) mb-5 flex items-center gap-2">
              Products
              <span className="text-(--color-primary)">•</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/courses"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.products.courses")}
                </Link>
              </li>
              <li>
                <Link
                  to="/instructors"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.products.instructors")}
                </Link>
              </li>
              <li>
                <Link
                  to="/enterprises"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.products.enterprise")}
                </Link>
              </li>
              <li>
                <Link
                  to="/mobile-app"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.products.mobileApp")}
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.products.pricing")}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-(--text-primary) mb-5 flex items-center gap-2">
              Company
              <span className="text-(--color-primary)">•</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.company.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.company.blog")}
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.company.careers")}
                </Link>
              </li>
              <li>
                <Link
                  to="/press"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.company.press")}
                </Link>
              </li>
              <li>
                <Link
                  to="/sponsors"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.company.partner")}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-(--text-primary) mb-5 flex items-center gap-2">
              Support
              <span className="text-(--color-primary)">•</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/contact"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.support.contact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.support.help")}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.support.faq")}
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.support.community")}
                </Link>
              </li>
              <li>
                <Link
                  to="/system-status"
                  className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                  {t("footer.support.status")}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-(--text-primary) mb-5 flex items-center gap-2">
              Contact
              <span className="text-(--color-primary)">•</span>
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiMail
                  className="text-(--color-primary) mt-1 shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-xs text-(--text-secondary) uppercase tracking-wide mb-1">
                    {t("footer.contact.email")}
                  </p>
                  <a
                    href="mailto:support@gradify.com"
                    className="text-(--text-primary) hover:text-(--color-primary) transition-colors"
                  >
                    support@gradify.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone
                  className="text-(--color-primary) mt-1 shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-xs text-(--text-secondary) uppercase tracking-wide mb-1">
                    {t("footer.contact.phone")}
                  </p>
                  <a
                    href="tel:+1234567890"
                    className="text-(--text-primary) hover:text-(--color-primary) transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin
                  className="text-(--color-primary) mt-1 shrink-0"
                  size={18}
                />
                <div>
                  <p className="text-xs text-(--text-secondary) uppercase tracking-wide mb-1">
                    {t("footer.contact.location")}
                  </p>
                  <p className="text-(--text-primary) text-sm">
                    {t("footer.contact.city")}
                    <br />
                    {t("footer.contact.country")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-(--border-color) my-8" />

        {/* Legal Links & Copyright */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 text-sm text-(--text-secondary)">
            <Link
              to="/terms-and-conditions"
              className="hover:text-(--color-primary) transition-colors"
            >
              {t("footer.legal.terms")}
            </Link>
            <Link
              to="/privacy"
              className="hover:text-(--color-primary) transition-colors"
            >
              {t("footer.legal.privacy")}
            </Link>
            <Link
              to="/cookies"
              className="hover:text-(--color-primary) transition-colors"
            >
              {t("footer.legal.cookies")}
            </Link>
            <Link
              to="/disclaimer"
              className="hover:text-(--color-primary) transition-colors"
            >
              {t("footer.legal.disclaimer")}
            </Link>
          </div>

          <p className="text-sm text-(--text-secondary)">
            {t("footer.copyright", { year: currentYear })}{" "}
            <span className="text-(--color-primary)">❤️</span>{" "}
            {t("footer.withLove")}
          </p>
        </motion.div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-linear-to-r from-(--color-primary) via-(--color-secondary) to-(--color-primary) opacity-20" />
    </footer>
  );
};

export default Footer;
