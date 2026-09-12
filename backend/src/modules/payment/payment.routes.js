import express from "express";
import { createOrder, verifyPaymentController } from "./payment.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);

router.post("/verify-payment", verifyPaymentController);

export default router;
