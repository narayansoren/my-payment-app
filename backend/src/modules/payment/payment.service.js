import razorpay from "../../common/config/razorpay.js";
import Payment from "./payment.model.js";

export const createPaymentOrder = async ({ amount, receipt }) => {
  const options = {
    amount,
    currency: "INR",
    receipt,
  };

  const order = await razorpay.orders.create(options);

  return order;
};

export const verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const order = await razorpay.orders.fetch(razorpayOrderId);

  return {
    orderId: order.id,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
    amount: order.amount,
    currency: order.currency,
  };
};

export const savePayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  amount,
  currency,
}) => {
  const existingPayment = await Payment.findOne({
    razorpayPaymentId,
  });

  if (existingPayment) {
    return existingPayment;
  }

  const payment = await Payment.create({
    razorpayOrderId,
    razorpayPaymentId,
    amount,
    currency,
    status: "paid",
  });

  return payment;
};
