import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-color)]">
      
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-14 grid md:grid-cols-4 gap-10">

        {/* ================= BRAND ================= */}
        <div>
          <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">
            Gradify
          </h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            Smart learning platform powered by AI. Track progress,
            improve skills, and learn efficiently.
          </p>
        </div>

        {/* ================= QUICK LINKS ================= */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>
              <Link to="/" className="hover:text-[var(--color-primary)]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[var(--color-primary)]">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[var(--color-primary)]">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="hover:text-[var(--color-primary)]">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= PLATFORM ================= */}
        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>
              <Link to="/login" className="hover:text-[var(--color-primary)]">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-[var(--color-primary)]">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= SOCIAL ================= */}
        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <div className="flex gap-4 text-xl text-[var(--text-secondary)]">
            <a href="#" className="hover:text-[var(--color-primary)]">
              <FiGithub />
            </a>
            <a href="#" className="hover:text-[var(--color-primary)]">
              <FiLinkedin />
            </a>
            <a href="#" className="hover:text-[var(--color-primary)]">
              <FiMail />
            </a>
          </div>
        </div>

      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-[var(--border-color)] py-6 text-center text-sm text-[var(--text-muted)]">
        © {new Date().getFullYear()} Gradify. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;