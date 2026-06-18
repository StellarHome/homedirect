import { Router, Request, Response } from "express";
import crypto from "crypto";

export const webhookRouter = Router();

/**
 * POST /api/v1/webhooks/paystack
 * Receives Paystack payment events and triggers on-chain actions.
 * Paystack signs each webhook with HMAC-SHA512 — we verify before acting.
 */
webhookRouter.post("/paystack", async (req: Request, res: Response) => {
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const { event, data } = req.body;

  switch (event) {
    case "charge.success":
      // TODO: on successful NGN payment for registration fee → activate listing
      // TODO: on successful NGN payment for 5% service fee → call create_lease on Stellar
      console.log("Payment success:", data.reference, data.amount);
      break;

    case "transfer.success":
      // TODO: landlord payout confirmed
      console.log("Transfer success:", data.reference);
      break;

    default:
      console.log("Unhandled Paystack event:", event);
  }

  // Always return 200 to Paystack to acknowledge receipt
  return res.status(200).json({ received: true });
});
