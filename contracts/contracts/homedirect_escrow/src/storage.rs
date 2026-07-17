use soroban_sdk::{Env, Address, String};
use crate::types::{DataKey, Deposit};

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

pub fn get_admin(env: &Env) -> Option<Address> {
    env.storage()
        .instance()
        .get::<DataKey, Address>(&DataKey::Admin)
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage()
        .instance()
        .set::<DataKey, Address>(&DataKey::Admin, admin);
}

pub fn save_deposit(env: &Env, lease_id: String, deposit: Deposit) {
    env.storage()
        .instance()
        .set::<DataKey, Deposit>(&DataKey::Deposit(lease_id), &deposit);
}

pub fn get_deposit(env: &Env, lease_id: String) -> Option<Deposit> {
    env.storage()
        .instance()
        .get::<DataKey, Deposit>(&DataKey::Deposit(lease_id))
}

pub fn deposit_exists(env: &Env, lease_id: String) -> bool {
    env.storage()
        .instance()
        .has(&DataKey::Deposit(lease_id))
}

pub fn update_deposit(env: &Env, lease_id: String, deposit: Deposit) {
    env.storage()
        .instance()
        .set::<DataKey, Deposit>(&DataKey::Deposit(lease_id), &deposit);
}
