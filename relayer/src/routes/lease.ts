import { Router, Request, Response } from "express";
import { stellarService } from "../services/stellar";

export const leaseRouter = Router();

/**
 * POST /api/v1/leases
 * Create a new on-chain lease after landlord accepts a tenant
 */
leaseRouter.post("/", async (req: Request, res: Response) => {
  try {
    const {
      landlordAddress,
      tenantSecret,
      propertyId,
      monthlyRentUsdc,
      securityDepositUsdc,
      durationMonths,
    } = req.body;

    if (!landlordAddress || !tenantSecret || !propertyId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await stellarService.createLease({
      landlordAddress,
      tenantSecret,
      propertyId,
      monthlyRentUsdc,
      securityDepositUsdc,
      durationMonths,
    });

    return res.status(201).json({
      success: true,
      txHash: result.hash,
      status: result.status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/leases/:propertyId/pay
 * Pay monthly rent for an active lease
 */
leaseRouter.post("/:propertyId/pay", async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    const { tenantSecret } = req.body;

    const result = await stellarService.payRent({ propertyId, tenantSecret });

    return res.json({ success: true, txHash: result.hash });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/v1/leases/:propertyId
 * Fetch lease data from the Stellar ledger
 */
leaseRouter.get("/:propertyId", async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    const lease = await stellarService.getLease(propertyId);

    if (!lease) {
      return res.status(404).json({ error: "Lease not found on chain" });
    }

    return res.json({ lease });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});
