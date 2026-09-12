import { createPaymentOrder, verifyPayment } from "../services/paymentApi";

function PaymentButton() {
  const handlePayment = async () => {
    try {
      const data = await createPaymentOrder(50000);

      console.log("Created Razorpay Order:", data.order);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.order.amount,
        currency: data.order.currency,

        name: "My MERN Store",
        description: "Test Payment",

        order_id: data.order.id,

        handler: async function (response) {
          try {
            console.log("Payment Response:", response);

            const verificationResponse = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            console.log("Payment Verification:", verificationResponse);

            if (verificationResponse.success) {
              alert("Payment verified successfully! 🎉");
            }
          } catch (error) {
            console.error("Payment Verification Error:", error);

            alert("Payment verification failed!");
          }
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return <button onClick={handlePayment}>Pay ₹500</button>;
}

export default PaymentButton;
