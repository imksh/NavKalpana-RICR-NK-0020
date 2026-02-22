import User from "../models/user.model.js";

export const updateLearningStreak = async (studentId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const user = await User.findById(studentId);

  const lastActive = user.learningStreak?.lastActiveDate
    ? new Date(user.learningStreak.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
  }

  // Already counted today
  if (lastActive && lastActive.getTime() === today.getTime()) {
    return;
  }

  let current = user.learningStreak?.current || 0;
  let longest = user.learningStreak?.longest || 0;

  if (lastActive) {
    const diff = (today - lastActive) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current += 1; // consecutive day
    } else {
      current = 1; // reset
    }
  } else {
    current = 1; // first activity
  }

  longest = Math.max(longest, current);

  user.learningStreak = {
    current,
    longest,
    lastActiveDate: today,
  };

  await user.save();
};