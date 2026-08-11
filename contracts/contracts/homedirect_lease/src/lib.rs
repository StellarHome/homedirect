#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env};

mod logic;
mod storage;
mod types;

#[contract]
pub struct LeaseContract;

#[contractimpl]
impl LeaseContract {
    pub fn initialize(env: Env, admin: Address) -> Result<(), types::Error> {
        logic::initialize(&env, admin)
    }

    pub fn version(_env: Env) -> u32 {
        1
    }

    pub fn set_admin(env: Env, new_admin: Address) -> Result<(), types::Error> {
        logic::set_admin(&env, new_admin)
    }

    pub fn set_token_config(env: Env, usdc_token: Address, platform_wallet: Address) -> Result<(), types::Error> {
        logic::set_token_config(&env, usdc_token, platform_wallet)
    }

    pub fn create_lease(
        env: Env,
        landlord: Address,
        tenant: Address,
        property_id: soroban_sdk::String,
        monthly_rent: i128,
        security_deposit: i128,
        duration_months: u32,
    ) -> Result<soroban_sdk::String, types::Error> {
        logic::create_lease(&env, landlord, tenant, property_id, monthly_rent, security_deposit, duration_months)
    }

    pub fn pay_rent(
        env: Env,
        lease_id: soroban_sdk::String,
        amount: i128,
        payer: Address,
    ) -> Result<(), types::Error> {
        logic::pay_rent(&env, lease_id, amount, payer)
    }

    pub fn release_deposit(
        env: Env,
        lease_id: soroban_sdk::String,
        to_tenant: bool,
    ) -> Result<(), types::Error> {
        logic::release_deposit(&env, lease_id, to_tenant)
    }

    pub fn raise_dispute(
        env: Env,
        lease_id: soroban_sdk::String,
        party: Address,
    ) -> Result<(), types::Error> {
        logic::raise_dispute(&env, lease_id, party)
    }

    pub fn resolve_dispute(
        env: Env,
        lease_id: soroban_sdk::String,
        winner: Address,
    ) -> Result<(), types::Error> {
        logic::resolve_dispute(&env, lease_id, winner)
    }

    pub fn get_lease(
        env: Env,
        lease_id: soroban_sdk::String,
    ) -> Option<types::Lease> {
        storage::get_lease(&env, lease_id)
    }

    pub fn get_lease_by_property(
        env: Env,
        property_id: soroban_sdk::String,
    ) -> Option<soroban_sdk::String> {
        storage::get_lease_by_property(&env, property_id)
    }

    pub fn collect_platform_fee(
        env: Env,
        lease_id: soroban_sdk::String,
    ) -> Result<(), types::Error> {
        logic::collect_platform_fee(&env, lease_id)
    }
}

#[cfg(test)]
mod test;
