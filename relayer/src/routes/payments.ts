import { Router, Request, Response } from "express";
import { paystackService } from "../services/paystack";

export const paymentRouter = Router();

/**
 * POST /api/v1/payments/initialize
 * Initialize a payment transaction via Paystack
 */
paymentRouter.post("/initialize", async (req: Request, res: Response) => {
  try {
    const { email, amount, reference, metadata } = req.body;

    if (!email || !amount || !reference) {
      return res.status(400).json({ error: "Missing required fields: email, amount, reference" });
    }

    const result = await paystackService.initializePayment({
      email,
      amount,
      reference,
      metadata,
    });

    return res.status(200).json({
      success: true,
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/v1/payments/verify/:reference
 * Verify a payment transaction
 */
paymentRouter.get("/verify/:reference", async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    const result = await paystackService.verifyPayment({ reference });

    return res.json({
      success: true,
      status: result.data.status,
      amount: result.data.amount,
      paid_at: result.data.paid_at,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/v1/payments/banks
 * Get list of Nigerian banks
 */
paymentRouter.get("/banks", async (_req: Request, res: Response) => {
  try {
    const banks = await paystackService.getBanks();
    return res.json({ success: true, banks });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/payments/resolve-account
 * Resolve bank account number
 */
paymentRouter.post("/resolve-account", async (req: Request, res: Response) => {
  try {
    const { account_number, bank_code } = req.body;

    if (!account_number || !bank_code) {
      return res.status(400).json({ error: "Missing required fields: account_number, bank_code" });
    }

    const result = await paystackService.resolveAccountNumber(account_number, bank_code);

    return res.json({
      success: true,
      account_name: result.account_name,
      account_number: result.account_number,
      bank_id: result.bank_id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/payments/subaccount
 * Create a subaccount for a landlord
 */
paymentRouter.post("/subaccount", async (req: Request, res: Response) => {
  try {
    const { business_name, settlement_bank, account_number, percentage_charge } = req.body;

    if (!business_name || !settlement_bank || !account_number || !percentage_charge) {
      return res.status(400).json({ 
        error: "Missing required fields: business_name, settlement_bank, account_number, percentage_charge" 
      });
    }

    const result = await paystackService.createSubaccount({
      business_name,
      settlement_bank,
      account_number,
      percentage_charge,
    });

    return res.status(201).json({
      success: true,
      subaccount_code: result.data.subaccount_code,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/payments/transfer
 * Initiate a transfer to landlord
 */
paymentRouter.post("/transfer", async (req: Request, res: Response) => {
  try {
    const { amount, recipient, reference, reason } = req.body;

    if (!amount || !recipient || !reference) {
      return res.status(400).json({ error: "Missing required fields: amount, recipient, reference" });
    }

    const result = await paystackService.initiateTransfer({
      amount,
      recipient,
      reference,
      reason,
    });

    return res.status(200).json({
      success: true,
      transfer_code: result.data.transfer_code,
      status: result.data.status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/payments/recipient
 * Create a transfer recipient
 */
paymentRouter.post("/recipient", async (req: Request, res: Response) => {
  try {
    const { type, name, account_number, bank_code, currency } = req.body;

    if (!type || !name || !account_number || !bank_code) {
      return res.status(400).json({ error: "Missing required fields: type, name, account_number, bank_code" });
    }

    const result = await paystackService.createTransferRecipient({
      type,
      name,
      account_number,
      bank_code,
      currency,
    });

    return res.status(201).json({
      success: true,
      recipient_code: result.data.recipient_code,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});
