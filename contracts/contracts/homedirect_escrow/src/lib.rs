#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env};

mod logic;
mod storage;
mod types;

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), types::Error> {
        logic::initialize(&env, admin)
    }

    pub fn version(_env: Env) -> u32 {
        1
    }

    pub fn lock_deposit(
        env: Env,
        lease_id: soroban_sdk::String,
        tenant: Address,
        landlord: Address,
        amount: i128,
    ) -> Result<(), types::Error> {
        logic::lock_deposit(&env, lease_id, tenant, landlord, amount)
    }

    pub fn release_deposit(
        env: Env,
        lease_id: soroban_sdk::String,
        to_tenant: bool,
    ) -> Result<(), types::Error> {
        logic::release_deposit(&env, lease_id, to_tenant)
    }

    pub fn partial_release(
        env: Env,
        lease_id: soroban_sdk::String,
        amount: i128,
    ) -> Result<(), types::Error> {
        logic::partial_release(&env, lease_id, amount)
    }

    pub fn confiscate_deposit(
        env: Env,
        lease_id: soroban_sdk::String,
    ) -> Result<(), types::Error> {
        logic::confiscate_deposit(&env, lease_id)
    }

    pub fn get_deposit(
        env: Env,
        lease_id: soroban_sdk::String,
    ) -> Option<types::Deposit> {
        storage::get_deposit(&env, lease_id)
    }

    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), types::Error> {
        logic::set_admin(&env, new_admin)
    }
}

#[cfg(test)]
mod test;
