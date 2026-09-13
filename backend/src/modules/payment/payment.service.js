import razorpay from "../../common/config/razorpay.js";
import Payment from "./payment.model.js";

export const createPaymentOrder = async ({ amount, receipt }) => {
  const options = {
    amount,
    currency: "INR",
    receipt,
  };

  const order = await razorpay.orders.create(options);

  const payment = await Payment.create({
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
    status: "created",
  });

  return {
    order,
    payment,
  };
};

export const verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const order = await razorpay.orders.fetch(razorpayOrderId);

  const payment = await razorpay.payments.fetch(razorpayPaymentId);

  return {
    orderId: order.id,
    orderStatus: order.status,

    paymentId: payment.id,
    paymentStatus: payment.status,
    paymentCaptured: payment.captured,

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
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      amount,
      currency,
      status: "paid",
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!payment) {
    throw new Error("Payment record not found");
  }

  return payment;
};

export const markPaymentAsFailed = async ({
  razorpayOrderId,
  razorpayPaymentId,
}) => {
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      status: "failed",
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!payment) {
    throw new Error("Payment record not found");
  }

  return payment;
};
