const API_URL = import.meta.env.VITE_API_URL;

export const createPaymentOrder = async (amount) => {
  const response = await fetch(`${API_URL}/payment/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create payment order");
  }

  return response.json();
};

export const verifyPayment = async (paymentData) => {
  const response = await fetch(`${API_URL}/payment/verify-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error("Payment verification failed");
  }

  return response.json();
};

export const markPaymentAsFailed = async (paymentData) => {
  const response = await fetch(`${API_URL}/payment/payment-failed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error("Failed to update payment status");
  }

  return response.json();
};
