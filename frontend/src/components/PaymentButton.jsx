import {
  createPaymentOrder,
  verifyPayment,
  markPaymentAsFailed,
} from "../services/paymentApi";

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

        modal: {
          ondismiss: function () {
            console.log("Checkout dismissed by user");

            alert("Payment cancelled.");
          },
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

      razorpay.on("payment.failed", async function (response) {
        console.log("Payment Failed:", response);

        try {
          const paymentId = response.error.metadata.payment_id;
          const orderId = response.error.metadata.order_id;

          const failedPaymentResponse = await markPaymentAsFailed({
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
          });

          console.log("Failed Payment Saved:", failedPaymentResponse);

          alert("Payment failed. Please try again.");
        } catch (error) {
          console.error("Failed Payment Update Error:", error);

          alert("Payment failed. Please try again.");
        }
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return <button onClick={handlePayment}>Pay ₹500</button>;
}

export default PaymentButton;
