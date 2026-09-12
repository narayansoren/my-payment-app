import {
  createPaymentOrder,
  verifyPayment,
  savePayment,
} from "./payment.service.js";

import { verifyRazorpaySignature } from "../../common/utils/verifyRazorpaySignature.js";

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

    const order = await createPaymentOrder({
      amount,
      receipt,
    });

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      order,
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
