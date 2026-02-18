import React, { useState } from "react";
import useUiStore from "../store/useUiStore";
import { pujaServices } from "../assets/data/pujaServices.js";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import usePublicStore from "../store/usePublicStore";
import { FiLoader } from "react-icons/fi";

const ContactForm = ({ setShowAnimation }) => {
  const { t } = useTranslation();
  const { lang } = useUiStore();
  const { sendingMessage, sendMessage } = usePublicStore();
  const [data, setData] = useState({
    name: "",
    phone: "",
    service: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((item) => ({ ...item, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await sendMessage(data);
    setData({
      name: "",
      phone: "",
      service: "",
      email: "",
      message: "",
    });
    if (res?.data) {
      if (setShowAnimation) setShowAnimation(true);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setData({
      name: "",
      phone: "",
      service: "",
      email: "",
      message: "",
    });

    setShowAnimation(false);
  };
  return (
    <motion.form
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="w-full px-4 py-8 md:p-16 rounded-2xl flex flex-col gap-2 shadow-2xl bg-white z-10"
      onSubmit={(e) => handleSubmit(e)}
      onReset={(e) => handleReset(e)}
    >
      {/* <h2 className="text-center font-bold my-2 text-xl md:text-3xl text-(--primary)">
              Create Account
            </h2> */}
      <div className="w-full flex flex-col mt-4 gap-4">
        <div className="w-full flex gap-4">
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={(e) => handleChange(e)}
            className="border p-4 rounded-xl border-gray-300 disabled:bg-gray-200 disabled:cursor-not-allowed  w-full "
            required
            disabled={sendingMessage}
            placeholder={t("contact.form.name")}
          />
        </div>
        <div className="w-full  flex flex-col">
          <input
            type="email"
            name="email"
            id="email"
            value={data.email}
            onChange={(e) => handleChange(e)}
            className="border p-4  rounded-xl border-gray-300 disabled:bg-gray-200 disabled:cursor-not-allowed   w-full"
            required
            disabled={sendingMessage}
            placeholder={t("contact.form.email")}
          />
        </div>
        <div className="w-full flex flex-col">
          <input
            type="tel"
            name="phone"
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange(e)}
            className="border p-4  rounded-xl border-gray-300 disabled:bg-gray-200 disabled:cursor-not-allowed   w-full "
            required
            disabled={sendingMessage}
            placeholder={t("contact.form.phone")}
          />
        </div>
        <div className="w-full flex flex-col">
          <select
            name="service"
            value={data.service}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border border-gray-300  bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
            disabled={sendingMessage}
          >
            <option value="">
              {lang === "hi" ? "पूजा सेवा चुनें" : "Select Service"}
            </option>

            {pujaServices.map((item, i) => (
              <option key={i} value={item.value}>
                {lang === "hi" ? item.label.hi : item.label.en}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full flex flex-col">
          <textarea
            name="message"
            id="message"
            value={data.message}
            onChange={(e) => handleChange(e)}
            className="border p-4  rounded-xl border-gray-300 disabled:bg-gray-200 disabled:cursor-not-allowed   w-full "
            disabled={sendingMessage}
            placeholder={t("contact.form.message")}
          />
        </div>
      </div>

      <div className="flex justify-around w-full my-8 gap-4 md:gap-8 border-t pt-4 px-4 border-gray-300">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-[50%] py-4 bg-red-500 hover:bg-red-700 text-white cursor-pointer  mx-auto  rounded-lg disabled:scale-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
          type="reset"
          disabled={sendingMessage}
        >
          {t("contact.form.clear")}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-[50%] py-4 bg-(--primary) hover:bg-(--accent) text-white cursor-pointer  mx-auto rounded-lg disabled:scale-100 disabled:bg-gray-400 disabled:cursor-not-allowed items-center justify-center flex `}
          type="submit"
          disabled={sendingMessage}
        >
          {!sendingMessage ? (
            t("contact.form.submit")
          ) : (
            <FiLoader className="animate-spin" />
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ContactForm;
