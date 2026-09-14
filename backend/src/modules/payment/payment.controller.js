import {
  createPaymentOrder,
  verifyPayment,
  savePayment,
  markPaymentAsFailed,
} from "./payment.service.js";

import { verifyRazorpaySignature } from "../../common/utils/verifyRazorpaySignature.js";
import { verifyRazorpayWebhookSignature } from "../../common/utils/verifyRazorpayWebhookSignature.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const receipt = `receipt_${Date.now()}`;

    const { order, payment } = await createPaymentOrder({
      amount,
      receipt,
    });

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      order,
      payment: {
        id: payment._id,
        orderId: payment.razorpayOrderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

export const verifyPaymentController = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required",
      });
    }

    const order = await verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    const isValid = verifyRazorpaySignature({
      orderId: order.orderId,
      paymentId: order.paymentId,
      signature: order.signature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    if (order.paymentStatus !== "captured" || order.orderStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment is not successfully captured",
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      });
    }

    const payment = await savePayment({
      razorpayOrderId: order.orderId,
      razorpayPaymentId: order.paymentId,
      amount: order.amount,
      currency: order.currency,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and saved successfully",
      payment: {
        id: payment._id,
        orderId: payment.razorpayOrderId,
        paymentId: payment.razorpayPaymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const failedPaymentController = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment failure details are required",
      });
    }

    const payment = await markPaymentAsFailed({
      razorpayOrderId,
      razorpayPaymentId,
    });

    return res.status(200).json({
      success: true,
      message: "Payment marked as failed",
      payment: {
        id: payment._id,
        orderId: payment.razorpayOrderId,
        paymentId: payment.razorpayPaymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("Failed payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
    });
  }
};

export const webhookController = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Webhook signature is missing",
      });
    }

    const rawBody = req.body;

    const isValid = verifyRazorpayWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const payload = JSON.parse(rawBody.toString());

    console.log("Razorpay Webhook Received:", payload);

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};
