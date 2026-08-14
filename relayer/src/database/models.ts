// Database models and interfaces for HomeDirect

export interface User {
  id: string;
  stellar_public_key: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  role: 'landlord' | 'tenant' | 'admin';
  password_hash?: string;
  kyc_verified: boolean;
  kyc_verified_at?: Date;
  kyc_method?: 'bvn' | 'nin' | 'both';
  bvn?: string;
  nin?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Property {
  id: string;
  landlord_id: string;
  title: string;
  description?: string;
  property_type: 'apartment' | 'house' | 'flat' | 'studio';
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  state: string;
  lga?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  monthly_rent_ngn: number;
  monthly_rent_usdc?: number;
  security_deposit_ngn?: number;
  security_deposit_usdc?: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | 'rented';
  images?: string[];
  amenities?: string[];
  utilities_included: boolean;
  furnished: boolean;
  available_from?: Date;
  minimum_lease_months: number;
  created_at: Date;
  updated_at: Date;
}

export interface Application {
  id: string;
  property_id: string;
  tenant_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  message?: string;
  proposed_move_in_date?: Date;
  proposed_lease_months?: number;
  monthly_rent_offer_ngn?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Lease {
  id: string;
  property_id: string;
  landlord_id: string;
  tenant_id: string;
  lease_id_on_chain?: string;
  monthly_rent_ngn: number;
  monthly_rent_usdc?: number;
  security_deposit_ngn?: number;
  security_deposit_usdc?: number;
  duration_months: number;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'completed' | 'terminated' | 'disputed';
  platform_fee_collected: boolean;
  platform_fee_amount?: number;
  platform_fee_collected_at?: Date;
  smart_contract_address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RentPayment {
  id: string;
  lease_id: string;
  tenant_id: string;
  amount_ngn?: number;
  amount_usdc?: number;
  payment_method: 'paystack' | 'stellar' | 'bank_transfer';
  payment_reference?: string;
  transaction_hash?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  due_date: Date;
  paid_date?: Date;
  month_number: number;
  created_at: Date;
  updated_at: Date;
}

export interface SecurityDeposit {
  id: string;
  lease_id: string;
  tenant_id: string;
  landlord_id: string;
  amount_ngn?: number;
  amount_usdc?: number;
  deposit_id_on_chain?: string;
  status: 'locked' | 'released' | 'partially_released' | 'confiscated';
  locked_at: Date;
  released_at?: Date;
  release_amount?: number;
  release_reason?: string;
  smart_contract_address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Dispute {
  id: string;
  lease_id: string;
  raised_by: string;
  dispute_type: 'deposit' | 'payment' | 'property_condition' | 'other';
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  resolution?: string;
  resolved_by?: string;
  resolved_at?: Date;
  evidence?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  lease_id?: string;
  type: 'rent' | 'deposit' | 'platform_fee' | 'withdrawal';
  amount_ngn?: number;
  amount_usdc?: number;
  payment_method: 'paystack' | 'stellar';
  payment_reference?: string;
  transaction_hash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface KYCVerification {
  id: string;
  user_id: string;
  verification_type: 'bvn' | 'nin' | 'face' | 'phone';
  verification_data: Record<string, any>;
  status: 'pending' | 'verified' | 'failed';
  verified_at?: Date;
  verification_reference?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  read_at?: Date;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// Database connection pool configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

// Query result types
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Filter types
export interface PropertyFilters {
  city?: string;
  state?: string;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_rent?: number;
  max_rent?: number;
  property_type?: string;
  status?: string;
  furnished?: boolean;
  utilities_included?: boolean;
}

export interface LeaseFilters {
  landlord_id?: string;
  tenant_id?: string;
  property_id?: string;
  status?: string;
  start_date_from?: Date;
  start_date_to?: Date;
}
