import { Router, Request, Response } from "express";
import { authenticate, authorize } from "../auth/middleware";
import { query } from "../database/connection";

export const propertyRouter = Router();

/** GET /api/v1/properties — list all properties (paginated) */
propertyRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', city, state, property_type, status } = req.query;

    const offset = (Number.parseInt(page as string) - 1) * Number.parseInt(limit as string);
    const limitNum = Number.parseInt(limit as string);

    let whereClause = '';
    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      whereClause += ` AND city = $${paramIndex}`;
      params.push(city);
      paramIndex++;
    }

    if (state) {
      whereClause += ` AND state = $${paramIndex}`;
      params.push(state);
      paramIndex++;
    }

    if (property_type) {
      whereClause += ` AND property_type = $${paramIndex}`;
      params.push(property_type);
      paramIndex++;
    }

    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM properties WHERE 1=1${whereClause}`,
      params
    );
    const total = Number.parseInt(countResult.rows[0].total, 10);

    // Get properties
    params.push(limitNum, offset);
    const result = await query(
      `SELECT id, title, description, property_type, bedrooms, bathrooms, address, city, state,
              monthly_rent_ngn, monthly_rent_usdc, security_deposit_ngn, security_deposit_usdc,
              status, images, amenities, utilities_included, furnished, available_from,
              minimum_lease_months, created_at
       FROM properties
       WHERE 1=1${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    res.json({
      properties: result.rows,
      total,
      page: Number.parseInt(page as string),
      limit: limitNum,
      hasMore: offset + limitNum < total,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

/** POST /api/v1/properties — create a new property listing */
propertyRouter.post("/", authenticate, authorize('landlord', 'admin'), async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      property_type,
      bedrooms,
      bathrooms,
      address,
      city,
      state,
      lga,
      postal_code,
      latitude,
      longitude,
      monthly_rent_ngn,
      monthly_rent_usdc,
      security_deposit_ngn,
      security_deposit_usdc,
      images,
      amenities,
      utilities_included,
      furnished,
      available_from,
      minimum_lease_months,
    } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Validate required fields
    if (!title || !property_type || !bedrooms || !bathrooms || !address || !city || !state || !monthly_rent_ngn) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Insert property
    const result = await query(
      `INSERT INTO properties (landlord_id, title, description, property_type, bedrooms, bathrooms,
                              address, city, state, lga, postal_code, latitude, longitude,
                              monthly_rent_ngn, monthly_rent_usdc, security_deposit_ngn, security_deposit_usdc,
                              status, images, amenities, utilities_included, furnished, available_from, minimum_lease_months)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
       RETURNING *`,
      [
        req.user.userId,
        title,
        description || null,
        property_type,
        bedrooms,
        bathrooms,
        address,
        city,
        state,
        lga || null,
        postal_code || null,
        latitude || null,
        longitude || null,
        monthly_rent_ngn,
        monthly_rent_usdc || null,
        security_deposit_ngn || null,
        security_deposit_usdc || null,
        'pending',
        images || null,
        amenities || null,
        utilities_included || false,
        furnished || false,
        available_from || null,
        minimum_lease_months || 12,
      ]
    );

    res.status(201).json({ property: result.rows[0] });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

/** GET /api/v1/properties/:id — get a single property */
propertyRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT p.*, u.first_name, u.last_name, u.stellar_public_key as landlord_public_key
       FROM properties p
       JOIN users u ON p.landlord_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    res.json({ property: result.rows[0] });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

/** PUT /api/v1/properties/:id — update a property */
propertyRouter.put("/:id", authenticate, authorize('landlord', 'admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check if user owns the property
    const existing = await query(
      'SELECT landlord_id FROM properties WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    if (existing.rows[0].landlord_id !== req.user.userId && req.user.role !== 'admin') {
      res.status(403).json({ error: 'You do not own this property' });
      return;
    }

    // Update property
    const {
      title,
      description,
      property_type,
      bedrooms,
      bathrooms,
      address,
      city,
      state,
      lga,
      postal_code,
      latitude,
      longitude,
      monthly_rent_ngn,
      monthly_rent_usdc,
      security_deposit_ngn,
      security_deposit_usdc,
      images,
      amenities,
      utilities_included,
      furnished,
      available_from,
      minimum_lease_months,
      status,
    } = req.body;

    const result = await query(
      `UPDATE properties
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           property_type = COALESCE($4, property_type),
           bedrooms = COALESCE($5, bedrooms),
           bathrooms = COALESCE($6, bathrooms),
           address = COALESCE($7, address),
           city = COALESCE($8, city),
           state = COALESCE($9, state),
           lga = COALESCE($10, lga),
           postal_code = COALESCE($11, postal_code),
           latitude = COALESCE($12, latitude),
           longitude = COALESCE($13, longitude),
           monthly_rent_ngn = COALESCE($14, monthly_rent_ngn),
           monthly_rent_usdc = COALESCE($15, monthly_rent_usdc),
           security_deposit_ngn = COALESCE($16, security_deposit_ngn),
           security_deposit_usdc = COALESCE($17, security_deposit_usdc),
           images = COALESCE($18, images),
           amenities = COALESCE($19, amenities),
           utilities_included = COALESCE($20, utilities_included),
           furnished = COALESCE($21, furnished),
           available_from = COALESCE($22, available_from),
           minimum_lease_months = COALESCE($23, minimum_lease_months),
           status = COALESCE($24, status)
       WHERE id = $1
       RETURNING *`,
      [
        id,
        title,
        description,
        property_type,
        bedrooms,
        bathrooms,
        address,
        city,
        state,
        lga,
        postal_code,
        latitude,
        longitude,
        monthly_rent_ngn,
        monthly_rent_usdc,
        security_deposit_ngn,
        security_deposit_usdc,
        images,
        amenities,
        utilities_included,
        furnished,
        available_from,
        minimum_lease_months,
        status,
      ]
    );

    res.json({ property: result.rows[0] });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

/** DELETE /api/v1/properties/:id — delete a property */
propertyRouter.delete("/:id", authenticate, authorize('landlord', 'admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Check if user owns the property
    const existing = await query(
      'SELECT landlord_id FROM properties WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    if (existing.rows[0].landlord_id !== req.user.userId && req.user.role !== 'admin') {
      res.status(403).json({ error: 'You do not own this property' });
      return;
    }

    await query('DELETE FROM properties WHERE id = $1', [id]);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});
