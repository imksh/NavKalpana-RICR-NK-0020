import { motion } from "framer-motion";
import { FiStar, FiSend, FiMessageCircle } from "react-icons/fi";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { realTutors, aiTutors } from "../../assets/data/tutor";

const StudentTutor = () => {
  const { user } = useAuthStore();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [question, setQuestion] = useState("");

  const handleAsk = () => {
    if (!question) return;
    console.log("Send question:", question);
    setQuestion("");
  };

  return (
    <div className="min-h-dvh bg-(--bg-main) text-(--text-primary) px-6 md:px-16 pt-32 pb-16">
      {/* PAGE TITLE */}
      <div className="mb-14">
        <h1 className="text-3xl font-semibold mb-3">Tutor Hub</h1>
        <p className="text-(--text-secondary)">
          Ask questions, book sessions, or chat with AI mentors instantly.
        </p>
      </div>

      {/* ================= AI TUTORS ================= */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold mb-8">🤖 AI Mentors</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiTutors.map((ai) => (
            <motion.div
              key={ai._id}
              whileHover={{ scale: 1.03 }}
              className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={ai.avatar}
                  alt={ai.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{ai.name}</h3>
                  <p className="text-sm text-(--text-secondary)">{ai.role}</p>
                </div>
              </div>

              <p className="text-sm text-(--text-secondary) mb-4">
                "{ai.welcomeMessage(user?.name || "Student")}"
              </p>

              {/* Suggested Prompts */}
              <div className="flex flex-wrap gap-2 mb-6">
                {ai.suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(prompt)}
                    className="px-3 py-1 text-xs bg-(--bg-muted) rounded-full hover:bg-(--color-primary) hover:text-white transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedTutor(ai)}
                className="mt-auto w-full py-2 bg-(--color-accent) text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
              >
                <FiMessageCircle />
                Start Chat
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= REAL TUTORS ================= */}
      <section>
        <h2 className="text-2xl font-semibold mb-8">👨‍🏫 Course Tutors</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
          {realTutors.map((tutor) => (
            <motion.div
              key={tutor._id}
              whileHover={{ y: -6 }}
              className="bg-(--card-bg) border border-(--border-color) p-6 rounded-3xl shadow-sm flex flex-col h-full transition-all duration-300"
            >
              {/* TOP SECTION */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="w-16 h-16 rounded-full object-cover border border-(--border-color)"
                />
                <div>
                  <h3 className="font-semibold text-lg">{tutor.name}</h3>
                  <p className="text-sm text-(--text-secondary)">
                    {tutor.specialization}
                  </p>
                </div>
              </div>

              {/* BIO */}
              <p className="text-sm text-(--text-secondary) mb-6 leading-relaxed">
                {tutor.bio}
              </p>

              {/* RATING + STATUS */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-1 text-(--color-warning)">
                  <FiStar />
                  <span className="text-sm font-medium">{tutor.rating}</span>
                </div>

                <span className="text-xs font-medium text-(--color-success)">
                  ● Online
                </span>
              </div>

              {/* BUTTONS — STICK TO BOTTOM */}
              <div className="mt-auto flex gap-3">
                <button className="flex-1 py-2 bg-(--color-primary) text-white rounded-xl hover:opacity-90 transition-all">
                  Ask Doubt
                </button>

                <button className="flex-1 py-2 border border-(--border-color) rounded-xl hover:bg-(--bg-muted) transition-all">
                  Book Session
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CHAT MODAL ================= */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-(--card-bg) w-[95%] md:w-[600px] p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Chat with {selectedTutor.name}
              </h3>
              <button onClick={() => setSelectedTutor(null)}>✕</button>
            </div>

            <div className="h-60 bg-(--bg-muted) rounded-xl mb-4 p-4 text-sm overflow-y-auto">
              <p className="text-(--text-secondary)">
                AI Chat will appear here...
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask your question..."
                className="flex-1 px-4 py-2 rounded-xl border border-(--border-color) bg-(--bg-surface)"
              />
              <button
                onClick={handleAsk}
                className="px-4 py-2 bg-(--color-accent) text-white rounded-xl"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTutor;
