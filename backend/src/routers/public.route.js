import express from "express";
import { subscribeNewsletter, unsubscribe } from '../controllers/newsletter.controller.js';
import { sendMessage } from '../controllers/message.controller.js';
import { trackVisitor } from '../controllers/public.controller.js';
import { contactLimiter, newsletterLimiter, trackLimiter } from "../middlewares/rateLimit.middleware.js";


const router = express.Router();

//Newsletter
router.post("/newsletter", newsletterLimiter, subscribeNewsletter);
router.get("/newsletter/unsubscribe", newsletterLimiter, unsubscribe);

//Message
router.post("/message", contactLimiter, sendMessage);

//Public
router.post("/track", trackLimiter, trackVisitor);

export default router;
