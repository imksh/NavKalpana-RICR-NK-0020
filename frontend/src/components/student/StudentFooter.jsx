import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiAward,
  FiSettings,
  FiHelpCircle,
  FiDownload,
  FiShare2,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiBarChart2,
  FiUsers,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import api from "../../config/api";

const _MotionRef = motion;

const StudentFooter = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [footerStatsData, setFooterStatsData] = useState(null);

  useEffect(() => {
    const fetchFooterStats = async () => {
      try {
        const res = await api.get("/student/stats");
        setFooterStatsData(res.data || null);
      } catch (error) {
        console.log("Error fetching footer stats:", error);
      }
    };

    fetchFooterStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const stats = [
    {
      icon: FiBookOpen,
      label: t("studentFooter.stats.courses"),
      value: footerStatsData?.totalCourses ?? 0,
      color: "text-(--color-primary)",
    },
    {
      icon: FiAward,
      label: t("studentHome.stats.assignments"),
      value:
        footerStatsData?.totalAssignments != null
          ? `${footerStatsData.submittedAssignments || 0}/${footerStatsData.totalAssignments}`
          : "0/0",
      color: "text-(--color-success)",
    },
    {
      icon: FiBarChart2,
      label: t("studentHome.stats.quizzes"),
      value:
        footerStatsData?.totalQuizzes != null
          ? `${footerStatsData.attemptedQuizzes || 0}/${footerStatsData.totalQuizzes}`
          : "0/0",
      color: "text-(--color-warning)",
    },
    {
      icon: FiClock,
      label: t("studentHome.stats.overallScore"),
      value:
        footerStatsData?.overallScore != null
          ? `${footerStatsData.overallScore}%`
          : "0%",
      color: "text-(--color-secondary)",
    },
  ];

  const quickLinks = [
    {
      icon: FiBookOpen,
      labelKey: "studentFooter.quickLinks.myCourses",
      href: "/student/courses",
      badge: null,
    },
    {
      icon: FiBarChart2,
      labelKey: "studentFooter.quickLinks.analytics",
      href: "/student/progress",
      badge: null,
    },
    {
      icon: FiCalendar,
      labelKey: "studentFooter.quickLinks.schedule",
      href: "/student/notifications",
      badge: null,
    },
    {
      icon: FiSettings,
      labelKey: "studentFooter.quickLinks.settings",
      href: "/student/profile",
      badge: null,
    },
  ];

  const resourceLinks = [
    {
      labelKey: "studentFooter.resources.learningPath",
      href: "/student/progress",
    },
    {
      labelKey: "studentFooter.resources.studyGroups",
      href: "/student/alumni",
    },
    { labelKey: "studentFooter.resources.qaForum", href: "/student/support" },
    {
      labelKey: "studentFooter.resources.recordedSessions",
      href: "/student/support",
    },
    {
      labelKey: "studentFooter.resources.downloadableResources",
      href: "/student/courses",
    },
    {
      labelKey: "studentFooter.resources.careerGuidance",
      href: "/student/jobs",
    },
  ];

  const supportLinks = [
    { labelKey: "studentFooter.support.helpCenter", href: "/student/support" },
    { labelKey: "studentFooter.support.faq", href: "/about" },
    { labelKey: "studentFooter.support.contactSupport", href: "/contact" },
    { labelKey: "studentFooter.support.reportIssue", href: "/student/support" },
    { labelKey: "studentFooter.support.feedback", href: "/contact" },
    {
      labelKey: "studentFooter.support.communityGuidelines",
      href: "/terms-and-conditions",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-(--bg-surface) border-t border-(--border-color) mt-16">
      {/* Stats Section */}
      <div className="bg-(--bg-main) border-b border-(--border-color) px-6 md:px-20 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-(--text-primary) mb-8">
            {t("studentFooter.titles.learningStats")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-4 text-center hover:border-(--color-primary) transition-all cursor-pointer"
                >
                  <Icon className={`${stat.color} mx-auto mb-3`} size={28} />
                  <p className="text-2xl font-bold text-(--text-primary) mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-(--text-secondary)">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-(--text-primary) mb-8">
            {t("studentFooter.titles.quickAccess")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Link
                    to={link.href}
                    className="flex flex-col items-center p-4 bg-(--card-bg) border border-(--border-color) rounded-xl hover:border-(--color-primary) transition-all group relative"
                  >
                    <div className="relative mb-3">
                      <Icon
                        className="text-(--color-primary) group-hover:scale-110 transition-transform"
                        size={24}
                      />
                      {link.badge && (
                        <span className="absolute -top-2 -right-2 bg-(--color-primary) text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm font-medium text-(--text-primary) text-center">
                      {t(link.labelKey)}
                    </p>
                    {hoveredCard === index && (
                      <motion.div
                        layoutId="hoverLine"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-primary) rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12 border-t border-(--border-color)">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12"
        >
          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-(--text-primary) mb-6 flex items-center gap-2">
              <FiBookOpen className="text-(--color-primary)" />
              {t("studentFooter.titles.learningResources")}
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-(--text-primary) mb-6 flex items-center gap-2">
              <FiHelpCircle className="text-(--color-primary)" />
              {t("studentFooter.titles.supportHelp")}
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-(--text-secondary) hover:text-(--color-primary) transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-(--color-primary) group-hover:translate-x-1 transition-transform" />
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Student Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-(--text-primary) mb-6 flex items-center gap-2">
              <FiUsers className="text-(--color-primary)" />
              {t("studentFooter.titles.yourProfile")}
            </h4>
            <div className="space-y-4">
              {user && (
                <>
                  <div>
                    <p className="text-xs text-(--text-secondary) uppercase tracking-wide mb-1">
                      {t("studentFooter.labels.name")}
                    </p>
                    <p className="text-(--text-primary) font-medium">
                      {user.name || t("studentFooter.labels.studentUser")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-(--text-secondary) uppercase tracking-wide mb-1">
                      {t("studentFooter.labels.email")}
                    </p>
                    <p className="text-(--text-primary) text-sm break-all">
                      {user.email || "student@gradify.com"}
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-xs text-(--text-secondary) uppercase tracking-wide mb-2">
                  {t("studentFooter.labels.social")}
                </p>
                <div className="flex items-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.2 }}
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-(--card-bg) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) transition-all"
                  >
                    <FiGithub size={14} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.2 }}
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-(--card-bg) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) transition-all"
                  >
                    <FiLinkedin size={14} />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.2 }}
                    href="mailto:student@gradify.com"
                    className="w-8 h-8 rounded-lg bg-(--card-bg) border border-(--border-color) flex items-center justify-center text-(--text-secondary) hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) transition-all"
                  >
                    <FiMail size={14} />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-(--border-color) my-8" />

        {/* Footer Bottom */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-xs text-(--text-secondary)">
            <Link
              to="/terms-and-conditions"
              className="hover:text-(--color-primary) transition-colors"
            >
              {t("studentFooter.bottom.terms")}
            </Link>
            <Link
              to="/contact"
              className="hover:text-(--color-primary) transition-colors"
            >
              {t("studentFooter.bottom.privacy")}
            </Link>
            <button className="flex items-center gap-2 hover:text-(--color-primary) transition-colors">
              <FiDownload size={14} />
              {t("studentFooter.bottom.downloadCertificate")}
            </button>
            <button className="flex items-center gap-2 hover:text-(--color-primary) transition-colors">
              <FiShare2 size={14} />
              {t("studentFooter.bottom.shareProfile")}
            </button>
          </div>

          <p className="text-xs text-(--text-secondary)">
            {t("studentFooter.bottom.copyright", { year: currentYear })}
          </p>
        </motion.div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-linear-to-r from-(--color-primary) via-(--color-secondary) to-(--color-primary) opacity-30" />
    </footer>
  );
};

export default StudentFooter;
