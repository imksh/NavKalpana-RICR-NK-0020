import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { useState } from "react";

const BookSessionModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    topic: "",
    date: "",
    time: "",
    instructor: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.topic || !form.date || !form.time) return;
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 flex items-center justify-center px-4 z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-(--card-bg) border border-(--border-color) w-full max-w-md p-6 rounded-3xl relative"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-(--bg-muted)"
          >
            <FiX size={18} />
          </button>

          <h2 className="text-xl font-semibold text-(--text-primary) mb-6 text-center">
            Book a Session
          </h2>

          <div className="space-y-4">

            {/* Topic */}
            <div>
              <label className="text-sm text-(--text-secondary)">
                Session Topic
              </label>
              <input
                type="text"
                name="topic"
                value={form.topic}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-main)"
                placeholder="React Doubts / Career Guidance"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm text-(--text-secondary)">
                Select Date
              </label>
              <div className="flex items-center gap-3 border border-(--border-color) bg-(--bg-main) p-3 rounded-xl mt-1">
                <FiCalendar className="text-(--text-muted)" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="text-sm text-(--text-secondary)">
                Select Time
              </label>
              <div className="flex items-center gap-3 border border-(--border-color) bg-(--bg-main) p-3 rounded-xl mt-1">
                <FiClock className="text-(--text-muted)" />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Instructor */}
            <div>
              <label className="text-sm text-(--text-secondary)">
                Instructor (Optional)
              </label>
              <div className="flex items-center gap-3 border border-(--border-color) bg-(--bg-main) p-3 rounded-xl mt-1">
                <FiUser className="text-(--text-muted)" />
                <input
                  type="text"
                  name="instructor"
                  value={form.instructor}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-transparent"
                  placeholder="Enter instructor name"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm text-(--text-secondary)">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                rows="3"
                value={form.notes}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl border border-(--border-color) bg-(--bg-main)"
                placeholder="Mention specific doubts..."
              />
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              className="w-full mt-4 py-3 rounded-xl bg-(--color-primary) text-white hover:opacity-90"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookSessionModal;