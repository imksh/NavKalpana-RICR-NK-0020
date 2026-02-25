import { motion } from "framer-motion";
import {
  FiCheck,
  FiShield,
  FiBook,
  FiAlertCircle,
  FiCreditCard,
  FiUsers,
  FiFileText,
  FiMail,
} from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";

const _MotionRef = motion;

const TermsAndConditions = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    {
      id: "acceptance",
      title: t("termsPage.sections.acceptance"),
      icon: FiCheck,
    },
    { id: "license", title: t("termsPage.sections.license"), icon: FiBook },
    { id: "account", title: t("termsPage.sections.account"), icon: FiUsers },
    { id: "content", title: t("termsPage.sections.content"), icon: FiFileText },
    {
      id: "payment",
      title: t("termsPage.sections.payment"),
      icon: FiCreditCard,
    },
    {
      id: "intellectual",
      title: t("termsPage.sections.intellectual"),
      icon: FiShield,
    },
    {
      id: "prohibited",
      title: t("termsPage.sections.prohibited"),
      icon: FiAlertCircle,
    },
    {
      id: "disclaimer",
      title: t("termsPage.sections.disclaimer"),
      icon: FiAlertCircle,
    },
    {
      id: "liability",
      title: t("termsPage.sections.liability"),
      icon: FiShield,
    },
    { id: "privacy", title: t("termsPage.sections.privacy"), icon: FiShield },
    { id: "changes", title: t("termsPage.sections.changes"), icon: FiFileText },
    { id: "contact", title: t("termsPage.sections.contact"), icon: FiMail },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="bg-(--bg-main) text-(--text-primary) min-h-screen">
      <SEO
        title="Terms and Conditions | Gradify"
        description="Read Gradify's terms and conditions for platform usage, account policies, course access, refunds, and legal information."
        keywords="Gradify terms, terms and conditions, privacy policy, LMS legal, user agreement"
        canonical="https://gradify.in/terms-and-conditions"
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-20 text-center bg-(--bg-surface) border-b border-(--border-color)">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 bg-(--card-bg) border border-(--border-color) rounded-full mb-6"
        >
          <span className="text-sm text-(--color-primary) font-medium">
            {t("termsPage.hero.badge")}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          {t("termsPage.hero.title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-(--text-secondary) max-w-3xl mx-auto"
        >
          {t("termsPage.hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 inline-block px-4 py-2 bg-(--color-primary)/10 rounded-lg"
        >
          <p className="text-sm text-(--text-secondary)">
            <strong>{t("termsPage.hero.lastUpdated")}</strong> February 23, 2026
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-6"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FiFileText className="text-(--color-primary)" />
                  {t("termsPage.toc.title")}
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                        activeSection === section.id
                          ? "bg-(--color-primary) text-white"
                          : "hover:bg-(--bg-surface) text-(--text-secondary)"
                      }`}
                    >
                      <section.icon size={16} />
                      <span className="text-sm font-medium">
                        {section.title}
                      </span>
                    </button>
                  ))}
                </nav>
              </motion.div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Introduction */}
              <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-8">
                <div className="prose prose-invert max-w-none">
                  <p className="text-(--text-secondary) leading-relaxed">
                    {t("termsPage.introduction")}
                  </p>
                </div>
              </div>

              {/* Section 1: Acceptance of Terms */}
              <Section
                id="acceptance"
                icon={FiCheck}
                title={t("termsPage.section1.title")}
                content={
                  <>
                    <p>{t("termsPage.section1.paragraph1")}</p>
                    <ul className="space-y-2 mt-4">
                      <li>{t("termsPage.section1.bullet1")}</li>
                      <li>{t("termsPage.section1.bullet2")}</li>
                      <li>{t("termsPage.section1.bullet3")}</li>
                      <li>{t("termsPage.section1.bullet4")}</li>
                    </ul>
                  </>
                }
              />

              {/* Section 2: Use License */}
              <Section
                id="license"
                icon={FiBook}
                title={t("termsPage.section2.title")}
                content={
                  <>
                    <p>{t("termsPage.section2.paragraph1")}</p>
                    <div className="mt-4 p-4 bg-(--bg-surface) rounded-xl border border-(--border-color)">
                      <h4 className="font-bold mb-3 text-(--color-primary)">
                        {t("termsPage.section2.youMayTitle")}
                      </h4>
                      <ul className="space-y-2">
                        <li>{t("termsPage.section2.youMay1")}</li>
                        <li>{t("termsPage.section2.youMay2")}</li>
                        <li>{t("termsPage.section2.youMay3")}</li>
                        <li>{t("termsPage.section2.youMay4")}</li>
                      </ul>
                    </div>
                    <div className="mt-4 p-4 bg-(--color-danger)/10 rounded-xl border border-(--color-danger)/30">
                      <h4 className="font-bold mb-3 text-(--color-danger)">
                        {t("termsPage.section2.youMayNotTitle")}
                      </h4>
                      <ul className="space-y-2">
                        <li>{t("termsPage.section2.youMayNot1")}</li>
                        <li>{t("termsPage.section2.youMayNot2")}</li>
                        <li>{t("termsPage.section2.youMayNot3")}</li>
                        <li>{t("termsPage.section2.youMayNot4")}</li>
                      </ul>
                    </div>
                  </>
                }
              />

              {/* Section 3: User Account */}
              <Section
                id="account"
                icon={FiUsers}
                title={t("termsPage.section3.title")}
                content={
                  <>
                    <p>{t("termsPage.section3.paragraph1")}</p>
                    <h4 className="font-bold mt-6 mb-3">
                      {t("termsPage.section3.responsibilitiesTitle")}
                    </h4>
                    <ul className="space-y-2">
                      <li>{t("termsPage.section3.responsibility1")}</li>
                      <li>{t("termsPage.section3.responsibility2")}</li>
                      <li>{t("termsPage.section3.responsibility3")}</li>
                      <li>{t("termsPage.section3.responsibility4")}</li>
                      <li>{t("termsPage.section3.responsibility5")}</li>
                    </ul>
                    <h4 className="font-bold mt-6 mb-3">
                      {t("termsPage.section3.terminationTitle")}
                    </h4>
                    <p>{t("termsPage.section3.terminationText")}</p>
                  </>
                }
              />

              {/* Section 4: Course Access and Content */}
              <Section
                id="content"
                icon={FiFileText}
                title={t("termsPage.section4.title")}
                content={
                  <>
                    <p>{t("termsPage.section4.paragraph1")}</p>
                    <div className="mt-6 grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-(--bg-surface) rounded-xl border border-(--border-color)">
                        <h5 className="font-bold mb-2 text-(--color-primary)">
                          {t("termsPage.section4.availabilityTitle")}
                        </h5>
                        <p className="text-sm text-(--text-secondary)">
                          {t("termsPage.section4.availabilityText")}
                        </p>
                      </div>
                      <div className="p-4 bg-(--bg-surface) rounded-xl border border-(--border-color)">
                        <h5 className="font-bold mb-2 text-(--color-primary)">
                          {t("termsPage.section4.certificatesTitle")}
                        </h5>
                        <p className="text-sm text-(--text-secondary)">
                          {t("termsPage.section4.certificatesText")}
                        </p>
                      </div>
                    </div>
                    <h4 className="font-bold mt-6 mb-3">
                      {t("termsPage.section4.qualityTitle")}
                    </h4>
                    <p>{t("termsPage.section4.qualityText")}</p>
                  </>
                }
              />

              {/* Section 5: Payment and Refunds */}
              <Section
                id="payment"
                icon={FiCreditCard}
                title={t("termsPage.section5.title")}
                content={
                  <>
                    <p>{t("termsPage.section5.paragraph1")}</p>
                    <h4 className="font-bold mt-6 mb-3">
                      {t("termsPage.section5.paymentTermsTitle")}
                    </h4>
                    <ul className="space-y-2">
                      <li>{t("termsPage.section5.paymentTerm1")}</li>
                      <li>{t("termsPage.section5.paymentTerm2")}</li>
                      <li>{t("termsPage.section5.paymentTerm3")}</li>
                      <li>{t("termsPage.section5.paymentTerm4")}</li>
                    </ul>
                    <div className="mt-6 p-6 bg-(--color-primary)/10 rounded-xl border border-(--color-primary)/30">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <FiShield className="text-(--color-primary)" />
                        {t("termsPage.section5.refundPolicyTitle")}
                      </h4>
                      <p className="mb-3">
                        {t("termsPage.section5.refundPolicyText")}
                      </p>
                      <ul className="space-y-2">
                        <li>{t("termsPage.section5.refundCondition1")}</li>
                        <li>{t("termsPage.section5.refundCondition2")}</li>
                        <li>{t("termsPage.section5.refundCondition3")}</li>
                      </ul>
                      <p className="mt-3 text-sm text-(--text-secondary)">
                        {t("termsPage.section5.refundNote")}
                      </p>
                    </div>
                  </>
                }
              />

              {/* Section 6: Intellectual Property */}
              <Section
                id="intellectual"
                icon={FiShield}
                title={t("termsPage.section6.title")}
                content={
                  <>
                    <p>{t("termsPage.section6.paragraph1")}</p>
                    <h4 className="font-bold mt-6 mb-3">
                      {t("termsPage.section6.courseContentTitle")}
                    </h4>
                    <p>{t("termsPage.section6.courseContentText")}</p>
                    <h4 className="font-bold mt-6 mb-3">
                      {t("termsPage.section6.userContentTitle")}
                    </h4>
                    <p>{t("termsPage.section6.userContentText")}</p>
                  </>
                }
              />

              {/* Section 7: Prohibited Activities */}
              <Section
                id="prohibited"
                icon={FiAlertCircle}
                title={t("termsPage.section7.title")}
                content={
                  <>
                    <p>{t("termsPage.section7.paragraph1")}</p>
                    <div className="mt-4 grid gap-3">
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited1")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited2")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited3")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited4")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited5")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited6")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited7")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited8")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited9")}
                      />
                      <ProhibitedItem
                        text={t("termsPage.section7.prohibited10")}
                      />
                    </div>
                    <p className="mt-6 p-4 bg-(--color-warning)/10 rounded-xl border border-(--color-warning)/30">
                      <strong>{t("termsPage.section7.warningLabel")}</strong>{" "}
                      {t("termsPage.section7.warningText")}
                    </p>
                  </>
                }
              />

              {/* Section 8: Disclaimer */}
              <Section
                id="disclaimer"
                icon={FiAlertCircle}
                title={t("termsPage.section8.title")}
                content={
                  <>
                    <div className="p-6 bg-(--color-warning)/10 rounded-xl border border-(--color-warning)/30">
                      <p className="font-bold mb-4">
                        {t("termsPage.section8.paragraph1")}
                      </p>
                      <p>{t("termsPage.section8.paragraph2")}</p>
                      <ul className="space-y-2 mt-3">
                        <li>{t("termsPage.section8.warrant1")}</li>
                        <li>{t("termsPage.section8.warrant2")}</li>
                        <li>{t("termsPage.section8.warrant3")}</li>
                        <li>{t("termsPage.section8.warrant4")}</li>
                        <li>{t("termsPage.section8.warrant5")}</li>
                      </ul>
                    </div>
                    <p className="mt-6">{t("termsPage.section8.paragraph3")}</p>
                  </>
                }
              />

              {/* Section 9: Limitations of Liability */}
              <Section
                id="liability"
                icon={FiShield}
                title={t("termsPage.section9.title")}
                content={
                  <>
                    <p>{t("termsPage.section9.paragraph1")}</p>
                    <h4 className="font-bold mt-6 mb-3">
                      {t("termsPage.section9.limitationTitle")}
                    </h4>
                    <ul className="space-y-2">
                      <li>{t("termsPage.section9.limitation1")}</li>
                      <li>{t("termsPage.section9.limitation2")}</li>
                      <li>{t("termsPage.section9.limitation3")}</li>
                      <li>{t("termsPage.section9.limitation4")}</li>
                      <li>{t("termsPage.section9.limitation5")}</li>
                    </ul>
                    <p className="mt-6 p-4 bg-(--bg-surface) rounded-xl border border-(--border-color)">
                      <strong>
                        {t("termsPage.section9.maxLiabilityLabel")}
                      </strong>{" "}
                      {t("termsPage.section9.maxLiabilityText")}
                    </p>
                  </>
                }
              />

              {/* Section 10: Privacy Policy */}
              <Section
                id="privacy"
                icon={FiShield}
                title={t("termsPage.section10.title")}
                content={
                  <>
                    <p>{t("termsPage.section10.paragraph1")}</p>
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-(--bg-surface) rounded-xl border border-(--border-color) text-center">
                        <FiShield
                          className="mx-auto mb-3 text-(--color-primary)"
                          size={24}
                        />
                        <h5 className="font-bold mb-2">
                          {t("termsPage.section10.dataSecurityTitle")}
                        </h5>
                        <p className="text-sm text-(--text-secondary)">
                          {t("termsPage.section10.dataSecurityText")}
                        </p>
                      </div>
                      <div className="p-4 bg-(--bg-surface) rounded-xl border border-(--border-color) text-center">
                        <FiUsers
                          className="mx-auto mb-3 text-(--color-primary)"
                          size={24}
                        />
                        <h5 className="font-bold mb-2">
                          {t("termsPage.section10.dataUsageTitle")}
                        </h5>
                        <p className="text-sm text-(--text-secondary)">
                          {t("termsPage.section10.dataUsageText")}
                        </p>
                      </div>
                      <div className="p-4 bg-(--bg-surface) rounded-xl border border-(--border-color) text-center">
                        <FiCheck
                          className="mx-auto mb-3 text-(--color-primary)"
                          size={24}
                        />
                        <h5 className="font-bold mb-2">
                          {t("termsPage.section10.yourRightsTitle")}
                        </h5>
                        <p className="text-sm text-(--text-secondary)">
                          {t("termsPage.section10.yourRightsText")}
                        </p>
                      </div>
                    </div>
                  </>
                }
              />

              {/* Section 11: Changes to Terms */}
              <Section
                id="changes"
                icon={FiFileText}
                title={t("termsPage.section11.title")}
                content={
                  <>
                    <p>{t("termsPage.section11.paragraph1")}</p>
                    <ul className="space-y-2 mt-4">
                      <li>{t("termsPage.section11.notification1")}</li>
                      <li>{t("termsPage.section11.notification2")}</li>
                      <li>{t("termsPage.section11.notification3")}</li>
                    </ul>
                    <div className="mt-6 p-6 bg-(--color-primary)/10 rounded-xl border border-(--color-primary)/30">
                      <p>
                        <strong>
                          {t("termsPage.section11.responsibilityLabel")}
                        </strong>{" "}
                        {t("termsPage.section11.responsibilityText")}
                      </p>
                    </div>
                    <p className="mt-4">
                      {t("termsPage.section11.paragraph2")}
                    </p>
                  </>
                }
              />

              {/* Section 12: Contact Us */}
              <Section
                id="contact"
                icon={FiMail}
                title={t("termsPage.section12.title")}
                content={
                  <>
                    <p>{t("termsPage.section12.paragraph1")}</p>
                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                      <div className="p-6 bg-(--bg-surface) rounded-xl border border-(--border-color)">
                        <h5 className="font-bold mb-4 flex items-center gap-2">
                          <FiMail className="text-(--color-primary)" />
                          {t("termsPage.section12.emailSupportTitle")}
                        </h5>
                        <p className="text-(--text-secondary) mb-2">
                          {t("termsPage.section12.generalInquiries")}
                        </p>
                        <a
                          href="mailto:support@gradify.com"
                          className="text-(--color-primary) font-medium hover:underline"
                        >
                          {t("termsPage.section12.supportEmail")}
                        </a>
                        <p className="text-(--text-secondary) mt-4 mb-2">
                          {t("termsPage.section12.legalMatters")}
                        </p>
                        <a
                          href="mailto:legal@gradify.com"
                          className="text-(--color-primary) font-medium hover:underline"
                        >
                          {t("termsPage.section12.legalEmail")}
                        </a>
                      </div>
                      <div className="p-6 bg-(--bg-surface) rounded-xl border border-(--border-color)">
                        <h5 className="font-bold mb-4">
                          {t("termsPage.section12.mailingAddressTitle")}
                        </h5>
                        <p
                          className="text-(--text-secondary)"
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {t("termsPage.section12.address")}
                        </p>
                        <p className="text-(--text-secondary) mt-4">
                          <strong>
                            {t("termsPage.section12.responseTimeLabel")}
                          </strong>{" "}
                          {t("termsPage.section12.responseTimeText")}
                        </p>
                      </div>
                    </div>
                  </>
                }
              />

              {/* Acceptance Footer */}
              <div className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <FiCheck
                    className="mx-auto mb-4 text-(--color-success)"
                    size={48}
                  />
                  <h3 className="text-2xl font-bold mb-4">
                    {t("termsPage.footer.thankYouTitle")}
                  </h3>
                  <p className="text-(--text-secondary) mb-6">
                    {t("termsPage.footer.thankYouText")}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={() => window.history.back()}
                      className="px-6 py-3 bg-(--color-primary) text-white font-semibold rounded-xl hover:bg-(--color-primary-hover) transition-all"
                    >
                      {t("termsPage.footer.understandButton")}
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 bg-(--card-bg) border-2 border-(--border-color) font-semibold rounded-xl hover:border-(--color-primary) transition-all"
                    >
                      {t("termsPage.footer.printButton")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Section Component
const Section = ({ id, icon: Icon, title, content }) => {
  const _IconRef = Icon;
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-8 scroll-mt-24"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-(--color-primary)/10 rounded-xl flex items-center justify-center shrink-0">
          <Icon className="text-(--color-primary)" size={24} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      </div>
      <div className="prose prose-invert max-w-none text-(--text-secondary) leading-relaxed">
        {content}
      </div>
    </motion.div>
  );
};

// Prohibited Item Component
const ProhibitedItem = ({ text }) => (
  <div className="flex items-start gap-3 p-3 bg-(--color-danger)/5 rounded-lg border border-(--color-danger)/20">
    <FiAlertCircle
      className="text-(--color-danger) shrink-0 mt-0.5"
      size={18}
    />
    <span className="text-sm">{text}</span>
  </div>
);

export default TermsAndConditions;
