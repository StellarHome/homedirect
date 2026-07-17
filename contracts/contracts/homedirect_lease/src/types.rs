use soroban_sdk::{contracttype, contracterror, Address, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Version,
    Admin,
    Lease(String),
    PropertyLease(String), // property_id -> lease_id mapping
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    AlreadyInitialized = 1,
    Unauthorized = 2,
    LeaseNotFound = 3,
    LeaseAlreadyExists = 4,
    InvalidLeaseStatus = 5,
    InsufficientPayment = 6,
    PropertyAlreadyLeased = 7,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LeaseStatus {
    Active,
    Completed,
    Disputed,
    Terminated,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Lease {
    pub lease_id: String,
    pub property_id: String,
    pub landlord: Address,
    pub tenant: Address,
    pub monthly_rent: i128,
    pub security_deposit: i128,
    pub duration_months: u32,
    pub start_timestamp: u64,
    pub end_timestamp: u64,
    pub status: LeaseStatus,
    pub rent_paid_months: u32,
    pub platform_fee_collected: bool,
}
