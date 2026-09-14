import crypto from "crypto";

export const verifyRazorpayWebhookSignature = ({ rawBody, signature }) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedSignature);
  const signatureBuffer = Buffer.from(signature);

  if (generatedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(generatedBuffer, signatureBuffer);
};
