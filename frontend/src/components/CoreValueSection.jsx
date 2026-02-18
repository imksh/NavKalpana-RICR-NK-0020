import { useState } from "react";
import { FaPlus, FaMinus, FaArrowRight } from "react-icons/fa6";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CoreValueSection = () => {
  const [open, setOpen] = useState(0);
  const [hoverContact, setHoverContact] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const faqs = t("coreValue.faqs", { returnObjects: true });

  return (
    <section className="px-[5%] py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* LEFT FAQ */}
      <motion.div
        className="lg:col-span-2 "
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h2 className="text-(--primary) text-4xl font-bold mb-10">
          {t("coreValue.title")}
        </h2>

        <div className="flex flex-col ">
          {faqs.map((item, i) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.9 }}
              key={i}
              className="py-6 border-b border-slate-300"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center text-left text-xl font-semibold cursor-pointer  "
              >
                {item.q}
                {open === i ? <FaMinus /> : <FaPlus />}
              </button>

              {open === i && (
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT CARD */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="bg-[#f0744a] rounded-3xl text-white p-10 flex flex-col justify-between relative overflow-hidden"
      >
        <div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-6">
            👤
          </div>

          <h3 className="text-4xl font-bold mb-6">
            {t("coreValue.helpCard.titleLine1")}
            <br />
            {t("coreValue.helpCard.titleLine2")}
          </h3>

          <p className="text-white/90 leading-relaxed">
            {t("coreValue.helpCard.description")}
          </p>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="bg-white text-(--primary) w-50 h-14 text-left rounded-4xl flex items-center relative overflow-hidden cursor-pointer z-20"
          onMouseEnter={() => setHoverContact(true)}
          onMouseLeave={() => setHoverContact(false)}
          onClick={() => navigate("/contact")}
        >
          <span className="ml-4 z-10 font-bold">
            {t("coreValue.helpCard.button")}
          </span>
          <motion.span
            initial={{ width: 0 }}
            animate={hoverContact ? { width: "100%" } : { width: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-(--secondary) rounded-4xl"
          />
          <motion.div
            initial={{ rotate: -45 }}
            animate={hoverContact ? { rotate: 0 } : { rotate: -45 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-12 h-12 rounded-full absolute right-1 text-white bg-(--primary) flex justify-center items-center z-10"
          >
            <FaArrowRight size={20} />
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default CoreValueSection;
