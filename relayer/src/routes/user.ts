import { Router, Request, Response } from "express";
import { stellarService } from "../services/stellar";

export const userRouter = Router();

/** POST /api/v1/users/register — register a new user + create Stellar wallet */
userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body; // role: "landlord" | "tenant"
    if (!email || !role) {
      return res.status(400).json({ error: "email and role are required" });
    }
    // Create custodial Stellar wallet
    const wallet = await stellarService.createWallet();
    // TODO: persist user + wallet public key to DB (NEVER store secret in DB — use KMS)
    return res.status(201).json({
      message: "User registered",
      stellarPublicKey: wallet.publicKey,
      // secret returned once — user must save it. In production: use KMS or passkey
      stellarSecret: wallet.secret,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/** POST /api/v1/users/kyc — submit KYC documents for verification */
userRouter.post("/kyc", async (_req: Request, res: Response) => {
  // TODO: integrate Dojah NIN/BVN verification API
  res.json({ status: "pending", message: "KYC verification stub — Dojah integration coming" });
});
