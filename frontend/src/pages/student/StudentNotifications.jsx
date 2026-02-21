import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { motion } from "framer-motion";
import { useStudentStore } from "../../store/useStudentStore";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import timeFormat from "../../utils/timeFormat";
import capitalize from "../../utils/capitalize";
import useUiStore from "../../store/useUiStore";

const StudentNotifications = () => {
  const { notifications, getNotifications } = useStudentStore();
  const [curr, setCurr] = useState("");
  const navigate = useNavigate();
  const { setNewNotification } = useUiStore();

  //   useEffect(() => {
  //     setNewNotification(false);
  //     getNotifications();
  //   }, []);

  return (
    <div className="w-[95%] md:w-[85%] mx-auto pb-10 space-y-8 min-h-dvh bg-(--bg-main) pt-20 md:pt-32">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-(--text-primary)">
          Notifications
        </h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          Your latest academic updates
        </p>
      </div>

      {/* LIST */}
      <div className="bg-(--card-bg) rounded-2xl border border-(--border-color) overflow-hidden shadow-sm ">
        {notifications?.length === 0 && (
          <div className="py-10 text-center text-(--text-secondary)">
            No notifications yet
          </div>
        )}

        {notifications?.map((item) => (
          <motion.button
            key={item._id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onMouseEnter={() => setCurr(item._id)}
            onMouseLeave={() => setCurr("")}
            onClick={() => navigate(item.url)}
            className="flex gap-4 px-6 py-5 border-b border-(--border-color) last:border-b-0 w-full text-left transition hover:bg-(--bg-muted)"
          >
            {/* ICON */}
            <motion.div
              animate={curr === item._id ? { x: [0, -4, 4, -4, 0] } : { x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-(--color-primary)/10 text-(--color-primary)"
            >
              <FiBell />
            </motion.div>

            {/* CONTENT */}
            <div className="flex-1">
              <h3 className="font-semibold text-(--text-primary)">
                {capitalize(item.type)}
              </h3>

              <p className="text-sm text-(--text-secondary) mt-1">
                {item.message}
              </p>

              <p className="text-xs text-(--text-muted) mt-2">
                {timeFormat(item.createdAt)}
              </p>
            </div>

            {/* ACTION */}
            <motion.div
              whileHover={{ x: 4 }}
              className="my-auto text-(--text-secondary)"
            >
              <IoIosArrowForward />
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StudentNotifications;