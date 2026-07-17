use soroban_sdk::{contracttype, contracterror, Address, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Version,
    Admin,
    Deposit(String), // lease_id -> deposit info
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    AlreadyInitialized = 1,
    Unauthorized = 2,
    DepositNotFound = 3,
    DepositAlreadyExists = 4,
    InvalidDepositStatus = 5,
    InsufficientBalance = 6,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DepositStatus {
    Locked,
    Released,
    PartiallyReleased,
    Confiscated,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Deposit {
    pub lease_id: String,
    pub tenant: Address,
    pub landlord: Address,
    pub amount: i128,
    pub status: DepositStatus,
    pub locked_timestamp: u64,
    pub release_timestamp: Option<u64>,
}
