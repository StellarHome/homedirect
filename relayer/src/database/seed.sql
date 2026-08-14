-- HomeDirect Seed Data
-- Sample data for development and testing

-- Sample Users
INSERT INTO users (stellar_public_key, email, phone, first_name, last_name, role, kyc_verified, kyc_verified_at, kyc_method, bvn, nin) VALUES
('GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K', 'landlord1@example.com', '+2348012345678', 'John', 'Doe', 'landlord', true, NOW(), 'both', '12345678901', '98765432101'),
('GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K', 'tenant1@example.com', '+2348023456789', 'Jane', 'Smith', 'tenant', true, NOW(), 'bvn', '22345678901', NULL),
('GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K', 'admin@example.com', '+2348034567890', 'Admin', 'User', 'admin', true, NOW(), 'bvn', '32345678901', NULL)
ON CONFLICT (stellar_public_key) DO NOTHING;

-- Sample Properties (using the landlord user ID from above)
INSERT INTO properties (landlord_id, title, description, property_type, bedrooms, bathrooms, address, city, state, lga, monthly_rent_ngn, monthly_rent_usdc, security_deposit_ngn, security_deposit_usdc, status, images, amenities, utilities_included, furnished, available_from, minimum_lease_months) VALUES
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'Modern 2-Bedroom Apartment in Lekki',
  'Spacious apartment with modern amenities, close to the expressway',
  'apartment',
  2,
  2,
  '123 Lekki Expressway, Phase 1',
  'Lekki',
  'Lagos',
  'Eti-Osa',
  250000.00,
  150.00,
  500000.00,
  300.00,
  'active',
  '["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'::jsonb,
  '["AC", "Gym", "Parking", "Security", "Generator"]'::jsonb,
  true,
  true,
  '2024-03-01',
  12
),
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'Spacious 3-Bedroom House in Ikeja',
  'Beautiful family home with garden and parking',
  'house',
  3,
  3,
  '45 Admiralty Way, Ikeja GRA',
  'Ikeja',
  'Lagos',
  'Ikeja',
  450000.00,
  270.00,
  900000.00,
  540.00,
  'active',
  '["https://example.com/image3.jpg", "https://example.com/image4.jpg"]'::jsonb,
  '["AC", "Garden", "Parking", "Security", "Generator", "Water Tank"]'::jsonb,
  false,
  false,
  '2024-04-01',
  12
),
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'Cozy 1-Bedroom Studio in Yaba',
  'Perfect for young professionals, close to universities',
  'studio',
  1,
  1,
  '78 Herbert Macaulay Way, Yaba',
  'Yaba',
  'Lagos',
  'Yaba',
  180000.00,
  108.00,
  360000.00,
  216.00,
  'pending',
  '["https://example.com/image5.jpg"]'::jsonb,
  '["AC", "Security"]'::jsonb,
  false,
  false,
  '2024-05-01',
  6
)
ON CONFLICT DO NOTHING;

-- Sample Applications
INSERT INTO applications (property_id, tenant_id, status, message, proposed_move_in_date, proposed_lease_months, monthly_rent_offer_ngn) VALUES
(
  (SELECT id FROM properties WHERE title = 'Modern 2-Bedroom Apartment in Lekki' LIMIT 1),
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'approved',
  'I am interested in this property. I am a working professional with good credit.',
  '2024-03-15',
  12,
  250000.00
),
(
  (SELECT id FROM properties WHERE title = 'Spacious 3-Bedroom House in Ikeja' LIMIT 1),
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'pending',
  'Looking for a family home. Can move in immediately.',
  '2024-04-01',
  12,
  440000.00
)
ON CONFLICT (property_id, tenant_id) DO NOTHING;

-- Sample Leases
INSERT INTO leases (property_id, landlord_id, tenant_id, lease_id_on_chain, monthly_rent_ngn, monthly_rent_usdc, security_deposit_ngn, security_deposit_usdc, duration_months, start_date, end_date, status, platform_fee_collected, platform_fee_amount, platform_fee_collected_at, smart_contract_address) VALUES
(
  (SELECT id FROM properties WHERE title = 'Modern 2-Bedroom Apartment in Lekki' LIMIT 1),
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'LEASE_1234567890ABCDEF',
  250000.00,
  150.00,
  500000.00,
  300.00,
  12,
  '2024-03-01',
  '2025-02-28',
  'active',
  true,
  150000.00,
  NOW(),
  'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
)
ON CONFLICT (lease_id_on_chain) DO NOTHING;

