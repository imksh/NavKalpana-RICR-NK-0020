import express from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import {
  pushTest,
  savePushSubscription,
  webPushUnsubscribe,
} from "../controllers/push.controller.js";

const router = express.Router();

router.post("/web-push-subscribe", protectedRoute, savePushSubscription);

router.post("/web-push-unsubscribe", protectedRoute, webPushUnsubscribe);

router.get("/push", protectedRoute, pushTest);

export default router;
