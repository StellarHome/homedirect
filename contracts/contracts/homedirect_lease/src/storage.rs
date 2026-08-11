use soroban_sdk::{Env, String, Address};

use crate::types::{DataKey, Lease};

pub fn get_version(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get::<DataKey, u32>(&DataKey::Version)
        .unwrap_or(0)
}

pub fn set_version(env: &Env, version: u32) {
    env.storage()
        .instance()
        .set::<DataKey, u32>(&DataKey::Version, &version);
}

pub fn set_admin(env: &Env, admin: Address) {
    env.storage()
        .instance()
        .set::<DataKey, Address>(&DataKey::Admin, &admin);
}

pub fn get_admin(env: &Env) -> Option<Address> {
    env.storage()
        .instance()
        .get::<DataKey, Address>(&DataKey::Admin)
}

pub fn set_usdc_token(env: &Env, token_address: Address) {
    env.storage()
        .instance()
        .set::<DataKey, Address>(&DataKey::UsdcToken, &token_address);
}

pub fn get_usdc_token(env: &Env) -> Option<Address> {
    env.storage()
        .instance()
        .get::<DataKey, Address>(&DataKey::UsdcToken)
}

pub fn set_platform_wallet(env: &Env, wallet_address: Address) {
    env.storage()
        .instance()
        .set::<DataKey, Address>(&DataKey::PlatformWallet, &wallet_address);
}

pub fn get_platform_wallet(env: &Env) -> Option<Address> {
    env.storage()
        .instance()
        .get::<DataKey, Address>(&DataKey::PlatformWallet)
}

pub fn save_lease(env: &Env, lease_id: String, lease: Lease) {
    env.storage()
        .instance()
        .set::<DataKey, Lease>(&DataKey::Lease(lease_id.clone()), &lease);
    
    // Also store property -> lease mapping
    env.storage()
        .instance()
        .set::<DataKey, String>(&DataKey::PropertyLease(lease.property_id.clone()), &lease_id);
}

pub fn get_lease(env: &Env, lease_id: String) -> Option<Lease> {
    env.storage()
        .instance()
        .get::<DataKey, Lease>(&DataKey::Lease(lease_id))
}

pub fn get_lease_by_property(env: &Env, property_id: String) -> Option<String> {
    env.storage()
        .instance()
        .get::<DataKey, String>(&DataKey::PropertyLease(property_id))
}

pub fn lease_exists(env: &Env, lease_id: String) -> bool {
    env.storage()
        .instance()
        .has(&DataKey::Lease(lease_id))
}

pub fn property_has_lease(env: &Env, property_id: String) -> bool {
    env.storage()
        .instance()
        .has(&DataKey::PropertyLease(property_id))
}

pub fn update_lease(env: &Env, lease_id: String, lease: Lease) {
    env.storage()
        .instance()
        .set::<DataKey, Lease>(&DataKey::Lease(lease_id), &lease);
}
