import express from "express";
import {
  createOrder,
  verifyPaymentController,
  failedPaymentController,
  webhookController,
} from "./payment.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);

router.post("/verify-payment", verifyPaymentController);

router.post("/payment-failed", failedPaymentController);

router.post("/webhook", webhookController);

export default router;
