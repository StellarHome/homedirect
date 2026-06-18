import { Router, Request, Response } from "express";

export const propertyRouter = Router();

/** GET /api/v1/properties — list all properties (paginated) */
propertyRouter.get("/", async (_req: Request, res: Response) => {
  // TODO: query PostgreSQL properties table
  res.json({ properties: [], total: 0 });
});

/** POST /api/v1/properties — create a new property listing */
propertyRouter.post("/", async (req: Request, res: Response) => {
  // TODO: validate KYC status, persist to DB, trigger admin review queue
  res.status(201).json({ message: "Property listing created", id: "pending" });
});

/** GET /api/v1/properties/:id — get a single property */
propertyRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: fetch from DB + check on-chain lease status
  res.json({ id, status: "stub — not yet implemented" });
});
