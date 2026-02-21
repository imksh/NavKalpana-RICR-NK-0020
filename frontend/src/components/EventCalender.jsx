import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useRef, useEffect } from "react";

const EventCalendar = ({ events = [] }) => {
  const [value, setValue] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const containerRef = useRef(null);

  const isEventDate = (date) => {
    return events.some(
      (event) =>
        new Date(event.startDate).toDateString() === date.toDateString(),
    );
  };

  const selectedEvents = events.filter(
    (event) =>
      new Date(event.startDate).toDateString() === value.toDateString(),
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-(--card-bg) border border-(--border-color) sm:p-6 rounded-2xl "
    >
      <Calendar
        onChange={(date) => {
          setValue(date);
          setShowPopup(true);
        }}
        value={value}
        tileContent={({ date }) =>
          isEventDate(date) ? (
            <div className="flex justify-center mt-1 !rounded-2xl">
              <div className="hidden md:block w-2 h-2 bg-(--color-primary) rounded-full"></div>
            </div>
          ) : null
        }
        tileClassName={({ date }) =>
          isEventDate(date)
            ? "text-(--color-primary) font-semibold hover:!bg-(--color-success) rounded-2xl"
            : "hover:!bg-(--color-success) rounded-2xl"
        }
        className="!bg-(--bg-main) !border-none !w-full !rounded-2xl p-2 sm:p-4"
      />

      {/* Small Absolute Popup */}
      {showPopup && selectedEvents.length > 0 && (
        <div className="absolute top-24 right-6 w-72 bg-(--card-bg) border border-(--border-color) rounded-xl shadow-xl p-4 z-50">
          <h4 className="font-semibold mb-3 text-sm">{value.toDateString()}</h4>

          {selectedEvents.map((event) => (
            <div key={event._id} className="mb-3 last:mb-0">
              <p className="text-[10px] text-(--text-secondary) bg-(--bg-main) w-fit px-2 py-0.5 rounded-2xl float-end">
                {event.eventType}
              </p>
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-xs text-(--text-secondary)">
                {event.description}
              </p>
              {event.endDate && (
                <p className="text-xs text-(--text-secondary)">
                  Ends on: {new Date(event.endDate).toLocaleDateString()}
                </p>
              )}

              {!event.isActive && (
                <p className="text-xs text-(--text-error)">
                  This event has ended.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;