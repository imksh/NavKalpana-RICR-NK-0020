import React from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const _MotionRef = motion;

const EventCard = ({ upcommingEvents }) => {
  const { t } = useTranslation();
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {upcommingEvents.map((event) => {
        const start = new Date(event.startDate);
        const end = event.endDate ? new Date(event.endDate) : null;

        return (
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            key={event._id}
            className="bg-(--card-bg) border border-(--border-color) rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-(--text-primary)">
                {event.title}
              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full capitalize ${
                  event.eventType === "exam"
                    ? "bg-red-100 text-red-600"
                    : event.eventType === "assignment"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {event.eventType.replaceAll("_", " ")}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-(--text-secondary) mb-4">
              {event.description}
            </p>

            {/* Date Section */}
            <div className="text-xs text-(--text-muted)">
              📅 {start.toLocaleDateString()}
              {end && ` → ${end.toLocaleDateString()}`}
            </div>

            {/* Priority */}
            {event.priority === 1 && (
              <div className="mt-3 text-xs font-medium text-(--color-success)">
                {t("components.eventCard.highPriority")}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default EventCard;
