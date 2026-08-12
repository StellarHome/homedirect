import { Router, Request, Response } from "express";
import { dojahService } from "../services/dojah";

export const kycRouter = Router();

/**
 * POST /api/v1/kyc/bvn
 * Verify BVN (Bank Verification Number)
 */
kycRouter.post("/bvn", async (req: Request, res: Response) => {
  try {
    const { bvn } = req.body;

    if (!bvn) {
      return res.status(400).json({ error: "Missing required field: bvn" });
    }

    const result = await dojahService.verifyBVN({ bvn });

    return res.json({
      success: true,
      status: result.status,
      data: result.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/kyc/nin
 * Verify NIN (National Identity Number)
 */
kycRouter.post("/nin", async (req: Request, res: Response) => {
  try {
    const { nin } = req.body;

    if (!nin) {
      return res.status(400).json({ error: "Missing required field: nin" });
    }

    const result = await dojahService.verifyNIN({ nin });

    return res.json({
      success: true,
      status: result.status,
      data: result.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/v1/kyc/bvn/:bvn
 * Get BVN details
 */
kycRouter.get("/bvn/:bvn", async (req: Request, res: Response) => {
  try {
    const { bvn } = req.params;

    const result = await dojahService.getBVNDetails(bvn);

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/v1/kyc/nin/:nin
 * Get NIN details
 */
kycRouter.get("/nin/:nin", async (req: Request, res: Response) => {
  try {
    const { nin } = req.params;

    const result = await dojahService.getNINDetails(nin);

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/kyc/face
 * Perform face verification
 */
kycRouter.post("/face", async (req: Request, res: Response) => {
  try {
    const { image, reference_id } = req.body;

    if (!image || !reference_id) {
      return res.status(400).json({ error: "Missing required fields: image, reference_id" });
    }

    const result = await dojahService.verifyFace(image, reference_id);

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/kyc/phone
 * Verify phone number
 */
kycRouter.post("/phone", async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Missing required field: phone" });
    }

    const result = await dojahService.verifyPhone(phone);

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/v1/kyc/credit/:bvn
 * Get credit bureau report
 */
kycRouter.get("/credit/:bvn", async (req: Request, res: Response) => {
  try {
    const { bvn } = req.params;

    const result = await dojahService.getCreditReport(bvn);

    return res.json({
      success: true,
      data: result.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * POST /api/v1/kyc/verify
 * Create a comprehensive KYC verification request
 */
kycRouter.post("/verify", async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, dob, phone, bvn, nin } = req.body;

    if (!first_name || !last_name || !dob || !phone) {
      return res.status(400).json({ 
        error: "Missing required fields: first_name, last_name, dob, phone" 
      });
    }

    const result = await dojahService.createKYCRequest({
      first_name,
      last_name,
      dob,
      phone,
      bvn,
      nin,
    });

    return res.status(201).json({
      success: true,
      request_id: result.data.request_id,
      status: result.data.status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

/**
 * GET /api/v1/kyc/status/:requestId
 * Get KYC verification request status
 */
kycRouter.get("/status/:requestId", async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const result = await dojahService.getKYCStatus(requestId);

    return res.json({
      success: true,
      status: result.data.status,
      data: result.data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});
