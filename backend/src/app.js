import express from "express";
import cors from "cors";

import paymentRoutes from "./modules/payment/payment.routes.js";

const app = express();

app.use(cors());

app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Razorpay Payment App Backend is running 🚀",
  });
});

export default app;
