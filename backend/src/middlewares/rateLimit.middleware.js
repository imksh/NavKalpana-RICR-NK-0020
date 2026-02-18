import rateLimit from "express-rate-limit";

/* LOGIN */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* OTP / EMAIL */
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many OTP requests. Please wait.",
  },
});

/* CONTACT FORM */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many contact messages. Try again later.",
  },
});

/* NEWSLETTER SUBSCRIBE */
export const newsletterLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 2,
  message: {
    message: "You have already subscribed recently. Try again tomorrow.",
  },
});


/* TRACK */
export const trackLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 60, 
  message: {
    message: "Too many requests",
  },
});