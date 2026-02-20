import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

const developers = [
  {
    _id: "dev1",
    name: "Karan Sharma",
    role: "Full Stack Developer",
    bio: "Built Gradify with MERN stack, AI integrations, and scalable LMS architecture.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Karan",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
    email: "your@email.com",
  },
  {
    _id: "dev2",
    name: "Team Gradify",
    role: "Product & Design",
    bio: "Focused on building a clean, scalable and AI-powered learning experience.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Gradify",
    github: "#",
    linkedin: "#",
    email: "#",
  },
  {
    _id: "dev3",
    name: "Karan Sharma",
    role: "Full Stack Developer",
    bio: "Built Gradify with MERN stack, AI integrations, and scalable LMS architecture.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Karan",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
    email: "your@email.com",
  },
  {
    _id: "dev4",
    name: "Team Gradify",
    role: "Product & Design",
    bio: "Focused on building a clean, scalable and AI-powered learning experience.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Gradify",
    github: "#",
    linkedin: "#",
    email: "#",
  },
];

const DeveloperSection = () => {
  const { t } = useTranslation();
  return (
    <section className="my-20 mx-4 md:m-20">
      <h2 className="text-3xl font-semibold mb-12 text-center">
        👨‍💻 {t("about.devHeader")}
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {developers.map((dev) => (
          <motion.div
            key={dev._id}
            whileHover={{ y: -6 }}
            className="bg-(--card-bg) border border-(--border-color) p-8 rounded-3xl shadow-sm transition-all duration-300"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src={dev.avatar}
                alt={dev.name}
                className="w-24 h-24 rounded-full object-cover mb-4 border border-(--border-color)"
              />
              <h3 className="text-xl font-semibold">{dev.name}</h3>
              <p className="text-sm text-(--color-primary)">{dev.role}</p>
            </div>

            {/* Bio */}
            <p className="text-sm text-(--text-secondary) mb-6 text-center">
              {dev.bio}
            </p>

            {/* Social Links */}
            <div className="flex justify-center gap-6 text-(--text-secondary)">
              <a
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-(--color-primary) transition"
              >
                <FiGithub size={18} />
              </a>

              <a
                href={dev.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-(--color-primary) transition"
              >
                <FiLinkedin size={18} />
              </a>

              <a
                href={`mailto:${dev.email}`}
                className="hover:text-(--color-primary) transition"
              >
                <FiMail size={18} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DeveloperSection;
