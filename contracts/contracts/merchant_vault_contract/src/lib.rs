#![no_std]

use soroban_sdk::{contract, contractimpl, Env, Address};

mod logic;
mod storage;
mod types;

#[contract]
pub struct MerchantVaultContract;

#[contractimpl]
impl MerchantVaultContract {
    pub fn initialize(env: Env, admin: Address) {
        logic::initialize(&env, admin);
    }

    pub fn deposit(env: Env, merchant: Address, amount: i128) -> Result<(), crate::types::Error> {
        logic::deposit(&env, merchant, amount)
    }

    pub fn get_merchant_balance(env: Env, merchant: Address) -> i128 {
        storage::get_merchant_record(&env, &merchant)
            .map(|r| r.usdc_balance)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