-- Sample Rent Payments
INSERT INTO rent_payments (lease_id, tenant_id, amount_ngn, amount_usdc, payment_method, payment_reference, transaction_hash, status, due_date, paid_date, month_number) VALUES
(
  (SELECT id FROM leases WHERE lease_id_on_chain = 'LEASE_1234567890ABCDEF'),
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  250000.00,
  150.00,
  'paystack',
  'PAYSTACK_REF_123456',
  NULL,
  'completed',
  '2024-03-01',
  '2024-03-01',
  1
)
ON CONFLICT (payment_reference) DO NOTHING;

-- Sample Security Deposits
INSERT INTO security_deposits (lease_id, tenant_id, landlord_id, amount_ngn, amount_usdc, deposit_id_on_chain, status, locked_at, smart_contract_address) VALUES
(
  (SELECT id FROM leases WHERE lease_id_on_chain = 'LEASE_1234567890ABCDEF'),
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  500000.00,
  300.00,
  'DEPOSIT_0987654321FEDCBA',
  'locked',
  NOW(),
  'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
)
ON CONFLICT (deposit_id_on_chain) DO NOTHING;

-- Sample KYC Verifications
INSERT INTO kyc_verifications (user_id, verification_type, verification_data, status, verified_at, verification_reference) VALUES
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'bvn',
  '{"bvn": "12345678901", "firstName": "John", "lastName": "Doe", "dateOfBirth": "1990-01-01"}'::jsonb,
  'verified',
  NOW(),
  'DOJAH_BVN_REF_12345'
),
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'nin',
  '{"nin": "98765432101", "firstName": "John", "lastName": "Doe", "gender": "Male"}'::jsonb,
  'verified',
  NOW(),
  'DOJAH_NIN_REF_12345'
),
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'bvn',
  '{"bvn": "22345678901", "firstName": "Jane", "lastName": "Smith", "dateOfBirth": "1995-05-15"}'::jsonb,
  'verified',
  NOW(),
  'DOJAH_BVN_REF_67890'
)
ON CONFLICT DO NOTHING;

-- Sample Notifications
INSERT INTO notifications (user_id, type, title, message, data, read) VALUES
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'application_received',
  'New Application Received',
  'You have a new application for your property: Modern 2-Bedroom Apartment in Lekki',
  '{"property_id": "1", "tenant_id": "2"}'::jsonb,
  false
),
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'application_approved',
  'Application Approved',
  'Your application for Modern 2-Bedroom Apartment in Lekki has been approved!',
  '{"property_id": "1", "lease_id": "1"}'::jsonb,
  false
),
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'rent_due',
  'Rent Payment Due',
  'Your rent payment of ₦250,000 is due for March 2024',
  '{"lease_id": "1", "amount": 250000, "due_date": "2024-03-01"}'::jsonb,
  true
)
ON CONFLICT DO NOTHING;

-- Sample Audit Logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) VALUES
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'create_property',
  'property',
  (SELECT id FROM properties WHERE title = 'Modern 2-Bedroom Apartment in Lekki' LIMIT 1),
  NULL,
  '{"title": "Modern 2-Bedroom Apartment in Lekki", "monthly_rent_ngn": 250000}'::jsonb,
  '192.168.1.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
),
(
  (SELECT id FROM users WHERE stellar_public_key = 'GD5I7U6J7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K7K'),
  'create_application',
  'application',
  (SELECT id FROM applications WHERE property_id = (SELECT id FROM properties WHERE title = 'Modern 2-Bedroom Apartment in Lekki' LIMIT 1) LIMIT 1),
  NULL,
  '{"status": "pending", "monthly_rent_offer_ngn": 250000}'::jsonb,
  '192.168.1.2',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
)
ON CONFLICT DO NOTHING;
